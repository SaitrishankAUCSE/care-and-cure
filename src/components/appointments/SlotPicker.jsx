import React from 'react';
import { Clock, Sun, Moon, Coffee, Info } from 'lucide-react';

export default function SlotPicker({
  selectedSlot,
  onSelectSlot,
  bookedSlots = [],
  availableSlots = [
    "09:00 AM",
    "09:45 AM",
    "10:30 AM",
    "11:15 AM",
    "04:00 PM",
    "04:45 PM",
    "05:30 PM",
    "06:15 PM",
    "07:00 PM",
    "07:45 PM",
    "08:30 PM"
  ]
}) {
  // Categorize morning vs evening slots
  const morningSlots = availableSlots.filter(s => s.includes('AM'));
  const eveningSlots = availableSlots.filter(s => s.includes('PM'));

  return (
    <div className="space-y-4">
      {/* Schedule note regarding public directory listings */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
        <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>
          <strong>Timings Notice:</strong> Public directories list 9:00 AM – 12:00 PM and 4:00 PM – 9:00 PM. Consultation hours confirmed with clinic reception.
        </span>
      </div>

      {/* Morning Slots */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Morning Consultation Slots (09:00 AM – 12:00 PM)</span>
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
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                    : isBooked
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/40'
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
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
        <Coffee className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="leading-snug">
          <strong>Clinic Break: 12:00 PM – 04:00 PM</strong> (Doctor consultations & hospital rounds). Booking requests can be submitted online 24/7!
        </span>
      </div>

      {/* Evening Slots */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Moon className="w-3.5 h-3.5 text-emerald-800" />
          <span>Evening Consultation Slots (04:00 PM – 09:00 PM)</span>
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
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                    : isBooked
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/40'
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
