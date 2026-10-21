import React, { useState } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import StatusChip from '../components/common/StatusChip';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { getReminderMessage } from '../utils/messageTemplates';
import { formatDateDisplay } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function RemindersPage() {
  const { appointments, simulateSendReminder } = useAppointments();
  const toast = useToast();
  const navigate = useNavigate();

  // Filter for Confirmed appointments
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');

  // Preview modal state
  const [previewingAppointment, setPreviewingAppointment] = useState(null);

  // Status breakdown
  const readyToSend = confirmedAppointments.filter(a => a.reminderStatus === 'Ready to Send');
  const sentReminders = confirmedAppointments.filter(a => a.reminderStatus === 'Sent' || a.reminderStatus === 'Sent in Demo');
  const scheduled = confirmedAppointments.filter(a => a.reminderStatus === 'Scheduled');

  const handleSimulateSend = async (id, name) => {
    await simulateSendReminder(id);
    toast.success(`WhatsApp reminder dispatched to ${name}!`);
  };

  const handleSimulateSendAll = async () => {
    for (const apt of readyToSend) {
      await simulateSendReminder(apt.id);
    }
    toast.success(`Sent ${readyToSend.length} WhatsApp reminders!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Patient Session Reminders & WhatsApp Dispatch
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Care And Cure Physiotherapy, Malkapuram (Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • 87909 72042)
          </p>
        </div>

        {readyToSend.length > 0 && (
          <button
            onClick={handleSimulateSendAll}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all active:scale-95 self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send All Ready ({readyToSend.length})</span>
          </button>
        )}
      </div>

      {/* Metric Breakdown Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ready to Send
            </span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
              {readyToSend.length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dispatched Reminders
            </span>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              {sentReminders.length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scheduled (Upcoming)
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {scheduled.length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <BellRing className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Upcoming Confirmed Therapy Sessions
            </h3>
            <p className="text-xs text-slate-500">
              Sessions eligible for automated WhatsApp reminder delivery
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {confirmedAppointments.length} confirmed
          </span>
        </div>

        {confirmedAppointments.length === 0 ? (
          <EmptyState
            icon={BellRing}
            title="No confirmed sessions for reminders"
            description="Go to the Appointments page and confirm a pending request to see it appear here."
            actionLabel="View Appointments Queue"
            onAction={() => navigate('/appointments')}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {confirmedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                {/* Patient & Slot Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">
                      {apt.patientName}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500">
                      ({apt.type})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      {formatDateDisplay(apt.date)} at {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {apt.phone}
                    </span>
                  </div>
                </div>

                {/* Timing & Reminder Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Trigger Timing
                    </span>
                    <span className="font-semibold text-slate-700">
                      {apt.reminderTiming || '1 day before, 6:00 PM'}
                    </span>
                  </div>

                  <StatusChip status={apt.reminderStatus || 'Scheduled'} type="reminder" />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewingAppointment(apt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preview</span>
                    </button>

                    {apt.reminderStatus !== 'Sent' && apt.reminderStatus !== 'Sent in Demo' ? (
                      <button
                        onClick={() => handleSimulateSend(apt.id, apt.patientName)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Reminder</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 px-2 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder Preview Modal */}
      <Modal
        isOpen={Boolean(previewingAppointment)}
        onClose={() => setPreviewingAppointment(null)}
        title="WhatsApp Reminder Preview"
        subtitle={`Scheduled for ${previewingAppointment?.patientName}`}
      >
        {previewingAppointment && (
          <div className="space-y-4">
            <div className="whatsapp-bubble-in p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 italic relative">
              "{getReminderMessage(
                previewingAppointment.patientName,
                previewingAppointment.date,
                previewingAppointment.time
              )}"
              <div className="text-[10px] text-right text-slate-400 not-italic mt-2">
                Delivered ✓✓
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const id = previewingAppointment.id;
                  setPreviewingAppointment(null);
                  navigate(`/simulator?id=${id}`);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open in WhatsApp Dispatcher</span>
              </button>

              <button
                onClick={() => setPreviewingAppointment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
