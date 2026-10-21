import React from 'react';
import { Calendar, Clock, Phone, User, FileText, CheckCircle2, Edit2, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import StatusChip from '../common/StatusChip';
import { formatDateDisplay } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export default function AppointmentCard({
  appointment,
  onConfirm,
  onEdit,
  onDelete,
  compact = false
}) {
  const navigate = useNavigate();
  const { id, patientName, phone, date, time, type, status, notes, reminderStatus } = appointment;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Name, Status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {patientName}
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wide">
                Demo
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{phone}</span>
            </div>
          </div>
          <StatusChip status={status} />
        </div>

        {/* Date, Time, Type Pills */}
        <div className="grid grid-cols-2 gap-2 my-4 pt-1">
          <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
              {formatDateDisplay(date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
              {time}
            </span>
          </div>
        </div>

        {/* Treatment Type */}
        <div className="text-xs flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <span className="text-slate-500 dark:text-slate-400">Treatment:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 bg-teal-50/50 dark:bg-teal-950/30 px-2 py-0.5 rounded-md text-teal-800 dark:text-teal-300">
            {type}
          </span>
        </div>

        {/* Notes (if present) */}
        {notes && (
          <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl italic">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">"{notes}"</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/simulator?id=${id}`)}
            title="Open in WhatsApp Simulator"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(appointment)}
              title="Edit Appointment"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              title="Delete Appointment"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Confirm button for Pending requests */}
        {status === 'Pending' && onConfirm && (
          <button
            onClick={() => onConfirm(id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Slot</span>
          </button>
        )}
      </div>
    </div>
  );
}
