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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Name, Status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">
                {patientName}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{phone}</span>
            </div>
          </div>
          <StatusChip status={status} />
        </div>

        {/* Date, Time, Type Pills */}
        <div className="grid grid-cols-2 gap-2 my-4 pt-1">
          <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium text-slate-700 truncate">
              {formatDateDisplay(date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="font-medium text-slate-700 truncate">
              {time}
            </span>
          </div>
        </div>

        {/* Treatment Type */}
        <div className="text-xs flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-slate-500">Treatment:</span>
          <span className="font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-100">
            {type}
          </span>
        </div>

        {/* Notes (if present) */}
        {notes && (
          <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">"{notes}"</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate(`/simulator?id=${id}`)}
            title="Open in WhatsApp Simulator"
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(appointment)}
              title="Edit Appointment"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(id)}
              title="Delete Appointment"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all active:scale-95 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Confirm button for Pending requests */}
        {status === 'Pending' && onConfirm && (
          <button
            type="button"
            onClick={() => onConfirm(id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Confirm Slot</span>
          </button>
        )}
      </div>
    </div>
  );
}
