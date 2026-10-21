import { db, isConfigured } from './firebaseConfig';
import { getInitialAppointments, INITIAL_SETTINGS } from './mockData';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';

const APPOINTMENTS_STORAGE_KEY = 'care_cure_appointments_v3';
const SETTINGS_STORAGE_KEY = 'care_cure_settings_v3';

// In-memory subscribers for local demo mode
const appointmentListeners = new Set();
const settingsListeners = new Set();

function notifyAppointmentListeners(data) {
  appointmentListeners.forEach(listener => {
    try {
      listener(data);
    } catch (e) {
      console.error('Error in appointment subscriber:', e);
    }
  });
}

function notifySettingsListeners(data) {
  settingsListeners.forEach(listener => {
    try {
      listener(data);
    } catch (e) {
      console.error('Error in settings subscriber:', e);
    }
  });
}

// Check storage mode
export function isFirebaseActive() {
  return isConfigured && db !== null;
}

export function getStorageModeLabel() {
  return isFirebaseActive()
    ? "Connected to Firebase demo database"
    : "Local demo mode: data stays in this browser";
}

// ---------------------------------------------------------------------------
// LOCAL STORAGE HELPERS
// ---------------------------------------------------------------------------
function getLocalAppointments() {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw || raw.includes('Demo') || raw.includes('Sample') || raw.includes('Mock')) {
      const initial = getInitialAppointments();
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialAppointments();
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read local appointments, resetting to defaults:', err);
    const initial = getInitialAppointments();
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveLocalAppointments(list) {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list));
    notifyAppointmentListeners(list);
  } catch (err) {
    console.error('Failed to save local appointments:', err);
  }
}

function getLocalSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SETTINGS;
  }
}

function saveLocalSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifySettingsListeners(settings);
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// ---------------------------------------------------------------------------
// UNIFIED APPOINTMENT FUNCTIONS
// ---------------------------------------------------------------------------

export async function listAppointments() {
  if (isFirebaseActive()) {
    try {
      const q = query(collection(db, 'demo_appointments'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      return items;
    } catch (err) {
      console.warn('Firestore read error, falling back to local:', err);
      return getLocalAppointments();
    }
  }
  return getLocalAppointments();
}

export async function createAppointment(data) {
  const newAppointment = {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || 'Pending',
    reminderStatus: data.reminderStatus || 'Scheduled',
    reminderTiming: data.reminderTiming || '1 day before, 6:00 PM',
  };

  if (isFirebaseActive()) {
    try {
      const docRef = await addDoc(collection(db, 'demo_appointments'), newAppointment);
      return { id: docRef.id, ...newAppointment };
    } catch (err) {
      console.warn('Firestore write failed, saving locally:', err);
    }
  }

  // Local fallback
  const appointments = getLocalAppointments();
  const created = {
    ...newAppointment,
    id: `apt-${Date.now()}`
  };
  const updatedList = [created, ...appointments];
  saveLocalAppointments(updatedList);
  return created;
}

export async function updateAppointment(id, updates) {
  if (isFirebaseActive()) {
    try {
      const aptRef = doc(db, 'demo_appointments', id);
      await updateDoc(aptRef, updates);
      return { id, ...updates };
    } catch (err) {
      console.warn('Firestore update failed, updating locally:', err);
    }
  }

  // Local fallback
  const appointments = getLocalAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    const updated = { ...appointments[index], ...updates };
    appointments[index] = updated;
    saveLocalAppointments([...appointments]);
    return updated;
  }
  return null;
}

export async function deleteAppointment(id) {
  if (isFirebaseActive()) {
    try {
      const aptRef = doc(db, 'demo_appointments', id);
      await deleteDoc(aptRef);
      return true;
    } catch (err) {
      console.warn('Firestore delete failed, deleting locally:', err);
    }
  }

  const appointments = getLocalAppointments();
  const filtered = appointments.filter(a => a.id !== id);
  saveLocalAppointments(filtered);
  return true;
}

export function subscribeAppointments(callback) {
  if (isFirebaseActive()) {
    try {
      const q = query(collection(db, 'demo_appointments'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach(docSnap => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      }, (err) => {
        console.warn('Firestore snapshot error, falling back to local listener:', err);
        callback(getLocalAppointments());
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscription failed:', err);
    }
  }

  // Local subscription
  appointmentListeners.add(callback);
  // Initial fire
  callback(getLocalAppointments());

  return () => {
    appointmentListeners.delete(callback);
  };
}

export function resetDemoData() {
  const freshAppointments = getInitialAppointments();
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(freshAppointments));
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
  notifyAppointmentListeners(freshAppointments);
  notifySettingsListeners(INITIAL_SETTINGS);
  return { appointments: freshAppointments, settings: INITIAL_SETTINGS };
}

// ---------------------------------------------------------------------------
// UNIFIED SETTINGS FUNCTIONS
// ---------------------------------------------------------------------------

export async function getSettings() {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'demo_settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.warn('Firestore settings fetch error:', err);
    }
  }
  return getLocalSettings();
}

export async function updateSettings(newSettings) {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'demo_settings', 'general');
      await setDoc(docRef, newSettings, { merge: true });
    } catch (err) {
      console.warn('Firestore settings update error:', err);
    }
  }
  saveLocalSettings(newSettings);
  return newSettings;
}

export function subscribeSettings(callback) {
  if (isFirebaseActive()) {
    try {
      const docRef = doc(db, 'demo_settings', 'general');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          callback(getLocalSettings());
        }
      }, () => {
        callback(getLocalSettings());
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firestore settings subscribe failed:', err);
    }
  }

  settingsListeners.add(callback);
  callback(getLocalSettings());
  return () => {
    settingsListeners.delete(callback);
  };
}
