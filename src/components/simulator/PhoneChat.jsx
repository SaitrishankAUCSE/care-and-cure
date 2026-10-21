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
  ShieldAlert,
  Clock
} from 'lucide-react';
import {
  getRequestReceivedMessage,
  getConfirmedMessage,
  getReminderMessage
} from '../../utils/messageTemplates';
import { formatDateDisplay } from '../../utils/dateUtils';

export default function PhoneChat({
  appointment,
  onSelectAppointment = null,
  allAppointments = []
}) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingJourney, setIsPlayingJourney] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'confirmed' | 'reminder' | 'journey'
  const chatBottomRef = useRef(null);

  const patientName = appointment?.patientName || 'Aarav Demo';
  const date = appointment?.date || '2026-10-22';
  const time = appointment?.time || '10:30 AM';

  const msgA = getRequestReceivedMessage(patientName, date, time);
  const msgB = getConfirmedMessage(patientName, date, time);
  const msgC = getReminderMessage(patientName, date, time);

  // Initialize with selected message
  useEffect(() => {
    if (!isPlayingJourney) {
      if (activeTab === 'received') {
        setMessages([
          {
            id: 'm-req',
            sender: 'clinic',
            text: msgA,
            time: '12:05 PM',
            tag: 'A. Request Received'
          }
        ]);
      } else if (activeTab === 'confirmed') {
        setMessages([
          {
            id: 'm-conf',
            sender: 'clinic',
            text: msgB,
            time: '01:15 PM',
            tag: 'B. Confirmed Slot'
          }
        ]);
      } else if (activeTab === 'reminder') {
        setMessages([
          {
            id: 'm-rem',
            sender: 'clinic',
            text: msgC,
            time: '08:00 AM',
            tag: 'C. Appointment Reminder'
          }
        ]);
      }
    }
  }, [appointment, activeTab, isPlayingJourney, msgA, msgB, msgC]);

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
          text: `Hi, I submitted a booking request for ${formatDateDisplay(date)} at ${time} for knee pain.`,
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
              text: msgA,
              time: '12:03 PM',
              tag: 'A. Request Received'
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
                  text: msgB,
                  time: '01:10 PM',
                  tag: 'B. Slot Confirmed'
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
                      text: msgC,
                      time: '06:00 PM',
                      tag: 'C. Reminder Sent'
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
    setActiveTab('received');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Appointment selector & simulator mode controls */}
      <div className="mb-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Selected Appointment
          </label>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
            Simulated
          </span>
        </div>

        {allAppointments.length > 0 && onSelectAppointment && (
          <select
            value={appointment?.id || ''}
            onChange={(e) => {
              const selected = allAppointments.find(a => a.id === e.target.value);
              if (selected) onSelectAppointment(selected);
            }}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {allAppointments.map(a => (
              <option key={a.id} value={a.id}>
                {a.patientName} — {formatDateDisplay(a.date)} ({a.time}) [{a.status}]
              </option>
            ))}
          </select>
        )}

        {/* Message Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={() => {
              setIsPlayingJourney(false);
              setActiveTab('received');
            }}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeTab === 'received' && !isPlayingJourney
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            A. Received
          </button>
          <button
            onClick={() => {
              setIsPlayingJourney(false);
              setActiveTab('confirmed');
            }}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeTab === 'confirmed' && !isPlayingJourney
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            B. Confirmed
          </button>
          <button
            onClick={() => {
              setIsPlayingJourney(false);
              setActiveTab('reminder');
            }}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              activeTab === 'reminder' && !isPlayingJourney
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            C. Reminder
          </button>
        </div>

        {/* Play Full Patient Journey Button */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={playFullJourney}
            disabled={isPlayingJourney}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isPlayingJourney ? 'animate-spin' : ''}`} />
            <span>{isPlayingJourney ? 'Simulating Patient Journey...' : 'Play Full Patient Journey'}</span>
          </button>
          {isPlayingJourney && (
            <button
              onClick={resetJourney}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Reset Journey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Realistic Smartphone Frame */}
      <div className="relative mx-auto rounded-[38px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800 max-w-sm">
        {/* Phone Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center z-20">
          <div className="w-10 h-1.5 bg-slate-950 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-2"></div>
        </div>

        {/* Screen container */}
        <div className="relative rounded-[28px] overflow-hidden bg-white dark:bg-slate-950 flex flex-col h-[560px]">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white px-4 pt-8 pb-3 flex items-center justify-between shadow-md z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
                C&C
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-sm tracking-tight">Care & Cure Physio</h4>
                <p className="text-[10px] text-teal-100 opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  {isTyping ? 'typing demo message...' : 'Verified Clinic (demo)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-teal-100">
              <Video className="w-4 h-4 opacity-80 cursor-not-allowed" />
              <Phone className="w-4 h-4 opacity-80 cursor-not-allowed" />
              <MoreVertical className="w-4 h-4 opacity-80 cursor-not-allowed" />
            </div>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 whatsapp-chat-bg p-3.5 overflow-y-auto space-y-3">
            {/* Disclaimer pill inside WhatsApp */}
            <div className="text-center my-2">
              <span className="inline-block bg-[#ffeecd] dark:bg-[#2d281f] text-[#544426] dark:text-[#e4cf9b] text-[10px] font-medium px-3 py-1 rounded-lg shadow-2xs border border-amber-300/40">
                🔒 WhatsApp Demo Simulation – For clinic demonstration only
              </span>
            </div>

            {/* Date divider */}
            <div className="text-center my-1">
              <span className="inline-block bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
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
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 px-1">
                      {m.tag}
                    </span>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs relative ${
                      isClinic
                        ? 'whatsapp-bubble-in rounded-tl-none border border-black/5 dark:border-white/5'
                        : 'whatsapp-bubble-out rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-100 font-normal">
                      {m.text}
                    </p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400 dark:text-slate-400">
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

          {/* Fake input bar */}
          <div className="p-2 bg-slate-100 dark:bg-slate-900 flex items-center gap-2 shrink-0 border-t border-slate-200 dark:border-slate-800">
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-full px-3.5 py-1.5 flex items-center justify-between text-slate-400 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 cursor-not-allowed" />
                <span className="text-[11px] text-slate-400 select-none">Simulated message input...</span>
              </div>
              <Paperclip className="w-4 h-4 cursor-not-allowed" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#075e54] text-white flex items-center justify-center shadow-xs cursor-not-allowed">
              <Mic className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Simulator caption */}
      <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-3">
        Interactive WhatsApp preview demonstrating how Care & Cure keeps patients updated without manual phone calls during break hours.
      </p>
    </div>
  );
}
