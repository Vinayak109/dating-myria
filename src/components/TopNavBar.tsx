import React from "react";
import { CurrentUser } from "../types";

interface TopNavBarProps {
  activeTab: "discover" | "vibes" | "radar" | "messages";
  setActiveTab: (tab: "discover" | "vibes" | "radar" | "messages") => void;
  currentUser: CurrentUser;
  unreadCount: number;
  likesCount: number;
  onOpenLikes: () => void;
  onOpenProfile: () => void;
  onOpenSparkLounge: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadCount,
  likesCount,
  onOpenLikes,
  onOpenProfile,
  onOpenSparkLounge,
}) => {
  return (
    <header className="bg-white/85 backdrop-blur-md text-[#B80035] top-0 sticky z-40 border-b border-[#E5BDBE]/40 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-12 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo & Salon Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("discover")}
            className="flex items-center gap-2 group text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B80035] to-[#E11D48] flex items-center justify-center text-white shadow-md shadow-[#B80035]/25 group-hover:scale-105 transition-transform duration-200">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#B80035]">
              Aria
            </span>
          </button>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFDADA] text-[#B80035] tracking-wider uppercase">
            Private Salon
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab("discover")}
            className={`font-semibold text-sm transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === "discover"
                ? "text-[#B80035] border-b-2 border-[#B80035]"
                : "text-[#5C3F40] hover:text-[#B80035]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Discover
          </button>

          <button
            onClick={() => setActiveTab("vibes")}
            className={`font-semibold text-sm transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === "vibes"
                ? "text-[#B80035] border-b-2 border-[#B80035]"
                : "text-[#5C3F40] hover:text-[#B80035]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Vibe Rooms
          </button>

          <button
            onClick={() => setActiveTab("radar")}
            className={`font-semibold text-sm transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === "radar"
                ? "text-[#B80035] border-b-2 border-[#B80035]"
                : "text-[#5C3F40] hover:text-[#B80035]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radar</span>
            Chemistry Radar
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`font-semibold text-sm transition-colors flex items-center gap-1.5 pb-1 relative ${
              activeTab === "messages"
                ? "text-[#B80035] border-b-2 border-[#B80035]"
                : "text-[#5C3F40] hover:text-[#B80035]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            Messages
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E11D48] absolute -top-0.5 -right-2 ring-2 ring-white"></span>
            )}
          </button>
        </nav>

        {/* Trailing Action Hub */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Likes Badge Button */}
          <button
            onClick={onOpenLikes}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#FFDADB]/60 hover:bg-[#FFDADB] text-[#B80035] text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95"
            title={`${likesCount} members liked your profile`}
          >
            <span
              className="material-symbols-outlined text-[18px] text-[#B80035]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-bold">{likesCount} Likes</span>
          </button>

          {/* Spark Lounge Quick Trigger */}
          <button
            onClick={onOpenSparkLounge}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E5BDBE]/60 hover:border-[#B80035] text-[#131B2E] text-sm font-medium transition-all duration-200 active:scale-95 bg-white/70"
          >
            <span className="material-symbols-outlined text-[18px] text-[#E11D48]">
              local_fire_department
            </span>
            <span>Spark Lounge</span>
          </button>

          {/* User Profile Pill with Emerald Active Ring */}
          <div className="flex items-center pl-2 border-l border-[#E5BDBE]/50">
            <button
              onClick={onOpenProfile}
              className="relative p-0.5 rounded-full transition-transform active:scale-95 group focus:outline-hidden"
              title="Edit Profile & Preferences"
            >
              <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-white overflow-hidden bg-[#EAEDFF]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
