export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  distance: string;
  verified: boolean;
  activeStatus: string;
  matchScore: number;
  image: string;
  photoGallery?: string[];
  intent: string;
  moodTags: string[];
  interests: string[];
  bioQuote: string;
  sundayPrompt: string;
  voiceNoteDuration: string;
  voiceNoteTopic: string;
  voiceNoteTranscript: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  intent: string;
  sundayPrompt: string;
  interests: string[];
  avatar: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface DateInvite {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  status: "pending" | "accepted" | "declined";
}

export interface Conversation {
  id: string;
  partnerId: string;
  name: string;
  avatar: string;
  occupation: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  messages: Message[];
  pendingInvite?: DateInvite;
}

export interface ChemistryDimension {
  score: number;
  insight: string;
}

export interface ChemistryAnalysis {
  compatibilityScore: number;
  chemistryHeadline: string;
  thinkingReasoning: string[];
  dimensions: {
    emotionalResonance: ChemistryDimension;
    conversationalChemistry: ChemistryDimension;
    lifestylePacing: ChemistryDimension;
    intellectualSpark: ChemistryDimension;
  };
  subtleFrictionPoints: string;
  curatedFirstDate: {
    title: string;
    neighborhood: string;
    description: string;
    whyItWorks: string;
  };
}
