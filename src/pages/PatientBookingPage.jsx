import React, { useState } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import SlotPicker from '../components/appointments/SlotPicker';
import { getOffsetDateString, formatDateDisplay } from '../utils/dateUtils';
import { getRequestReceivedMessage } from '../utils/messageTemplates';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  Coffee,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Activity,
  HeartPulse
} from 'lucide-react';

export default function PatientBookingPage() {
  const { addAppointment, getBookedSlotsForDate, settings } = useAppointments();
  const toast = useToast();
  const navigate = useNavigate();

  // Form state
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+91 9');
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
      errs.phone = 'Please enter a valid phone number (fictional demo numbers allowed).';
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
      errs.consent = 'Please confirm consent to receive simulated appointment updates.';
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
      let formattedPhone = phone.trim();
      if (!formattedPhone.includes('(demo)')) {
        formattedPhone += ' (demo)';
      }

      const newRecord = await addAppointment({
        patientName: patientName.trim(),
        phone: formattedPhone,
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
      toast.success('Slot request submitted! Added to pending clinic queue.');
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm ring-8 ring-teal-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-3 py-1 rounded-full mb-2">
              Request Received (Pending Confirmation)
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Appointment Slot Requested!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your request has been placed into the clinic's queue. The staff will confirm your slot shortly after reviewing today's schedule.
            </p>
          </div>

          {/* Appointment Recap Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-100 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Patient Name:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{submittedAppointment.patientName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Preferred Date:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{formatDateDisplay(submittedAppointment.date)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Time Slot:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">{submittedAppointment.time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400">Treatment:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedAppointment.type}</span>
            </div>
          </div>

          {/* WhatsApp Message Preview Bubble */}
          <div className="text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <MessageSquare className="w-4 h-4" />
              <span>Simulated WhatsApp Notification Sent to Patient:</span>
            </div>
            <div className="whatsapp-bubble-in p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs shadow-xs text-slate-800 dark:text-slate-100 italic relative">
              "{previewMessage}"
              <div className="text-[10px] text-right text-slate-400 not-italic mt-1.5">
                Simulated Delivery • Just now ✓✓
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/simulator?id=${submittedAppointment.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open in WhatsApp Simulator</span>
            </Link>
            <button
              onClick={() => {
                setSubmittedAppointment(null);
                setPatientName('');
                setTime('');
                setNotes('');
              }}
              className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
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
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 pb-20 md:pb-6">
      {/* Friendly top line required by prompt */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200/80 dark:border-teal-800/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-teal-950 dark:text-teal-200">
              Phone busy or clinic on a break? Request your slot here any time.
            </h2>
            <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-0.5 leading-relaxed">
              Care & Cure Visakhapatnam takes an afternoon break between 12:00 PM and 5:00 PM. You can still pick your preferred slot instantly below!
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Request Physiotherapy Slot
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in your details below. Slots are confirmed directly by clinic staff.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name (Demo Patient) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Aarav Demo"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            {errors.patientName && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.patientName}
              </p>
            )}
          </div>

          {/* Demo Mobile Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mobile Number (For WhatsApp Updates) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 90000 00101 (demo)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Fictional numbers are welcome. All WhatsApp messaging is simulated in-browser.
            </p>
            {errors.phone && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Preferred Date (No Past Dates) <span className="text-rose-500">*</span>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Appointment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
            >
              <option value="Initial consultation">Initial consultation (Pain Assessment & Evaluation)</option>
              <option value="Physiotherapy session">Physiotherapy session (Manual Therapy / Modalities)</option>
              <option value="Follow-up">Follow-up (Rehabilitation & Exercise Review)</option>
            </select>
          </div>

          {/* Non-Medical Note (max 120 chars) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Brief Non-Medical Note (Optional)
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
              placeholder="e.g. Lower back pain after gym; prefer quiet room."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
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
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                I consent to receive automated appointment status and reminder notifications via simulated WhatsApp from Care & Cure Physiotherapy.
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
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
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
