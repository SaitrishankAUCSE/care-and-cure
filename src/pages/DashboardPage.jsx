import React from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import StatCard from '../components/common/StatCard';
import AppointmentCard from '../components/appointments/AppointmentCard';
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart';
import EmptyState from '../components/common/EmptyState';
import { StatCardSkeleton, AppointmentCardSkeleton } from '../components/common/Skeleton';
import { getOffsetDateString, formatDateDisplay } from '../utils/dateUtils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BellRing,
  Coffee,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Activity
} from 'lucide-react';

export default function DashboardPage() {
  const { appointments, stats, loading, confirmAppointment } = useAppointments();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = getOffsetDateString(0);

  // Today's appointments
  const todayAppointments = appointments.filter(a => a.date === todayStr);

  // Recent booking requests (Pending)
  const pendingRequests = appointments.filter(a => a.status === 'Pending').slice(0, 4);

  const handleQuickConfirm = async (id) => {
    await confirmAppointment(id);
    toast.success('Appointment confirmed! Updated in clinic schedule.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* Clinic Notice Header Banner */}
      <div className="rounded-2xl bg-teal-800 text-white p-6 sm:p-7 shadow-sm border border-teal-900">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-teal-900/80 text-teal-100 mb-3 border border-teal-700">
            <Coffee className="w-3.5 h-3.5" />
            <span>Clinic Afternoon Break: 12:00 PM – 5:00 PM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Care & Cure Physiotherapy – Reception Desk & Online Booking
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed mb-4">
            Our clinic is on break from 12:00 PM to 5:00 PM daily. Patients calling with back or knee pain can request their appointment online anytime. Reception staff can review and confirm pending slots with one click.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-teal-900 hover:bg-teal-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              <span>Patient Slot Booking Form</span>
            </Link>
            <Link
              to="/simulator"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-900 hover:bg-teal-950 text-white border border-teal-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>WhatsApp Message Preview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Sessions"
              value={stats.total}
              subtitle="All fictional records"
              icon={Calendar}
              color="teal"
              onClick={() => navigate('/appointments')}
            />
            <StatCard
              title="Pending Requests"
              value={stats.pending}
              subtitle="Needs staff review"
              badgeText={stats.pending > 0 ? "Action Required" : "All clear"}
              icon={AlertCircle}
              color="amber"
              onClick={() => navigate('/appointments?status=Pending')}
            />
            <StatCard
              title="Confirmed Slots"
              value={stats.confirmed}
              subtitle="Active sessions booked"
              icon={CheckCircle2}
              color="emerald"
              onClick={() => navigate('/appointments?status=Confirmed')}
            />
            <StatCard
              title="Reminders Due"
              value={stats.remindersDue}
              subtitle="Upcoming sessions"
              icon={BellRing}
              color="blue"
              onClick={() => navigate('/reminders')}
            />
          </>
        )}
      </div>

      {/* Main Grid: Pending Requests & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Weekly Demand Chart + Pending Triage */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Volume SVG Chart */}
          <WeeklyVolumeChart />

          {/* Pending Requests Queue */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Pending Booking Requests</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requests submitted by patients (instant slot reservation awaiting confirmation)
                </p>
              </div>
              <Link
                to="/appointments?status=Pending"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <AppointmentCardSkeleton />
                <AppointmentCardSkeleton />
              </div>
            ) : pendingRequests.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All caught up!"
                description="No pending patient requests right now. Create a new slot request from the booking page to test."
                actionLabel="Submit Demo Request"
                onAction={() => navigate('/book')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingRequests.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onConfirm={handleQuickConfirm}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Today's Schedule & Quick Demo Controls */}
        <div className="space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Today's Sessions</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDateDisplay(todayStr)}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                {todayAppointments.length} slots
              </span>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No appointments scheduled for today.
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {apt.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {apt.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                        {apt.time}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        apt.status === 'Confirmed'
                          ? 'text-teal-600 dark:text-teal-400'
                          : apt.status === 'Pending'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-400'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demo Clinic Quick Profile */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Clinic Location & Hours</span>
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Care And Cure Physiotherapy Clinic
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Dwaraka Nagar, Visakhapatnam, Andhra Pradesh
              </p>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-[11px]">
                <p><strong>Morning:</strong> 09:00 AM – 12:00 PM</p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold">
                  <strong>Break:</strong> 12:00 PM – 05:00 PM (Break / Inpatient rounds)
                </p>
                <p><strong>Evening:</strong> 05:00 PM – 09:00 PM</p>
              </div>
            </div>
            <Link
              to="/settings"
              className="inline-block text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline pt-1"
            >
              Edit demo clinic timings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
