import React, { useState } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import SlotPicker from '../components/appointments/SlotPicker';
import { getOffsetDateString, formatDateDisplay } from '../utils/dateUtils';
import { getRequestReceivedMessage } from '../utils/messageTemplates';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Coffee,
  MessageSquare,
  AlertCircle,
  Building2,
  Info,
  ShieldCheck
} from 'lucide-react';

export default function PatientBookingPage() {
  const { addAppointment, getBookedSlotsForDate, settings } = useAppointments();
  const toast = useToast();

  // Form state
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [date, setDate] = useState(getOffsetDateString(0));
  const [time, setTime] = useState('');
  const [type, setType] = useState('Physiotherapy session');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submitted appointment state for the confirmation view
  const [submittedAppointment, setSubmittedAppointment] = useState(null);

  const bookedSlots = getBookedSlotsForDate(date);

  const validate = () => {
    const errs = {};
    if (!patientName.trim()) {
      errs.patientName = 'Please enter your name.';
    } else if (patientName.trim().length < 2) {
      errs.patientName = 'Name must be at least 2 characters.';
    }

    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone = 'Please enter a valid mobile number.';
    }

    if (!date) {
      errs.date = 'Please pick a preferred date.';
    }

    if (!time) {
      errs.time = 'Please select an available time slot.';
    } else if (bookedSlots.includes(time)) {
      errs.time = 'This slot was just taken. Please choose another time slot.';
    }

    if (notes && notes.length > 120) {
      errs.notes = 'Note must be within 120 characters.';
    }

    if (!consent) {
      errs.consent = 'Please confirm consent to receive appointment notifications.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Please complete all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newRecord = await addAppointment({
        patientName: patientName.trim(),
        phone: phone.trim(),
        date,
        time,
        type,
        notes: notes.trim(),
        status: 'Pending',
        reminderStatus: 'Scheduled',
        reminderTiming: '1 day before, 6:00 PM'
      });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Non-blocking
      }

      setSubmittedAppointment(newRecord);
      toast.success('Slot request submitted! Reception has been notified.');
    } catch (err) {
      toast.error('Failed to submit appointment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Confirmation Screen After Submission
  // -------------------------------------------------------------------------
  if (submittedAppointment) {
    const previewMessage = getRequestReceivedMessage(
      submittedAppointment.patientName,
      submittedAppointment.date,
      submittedAppointment.time
    );

    return (
      <div className="max-w-xl mx-auto py-6 px-4 space-y-6 pb-20 md:pb-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              Request Received • Pending Reception Confirmation
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Appointment Slot Requested!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Your request has been placed into the clinic reception queue. Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik's staff will confirm availability shortly.
            </p>
          </div>

          {/* Appointment Recap Card */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-800">{submittedAppointment.patientName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-800">{submittedAppointment.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Preferred Date:</span>
              <span className="font-bold text-slate-800">{formatDateDisplay(submittedAppointment.date)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Requested Slot:</span>
              <span className="font-bold text-emerald-700">{submittedAppointment.time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Treatment:</span>
              <span className="font-semibold text-slate-800">{submittedAppointment.type}</span>
            </div>
          </div>

          {/* WhatsApp Message Preview Bubble */}
          <div className="text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Notification Dispatched to Patient:</span>
            </div>
            <div className="whatsapp-bubble-in p-4 rounded-2xl border border-slate-200 text-xs shadow-xs text-slate-800 italic relative">
              "{previewMessage}"
              <div className="text-[10px] text-right text-slate-400 not-italic mt-1.5">
                Delivered • Just now ✓✓
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/simulator?id=${submittedAppointment.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>View in WhatsApp Simulator</span>
            </Link>
            <button
              onClick={() => {
                setSubmittedAppointment(null);
                setPatientName('');
                setTime('');
                setNotes('');
              }}
              className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Book Another Slot
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main Booking Form
  // -------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-6 pb-20 md:pb-6">
      {/* Clinic Notice Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950">
              Phone busy or clinic on a break? Request your slot here 24/7.
            </h2>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              Care & Cure Physiotherapy, Malkapuram (Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • 87909 72042). When doctors are in hospital consultations or observing the 12 PM – 4 PM break, you can reserve your slot online without waiting on hold!
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Book a Physiotherapy Appointment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Choose your preferred date, time, and service type. Our reception confirms availability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
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
                <AlertCircle className="w-3.5 h-3.5" /> {errors.patientName}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Number (For WhatsApp Updates) <span className="text-rose-500">*</span>
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
              You will receive confirmation details and session reminders on this number.
            </p>
            {errors.phone && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Preferred Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="date"
                min={getOffsetDateString(0)}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime(''); // Reset time when date changes
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
              />
            </div>
            {errors.date && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
              </p>
            )}
          </div>

          {/* Slot Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Time Slot <span className="text-rose-500">*</span>
            </label>
            <SlotPicker
              selectedSlot={time}
              onSelectSlot={setTime}
              bookedSlots={bookedSlots}
              availableSlots={settings.availableSlots}
            />
            {errors.time && (
              <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.time}
              </p>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Treatment / Consultation Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
            >
              <option value="Initial consultation">Initial consultation (Pain Assessment & Evaluation)</option>
              <option value="Physiotherapy session">Physiotherapy session (Manual Therapy & Modalities)</option>
              <option value="Follow-up">Follow-up (Sports Injury & Rehab Review)</option>
            </select>
          </div>

          {/* Non-Medical Note (max 120 chars) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Brief Note / Area of Pain (Optional)
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
              placeholder="e.g. Knee pain after running, cervical neck stiffness, lower back spasm"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
            />
            {errors.notes && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.notes}
              </p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span className="text-xs text-slate-600 leading-snug">
                I consent to receive appointment status updates, confirmations, and session reminders via WhatsApp from Care & Cure Physiotherapy.
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.consent}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Slot Request...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Appointment Slot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
