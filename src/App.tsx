/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TopNavBar } from "./components/TopNavBar";
import { ChemistryModal } from "./components/ChemistryModal";
import { SpeedDateModal } from "./components/SpeedDateModal";
import { SendRoseModal } from "./components/SendRoseModal";
import { PersonaDrawer } from "./components/PersonaDrawer";
import { ConversationDrawer } from "./components/ConversationDrawer";
import { LikedMeDrawer } from "./components/LikedMeDrawer";
import { MatchCelebrationModal } from "./components/MatchCelebrationModal";
import {
  initialProfiles,
  initialConversations,
  initialCrushes,
  defaultUserPersona,
} from "./data/profiles";
import { UserProfile, CurrentUser, Conversation } from "./types";

export default function App() {
  // Navigation & View State
  const [activeNavTab, setActiveNavTab] = useState<"discover" | "vibes" | "radar" | "messages">("discover");
  const [selectedMood, setSelectedMood] = useState<string>("All");

  // Data State
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [activeProfileIndex, setActiveProfileIndex] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultUserPersona);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [crushes, setCrushes] = useState(initialCrushes);
  const [likesList, setLikesList] = useState<UserProfile[]>([
    initialProfiles[1],
    initialProfiles[2],
    initialProfiles[3],
    initialProfiles[4],
  ]);

  // Modals & Drawers
  const [isChemistryOpen, setIsChemistryOpen] = useState<boolean>(false);
  const [isSpeedDateOpen, setIsSpeedDateOpen] = useState<boolean>(false);
  const [isSendRoseOpen, setIsSendRoseOpen] = useState<boolean>(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState<boolean>(false);
  const [isLikedMeOpen, setIsLikedMeOpen] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [matchedCandidate, setMatchedCandidate] = useState<UserProfile | null>(null);
  const [isMatchCelebrationOpen, setIsMatchCelebrationOpen] = useState<boolean>(false);

  // Audio Voice Note Simulation State
  const [isPlayingVoiceNote, setIsPlayingVoiceNote] = useState<boolean>(false);
  const [showVoiceTranscript, setShowVoiceTranscript] = useState<boolean>(false);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState<number>(0);

  // User feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Right sidebar tab state: 'chats' | 'invites'
  const [sidebarTab, setSidebarTab] = useState<"chats" | "invites">("chats");

  const activeSpotlight = profiles[activeProfileIndex] || profiles[0];

  // Voice note timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingVoiceNote) {
      interval = setInterval(() => {
        setVoicePlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingVoiceNote(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      setVoicePlaybackProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingVoiceNote]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Actions
  const handlePass = () => {
    setIsPlayingVoiceNote(false);
    setShowVoiceTranscript(false);
    setActiveProfileIndex((prev) => (prev + 1) % profiles.length);
    showToast(`Passed on ${activeSpotlight.name}. Showing next salon member.`);
  };

  const handleRewind = () => {
    setIsPlayingVoiceNote(false);
    setShowVoiceTranscript(false);
    setActiveProfileIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
    showToast("Profile rewound.");
  };

  const handleSuperSpark = () => {
    showToast(`★ Sent a Super Spark to ${activeSpotlight.name}! They were notified.`);
  };

  const handleConnect = () => {
    setMatchedCandidate(activeSpotlight);
    setIsMatchCelebrationOpen(true);
  };

  const handleStartChatFromMatch = (candidate: UserProfile) => {
    // Check if conversation already exists or create new
    let existing = conversations.find((c) => c.partnerId === candidate.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        partnerId: candidate.id,
        name: candidate.name,
        avatar: candidate.image,
        occupation: candidate.occupation,
        lastMessage: "You matched! Say hello to break the ice.",
        time: "Just now",
        unread: false,
        online: true,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: "them",
            text: `Hi ${currentUser.name}! I loved reading your Sunday prompt about "${currentUser.sundayPrompt.slice(0, 32)}..."`,
            time: "Just now",
          },
        ],
      };
      setConversations([newConv, ...conversations]);
      existing = newConv;
    }
    setSelectedConversation(existing);
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: "me" as const,
            text,
            time: "Just now",
          };
          return {
            ...c,
            lastMessage: text,
            time: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Auto simulated response after 1.8 seconds for delightful responsiveness
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            const replies = [
              "I completely agree! Would love to explore that place with you.",
              "That sounds wonderful. Let's make that happen this week!",
              "Haha, that's such a great perspective. Tell me more!",
            ];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            const autoMsg = {
              id: `msg-${Date.now() + 1}`,
              sender: "them" as const,
              text: replyText,
              time: "Just now",
            };
            return {
              ...c,
              lastMessage: replyText,
              time: "Just now",
              messages: [...c.messages, autoMsg],
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const handleAcceptDateInvite = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId && c.pendingInvite) {
          return {
            ...c,
            pendingInvite: {
              ...c.pendingInvite,
              status: "accepted",
            },
          };
        }
        return c;
      })
    );
    showToast("Date invitation accepted! Added to your Salon calendar.");
  };

  const handlePlanDateFromChemistry = (candidate: UserProfile, dateTitle: string) => {
    handleStartChatFromMatch(candidate);
    showToast(`Invited ${candidate.name} to "${dateTitle}"!`);
  };

  const handleSendRoseNote = (candidateName: string, noteText: string) => {
    showToast(`🌹 Delivered private rose note to ${candidateName}: "${noteText.slice(0, 36)}..."`);
  };

  // Filter profiles based on selected mood
  const filteredProfiles = selectedMood === "All"
    ? profiles
    : profiles.filter((p) => p.moodTags.includes(selectedMood));

  const unreadMessagesCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] antialiased min-h-screen selection:bg-[#FFDADB] selection:text-[#B80035] relative">
      {/* Ambient Candleglow Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#FFDADA]/30 rounded-full blur-[140px] opacity-60"></div>
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-[#FFDADB]/40 rounded-full blur-[160px] opacity-50"></div>
        <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-[#EAEDFF]/60 rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-white/10 text-sm">
          <span className="material-symbols-outlined text-[#E11D48] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <TopNavBar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        currentUser={currentUser}
        unreadCount={unreadMessagesCount}
        likesCount={likesList.length + 20}
        onOpenLikes={() => setIsLikedMeOpen(true)}
        onOpenProfile={() => setIsPersonaOpen(true)}
        onOpenSparkLounge={() => setIsSpeedDateOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* VIEW 1: DISCOVER VIEW */}
        {activeNavTab === "discover" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT & CENTER REGION: Discover Showcase & Curated Moments (Span 8 Cols) */}
            <section className="lg:col-span-8 flex flex-col gap-8">
              {/* Atmospheric Filter Bar: Chemistry Mood Radar */}
              <div className="glass-surface rounded-full p-1.5 px-3 flex items-center justify-between overflow-x-auto no-scrollbar shadow-xs">
                <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-[#E5BDBE]/30">
                  <span className="material-symbols-outlined text-[#B80035] text-[20px]">
                    tune
                  </span>
                  <span className="text-[11px] font-bold text-[#5C3F40] uppercase tracking-wider">
                    Mood Radar
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  {["All", "Dinner & Drinks", "Art Gallery Hop", "Deep Conversations", "Sunset Walks"].map(
                    (mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          selectedMood === mood
                            ? "bg-[#B80035] text-white shadow-xs shadow-[#B80035]/20"
                            : "bg-white/80 hover:bg-[#EAEDFF] text-[#131B2E]"
                        }`}
                      >
                        {mood === "Dinner & Drinks" && <span className="material-symbols-outlined text-[16px]">wine_bar</span>}
                        {mood === "Art Gallery Hop" && <span className="material-symbols-outlined text-[16px]">palette</span>}
                        {mood === "Deep Conversations" && <span className="material-symbols-outlined text-[16px]">psychology_alt</span>}
                        {mood === "Sunset Walks" && <span className="material-symbols-outlined text-[16px]">wb_twilight</span>}
                        <span>{mood}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* MAIN DISCOVER SHOWCASE CARD: High Fashion Editorial Profile */}
              <div className="relative w-full rounded-3xl overflow-hidden glass-card-elevated group border border-[#E5BDBE]/40">
                {/* Large Portrait Canvas with Vignette */}
                <div className="relative w-full h-[580px] overflow-hidden bg-[#131B2E]">
                  <img
                    src={activeSpotlight.image}
                    alt={activeSpotlight.name}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                  />
                  {/* Vignette Gradient for typography contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-[#131B2E]/40 to-transparent opacity-95"></div>

                  {/* Top Floating Badges */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                    <div className="glass-surface px-3 py-1.5 rounded-full flex items-center gap-2 text-[#131B2E] text-xs font-semibold shadow-xs backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{activeSpotlight.activeStatus}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#B80035] text-xs font-bold flex items-center gap-1 shadow-xs border border-[#E5BDBE]/30">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Verified Member
                      </span>
                    </div>
                  </div>

                  {/* Bottom Card Content overlayed on gradient */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col gap-3 text-white">
                    {/* Compatibility Pill & Member Headline */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-xs">
                          {activeSpotlight.name}, {activeSpotlight.age}
                        </h1>
                        <span
                          className="material-symbols-outlined text-[#E11D48] text-[26px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          title="Verified Profile"
                        >
                          verified
                        </span>
                      </div>

                      {/* Gemini Chemistry Match Button */}
                      <button
                        onClick={() => setIsChemistryOpen(true)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white text-sm font-bold shadow-lg shadow-[#B80035]/30 flex items-center gap-2 border border-white/20 hover:scale-105 active:scale-95 transition-transform"
                        title="Click to view Gemini High Thinking analysis"
                      >
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span>{activeSpotlight.matchScore}% Chemistry Match</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/20 ml-1">
                          AI Breakdown
                        </span>
                      </button>
                    </div>

                    {/* Profession and Location */}
                    <p className="text-base text-white/90 font-medium">
                      {activeSpotlight.occupation} • {activeSpotlight.distance}
                    </p>

                    {/* Passion Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {activeSpotlight.interests.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Narrative Section: Voice Note & Romantic Prompt */}
                <div className="p-6 sm:p-8 bg-white flex flex-col gap-6">
                  {/* Audio Voice Note Player Capsule */}
                  <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E5BDBE]/30 flex flex-col gap-3 transition-colors hover:border-[#B80035]/40">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={() => setIsPlayingVoiceNote(!isPlayingVoiceNote)}
                          aria-label="Play Voice Note"
                          className="w-11 h-11 rounded-full bg-[#B80035] text-white flex items-center justify-center shadow-md shadow-[#B80035]/25 hover:scale-105 active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {isPlayingVoiceNote ? "pause" : "play_arrow"}
                          </span>
                        </button>
                        <div>
                          <p className="text-sm font-bold text-[#131B2E]">
                            Hear {activeSpotlight.name}'s Voice Note
                          </p>
                          <p className="text-xs text-[#5C3F40]">
                            {activeSpotlight.voiceNoteDuration} • {activeSpotlight.voiceNoteTopic}
                          </p>
                        </div>
                      </div>

                      {/* Animated Soundwave Frequency Bars */}
                      <div className="hidden sm:flex items-center gap-1 h-6">
                        {[6, 12, 20, 14, 24, 10, 18, 8].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full bg-[#B80035] transition-all duration-300 ${
                              isPlayingVoiceNote ? "animate-pulse" : "opacity-40"
                            }`}
                            style={{
                              height: isPlayingVoiceNote ? `${h}px` : "6px",
                              animationDelay: `${i * 120}ms`,
                            }}
                          ></span>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowVoiceTranscript(!showVoiceTranscript)}
                        className="text-xs text-[#B80035] hover:underline font-semibold"
                      >
                        {showVoiceTranscript ? "Hide Transcript" : "Read Transcript"}
                      </button>
                    </div>

                    {/* Spoken Voice Transcript */}
                    {showVoiceTranscript && (
                      <div className="p-3 rounded-xl bg-white border border-[#E5BDBE]/30 text-xs text-[#5C3F40] italic font-serif leading-relaxed">
                        "{activeSpotlight.voiceNoteTranscript}"
                      </div>
                    )}

                    {/* Progress Bar when playing */}
                    {isPlayingVoiceNote && (
                      <div className="w-full h-1 bg-[#E5BDBE]/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#B80035] transition-all duration-500"
                          style={{ width: `${voicePlaybackProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Editorial Romantic Prompt Card */}
                  <div className="p-5 rounded-2xl bg-[#FFDADB]/20 border-l-4 border-[#B80035] flex flex-col gap-2">
                    <span className="font-serif text-lg italic text-[#B80035]">
                      "My ideal Sunday..."
                    </span>
                    <p className="text-base text-[#131B2E] leading-relaxed">
                      {activeSpotlight.sundayPrompt}
                    </p>
                  </div>

                  {/* FLOATING ROMANTIC DECISION DOCK (Action Controls) */}
                  <div className="pt-2 flex items-center justify-center gap-3 sm:gap-5 pb-2">
                    {/* Rewind Action */}
                    <button
                      onClick={handleRewind}
                      className="w-12 h-12 rounded-full glass-surface flex items-center justify-center text-[#5C3F40] hover:text-[#131B2E] hover:shadow-md transition-all active:scale-95 border border-[#E5BDBE]/40"
                      title="Rewind Profile"
                    >
                      <span className="material-symbols-outlined text-[22px]">replay</span>
                    </button>

                    {/* Pass Action (✕) */}
                    <button
                      onClick={handlePass}
                      className="w-14 h-14 rounded-full bg-white border border-[#E5BDBE]/50 text-[#906F70] hover:text-[#BA1A1A] hover:border-[#BA1A1A]/50 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center group"
                      title="Pass"
                    >
                      <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">
                        close
                      </span>
                    </button>

                    {/* Super Spark (Glowing Star) */}
                    <button
                      onClick={handleSuperSpark}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 shadow-md shadow-amber-400/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      title="Super Spark"
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    </button>

                    {/* Hero Action: Connect / Match (Vibrant Ruby Glow) */}
                    <button
                      onClick={handleConnect}
                      className="h-14 px-8 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white text-base crimson-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-bold shadow-xl shadow-[#B80035]/30"
                      title={`Connect with ${activeSpotlight.name}`}
                    >
                      <span
                        className="material-symbols-outlined text-[26px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                      <span>Connect</span>
                    </button>

                    {/* Send Rose Note Action */}
                    <button
                      onClick={() => setIsSendRoseOpen(true)}
                      className="w-12 h-12 rounded-full glass-surface flex items-center justify-center text-[#B80035] hover:bg-[#FFDADB]/50 hover:shadow-md transition-all active:scale-95 border border-[#B80035]/20"
                      title="Send Rose Note"
                    >
                      <span className="material-symbols-outlined text-[22px]">redeem</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECONDARY SECTION: 'Curated For Tonight' Mini Match Grid */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#B80035] text-[24px]">
                      nightlife
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#131B2E]">
                      Curated For Tonight
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveNavTab("radar")}
                    className="text-xs sm:text-sm font-semibold text-[#B80035] hover:underline flex items-center gap-1"
                  >
                    View All Radar Matches
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </button>
                </div>

                {/* 3 Mini Discovery Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {profiles.slice(1, 4).map((member, idx) => (
                    <div
                      key={member.id}
                      onClick={() => {
                        setActiveProfileIndex(idx + 1);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="glass-surface rounded-2xl overflow-hidden border border-[#E5BDBE]/30 hover:shadow-md transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-[#D2D9F4]">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E]/80 via-transparent to-transparent"></div>
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-md text-[#131B2E] text-[11px] font-medium">
                          {member.distance}
                        </span>
                        <button
                          aria-label={`Like ${member.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMatchedCandidate(member);
                            setIsMatchCelebrationOpen(true);
                          }}
                          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 text-[#B80035] hover:bg-[#B80035] hover:text-white flex items-center justify-center shadow-md transition-colors"
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            favorite
                          </span>
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 text-white">
                          <p className="font-serif text-base font-bold leading-tight">
                            {member.name}, {member.age}
                          </p>
                          <p className="text-xs text-white/80">{member.occupation}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white flex flex-col justify-between flex-1 gap-2">
                        <span className="inline-block px-2 py-1 rounded-md bg-[#FFDADB]/40 text-[#B80035] text-[11px] font-bold">
                          {member.intent}
                        </span>
                        <p className="text-xs text-[#5C3F40] line-clamp-2 italic font-serif">
                          "{member.bioQuote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT REGION / SPARK LOUNGE & CHATS (Span 4 Cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
              {/* Spark Lounge Panel */}
              <div className="glass-surface rounded-3xl p-5 border border-[#E5BDBE]/40 shadow-xs flex flex-col gap-5">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5BDBE]/30">
                  <div>
                    <h3 className="font-serif text-xl text-[#B80035] font-bold flex items-center gap-1.5">
                      <span>Spark Lounge & Chats</span>
                      <span className="material-symbols-outlined text-[20px] text-[#DC2C4F]">
                        local_fire_department
                      </span>
                    </h3>
                    <p className="text-xs text-[#5C3F40]">12 members vibrant now</p>
                  </div>
                  <button
                    onClick={() => setIsPersonaOpen(true)}
                    className="p-1.5 rounded-full hover:bg-[#EAEDFF] text-[#5C3F40] transition-colors"
                    title="Profile & Preferences"
                  >
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </button>
                </div>

                {/* Mutual Crushes Live Stories Tray */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5C3F40] uppercase tracking-wider">
                      Mutual Crushes
                    </span>
                    <span className="text-[11px] text-[#B80035] font-semibold">
                      {crushes.length} Sparks
                    </span>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                    {crushes.map((crush) => (
                      <div
                        key={crush.id}
                        onClick={() => {
                          const cand = profiles.find((p) => p.name.includes(crush.name)) || profiles[0];
                          handleStartChatFromMatch(cand);
                        }}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-full p-0.5 ring-2 ring-[#B80035] ring-offset-2 ring-offset-white transition-transform group-hover:scale-105 overflow-hidden">
                          <img
                            src={crush.avatar}
                            alt={crush.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <span className="text-xs text-[#131B2E] font-medium">
                          {crush.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incoming Audio Speed Date Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#B90538] text-white shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined text-[20px]">mic</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">Audio Speed Date</p>
                      <p className="text-xs text-white/80">3-min anonymous blind chat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSpeedDateOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#B80035] text-xs font-bold hover:bg-[#FAF8FF] active:scale-95 transition-transform shadow-xs"
                  >
                    Join
                  </button>
                </div>

                {/* Navigation Sub-Tabs */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAEDFF]/60 rounded-xl">
                  <button
                    onClick={() => setSidebarTab("chats")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      sidebarTab === "chats"
                        ? "bg-white text-[#B80035] shadow-xs font-bold"
                        : "text-[#5C3F40] hover:text-[#B80035]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chat_bubble
                    </span>
                    Chats
                  </button>

                  <button
                    onClick={() => setSidebarTab("invites")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      sidebarTab === "invites"
                        ? "bg-white text-[#B80035] shadow-xs font-bold"
                        : "text-[#5C3F40] hover:text-[#B80035]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      event_available
                    </span>
                    Date Invites
                  </button>
                </div>

                {/* Active Conversations / Date Invites List */}
                <div className="flex flex-col gap-2.5">
                  {sidebarTab === "chats" ? (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 rounded-2xl transition-all flex items-center gap-3.5 group cursor-pointer border ${
                          conv.unread
                            ? "bg-[#FAF8FF] border-[#E5BDBE]/60 shadow-xs"
                            : "hover:bg-[#FAF8FF] border-transparent"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={conv.avatar}
                              alt={conv.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="font-serif font-bold text-sm text-[#131B2E] truncate group-hover:text-[#B80035] transition-colors">
                              {conv.name}
                            </h4>
                            <span className="text-[11px] text-[#B80035] font-semibold">
                              {conv.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C3F40] truncate">
                            {conv.lastMessage}
                          </p>
                        </div>

                        {conv.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B80035] shrink-0"></span>
                        )}
                      </div>
                    ))
                  ) : (
                    // Date Invites tab
                    conversations
                      .filter((c) => c.pendingInvite)
                      .map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#FDA4AF]/60 flex flex-col gap-2 cursor-pointer hover:shadow-xs transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full overflow-hidden">
                                <img
                                  src={conv.avatar}
                                  alt={conv.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-serif font-bold text-xs text-[#131B2E]">
                                {conv.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-[#B80035] px-2 py-0.5 rounded-full bg-[#FFDADB]">
                              {conv.pendingInvite?.status === "accepted" ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#131B2E]">
                            {conv.pendingInvite?.title}
                          </p>
                          <p className="text-[11px] text-[#5C3F40]">
                            {conv.pendingInvite?.location} • {conv.pendingInvite?.dateTime}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                {/* Start Instant Note CTA */}
                <button
                  onClick={() => setIsSendRoseOpen(true)}
                  className="w-full py-3 rounded-full bg-[#FFDADB]/50 hover:bg-[#FFDADB] text-[#B80035] text-sm font-bold transition-all active:scale-98 flex items-center justify-center gap-2 border border-[#B80035]/20"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  <span>Start Instant Note</span>
                </button>
              </div>

              {/* Safety & Editorial Guarantee Badge */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5BDBE]/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#B80035] text-[24px]">
                  shield
                </span>
                <div>
                  <p className="text-xs font-bold text-[#131B2E]">Curated & Verified Only</p>
                  <p className="text-[11px] text-[#5C3F40]">
                    Every profile is manually reviewed for intentional, aesthetic dating.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* VIEW 2: VIBE ROOMS */}
        {activeNavTab === "vibes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#131B2E]">
                  Aria Private Vibe Rooms
                </h2>
                <p className="text-sm text-[#5C3F40] mt-1">
                  Intimate ambient digital lounges where members discuss shared obsessions in real time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Acoustic Vinyl & Bossa Nova",
                  host: "Elena & Lucas",
                  activeCount: 8,
                  prompt: "Spinning Stan Getz and comparing 1960s pressing acoustics.",
                  tag: "Audio Salon",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqYdHXSPlDe-FlgOnMY5dhkfTTodREnwrh_f0xW8sHrbM4-7UpHidFW_WymwICmqcpkSVHP_lRLAXsZ5hG69vUu-XtZFC9rjKaDsYlRMm8GrR_3OlD8g3lo_nVbSzuaDl3A3KN2BcV0Q1WCEU7YIbfgkgpVq2yGV0TZfybZceBeP9XY71lT9CH-rWaP5IlGuC0F0xZlv-iCzkO__T012G9e54Aa340-qiVN8oUv4IDFLvI7WN9yojPig",
                },
                {
                  title: "Natural Wine & Biodynamics",
                  host: "Camille & Leo",
                  activeCount: 14,
                  prompt: "Discussing skin-contact whites from Etna and Jura producers.",
                  tag: "Tasting Parlour",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqgtcOXVUjUDOe0ry29z9Iw9XrUh9pcl5t_Ck1FS8vXi-eBRmD45zKinH1mbZTVwsvxgz-2zu_HmxEHzdO2ofGgvjgkAhZS90EvBjP7zl7EzteGaxjj3mNW73HVA38FOiL8JhbMi4vzZVLLJkmbZj1bh3GdoaDmfHG3WD7AR2ouK-aU4roj_9-c0lRkxHSDQJ_EwNddQDJItzl5KJBLZUWB16susxT9UDDWtD4Dln5NNWL9ydgj80QPQ",
                },
                {
                  title: "Mid-Century Light & Architecture",
                  host: "Maya & Julian",
                  activeCount: 11,
                  prompt: "Exploring daylight studies and brutalist warmth in Paris and Kyoto.",
                  tag: "Design Forum",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxxNquzNbssPf4KMIAvbnNK7UWQKnol8legQBVnjkASTpUYJe_Ua6lG6Q9tw5CtJdkmc3k81CzsFwd6f0u7eUZzJwAHiUhKASce2fXEmbC24VBsyDKcSGj-iUVMEOdpnRcfmLmO24N01deaJimXEj94s92yXHntcetIOxDw1JIQaPei9K6jvGBOsW5enX7SL9ZeXl_Ez5OY2DWp7MCaMSfkG6jNP3kYzz7szafsLOXQ1TRbwVndfxIEg",
                },
              ].map((room, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden glass-card-elevated border border-[#E5BDBE]/40 flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-[#131B2E]/30 to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#131B2E] text-[11px] font-bold">
                      {room.tag}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {room.activeCount} in room
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif text-lg font-bold">{room.title}</h3>
                      <p className="text-xs text-white/80">Hosted by {room.host}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-white flex flex-col justify-between flex-1 gap-4">
                    <p className="text-xs text-[#5C3F40] leading-relaxed">
                      "{room.prompt}"
                    </p>
                    <button
                      onClick={() => {
                        setIsSpeedDateOpen(true);
                      }}
                      className="w-full py-2.5 rounded-full bg-[#B80035] hover:bg-[#920028] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        login
                      </span>
                      <span>Enter Audio Lounge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: CHEMISTRY RADAR */}
        {activeNavTab === "radar" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#131B2E]">
                  Aria Chemistry Radar
                </h2>
                <p className="text-sm text-[#5C3F40] mt-1">
                  Dynamic psychological mapping computed against your profile values and conversational rhythm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((cand) => (
                <div
                  key={cand.id}
                  className="rounded-3xl glass-card-elevated p-6 border border-[#E5BDBE]/40 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#EAEDFF]">
                      <img
                        src={cand.image}
                        alt={cand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif text-lg font-bold text-[#131B2E]">
                          {cand.name}, {cand.age}
                        </h3>
                        <span
                          className="material-symbols-outlined text-[#E11D48] text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      </div>
                      <p className="text-xs text-[#5C3F40]">{cand.occupation}</p>
                      <p className="text-[11px] text-[#B80035] font-semibold mt-0.5">
                        {cand.distance}
                      </p>
                    </div>
                  </div>

                  {/* Compatibility Bars */}
                  <div className="space-y-2 py-2 border-y border-[#E5BDBE]/30">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#5C3F40]">Intellectual Synergy</span>
                      <span className="font-bold text-[#B80035]">{cand.matchScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAEDFF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B80035] to-[#E11D48]"
                        style={{ width: `${cand.matchScore}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-[#5C3F40]">Weekend Rhythm Alignment</span>
                      <span className="font-bold text-[#B80035]">
                        {Math.max(85, cand.matchScore - 4)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAEDFF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B80035] to-[#E11D48]"
                        style={{ width: `${Math.max(85, cand.matchScore - 4)}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5C3F40] italic font-serif">
                    "{cand.sundayPrompt.slice(0, 75)}..."
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveProfileIndex(profiles.findIndex((p) => p.id === cand.id));
                        setIsChemistryOpen(true);
                      }}
                      className="flex-1 py-2 rounded-full bg-[#FFDADB]/50 hover:bg-[#FFDADB] text-[#B80035] text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        psychology
                      </span>
                      <span>Deep AI Analysis</span>
                    </button>

                    <button
                      onClick={() => {
                        setMatchedCandidate(cand);
                        setIsMatchCelebrationOpen(true);
                      }}
                      className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B80035] to-[#E11D48] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
                      title="Connect"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: MESSAGES DEDICATED VIEW */}
        {activeNavTab === "messages" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#131B2E]">
              Private Salon Messages
            </h2>

            <div className="rounded-3xl glass-card-elevated border border-[#E5BDBE]/40 overflow-hidden divide-y divide-[#E5BDBE]/30 bg-white">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className="p-5 hover:bg-[#FAF8FF] transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#131B2E]">
                          {conv.name}
                        </h3>
                        <span className="text-xs text-[#5C3F40]">
                          • {conv.occupation}
                        </span>
                      </div>
                      <p className="text-sm text-[#5C3F40] mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#B80035] font-semibold block mb-1">
                      {conv.time}
                    </span>
                    {conv.pendingInvite && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFDADB] text-[#B80035] text-[10px] font-bold">
                        Date Planned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS & DRAWERS */}

      {/* 1. Deep AI Chemistry Breakdown (Gemini High Thinking) */}
      <ChemistryModal
        candidate={activeSpotlight}
        currentUser={currentUser}
        isOpen={isChemistryOpen}
        onClose={() => setIsChemistryOpen(false)}
        onPlanDate={handlePlanDateFromChemistry}
      />

      {/* 2. Blind Audio Speed Date Simulator */}
      <SpeedDateModal
        isOpen={isSpeedDateOpen}
        onClose={() => setIsSpeedDateOpen(false)}
        onMutualSpark={(name) => {
          const cand = profiles.find((p) => p.name.includes(name)) || profiles[0];
          setMatchedCandidate(cand);
          setIsMatchCelebrationOpen(true);
        }}
      />

      {/* 3. Send Rose Note Modal */}
      <SendRoseModal
        candidate={activeSpotlight}
        isOpen={isSendRoseOpen}
        onClose={() => setIsSendRoseOpen(false)}
        onSent={handleSendRoseNote}
      />

      {/* 4. Persona Switcher & Preferences Drawer */}
      <PersonaDrawer
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast("Profile preferences updated. Re-ranking salon matches.");
        }}
      />

      {/* 5. Direct Message Conversation Drawer */}
      <ConversationDrawer
        conversation={selectedConversation}
        isOpen={!!selectedConversation}
        onClose={() => setSelectedConversation(null)}
        onSendMessage={handleSendMessage}
        onAcceptDate={handleAcceptDateInvite}
      />

      {/* 6. Liked Me Drawer */}
      <LikedMeDrawer
        isOpen={isLikedMeOpen}
        onClose={() => setIsLikedMeOpen(false)}
        likesList={likesList}
        onSelectCandidate={(candidate) => {
          const idx = profiles.findIndex((p) => p.id === candidate.id);
          if (idx !== -1) setActiveProfileIndex(idx);
          window.scrollTo({ top: 120, behavior: "smooth" });
        }}
        onMatchBack={(candidate) => {
          setMatchedCandidate(candidate);
          setIsMatchCelebrationOpen(true);
        }}
      />

      {/* 7. Mutual Chemistry Match Celebration */}
      <MatchCelebrationModal
        candidate={matchedCandidate}
        currentUser={currentUser}
        isOpen={isMatchCelebrationOpen}
        onClose={() => setIsMatchCelebrationOpen(false)}
        onStartChat={handleStartChatFromMatch}
      />
    </div>
  );
}
