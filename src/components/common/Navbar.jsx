import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAppointments } from '../../context/AppointmentContext';
import StorageBadge from './StorageBadge';
import { Sun, Moon, CalendarPlus, Activity, Menu, Shield } from 'lucide-react';

export default function Navbar({ onOpenMobileMenu }) {
  const { isDark, toggleTheme } = useTheme();
  const { stats } = useAppointments();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clinic Info */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                    Care & Cure
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    Vizag Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Physiotherapy • Slot Booking & WhatsApp Reminders
                </p>
              </div>
            </Link>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Storage Mode Badge */}
            <StorageBadge />

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quick Patient Booking CTA */}
            <Link
              to="/book"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all active:scale-95"
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Patient Slot Booking</span>
              <span className="sm:hidden">Book</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
