/**
 * WhatsApp message templates for Care And Cure Physiotherapy
 * Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik • Malkapuram, Visakhapatnam
 * Phone: +91 87909 72042
 */

import { formatDateDisplay } from './dateUtils';

export function getRequestReceivedMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Hello ${patientName || '[Name]'}, we have received your appointment request for ${displayDate} at ${time || '[time]'}. Care And Cure Physiotherapy (Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik, Malkapuram) will confirm your slot shortly.`;
}

export function getConfirmedMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Hello ${patientName || '[Name]'}, your physiotherapy appointment at Care And Cure Physiotherapy Clinic, Malkapuram is confirmed for ${displayDate} at ${time || '[time]'}. Please arrive 5 minutes early. For inquiries, call 87909 72042.`;
}

export function getRescheduleMessage(patientName, newDate, newTime) {
  const displayDate = formatDateDisplay(newDate);
  return `Hello ${patientName || '[Name]'}, your physiotherapy appointment at Care And Cure Clinic has been rescheduled to ${displayDate} at ${newTime || '[time]'}. Please let us know if this time suits you or call 87909 72042.`;
}

export function getCancellationMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Hello ${patientName || '[Name]'}, your appointment scheduled for ${displayDate} at ${time || '[time]'} at Care And Cure Physiotherapy has been cancelled as requested. To book a new slot, visit our portal or contact 87909 72042.`;
}

export function getReminderMessage(patientName, date, time) {
  const displayDate = formatDateDisplay(date);
  return `Reminder from Care And Cure Physiotherapy, Malkapuram: You have a therapy session scheduled for ${displayDate} at ${time || '[time]'}. Please call 87909 72042 if you need to reschedule.`;
}

export const CLINIC_DEFAULT_INFO = {
  name: "Care And Cure Physiotherapy Clinic",
  doctors: "Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik",
  address: "D.No. 61-1-33, Opp. HPCL Main Gate, Near Union Bank of India, Ramakrishnapuram Main Road, Malkapuram, Visakhapatnam, Andhra Pradesh 530011",
  landmark: "Opp. HPCL Main Gate, Near Union Bank of India",
  phone: "+91 87909 72042",
  breakNotice: "Break hours: 12:00 PM – 4:00 PM. Slot requests are accepted 24/7 online!",
  hoursNote: "Online directories note 9:00 AM – 12:00 PM & 4:00 PM – 9:00 PM. Schedule confirmed upon request."
};
