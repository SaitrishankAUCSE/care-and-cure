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
  Coffee,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  MapPin,
  Activity,
  Phone,
  UserCheck,
  Award,
  Stethoscope,
  ChevronRight,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { appointments, stats, confirmAppointment } = useAppointments();
  const toast = useToast();
  const navigate = useNavigate();

  const todayStr = getOffsetDateString(0);
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingRequests = appointments.filter(a => a.status === 'Pending').slice(0, 4);

  const handleQuickConfirm = async (id) => {
    await confirmAppointment(id);
    toast.success('Appointment confirmed! Updated in clinic schedule.');
  };

  const services = [
    {
      title: "Sports Injury Rehabilitation",
      desc: "Specialized rehabilitation for athlete ligament strains, sprains, joint trauma, and muscle tears.",
      badge: "Sports Physio"
    },
    {
      title: "Orthopaedic Spine & Back Care",
      desc: "Lumbar spondylosis, sciatica decompression, postural rehabilitation, and disc management.",
      badge: "Spine & Disc"
    },
    {
      title: "Knee & Joint Mobility",
      desc: "Osteoarthritis therapy, post-surgical rehabilitation, ligament strengthening, and patellar care.",
      badge: "Joint Rehab"
    },
    {
      title: "Shoulder & Cervical Therapy",
      desc: "Frozen shoulder mobilization, rotator cuff repair recovery, and cervical neck stiffness relief.",
      badge: "Shoulder & Neck"
    },
    {
      title: "Post-Fracture Rehabilitation",
      desc: "Joint stiffness resolution, muscle re-education, and functional independence training.",
      badge: "Post-Trauma"
    },
    {
      title: "Pain Management & Electrotherapy",
      desc: "Targeted IFT, TENS, and therapeutic ultrasound for persistent musculoskeletal discomfort.",
      badge: "Therapy Modalities"
    }
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Clinic Hero Section - White background with Emerald Green border and accents */}
      <section className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Care & Cure Physiotherapy • Malkapuram, Visakhapatnam</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Care & Cure Physiotherapy & Sports Injury Clinic
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Led by <strong>Dr. K. Hareesh Patnaik</strong> and <strong>Dr. V.V. Reshma Patnaik</strong>, our Malkapuram clinic delivers dedicated physiotherapy, sports-injury recovery, and musculoskeletal rehabilitation.
            </p>

            {/* Doctor Info Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                D.No. 61-1-33, Opp. HPCL Main Gate, Ramakrishnapuram, Malkapuram, Vizag
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                +91 87909 72042
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Request Appointment Slot (24/7)</span>
              </Link>
              <Link
                to="/appointments"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Reception Desk ({stats.pending} pending requests)</span>
              </Link>
            </div>
          </div>

          {/* Break Period Alert Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Coffee className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Break Hours Notice: 12:00 PM – 4:00 PM</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                During our mid-day break and off-hours, phone lines may be busy. Patients experiencing joint, spine, or sports injuries can request their consultation slot online anytime.
              </p>

              <div className="bg-white rounded-xl p-3.5 border border-emerald-100 text-xs text-slate-700 space-y-1.5">
                <p className="font-semibold text-emerald-800">
                  ✓ Instant Patient Reassurance:
                </p>
                <p className="text-slate-600">
                  Patients receive a simulated WhatsApp confirmation immediately, and our reception desk confirms availability with one click upon reopening.
                </p>
              </div>

              <Link
                to="/simulator"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Preview the WhatsApp confirmation messages</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Services Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-700" />
            <span>Physiotherapy & Sports-Injury Services</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Care & Cure Clinic • Malkapuram, Visakhapatnam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs hover:border-emerald-500 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {s.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  to="/book"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
                >
                  <span>Request session for this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reception OPD Desk Live Section: Today's Appointments & Pending Queue */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Reception OPD Schedule & Booking Queue</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Live clinic desk at Malkapuram: review incoming patient requests and today's roster
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              {stats.pending} Pending Requests
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {stats.confirmed} Confirmed Sessions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Patient Requests (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Pending Requests from Off-Hours & Break Period</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Patients who requested an appointment while reception was on break
                </p>
              </div>
              <Link
                to="/appointments?status=Pending"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View all ({stats.pending})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No pending requests in queue"
                description="All patient slot requests are confirmed. Use the booking form to simulate a new patient request."
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
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Today's Sessions</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {formatDateDisplay(todayStr)}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
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
                    className="p-3 rounded-xl border border-slate-100 bg-emerald-50/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {apt.patientName}
                      </p>
                      <p className="text-[11px] text-slate-500">{apt.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 block">
                        {apt.time}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        apt.status === 'Confirmed' ? 'text-emerald-700' : 'text-amber-600'
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
                className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 p-2 rounded-xl transition-colors"
              >
                <span>View Full Clinic Schedule →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Chart */}
      <section className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs">
        <WeeklyVolumeChart />
      </section>

      {/* Clinic Location & Working Hours Footer */}
      <section className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-emerald-100">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>Care & Cure Physiotherapy Clinic</span>
            </h4>
            <p className="leading-relaxed">
              D.No. 61-1-33, Opp. HPCL Main Gate, Near Union Bank of India (formerly Andhra Bank), Ramakrishnapuram Main Road, Malkapuram, Visakhapatnam, Andhra Pradesh 530011.
            </p>
            <p className="mt-2 text-emerald-300">
              Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>OPD Consultation Hours</span>
            </h4>
            <p><strong>Morning OPD:</strong> 09:00 AM – 12:00 PM</p>
            <p className="text-amber-300 font-bold mt-1">
              <strong>Break Period:</strong> 12:00 PM – 04:00 PM
            </p>
            <p className="mt-1"><strong>Evening OPD:</strong> 04:00 PM – 09:00 PM</p>
            <p className="text-emerald-300 mt-1">Appointments can be requested 24/7 online</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Helpline & Booking</span>
            </h4>
            <p>Direct Contact: <strong>+91 87909 72042</strong></p>
            <p className="mt-1 text-emerald-200">Physiotherapy & Sports Injury Services</p>
            <div className="pt-2">
              <Link
                to="/book"
                className="inline-block px-3.5 py-1.5 rounded-lg bg-white text-emerald-900 font-bold text-xs shadow-sm hover:bg-emerald-50"
              >
                Book Appointment Online
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
