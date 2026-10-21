import React, { useState } from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import SlotPicker from './SlotPicker';
import { getOffsetDateString } from '../../utils/dateUtils';
import { User, Phone, Calendar, Clock, FileText, Check, AlertCircle } from 'lucide-react';

export default function AppointmentForm({
  initialData = null,
  onSubmit,
  onCancel,
  isStaffMode = true
}) {
  const { getBookedSlotsForDate, settings } = useAppointments();

  const [patientName, setPatientName] = useState(initialData?.patientName || '');
  const [phone, setPhone] = useState(initialData?.phone || '+91 ');
  const [date, setDate] = useState(initialData?.date || getOffsetDateString(0));
  const [time, setTime] = useState(initialData?.time || '');
  const [type, setType] = useState(initialData?.type || 'Physiotherapy session');
  const [status, setStatus] = useState(initialData?.status || 'Pending');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [errors, setErrors] = useState({});

  // Compute booked slots on selected date (excluding current appointment if editing)
  const bookedSlots = getBookedSlotsForDate(date).filter(
    s => !(initialData && initialData.date === date && initialData.time === s)
  );

  const validate = () => {
    const errs = {};
    if (!patientName.trim()) {
      errs.patientName = 'Patient name is required';
    } else if (patientName.length < 2) {
      errs.patientName = 'Name must be at least 2 characters';
    }

    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone = 'Valid phone number is required';
    }

    if (!date) {
      errs.date = 'Please select a date';
    }

    if (!time) {
      errs.time = 'Please select an available time slot';
    } else if (bookedSlots.includes(time)) {
      errs.time = 'This slot has already been booked. Please pick another.';
    }

    if (notes && notes.length > 120) {
      errs.notes = 'Note cannot exceed 120 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      patientName: patientName.trim(),
      phone: phone.trim(),
      date,
      time,
      type,
      status,
      notes: notes.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Patient Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Patient Full Name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. K. Rajesh Kumar"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
          />
        </div>
        {errors.patientName && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.patientName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Patient Mobile / WhatsApp Number
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98480 23145"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Used by clinic staff to send appointment confirmations and session reminders.
        </p>
        {errors.phone && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Date & Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Appointment Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="date"
              min={getOffsetDateString(0)}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime(''); // reset time if date changes
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
            />
          </div>
          {errors.date && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.date}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Treatment / Service Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
          >
            <option value="Initial consultation">Initial Consultation & Assessment</option>
            <option value="Physiotherapy session">Physiotherapy Treatment Session</option>
            <option value="Follow-up">Follow-up & Rehab Monitoring</option>
          </select>
        </div>
      </div>

      {/* Time Slot Picker */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Available Time Slot
        </label>
        <SlotPicker
          selectedSlot={time}
          onSelectSlot={setTime}
          bookedSlots={bookedSlots}
          availableSlots={settings.availableSlots}
        />
        {errors.time && (
          <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.time}
          </p>
        )}
      </div>

      {/* Staff Status Dropdown */}
      {isStaffMode && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Appointment Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
          >
            <option value="Pending">Pending Request</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {/* Optional Notes */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isStaffMode ? 'Staff Notes / Clinical Area of Pain' : 'Non-Medical Note / Complaint'}
          </label>
          <span className="text-[11px] text-slate-400">
            {notes.length}/120
          </span>
        </div>
        <textarea
          rows={2}
          maxLength={120}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={isStaffMode ? "e.g. Lumbar back pain, knee ligament injury, cervical stiffness" : "e.g. Shoulder stiffness or post-run knee pain"}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
        />
        {errors.notes && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.notes}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors"
        >
          {initialData ? 'Update Appointment' : 'Save Appointment'}
        </button>
      </div>
    </form>
  );
}
