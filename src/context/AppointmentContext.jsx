import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  subscribeAppointments,
  subscribeSettings,
  createAppointment as apiCreateAppointment,
  updateAppointment as apiUpdateAppointment,
  deleteAppointment as apiDeleteAppointment,
  resetDemoData as apiResetDemoData,
  updateSettings as apiUpdateSettings,
  getStorageModeLabel,
  isFirebaseActive
} from '../services/dataService';
import { INITIAL_SETTINGS } from '../services/mockData';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [storageLabel, setStorageLabel] = useState(getStorageModeLabel());

  useEffect(() => {
    setStorageLabel(getStorageModeLabel());

    // Subscribe to real-time appointments
    const unsubAppointments = subscribeAppointments((data) => {
      setAppointments(data || []);
      setLoading(false);
    });

    // Subscribe to settings
    const unsubSettings = subscribeSettings((data) => {
      if (data) setSettings(data);
    });

    return () => {
      if (typeof unsubAppointments === 'function') unsubAppointments();
      if (typeof unsubSettings === 'function') unsubSettings();
    };
  }, []);

  // Compute reactive statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
    
    // Reminders due: Confirmed appointments that haven't been sent yet
    const remindersDue = appointments.filter(
      a => a.status === 'Confirmed' && a.reminderStatus !== 'Sent in Demo'
    ).length;

    return { total, pending, confirmed, completed, cancelled, remindersDue };
  }, [appointments]);

  // Check if a specific slot on a given date is occupied
  const isSlotBooked = (date, time, excludeId = null) => {
    if (!date || !time) return false;
    return appointments.some(a => 
      a.date === date &&
      a.time === time &&
      a.status !== 'Cancelled' &&
      (!excludeId || a.id !== excludeId)
    );
  };

  // Get list of booked slots for a specific date
  const getBookedSlotsForDate = (date) => {
    if (!date) return [];
    return appointments
      .filter(a => a.date === date && a.status !== 'Cancelled')
      .map(a => a.time);
  };

  // Actions
  const addAppointment = async (aptData) => {
    return await apiCreateAppointment(aptData);
  };

  const updateAppointment = async (id, updates) => {
    return await apiUpdateAppointment(id, updates);
  };

  const confirmAppointment = async (id) => {
    return await apiUpdateAppointment(id, { 
      status: 'Confirmed',
      reminderStatus: 'Scheduled'
    });
  };

  const simulateSendReminder = async (id) => {
    return await apiUpdateAppointment(id, {
      reminderStatus: 'Sent in Demo',
      lastSentAt: new Date().toISOString()
    });
  };

  const deleteAppointment = async (id) => {
    return await apiDeleteAppointment(id);
  };

  const resetAllData = () => {
    const res = apiResetDemoData();
    setAppointments(res.appointments);
    setSettings(res.settings);
    return res;
  };

  const updateClinicSettings = async (newSettings) => {
    const updated = await apiUpdateSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        settings,
        loading,
        storageLabel,
        isFirebase: isFirebaseActive(),
        stats,
        isSlotBooked,
        getBookedSlotsForDate,
        addAppointment,
        updateAppointment,
        confirmAppointment,
        simulateSendReminder,
        deleteAppointment,
        resetAllData,
        updateClinicSettings
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
