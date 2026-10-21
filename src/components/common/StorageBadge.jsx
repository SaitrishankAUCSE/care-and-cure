import React from 'react';
import { Database, HardDrive, ShieldCheck } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

export default function StorageBadge() {
  const { isFirebase, storageLabel } = useAppointments();

  return (
    <div
      title={isFirebase ? "Connected to Firestore demo DB" : "Data is stored securely in your browser's localStorage"}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs border-slate-200 dark:border-slate-800"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isFirebase ? 'bg-emerald-400' : 'bg-teal-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isFirebase ? 'bg-emerald-500' : 'bg-teal-500'
          }`}
        />
      </span>

      {isFirebase ? (
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <HardDrive className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
      )}

      <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">
        {storageLabel}
      </span>
      <span className="text-slate-600 dark:text-slate-300 font-medium sm:hidden">
        {isFirebase ? 'Firebase Mode' : 'Local Demo'}
      </span>
    </div>
  );
}
