import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  Play,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import {
  getRequestReceivedMessage,
  getConfirmedMessage,
  getRescheduleMessage,
  getCancellationMessage,
  getReminderMessage
} from '../../utils/messageTemplates';
import { formatDateDisplay } from '../../utils/dateUtils';
import { useToast } from '../common/Toast';

export default function PhoneChat({
  appointment,
  onSelectAppointment = null,
  allAppointments = []
}) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingJourney, setIsPlayingJourney] = useState(false);
  const [activeTab, setActiveTab] = useState('confirmed'); // 'received' | 'confirmed' | 'reschedule' | 'cancel' | 'reminder' | 'journey'
  const [copied, setCopied] = useState(false);
  const chatBottomRef = useRef(null);

  const patientName = appointment?.patientName || 'K. Rajesh Kumar';
  const phone = appointment?.phone || '+91 98480 23145';
  const date = appointment?.date || '2026-10-22';
  const time = appointment?.time || '10:30 AM';

  const msgReceived = getRequestReceivedMessage(patientName, date, time);
  const msgConfirmed = getConfirmedMessage(patientName, date, time);
  const msgReschedule = getRescheduleMessage(patientName, date, time);
  const msgCancel = getCancellationMessage(patientName, date, time);
  const msgReminder = getReminderMessage(patientName, date, time);

  const getActiveMessageText = () => {
    switch (activeTab) {
      case 'received': return msgReceived;
      case 'confirmed': return msgConfirmed;
      case 'reschedule': return msgReschedule;
      case 'cancel': return msgCancel;
      case 'reminder': return msgReminder;
      default: return msgConfirmed;
    }
  };

  // Initialize with selected message
  useEffect(() => {
    if (!isPlayingJourney) {
      let activeText = msgConfirmed;
      let tag = 'Confirmed Slot';

      if (activeTab === 'received') {
        activeText = msgReceived;
        tag = '1. Request Received';
      } else if (activeTab === 'confirmed') {
        activeText = msgConfirmed;
        tag = '2. Slot Confirmed';
      } else if (activeTab === 'reschedule') {
        activeText = msgReschedule;
        tag = '3. Appointment Rescheduled';
      } else if (activeTab === 'cancel') {
        activeText = msgCancel;
        tag = '4. Appointment Cancelled';
      } else if (activeTab === 'reminder') {
        activeText = msgReminder;
        tag = '5. Session Reminder';
      }

      setMessages([
        {
          id: `m-${activeTab}`,
          sender: 'clinic',
          text: activeText,
          time: '10:45 AM',
          tag
        }
      ]);
    }
  }, [appointment, activeTab, isPlayingJourney, msgReceived, msgConfirmed, msgReschedule, msgCancel, msgReminder]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Full Patient Journey Animation
  const playFullJourney = () => {
    if (isPlayingJourney) return;
    setIsPlayingJourney(true);
    setActiveTab('journey');
    setMessages([]);

    // Step 1: Patient requests slot
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 'step-0',
          sender: 'patient',
          text: `Hi Dr. Patnaik, I submitted a physiotherapy slot request for ${formatDateDisplay(date)} at ${time} for lower back stiffness.`,
          time: '12:02 PM',
          tag: 'Patient Request'
        }
      ]);

      // Step 2: Clinic automated receipt
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: 'step-1',
              sender: 'clinic',
              text: msgReceived,
              time: '12:03 PM',
              tag: '1. Request Received'
            }
          ]);

          // Step 3: Staff confirms slot (after clinic break/review)
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setMessages(prev => [
                ...prev,
                {
                  id: 'step-2',
                  sender: 'clinic',
                  text: msgConfirmed,
                  time: '04:05 PM',
                  tag: '2. Slot Confirmed'
                }
              ]);

              // Step 4: 24h before reminder
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: 'step-3',
                      sender: 'clinic',
                      text: msgReminder,
                      time: '06:00 PM',
                      tag: '3. Session Reminder'
                    }
                  ]);
                  setIsPlayingJourney(false);
                }, 1200);
              }, 1400);
            }, 1200);
          }, 1400);
        }, 1100);
      }, 700);
    }, 700);
  };

  const resetJourney = () => {
    setIsPlayingJourney(false);
    setActiveTab('confirmed');
  };

  const handleCopyMessage = () => {
    const text = getActiveMessageText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('WhatsApp message template copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(getActiveMessageText());
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Appointment selector & message actions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Select Patient Appointment
          </label>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            Active Patient
          </span>
        </div>

        {allAppointments.length > 0 && onSelectAppointment && (
          <select
            value={appointment?.id || ''}
            onChange={(e) => {
              const selected = allAppointments.find(a => a.id === e.target.value);
              if (selected) onSelectAppointment(selected);
            }}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            {allAppointments.map(a => (
              <option key={a.id} value={a.id}>
                {a.patientName} — {formatDateDisplay(a.date)} at {a.time} [{a.status}]
              </option>
            ))}
          </select>
        )}

        {/* Message Type Selector Pills */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            Select Message Type to Review & Send
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setIsPlayingJourney(false);
                setActiveTab('confirmed');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'confirmed' && !isPlayingJourney
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
              }`}
            >
              Confirmation
            </button>
            <button
              onClick={() => {
                setIsPlayingJourney(false);
                setActiveTab('reschedule');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'reschedule' && !isPlayingJourney
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
              }`}
            >
              Rescheduling
            </button>
            <button
              onClick={() => {
                setIsPlayingJourney(false);
                setActiveTab('cancel');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'cancel' && !isPlayingJourney
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
              }`}
            >
              Cancellation
            </button>
            <button
              onClick={() => {
                setIsPlayingJourney(false);
                setActiveTab('reminder');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'reminder' && !isPlayingJourney
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
              }`}
            >
              Session Reminder
            </button>
            <button
              onClick={() => {
                setIsPlayingJourney(false);
                setActiveTab('received');
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'received' && !isPlayingJourney
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
              }`}
            >
              Request Received
            </button>
          </div>
        </div>

        {/* Staff Action Buttons: Copy Message & Send to Patient WhatsApp */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={handleCopyMessage}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Template'}</span>
          </button>
          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Send via WhatsApp</span>
          </button>
        </div>

        {/* Play Full Patient Journey Button */}
        <div className="pt-1 flex gap-2">
          <button
            onClick={playFullJourney}
            disabled={isPlayingJourney}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isPlayingJourney ? 'animate-spin' : ''}`} />
            <span>{isPlayingJourney ? 'Simulating Conversation Flow...' : 'Play Patient Journey Demo'}</span>
          </button>
          {isPlayingJourney && (
            <button
              onClick={resetJourney}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
              title="Reset Journey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative mx-auto rounded-[38px] p-3 bg-slate-900 shadow-xl border-4 border-slate-800 max-w-sm">
        {/* Phone Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center z-20">
          <div className="w-10 h-1.5 bg-slate-950 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-2"></div>
        </div>

        {/* Screen container */}
        <div className="relative rounded-[28px] overflow-hidden bg-white flex flex-col h-[520px]">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white px-4 pt-8 pb-3 flex items-center justify-between shadow-md z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
                C&C
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-sm tracking-tight">Care & Cure Physio</h4>
                <p className="text-[10px] text-emerald-100 opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block animate-pulse"></span>
                  {isTyping ? 'typing message...' : 'Malkapuram Clinic (87909 72042)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-emerald-100">
              <Video className="w-4 h-4 opacity-80" />
              <Phone className="w-4 h-4 opacity-80" />
              <MoreVertical className="w-4 h-4 opacity-80" />
            </div>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 whatsapp-chat-bg p-3.5 overflow-y-auto space-y-3">
            {/* Disclaimer pill inside WhatsApp */}
            <div className="text-center my-2">
              <span className="inline-block bg-[#ffeecd] text-[#544426] text-[10px] font-medium px-3 py-1 rounded-lg shadow-2xs border border-amber-300/40">
                🔒 Care & Cure Physiotherapy • Dr. K. Hareesh Patnaik & Dr. V.V. Reshma Patnaik
              </span>
            </div>

            {/* Date divider */}
            <div className="text-center my-1">
              <span className="inline-block bg-white/90 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                {formatDateDisplay(date)}
              </span>
            </div>

            {/* Messages */}
            {messages.map((m) => {
              const isClinic = m.sender === 'clinic';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isClinic ? 'items-start' : 'items-end'}`}
                >
                  {/* Tag label */}
                  {m.tag && (
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 mb-0.5 px-1">
                      {m.tag}
                    </span>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs relative ${
                      isClinic
                        ? 'whatsapp-bubble-in rounded-tl-none border border-black/5'
                        : 'whatsapp-bubble-out rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-normal">
                      {m.text}
                    </p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>{m.time}</span>
                      {isClinic && <CheckCheck className="w-3 h-3 text-sky-500 inline" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 whatsapp-bubble-in px-3.5 py-2 rounded-2xl rounded-tl-none w-20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <div className="p-2 bg-slate-100 flex items-center gap-2 shrink-0 border-t border-slate-200">
            <div className="flex-1 bg-white rounded-full px-3.5 py-1.5 flex items-center justify-between text-slate-400 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] text-slate-400 select-none">Send message to {patientName}...</span>
              </div>
              <Paperclip className="w-4 h-4 text-slate-400" />
            </div>
            <button
              onClick={handleOpenWhatsApp}
              className="w-8 h-8 rounded-full bg-[#075e54] text-white flex items-center justify-center shadow-xs hover:bg-[#064e46] transition-colors"
              title="Open WhatsApp with this message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
