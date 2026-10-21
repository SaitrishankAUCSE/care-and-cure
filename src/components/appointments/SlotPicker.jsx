import React from 'react';
import { Clock, Sun, Moon, Coffee } from 'lucide-react';

export default function SlotPicker({
  selectedSlot,
  onSelectSlot,
  bookedSlots = [],
  availableSlots = [
    "09:00 AM",
    "09:45 AM",
    "10:30 AM",
    "11:15 AM",
    "05:00 PM",
    "05:45 PM",
    "06:30 PM",
    "07:15 PM",
    "08:00 PM"
  ]
}) {
  // Categorize morning vs evening slots
  const morningSlots = availableSlots.filter(s => s.includes('AM'));
  const eveningSlots = availableSlots.filter(s => s.includes('PM'));

  return (
    <div className="space-y-4">
      {/* Morning Slots */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Morning Slots (09:00 AM – 12:00 PM)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {morningSlots.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <button
                type="button"
                key={slot}
                disabled={isBooked}
                onClick={() => onSelectSlot(slot)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                    : isBooked
                    ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-800/60 cursor-not-allowed line-through'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <Clock className="w-3 h-3 opacity-70" />
                <span>{slot}</span>
                {isBooked && (
                  <span className="text-[10px] ml-1 uppercase font-bold text-slate-400">Booked</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Break Info Banner */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
        <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="leading-snug">
          <strong>Clinic Break: 12:00 PM – 5:00 PM</strong> (Doctor consultations & hospital rounds). Booking requests can still be submitted 24/7!
        </span>
      </div>

      {/* Evening Slots */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Evening Slots (05:00 PM – 09:00 PM)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {eveningSlots.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <button
                type="button"
                key={slot}
                disabled={isBooked}
                onClick={() => onSelectSlot(slot)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                    : isBooked
                    ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-800/60 cursor-not-allowed line-through'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                <Clock className="w-3 h-3 opacity-70" />
                <span>{slot}</span>
                {isBooked && (
                  <span className="text-[10px] ml-1 uppercase font-bold text-slate-400">Booked</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
