import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';

// Pages
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientBookingPage from './pages/PatientBookingPage';
import WhatsAppSimulatorPage from './pages/WhatsAppSimulatorPage';
import RemindersPage from './pages/RemindersPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppointmentProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
              {/* Top Navigation Bar */}
              <Navbar />

              {/* Main App Layout: Sidebar + Route Views */}
              <div className="flex-1 flex w-full">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Page Content Viewport */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/book" element={<PatientBookingPage />} />
                    <Route path="/simulator" element={<WhatsAppSimulatorPage />} />
                    <Route path="/reminders" element={<RemindersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>

              {/* Mobile Bottom Navigation */}
              <BottomNav />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AppointmentProvider>
    </ThemeProvider>
  );
}
