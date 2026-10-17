import React, { useState } from "react";
import { UserProfile } from "../types";

interface SendRoseModalProps {
  candidate: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSent: (candidateName: string, note: string) => void;
}

export const SendRoseModal: React.FC<SendRoseModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSent,
}) => {
  const [giftType, setGiftType] = useState<"rose" | "wine" | "vinyl">("rose");
  const [note, setNote] = useState<string>(
    `I loved your thought about "${candidate.sundayPrompt.slice(0, 48)}...". Would love to hear more over drinks.`
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#FDA4AF]/40 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FFF1F2] to-[#FFDADA] border-b border-[#FDA4AF]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-md shadow-[#E11D48]/25">
              <span className="material-symbols-outlined text-[22px]">redeem</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#B80035] uppercase tracking-wider">
                Private Salon Gesture
              </span>
              <h3 className="font-serif text-xl font-bold text-[#131B2E]">
                Send a Note to {candidate.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#5C3F40]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Gift Selector */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-2">
              Select Curated Gift Token
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setGiftType("rose")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  giftType === "rose"
                    ? "bg-[#FFF1F2] border-[#E11D48] text-[#B80035] shadow-xs"
                    : "border-[#E5BDBE]/40 hover:bg-[#FAF8FF] text-[#5C3F40]"
                }`}
              >
                <span className="text-2xl block mb-1">🌹</span>
                <span className="text-xs font-bold">Midnight Rose</span>
              </button>

              <button
                type="button"
                onClick={() => setGiftType("wine")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  giftType === "wine"
                    ? "bg-[#FFF1F2] border-[#E11D48] text-[#B80035] shadow-xs"
                    : "border-[#E5BDBE]/40 hover:bg-[#FAF8FF] text-[#5C3F40]"
                }`}
              >
                <span className="text-2xl block mb-1">🍷</span>
                <span className="text-xs font-bold">Orange Wine</span>
              </button>

              <button
                type="button"
                onClick={() => setGiftType("vinyl")}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  giftType === "vinyl"
                    ? "bg-[#FFF1F2] border-[#E11D48] text-[#B80035] shadow-xs"
                    : "border-[#E5BDBE]/40 hover:bg-[#FAF8FF] text-[#5C3F40]"
                }`}
              >
                <span className="text-2xl block mb-1">🎷</span>
                <span className="text-xs font-bold">Vinyl Pressing</span>
              </button>
            </div>
          </div>

          {/* Handwritten Note Area */}
          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-2">
              Personalized Note
            </label>
            <div className="relative rounded-2xl bg-[#FFFDFD] border border-[#FDA4AF]/60 p-4 shadow-inner">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full bg-transparent text-sm text-[#131B2E] placeholder-[#906F70] focus:outline-hidden resize-none font-serif leading-relaxed"
                placeholder="Write an intentional first note..."
              ></textarea>
              <div className="flex justify-between items-center pt-2 text-[11px] text-[#906F70] border-t border-[#FDA4AF]/20">
                <span>Direct delivery to {candidate.name}'s salon tray</span>
                <span>{note.length}/280</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8FF] border-t border-[#E5BDBE]/40 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#E5BDBE] hover:bg-white text-sm font-semibold text-[#5C3F40]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSent(candidate.name, note);
              onClose();
            }}
            disabled={!note.trim()}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white text-sm font-bold shadow-md shadow-[#B80035]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Send Gesture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
