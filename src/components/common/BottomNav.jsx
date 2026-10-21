import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  MessageSquare,
  BellRing
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

export default function BottomNav() {
  const { stats } = useAppointments();

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/appointments',
      label: 'Staff',
      icon: Calendar,
      badge: stats.pending > 0 ? stats.pending : null
    },
    {
      to: '/book',
      label: 'Book Slot',
      icon: CalendarPlus,
      highlight: true
    },
    {
      to: '/simulator',
      label: 'WhatsApp',
      icon: MessageSquare
    },
    {
      to: '/reminders',
      label: 'Reminders',
      icon: BellRing,
      badge: stats.remindersDue > 0 ? stats.remindersDue : null
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 transition-colors shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={() =>
                  `flex flex-col items-center justify-center -mt-4 p-2`
                }
              >
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1">
                  Book Slot
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
