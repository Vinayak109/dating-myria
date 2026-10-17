import React from "react";
import { UserProfile, CurrentUser } from "../types";

interface MatchCelebrationModalProps {
  candidate: UserProfile | null;
  currentUser: CurrentUser;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (candidate: UserProfile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  candidate,
  currentUser,
  isOpen,
  onClose,
  onStartChat,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F172A] text-white rounded-3xl shadow-2xl border border-white/15 p-8 text-center flex flex-col items-center space-y-6">
        {/* Glow Halo */}
        <div className="absolute -top-16 inset-x-0 flex justify-center pointer-events-none">
          <div className="w-48 h-48 bg-[#E11D48]/30 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Sparks Title */}
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#FFB2B7] flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            Mutual Salon Spark
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            It's a Chemistry Match
          </h2>
          <p className="text-xs text-white/70 mt-1.5">
            You and {candidate.name} both felt the frequency.
          </p>
        </div>

        {/* Dual Avatars Interlocking */}
        <div className="flex items-center justify-center -space-x-4 my-2">
          <div className="w-24 h-24 rounded-full ring-4 ring-[#0F172A] ring-offset-2 ring-offset-[#E11D48] overflow-hidden bg-slate-800 shadow-xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-24 h-24 rounded-full ring-4 ring-[#0F172A] ring-offset-2 ring-offset-[#B80035] overflow-hidden bg-slate-800 shadow-xl z-10">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Compatibility highlight */}
        <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs text-white font-medium flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#E11D48] text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>{candidate.matchScore}% Aesthetic & Intellectual Compatibility</span>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={() => {
              onStartChat(candidate);
              onClose();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white font-bold text-sm shadow-xl shadow-[#E11D48]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Send First Message to {candidate.name}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            Keep Exploring Salon
          </button>
        </div>
      </div>
    </div>
  );
};
