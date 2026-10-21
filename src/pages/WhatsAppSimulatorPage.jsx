import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import PhoneChat from '../components/simulator/PhoneChat';
import {
  MessageSquare,
  Coffee,
  Info,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  AlertTriangle,
  RotateCcw
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              WhatsApp Booking & Reminder Communication
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Staff Message Review
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Care And Cure Physiotherapy, Malkapuram (Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • 87909 72042)
          </p>
        </div>

        <div className="text-xs text-slate-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Interactive Message Dispatcher</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context, Templates & Explanations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Why this matters card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Coffee className="w-4 h-4 text-emerald-700" />
              <span>Covering the Mid-Day Clinic Break (12 PM – 4 PM)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When patients with acute lower back spasms, neck stiffness, or post-injury joint pain reach out during doctor hospital rounds or clinic break, automated and pre-scripted WhatsApp messages keep them engaged.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Clinic staff can review, copy, and send 5 standardized templates:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pl-4 list-disc marker:text-emerald-700">
              <li>
                <strong>Confirmation:</strong> Confirms date, time slot, and advises arriving 5 mins early.
              </li>
              <li>
                <strong>Rescheduling:</strong> Notifies patient of alternative time or date if schedule changes.
              </li>
              <li>
                <strong>Cancellation:</strong> Confirms cancelled slots gracefully with a 1-click rebooking link.
              </li>
              <li>
                <strong>Session Reminders:</strong> Sent 24h or morning-of for recurring rehab patients.
              </li>
              <li>
                <strong>Request Received:</strong> Immediate acknowledgment when a patient submits a slot online.
              </li>
            </ul>
          </div>

          {/* Message Templates Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Standard Clinical WhatsApp Templates
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">
                  1. Slot Confirmation
                </span>
                <p className="text-slate-600 italic">
                  "Hello [Name], your physiotherapy appointment at Care And Cure Physiotherapy Clinic, Malkapuram is confirmed for [Date] at [Time]..."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  2. Slot Rescheduling
                </span>
                <p className="text-slate-600 italic">
                  "Hello [Name], your physiotherapy appointment at Care And Cure Clinic has been rescheduled to [Date] at [Time]..."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  3. Slot Cancellation
                </span>
                <p className="text-slate-600 italic">
                  "Hello [Name], your appointment scheduled for [Date] at [Time] at Care And Cure Physiotherapy has been cancelled as requested..."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  4. Recurring Session Reminder
                </span>
                <p className="text-slate-600 italic">
                  "Reminder from Care And Cure Physiotherapy, Malkapuram: You have a therapy session scheduled for [Date] at [Time]..."
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
