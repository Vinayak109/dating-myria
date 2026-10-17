import React, { useState } from "react";
import { Conversation, Message } from "../types";

interface ConversationDrawerProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onAcceptDate: (conversationId: string) => void;
}

export const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  conversation,
  isOpen,
  onClose,
  onSendMessage,
  onAcceptDate,
}) => {
  const [inputText, setInputText] = useState("");

  if (!isOpen || !conversation) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(conversation.id, inputText);
    setInputText("");
  };

  const quickPrompts = [
    "I'd love that! What time works for you?",
    "That lounge has amazing music.",
    "Thursday evening sounds perfect.",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-[#E5BDBE]/60 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E5BDBE]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-lg font-bold text-[#131B2E]">
                  {conversation.name}
                </h3>
                <span
                  className="material-symbols-outlined text-[#E11D48] text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <p className="text-xs text-[#5C3F40]">{conversation.occupation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#5C3F40]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Date Invitation Banner if present */}
        {conversation.pendingInvite && (
          <div className="p-4 bg-gradient-to-r from-[#FFF1F2] to-[#FFDADB]/50 border-b border-[#FDA4AF]/40 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#B80035] text-[22px] mt-0.5">
                  event_available
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#B80035] uppercase tracking-wider">
                    Date Invitation Received
                  </span>
                  <p className="text-sm font-bold text-[#131B2E]">
                    {conversation.pendingInvite.title}
                  </p>
                  <p className="text-xs text-[#5C3F40]">
                    {conversation.pendingInvite.location} • {conversation.pendingInvite.dateTime}
                  </p>
                </div>
              </div>
              {conversation.pendingInvite.status === "pending" ? (
                <button
                  onClick={() => onAcceptDate(conversation.id)}
                  className="px-3 py-1.5 rounded-full bg-[#B80035] text-white text-xs font-bold hover:bg-[#920028] shadow-xs active:scale-95 transition-all shrink-0"
                >
                  Accept Date
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Date Confirmed
                </span>
              )}
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#FAF8FF]">
          {conversation.messages.map((m: Message) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "me" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.sender === "me"
                    ? "bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white rounded-br-xs shadow-xs"
                    : "bg-white text-[#131B2E] border border-[#E5BDBE]/40 rounded-bl-xs shadow-xs"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#906F70] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 px-4 bg-white border-t border-[#E5BDBE]/30 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(q)}
              className="px-3 py-1 rounded-full bg-[#FAF8FF] border border-[#E5BDBE]/50 text-xs text-[#5C3F40] hover:text-[#B80035] hover:border-[#B80035] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-white border-t border-[#E5BDBE]/40 flex items-center gap-2.5 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${conversation.name}...`}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] placeholder-[#906F70] focus:outline-hidden focus:border-[#B80035]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
