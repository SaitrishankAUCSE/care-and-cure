import React, { useState, useEffect } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import {
  Settings,
  Building2,
  Clock,
  Phone,
  RotateCcw,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  ShieldAlert,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateClinicSettings, resetAllData } = useAppointments();
  const toast = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [newSlotInput, setNewSlotInput] = useState('');
  const [slotError, setSlotError] = useState('');

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  // Slot format validator: e.g. "09:00 AM" or "10:30 PM"
  const SLOT_REGEX = /^(0[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/;

  const handleAddSlot = () => {
    setSlotError('');
    const trimmed = newSlotInput.trim().toUpperCase();

    if (!trimmed) return;

    if (!SLOT_REGEX.test(trimmed)) {
      setSlotError('Format must be "HH:MM AM" or "HH:MM PM" (e.g. "09:00 AM" or "04:30 PM")');
      return;
    }

    if (formData.availableSlots.includes(trimmed)) {
      setSlotError('This slot already exists in the schedule.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      availableSlots: [...prev.availableSlots, trimmed]
    }));
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slotToRemove) => {
    if (formData.availableSlots.length <= 2) {
      toast.warning('Please keep at least 2 available slots.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter(s => s !== slotToRemove)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateClinicSettings(formData);
      toast.success('Demo settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (appointments and settings) back to default fictional records?')) {
      resetAllData();
      toast.success('Demo data restored to initial fictional records.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Clinic Timings, OPD Hours & Slot Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Care & Cure Clinic • Configure consultation hours, afternoon break period, and bookable time slots
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Demo Placeholders Disclaimer Box Required by Prompt */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Demo Notice:</strong> All values (clinic name, timings, slots, and contact details) are <strong>demo placeholders, not confirmed by the clinic</strong>. Changes made here apply locally to this browser session to show how flexible the schedule is.
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic Identity */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Clinic Details (Demo Placeholders)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Clinic Name
              </label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Clinic City / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Address (Fictional Demo)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Reception Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Default Session Duration
              </label>
              <input
                type="text"
                value={formData.sessionDuration}
                onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Break Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Shift Timings & Break Period
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Morning Hours
              </label>
              <input
                type="text"
                value={formData.morningHours}
                onChange={(e) => setFormData({ ...formData, morningHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
                Break Period (Closed to calls)
              </label>
              <input
                type="text"
                value={formData.breakHours}
                onChange={(e) => setFormData({ ...formData, breakHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Evening Hours
              </label>
              <input
                type="text"
                value={formData.eveningHours}
                onChange={(e) => setFormData({ ...formData, eveningHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Available Slot Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Configured Appointment Slots
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These slots appear on the patient booking screen and slot picker
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {formData.availableSlots.length} slots
            </span>
          </div>

          {/* Current Slots Pills */}
          <div className="flex flex-wrap gap-2">
            {formData.availableSlots.map(slot => (
              <span
                key={slot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remove slot"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Slot Input with Validation */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Add New Slot (Format: "HH:MM AM" or "HH:MM PM")
            </label>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSlotInput}
                onChange={(e) => {
                  setNewSlotInput(e.target.value);
                  setSlotError('');
                }}
                placeholder="e.g. 11:45 AM or 04:15 PM"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddSlot}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {slotError && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {slotError}
              </p>
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>Save Demo Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
