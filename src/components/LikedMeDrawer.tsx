import React from "react";
import { UserProfile } from "../types";

interface LikedMeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  likesList: UserProfile[];
  onSelectCandidate: (candidate: UserProfile) => void;
  onMatchBack: (candidate: UserProfile) => void;
}

export const LikedMeDrawer: React.FC<LikedMeDrawerProps> = ({
  isOpen,
  onClose,
  likesList,
  onSelectCandidate,
  onMatchBack,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5BDBE]/60 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FFF1F2] to-[#FFDADA] border-b border-[#FDA4AF]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-md shadow-[#E11D48]/25">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#B80035] uppercase tracking-wider">
                Private Admirers
              </span>
              <h3 className="font-serif text-xl font-bold text-[#131B2E]">
                {likesList.length} Members Liked You
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

        {/* List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <p className="text-xs text-[#5C3F40]">
            These members sent you an intentional spark. Match back to begin an
            instant private conversation.
          </p>

          <div className="space-y-3">
            {likesList.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E5BDBE]/40 hover:border-[#B80035]/40 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onSelectCandidate(member);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className="w-13 h-13 rounded-xl overflow-hidden shrink-0 bg-[#EAEDFF]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-[#131B2E] text-sm truncate">
                        {member.name}, {member.age}
                      </h4>
                      <span
                        className="material-symbols-outlined text-[#E11D48] text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <p className="text-xs text-[#5C3F40] truncate">
                      {member.occupation}
                    </p>
                    <p className="text-[11px] text-[#B80035] font-semibold mt-0.5">
                      {member.matchScore}% Chemistry Match
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onMatchBack(member);
                      onClose();
                    }}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B80035] to-[#E11D48] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                    title={`Match with ${member.name}`}
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
      </div>
    </div>
  );
};
