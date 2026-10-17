import React, { useEffect, useState } from "react";

interface SpeedDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMutualSpark: (partnerName: string) => void;
}

export const SpeedDateModal: React.FC<SpeedDateModalProps> = ({
  isOpen,
  onClose,
  onMutualSpark,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(180);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    "What is something you loved intensely as a child that still influences who you are today?"
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(true);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(180);
      setSessionCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Dynamic speaking wave simulation
    const speechInterval = setInterval(() => {
      setIsSpeaking((s) => !s);
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(speechInterval);
    };
  }, [isOpen]);

  const fetchNextPrompt = async () => {
    try {
      const res = await fetch("/api/speed-date/prompt", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCurrentPrompt(data.prompt);
      }
    } catch {
      const fallbacks = [
        "What is the most romantic meal you've ever had?",
        "If you could wake up anywhere tomorrow morning with zero obligations, where are we?",
        "What book or record reshaped how you look at the world?",
      ];
      setCurrentPrompt(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0F172A] text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-sm tracking-wide uppercase text-white/80">
              Live Blind Speed Date
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Center Canvas */}
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          {/* Mystery Partner Silhouette with Aura */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#B80035] to-[#E11D48] flex items-center justify-center shadow-2xl shadow-[#E11D48]/50 ring-4 ring-white/10">
              <span className="material-symbols-outlined text-white text-[48px]">
                graphic_eq
              </span>
            </div>
            {isSpeaking && (
              <span className="absolute -inset-2 rounded-full border-2 border-[#E11D48] animate-ping opacity-40"></span>
            )}
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold">
              {sessionCompleted ? "Time is Up!" : "Anonymous Member #419"}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              {sessionCompleted
                ? "Would you like to reveal identities and spark a connection?"
                : "Live in West Village • Both matched on 'Deep Conversations' & 'Art'"}
            </p>
          </div>

          {/* Countdown Clock */}
          {!sessionCompleted && (
            <div className="px-5 py-2 rounded-full bg-white/10 border border-white/15 text-2xl font-mono font-bold tracking-wider text-[#FFB2B7]">
              {timeFormatted}
            </div>
          )}

          {/* Soundwave Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            {[4, 8, 14, 22, 16, 28, 12, 20, 26, 18, 10, 24, 15, 6].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-gradient-to-t from-[#B80035] to-[#FFB2B7] rounded-full transition-all duration-300"
                style={{
                  height: isSpeaking ? `${h}px` : "4px",
                  animation: isSpeaking ? `pulse 1s infinite alternate ${i * 70}ms` : "none",
                }}
              ></span>
            ))}
          </div>

          {/* Icebreaker Prompt Box */}
          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left relative group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#FFB2B7] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Current Icebreaker
              </span>
              <button
                onClick={fetchNextPrompt}
                className="text-xs text-white/70 hover:text-white flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                New topic
              </button>
            </div>
            <p className="text-sm text-white/90 font-serif italic leading-relaxed">
              "{currentPrompt}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-around gap-4">
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMicMuted ? "bg-red-500/30 text-red-400" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMicMuted ? "mic_off" : "mic"}
            </span>
          </button>

          <button
            onClick={() => {
              onMutualSpark("Elena Vance");
              onClose();
            }}
            className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white font-bold text-sm shadow-lg shadow-[#E11D48]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span>Spark Match & Reveal</span>
          </button>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all"
            title="Leave Speed Date"
          >
            <span className="material-symbols-outlined text-[22px]">call_end</span>
          </button>
        </div>
      </div>
    </div>
  );
};
