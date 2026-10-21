/**
 * WhatsApp message templates for Care And Cure Physiotherapy Demo
 * Notice: All messages are simulated for demo purposes only.
 */

import { formatDateDisplay } from './dateUtils';

export function getRequestReceivedMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Hello ${patientName || '[Name]'}, we have received your appointment request for ${displayDate} at ${time || '[time]'}. The clinic will confirm your slot shortly.`;
}

export function getConfirmedMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Hello ${patientName || '[Name]'}, your physiotherapy appointment is confirmed for ${displayDate} at ${time || '[time]'}. Please contact the clinic if you need to reschedule.`;
}

export function getReminderMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Reminder: You have an appointment scheduled for ${displayDate} at ${time || '[time]'}. Please contact the clinic if you need to make any changes.`;
}

export const CLINIC_DEFAULT_INFO = {
  name: "Care And Cure Physiotherapy Clinic",
  address: "D.No 48-14-3, Rama Talkies Road, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016",
  phone: "+91 891 270 0000 (demo)",
  breakNotice: "Break hours: 12:00 PM – 5:00 PM. Slot requests are accepted 24/7 online!",
};
