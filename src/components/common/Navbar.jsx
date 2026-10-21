import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import {
  Phone,
  MapPin,
  Clock,
  CalendarPlus,
  Activity,
  Menu,
  X,
  Calendar,
  MessageSquare,
  BellRing,
  Settings,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function Navbar() {
  const { stats, isFirebase } = useAppointments();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Clinic Home', end: true },
    { to: '/book', label: 'Book Appointment (24/7)', highlight: true },
    {
      to: '/appointments',
      label: 'Reception OPD Desk',
      badge: stats.pending > 0 ? stats.pending : null
    },
    { to: '/simulator', label: 'WhatsApp Simulator' },
    {
      to: '/reminders',
      label: 'Reminders Queue',
      badge: stats.remindersDue > 0 ? stats.remindersDue : null
    },
    { to: '/settings', label: 'Clinic Timings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Top Clinical Utility Bar - Standard for Real Clinics */}
      <div className="bg-teal-900 text-teal-100 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-teal-300" />
              Reception / Appointments: <strong>+91 891 270 0000</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              Opp. Rama Talkies, Dwaraka Nagar, Visakhapatnam
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>OPD: 9 AM - 12 PM & 5 PM - 9 PM</span>
              <span className="bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded font-semibold ml-1">
                Break: 12 PM - 5 PM
              </span>
            </span>
            <span className="opacity-80">
              {isFirebase ? '• Connected to Clinic DB' : '• Local Storage Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Clinic Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Clinic Brand & Doctor's Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Care & Cure Physiotherapy
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Visakhapatnam
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Dr. K. Ramanathan, M.P.T. (Ortho), MIAP • Spine & Joint Rehabilitation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  } ${link.highlight ? 'text-teal-700 font-extrabold' : ''}`
                }
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Book Slot Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Consultation Slot</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 mb-2">
            <strong>Break Period Notice:</strong> 12 PM to 5 PM daily. Online booking remains active 24/7!
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold dark:bg-teal-950 dark:text-teal-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {link.badge} pending
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-700 text-white font-bold text-sm shadow-sm"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment Slot</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
