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

  const navLinks = [
    { to: '/', label: 'Clinic Home', end: true },
    { to: '/book', label: 'Book Appointment', highlight: true },
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
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Clinical Utility Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              Reception / Contact: <strong>+91 87909 72042</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              Malkapuram, Visakhapatnam, Andhra Pradesh
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>OPD: 9 AM - 12 PM & 4 PM - 9 PM</span>
              <span className="bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-semibold ml-1">
                Break: 12 PM - 4 PM
              </span>
            </span>
            <span className="opacity-90">
              {isFirebase ? '• Connected to Clinic DB' : '• Local Storage Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Clinic Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Clinic Brand & Doctors */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Care & Cure Physiotherapy
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Malkapuram, Vizag
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • Sports Injury & Rehabilitation
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
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  } ${link.highlight ? 'text-emerald-700 font-extrabold' : ''}`
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

          {/* Book Slot CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment Slot</span>
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 mb-2 border border-emerald-200">
            <strong>Clinic Break:</strong> 12 PM to 4 PM. Online slot requests accepted 24/7.
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
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-700 hover:bg-emerald-50'
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-sm"
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
