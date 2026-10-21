import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import {
  Phone,
  MapPin,
  Clock,
  CalendarPlus,
  Activity,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { stats, isFirebase } = useAppointments();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Clinic Home', end: true },
    {
      to: '/appointments',
      label: 'Reception Desk',
      badge: stats.pending > 0 ? stats.pending : null
    },
    { to: '/simulator', label: 'WhatsApp Simulator' },
    {
      to: '/reminders',
      label: 'Reminders Log',
      badge: stats.remindersDue > 0 ? stats.remindersDue : null
    },
    { to: '/settings', label: 'Clinic Hours' }
  ];

  return (
    <header className="relative z-30 bg-white border-b border-emerald-200 shadow-xs">
      {/* Top Clinical Utility Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-5 min-w-0 overflow-hidden">
            <span className="flex items-center gap-1.5 font-semibold shrink-0">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Reception: <strong className="text-white">+91 87909 72042</strong></span>
            </span>
            <span className="flex items-center gap-1.5 min-w-0 truncate text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">D.No. 61-1-33, Opp. HPCL Main Gate, Near Union Bank, Ramakrishnapuram, Malkapuram, Vizag - 530011</span>
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>OPD: 9 AM-12 PM & 4 PM-9 PM</span>
              <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-semibold ml-1 text-[10px]">
                Break: 12 PM - 4 PM
              </span>
            </span>
            <span className="opacity-90 font-medium text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded">
              {isFirebase ? 'Cloud DB' : 'Local Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Clinic Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Clinic Brand & Doctors */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shrink-0 group-hover:bg-emerald-800 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                  Care & Cure Physiotherapy
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hidden xl:inline shrink-0">
                  Malkapuram, Vizag
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">
                Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • Sports Injury Clinic
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60'
                  }`
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

          {/* Book Slot CTA Button (Right Action) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <CalendarPlus className="w-4 h-4 shrink-0" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2.5">
          <div className="text-xs text-slate-600 pb-2 border-b border-slate-100">
            <p className="font-bold text-slate-900">Care & Cure Physiotherapy</p>
            <p className="text-[11px] text-slate-500">
              D.No. 61-1-33, Opp. HPCL Main Gate, Malkapuram, Vizag • +91 87909 72042
            </p>
          </div>

          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment Online (24/7)</span>
          </Link>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
