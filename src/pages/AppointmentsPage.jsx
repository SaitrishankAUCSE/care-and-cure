import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../components/common/Toast';
import AppointmentCard from '../components/appointments/AppointmentCard';
import AppointmentForm from '../components/appointments/AppointmentForm';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { AppointmentCardSkeleton } from '../components/common/Skeleton';
import { getOffsetDateString, isPastDate } from '../utils/dateUtils';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';

export default function AppointmentsPage() {
  const { appointments, loading, addAppointment, updateAppointment, deleteAppointment, confirmAppointment } = useAppointments();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const statusFilter = searchParams.get('status') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'tomorrow' | 'upcoming' | 'past'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const todayStr = getOffsetDateString(0);
  const tomorrowStr = getOffsetDateString(1);

  // Status pills
  const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && apt.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter
      if (dateFilter === 'today' && apt.date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && apt.date !== tomorrowStr) return false;
      if (dateFilter === 'upcoming' && apt.date < todayStr) return false;
      if (dateFilter === 'past' && !isPastDate(apt.date)) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = apt.patientName?.toLowerCase().includes(query);
        const matchesPhone = apt.phone?.toLowerCase().includes(query);
        const matchesNotes = apt.notes?.toLowerCase().includes(query);
        const matchesType = apt.type?.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesNotes && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, statusFilter, dateFilter, searchQuery, todayStr, tomorrowStr]);

  const handleSetStatusFilter = (status) => {
    if (status === 'All') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  const handleCreateAppointment = async (formData) => {
    try {
      await addAppointment(formData);
      setIsCreateModalOpen(false);
      toast.success(`Appointment for ${formData.patientName} created successfully!`);
    } catch (err) {
      toast.error('Failed to create appointment.');
    }
  };

  const handleUpdateAppointment = async (formData) => {
    if (!editingAppointment) return;
    try {
      await updateAppointment(editingAppointment.id, formData);
      setEditingAppointment(null);
      toast.success(`Appointment updated successfully!`);
    } catch (err) {
      toast.error('Failed to update appointment.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fictional demo record?')) {
      await deleteAppointment(id);
      toast.info('Appointment record removed.');
    }
  };

  const handleConfirm = async (id) => {
    await confirmAppointment(id);
    toast.success('Appointment confirmed! Status updated.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Staff Appointment Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track, filter, edit, and confirm patient physiotherapy appointments
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment (Staff)</span>
        </button>
      </div>

      {/* Filter Toolbar: Search, Status Tabs, Date Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, demo phone, notes..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Schedule</option>
              <option value="tomorrow">Tomorrow's Schedule</option>
              <option value="upcoming">Upcoming (Future)</option>
              <option value="past">Past Records</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusOptions.map((status) => {
            const count = status === 'All' 
              ? appointments.length 
              : appointments.filter(a => a.status === status).length;
            const isSelected = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() => handleSetStatusFilter(status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-teal-700 text-teal-100'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointment Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments matching filter"
          description="Try selecting a different status pill, clearing the search box, or adding a new booking."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            handleSetStatusFilter('All');
            setDateFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onConfirm={handleConfirm}
              onEdit={(apt) => setEditingAppointment(apt)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal: Create Appointment */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Appointment"
        subtitle="Staff interface for clinic bookings"
      >
        <AppointmentForm
          onSubmit={handleCreateAppointment}
          onCancel={() => setIsCreateModalOpen(false)}
          isStaffMode={true}
        />
      </Modal>

      {/* Modal: Edit Appointment */}
      <Modal
        isOpen={Boolean(editingAppointment)}
        onClose={() => setEditingAppointment(null)}
        title="Edit Appointment Details"
        subtitle={editingAppointment?.patientName}
      >
        {editingAppointment && (
          <AppointmentForm
            initialData={editingAppointment}
            onSubmit={handleUpdateAppointment}
            onCancel={() => setEditingAppointment(null)}
            isStaffMode={true}
          />
        )}
      </Modal>
    </div>
  );
}
