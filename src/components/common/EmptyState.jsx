import React from 'react';
import { CalendarX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = CalendarX,
  title = "No appointments found",
  description = "No matching appointments match your current filters.",
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-slate-300 bg-white">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
