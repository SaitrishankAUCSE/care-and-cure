import React from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import AppointmentCard from '../components/appointments/AppointmentCard';
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart';
import EmptyState from '../components/common/EmptyState';
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
  Activity,
  Phone,
  UserCheck,
  Award,
  Stethoscope,
  ChevronRight,
  Building2
} from 'lucide-react';

export default function DashboardPage() {
  const { appointments, stats, loading, confirmAppointment } = useAppointments();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = getOffsetDateString(0);
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingRequests = appointments.filter(a => a.status === 'Pending').slice(0, 4);

  const handleQuickConfirm = async (id) => {
    await confirmAppointment(id);
    toast.success('Appointment confirmed! Updated in clinic schedule.');
  };

  const treatments = [
    {
      title: "Spine & Sciatica Therapy",
      desc: "Decompression therapy, core stabilization, and manual traction for lumbar disc herniation and nerve pain.",
      badge: "Spine Care"
    },
    {
      title: "Knee Arthritis & Joint Rehab",
      desc: "Quadriceps strengthening, ultrasound therapy, and post-total knee replacement mobilization protocols.",
      badge: "Joint Rehab"
    },
    {
      title: "Cervical Spondylosis & Neck Strain",
      desc: "Relief for desk workers experiencing radiating shoulder pain, cervical stiffness, and tension headaches.",
      badge: "Neck & Upper Back"
    },
    {
      title: "Frozen Shoulder Mobilization",
      desc: "Capsular stretching, Maitland joint mobilization, and range-of-motion restoration for adhesive capsulitis.",
      badge: "Shoulder Care"
    },
    {
      title: "Post-Fracture & Surgical Rehab",
      desc: "Gradual weight-bearing exercises, scar tissue management, and functional independence training.",
      badge: "Post-Op Rehab"
    },
    {
      title: "Sports Injury Rehabilitation",
      desc: "ACL ligament rehab, ankle sprain recovery, rotator cuff conditioning, and return-to-sport protocols.",
      badge: "Sports Physio"
    }
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Clinic Hero Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Award className="w-3.5 h-3.5" />
              <span>Visakhapatnam's Trusted Physiotherapy & Spine Clinic</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Care & Cure Physiotherapy & Rehabilitation Centre
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Specialized clinical physiotherapy for acute back spasms, knee osteoarthritis, frozen shoulder, and sports injuries. Led by <strong>Dr. K. Ramanathan, M.P.T. (Ortho)</strong> with 14+ years of clinical excellence in Visakhapatnam.
            </p>

            {/* Doctor Info Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Dr. K. Ramanathan, M.P.T. (Ortho), MIAP
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                Dwaraka Nagar, Visakhapatnam
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                Consultation: ₹400 / session
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Book Consultation Slot (24/7)</span>
              </Link>
              <Link
                to="/appointments"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Reception OPD Schedule ({stats.pending} pending)</span>
              </Link>
            </div>
          </div>

          {/* Break Period Alert Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>Clinic Afternoon Break: 12:00 PM – 5:00 PM</span>
              </div>

              <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed">
                Our clinic takes an afternoon rest break and conducts hospital inpatient rounds between <strong>12 PM and 5 PM</strong>. Reception phone calls during this period may be unattended.
              </p>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <p className="font-semibold text-teal-800 dark:text-teal-300">
                  ✓ Need a slot right now?
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Select your slot online anytime. You will immediately receive a simulated WhatsApp confirmation message, and staff will confirm your slot upon reopening.
                </p>
              </div>

              <Link
                to="/simulator"
                className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Preview the WhatsApp confirmation patients receive</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Treatments Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>Conditions Treated at Care & Cure Visakhapatnam</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Evidence-based physiotherapy modalities including IFT, Ultrasound, TENS, Traction, and Manual Therapy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {treatments.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-teal-500 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded">
                  {t.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/book"
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Book for this condition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reception Desk Live Section: Today's Appointments & Pending Queue */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>Clinic Reception OPD Desk (Live Demo)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Front-desk queue for verifying slot requests and managing today's patients
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              {stats.pending} Pending Requests
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              {stats.confirmed} Confirmed Sessions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Patient Requests (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Pending Requests from Clinic Break Period</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Patients who requested a slot while the clinic phone line was busy
                </p>
              </div>
              <Link
                to="/appointments?status=Pending"
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View all ({stats.pending})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All pending requests handled"
                description="No unconfirmed slot requests right now. Submit a slot request from the booking page to test reception confirmation."
                actionLabel="Book a Slot"
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

          {/* Today's Schedule (Right 1 col) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Today's Clinic Schedule</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDateDisplay(todayStr)}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {todayAppointments.length} sessions
              </span>
            </div>

            {todayAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No sessions booked for today.
              </p>
            ) : (
              <div className="space-y-2.5">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {apt.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500">{apt.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {apt.time}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        apt.status === 'Confirmed' ? 'text-teal-700' : 'text-amber-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/appointments"
                className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-teal-700 hover:bg-teal-50 p-2 rounded-xl transition-colors"
              >
                <span>Open Full Reception Schedule →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Chart */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <WeeklyVolumeChart />
      </section>

      {/* Clinic Location & Working Hours Footer Info */}
      <section className="bg-teal-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-teal-100">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-300" />
              <span>Care & Cure Physiotherapy</span>
            </h4>
            <p className="leading-relaxed">
              D.No 48-14-3, Sri Sai Complex, Rama Talkies Road, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016.
            </p>
            <p className="mt-2 text-teal-300">Reg. No: AP/MC/PT/2012/0481</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-300" />
              <span>OPD Consultation Hours</span>
            </h4>
            <p><strong>Morning OPD:</strong> 09:00 AM – 12:00 PM</p>
            <p className="text-amber-300 font-bold mt-1">
              <strong>Break Hours:</strong> 12:00 PM – 05:00 PM (Inpatient rounds)
            </p>
            <p className="mt-1"><strong>Evening OPD:</strong> 05:00 PM – 09:00 PM</p>
            <p className="text-teal-300 mt-1">Sundays: Morning 10:00 AM – 01:00 PM</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-300" />
              <span>Helpline & Booking</span>
            </h4>
            <p>Reception Phone: <strong>+91 891 270 0000</strong></p>
            <p>Emergency Mobile: <strong>+91 90000 00000</strong></p>
            <div className="pt-2">
              <Link
                to="/book"
                className="inline-block px-3.5 py-1.5 rounded-lg bg-white text-teal-900 font-bold text-xs shadow-sm hover:bg-teal-50"
              >
                Book 24/7 Online
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
