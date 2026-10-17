import React, { useState } from "react";
import { CurrentUser } from "../types";

interface PersonaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUpdateUser: (updated: CurrentUser) => void;
}

export const PersonaDrawer: React.FC<PersonaDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [occupation, setOccupation] = useState(currentUser.occupation);
  const [location, setLocation] = useState(currentUser.location);
  const [intent, setIntent] = useState(currentUser.intent);
  const [sundayPrompt, setSundayPrompt] = useState(currentUser.sundayPrompt);
  const [interestsText, setInterestsText] = useState(currentUser.interests.join(", "));

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedInterests = interestsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    onUpdateUser({
      ...currentUser,
      name,
      occupation,
      location,
      intent,
      sundayPrompt,
      interests: updatedInterests.length > 0 ? updatedInterests : currentUser.interests,
    });
    onClose();
  };

  const presetPersonas: Array<Partial<CurrentUser>> = [
    {
      name: "Liam Sterling",
      age: 27,
      occupation: "Architectural Photographer",
      location: "Soho, NY",
      intent: "Looking for long-term love & mutual inspiration",
      sundayPrompt:
        "Espresso and vintage record shops followed by natural wine and intimate cooking with someone who notices the little details.",
      interests: ["Architecture", "Film Noir", "Acoustic Jazz", "Natural Wine"],
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYLVuJdLHHUmbpX9Kfk3lVdsk9cbarcy9vjmWT036MqU_DyGg6yc8f-CG18QKelVfz7OuxT8wYnzyO2J95_F-Kp_1GNB1HyH00DeYNG5IyOo6rLgq67dnLIiJCklgEqhJ1S92_YGSRwaddYW5Fb1mzFHREEe1Dc9qAQCu5Q2r-oD25vHOp4g3VF7CdR9gKbOqbV4Vu10N6FIulbs7dqpc7V_Sx-EZKuuTPHdpHLzfnMh0clFA5sE89MQ",
    },
    {
      name: "Julian Rivera",
      age: 28,
      occupation: "Documentary Filmmaker",
      location: "DUMBO, NY",
      intent: "Spontaneous adventures & artistic collaboration",
      sundayPrompt:
        "Developing rolls of Tri-X film by red safelight, long bicycle rides across the Brooklyn Bridge, and street ramen.",
      interests: ["35mm Film", "Documentaries", "Jazz", "Darkrooms"],
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7sqkjTGmHqWuCZ9LvuO_UO5lLuNbn1sD7Vlp8MLwKUMdqQmmnqnMrJooFsFtBLNnvXh0f1jQiUR2DuzNfdhF6AFSfnqzHpedoaxxEXsRwt2WhHjh0U5cjnYajn6RSGzQcmjNeE5RV6yxUk1xEVbVJJHKuZBDYkeeCcFYmZ8o_0WbDhxbmUVd9y684A693NP017ZbGfVfu0nfNiE0aLqwuS7gCMMtQyrzGdDEl5jF070rUacnqDKhbRA",
    },
    {
      name: "Maya Brooks",
      age: 27,
      occupation: "Ceramist & Author",
      location: "Greenwich Village",
      intent: "Deep Conversations & slow romance",
      sundayPrompt:
        "Throwing terracotta clay at the studio with ambient piano on loop, picking up fresh figs at the market.",
      interests: ["Ceramics", "Joan Didion", "Espresso", "Japanese Pottery"],
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCxxNquzNbssPf4KMIAvbnNK7UWQKnol8legQBVnjkASTpUYJe_Ua6lG6Q9tw5CtJdkmc3k81CzsFwd6f0u7eUZzJwAHiUhKASce2fXEmbC24VBsyDKcSGj-iUVMEOdpnRcfmLmO24N01deaJimXEj94s92yXHntcetIOxDw1JIQaPei9K6jvGBOsW5enX7SL9ZeXl_Ez5OY2DWp7MCaMSfkG6jNP3kYzz7szafsLOXQ1TRbwVndfxIEg",
    },
  ];

  const handleApplyPreset = (preset: Partial<CurrentUser>) => {
    if (preset.name) setName(preset.name);
    if (preset.occupation) setOccupation(preset.occupation);
    if (preset.location) setLocation(preset.location);
    if (preset.intent) setIntent(preset.intent);
    if (preset.sundayPrompt) setSundayPrompt(preset.sundayPrompt);
    if (preset.interests) setInterestsText(preset.interests.join(", "));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5BDBE]/60 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FFF1F2] to-[#FFDADA] border-b border-[#FDA4AF]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-500">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#B80035] uppercase tracking-wider">
                My Profile & Preferences
              </span>
              <h3 className="font-serif text-xl font-bold text-[#131B2E]">
                {currentUser.name}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Quick Persona Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-2">
              Switch Persona Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetPersonas.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2 rounded-xl border border-[#E5BDBE]/60 hover:border-[#B80035] bg-[#FAF8FF] text-left transition-all"
                >
                  <p className="text-xs font-bold text-[#131B2E] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#5C3F40] truncate">{p.occupation}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              Profession & Identity
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              Neighborhood / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              Dating Intent
            </label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035]"
            >
              <option value="Looking for long-term love & mutual inspiration">
                Looking for long-term love & mutual inspiration
              </option>
              <option value="Spontaneous adventures & artistic collaboration">
                Spontaneous adventures & artistic collaboration
              </option>
              <option value="Deep Conversations & slow romance">
                Deep Conversations & slow romance
              </option>
              <option value="Intimate salon companionship">
                Intimate salon companionship
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              "My Ideal Sunday..."
            </label>
            <textarea
              value={sundayPrompt}
              onChange={(e) => setSundayPrompt(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035] resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C3F40] uppercase tracking-wider mb-1.5">
              Interests & Passions (comma separated)
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E5BDBE]/60 text-sm text-[#131B2E] focus:outline-hidden focus:border-[#B80035]"
              placeholder="e.g. Architecture, Film Noir, Natural Wine"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#B80035] to-[#E11D48] text-white text-sm font-bold shadow-md shadow-[#B80035]/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Update Profile & Recalculate Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
