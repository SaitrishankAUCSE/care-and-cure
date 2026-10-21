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
      label: 'Clinic Home',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/appointments',
      label: 'Reception OPD',
      icon: Calendar,
      badge: stats.pending > 0 ? `${stats.pending} pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      to: '/book',
      label: 'Book Appointment',
      icon: CalendarPlus,
      badge: '24/7',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      to: '/simulator',
      label: 'WhatsApp Dispatch',
      icon: MessageSquare,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      to: '/reminders',
      label: 'Reminders Queue',
      icon: BellRing,
      badge: stats.remindersDue > 0 ? `${stats.remindersDue} due` : null,
      badgeColor: 'bg-slate-100 text-slate-800'
    },
    {
      to: '/settings',
      label: 'Clinic Timings',
      icon: Settings
    }
  ];

  const handleReset = () => {
    if (window.confirm('Reset all appointments and clinic settings to defaults?')) {
      resetAllData();
      toast.success('Restored default records.');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 justify-between transition-colors">
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
                      ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Data</span>
        </button>
      </div>
    </aside>
  );
}
