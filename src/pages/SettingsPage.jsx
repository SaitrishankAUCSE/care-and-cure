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
  Info,
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
      toast.success('Clinic schedule and settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all appointments and settings back to original clinic defaults?')) {
      resetAllData();
      toast.success('Restored to default clinic records.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Clinic Timings, Break Schedule & Slot Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Care And Cure Physiotherapy, Malkapuram (Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • 87909 72042)
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Data</span>
        </button>
      </div>

      {/* Conflicting Hours Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong>Operating Hours Notice:</strong> One public directory lists clinic hours as <strong>4:00 PM – 9:00 PM</strong>, while another lists morning hours of <strong>9:00 AM – 12:00 PM</strong>. Because directory sources conflict, hours and slots are not rigidly locked and can be customized below anytime.
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic Identity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Clinic & Doctors Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Clinic Name
              </label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Consulting Doctors
              </label>
              <input
                type="text"
                value={formData.doctors}
                onChange={(e) => setFormData({ ...formData, doctors: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Clinic Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Reception Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Standard Session Duration
              </label>
              <input
                type="text"
                value={formData.sessionDuration}
                onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Break Hours */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Shift Timings & Break Period
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Morning Hours
              </label>
              <input
                type="text"
                value={formData.morningHours}
                onChange={(e) => setFormData({ ...formData, morningHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                Mid-day Break (Closed to Calls)
              </label>
              <input
                type="text"
                value={formData.breakHours}
                onChange={(e) => setFormData({ ...formData, breakHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Evening Hours
              </label>
              <input
                type="text"
                value={formData.eveningHours}
                onChange={(e) => setFormData({ ...formData, eveningHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Available Slot Configuration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bookable Consultation Slots
              </h3>
              <p className="text-xs text-slate-500">
                These slots appear on the patient booking screen and slot picker
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {formData.availableSlots.length} slots
            </span>
          </div>

          {/* Current Slots Pills */}
          <div className="flex flex-wrap gap-2">
            {formData.availableSlots.map(slot => (
              <span
                key={slot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-200"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddSlot}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
