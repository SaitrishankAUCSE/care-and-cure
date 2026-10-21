import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import PhoneChat from '../components/simulator/PhoneChat';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Bell,
  Coffee,
  Info,
  Calendar
} from 'lucide-react';
import { formatDateDisplay } from '../utils/dateUtils';

export default function WhatsAppSimulatorPage() {
  const { appointments } = useAppointments();
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get('id');

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Sync selected appointment
  useEffect(() => {
    if (appointments.length > 0) {
      if (requestedId) {
        const found = appointments.find(a => a.id === requestedId);
        if (found) {
          setSelectedAppointment(found);
          return;
        }
      }
      if (!selectedAppointment) {
        // Default to a pending or first appointment
        const pending = appointments.find(a => a.status === 'Pending');
        setSelectedAppointment(pending || appointments[0]);
      }
    }
  }, [appointments, requestedId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Patient WhatsApp Notification Preview
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Demo Simulation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Care & Cure Clinic • See how patients receive instant reassurance when requesting a slot during the 12 PM – 5 PM break
          </p>
        </div>

        <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>Simulated for clinic demonstration only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context, Templates & Explanations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Why this matters card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-sm">
              <Coffee className="w-4 h-4" />
              <span>Solving the Visakhapatnam Clinic Break Gap</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When patients with acute lower back spasms, frozen shoulder, or knee arthritis reach out between <strong>12:00 PM and 5:00 PM</strong>, a busy tone leads to lost consultations.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              With automated WhatsApp simulation:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pl-4 list-disc marker:text-teal-500">
              <li>
                <strong>Message A (Request Received):</strong> Immediately reassures the patient their slot is held while staff is on rest.
              </li>
              <li>
                <strong>Message B (Confirmed):</strong> Once the physiotherapist reviews the schedule at 5:00 PM, the slot is confirmed with 1 click.
              </li>
              <li>
                <strong>Message C (Reminder):</strong> Automated 24h reminder reduces no-shows and clinic downtime.
              </li>
            </ul>
          </div>

          {/* Message Templates Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Message Templates (Simulated)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-teal-700 dark:text-teal-400 block mb-1">
                  Template A • Request Received
                </span>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Hello [Name], we have received your appointment request for [date] at [time]. The clinic will confirm your slot shortly."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  Template B • Slot Confirmed
                </span>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Hello [Name], your physiotherapy appointment is confirmed for [date] at [time]. Please contact the clinic if you need to reschedule."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">
                  Template C • 24h Reminder
                </span>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Reminder: You have an appointment scheduled for [date] at [time]. Please contact the clinic if you need to make any changes."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Phone Chat Simulator Component (7 cols) */}
        <div className="lg:col-span-7">
          <PhoneChat
            appointment={selectedAppointment}
            allAppointments={appointments}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          />
        </div>
      </div>
    </div>
  );
}
