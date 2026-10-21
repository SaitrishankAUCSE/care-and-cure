import React from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import { getOffsetDateString } from '../../utils/dateUtils';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function WeeklyVolumeChart() {
  const { appointments } = useAppointments();

  // Create a 7-day window from -3 days to +3 days relative to today
  const days = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
    const dateStr = getOffsetDateString(offset);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);

    const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
    const formatted = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Count appointments on this day
    const dayAppointments = appointments.filter(a => a.date === dateStr);
    const count = dayAppointments.length;
    const confirmedCount = dayAppointments.filter(a => a.status === 'Confirmed').length;
    const pendingCount = dayAppointments.filter(a => a.status === 'Pending').length;

    return {
      offset,
      dateStr,
      dayName,
      formatted,
      isToday: offset === 0,
      count,
      confirmedCount,
      pendingCount
    };
  });

  const maxVal = Math.max(...days.map(d => d.count), 4);
  const chartHeight = 140;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Weekly Appointment Demand</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time activity across Visakhapatnam clinic schedule
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500"></span> Confirmed
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Pending
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="pt-2">
        <div className="grid grid-cols-7 gap-2 items-end h-[140px] border-b border-slate-100 dark:border-slate-800 pb-2">
          {days.map((day) => {
            const barHeightPercent = Math.max(8, Math.round((day.count / maxVal) * 100));
            const confirmedPercent = day.count > 0 ? (day.confirmedCount / day.count) * 100 : 0;
            const pendingPercent = day.count > 0 ? (day.pendingCount / day.count) * 100 : 0;

            return (
              <div
                key={day.dateStr}
                className="flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md transition-opacity whitespace-nowrap z-20">
                  {day.count} sessions ({day.confirmedCount} conf, {day.pendingCount} pend)
                </div>

                {/* Number above bar */}
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-600 mb-1 transition-colors">
                  {day.count}
                </span>

                {/* Stacked bar */}
                <div
                  style={{ height: `${barHeightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 ${
                    day.isToday ? 'ring-2 ring-teal-500/40 shadow-sm' : ''
                  }`}
                >
                  <div
                    style={{ height: `${pendingPercent}%` }}
                    className="w-full bg-amber-400 dark:bg-amber-500"
                  />
                  <div
                    style={{ height: `${confirmedPercent}%` }}
                    className="w-full bg-teal-600 dark:bg-teal-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 pt-2 text-center">
          {days.map((day) => (
            <div key={day.dateStr} className="text-center">
              <span
                className={`block text-[11px] font-bold ${
                  day.isToday
                    ? 'text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {day.isToday ? 'Today' : day.dayName}
              </span>
              <span className="text-[9px] text-slate-400 block -mt-0.5">
                {day.formatted}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
