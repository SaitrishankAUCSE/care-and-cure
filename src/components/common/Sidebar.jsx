import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  MessageSquare,
  BellRing,
  Settings,
  Coffee,
  RotateCcw
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useToast } from './Toast';

export default function Sidebar() {
  const { stats, resetAllData } = useAppointments();
  const toast = useToast();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: stats.pending > 0 ? `${stats.pending} pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      to: '/book',
      label: 'Patient Booking',
      icon: CalendarPlus,
      badge: '24/7 Open',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
    },
    {
      to: '/simulator',
      label: 'WhatsApp Simulator',
      icon: MessageSquare,
      badge: 'Demo',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      to: '/reminders',
      label: 'Reminders Queue',
      icon: BellRing,
      badge: stats.remindersDue > 0 ? `${stats.remindersDue} due` : null,
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
    },
    {
      to: '/settings',
      label: 'Demo Settings',
      icon: Settings
    }
  ];

  const handleReset = () => {
    if (window.confirm('Reset all demo appointments and clinic settings to default fictional data?')) {
      resetAllData();
      toast.success('Demo data restored to initial fictional records.');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Break Hours Context Pill */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Clinic Break Period</span>
          </div>
          <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            12:00 PM – 5:00 PM daily. This demo shows how patients can still book slots during the break!
          </p>
        </div>
      </div>

      {/* Bottom Area: Reset Demo Data */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
          Care & Cure Visakhapatnam Demo v1.0
        </p>
      </div>
    </aside>
  );
}
