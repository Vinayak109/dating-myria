# Aria — High-End Romantic Discovery & Personalized Matching

Aria is an editorial, high-fashion dating experience designed around intentional, high-chemistry romantic discovery. Departing from superficial swipe interfaces, Aria pairs an intimate editorial salon aesthetic with a deep AI Chemistry Engine powered by Gemini high thinking, voice note previews, interactive vibe radar filtering, and personalized profile customization.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your preferences in Phase 1:
> - **Compatibility Engine**: Powered by **Deep AI Chemistry Analysis with Gemini High Thinking** (`gemini-4-argon`, `thinkingLevel: ThinkingLevel.HIGH`), delivering thorough psychological breakdowns, conversational chemistry forecasts, and tailored first-date concepts.
> - **Primary Interactive Experience**: **Focused editorial discovery feed with detailed romantic profiles**, immersive voice notes, lifestyle prompt cards, and a glassmorphic decision dock.
> - **Persona & Customization**: **Interactive profile switcher and personalized preferences editor**, enabling users to customize their dating intents, lifestyle prompts, and active persona to experience personalized dynamic matching.

---

## 1. Overview & Core Concept

- **What It Does**: Aria reimagines modern romance as a curated private salon. Members explore rich editorial profiles with high-resolution portraits, authentic voice notes, romantic prompt cards, and deep chemistry compatibility breakdowns. Members can filter by real-time romantic mood, initiate spontaneous blind audio speed dates, send roses with notes, and engage in meaningful conversations with planned date invitations.
- **Target Audience / Persona**: Cultured singles, creatives, architects, writers, and professionals seeking intentional romance, aesthetic elegance, and genuine intellectual & emotional connection over gamified swipe loops.
- **Key Value**: Replaces arbitrary swipe numbers with qualitative, deep AI reasoning that uncovers shared values, lifestyle rhythms, and authentic chemistry sparks.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Editorial Discover Feed**: Browse featured spotlight members (e.g. Elena Vance, Soho architect & vinyl collector) with multi-photo gallery, animated voice note player, lifestyle prompts ("My ideal Sunday..."), and dynamic chemistry match scores.
2. **Deep AI Chemistry Breakdown**: Click the "96% Chemistry Match" chip to trigger a deep AI analysis modal powered by `gemini-4-argon` with `ThinkingLevel.HIGH`, revealing emotional wavelength alignment, communication style harmony, subtle friction points, and an AI-curated first date itinerary.
3. **Interactive Decision Dock**: Pass, Rewind, Super Spark with golden stardust, Send Rose with custom romantic note, or Connect to trigger an immediate mutual spark celebration modal with instant chat initiation.
4. **Mood Radar & Curated For Tonight**: Filter discovery by romantic ambiance ("Dinner & Drinks", "Art Gallery Hop", "Deep Conversations", "Sunset Walks") to see tailored neighborhood matches.
5. **Spark Lounge & Audio Speed Date**: Join simulated 3-minute blind audio dates with interactive topic prompts, or open active message threads (Clara, Leo, Annika) with interactive date invites and instant replies.
6. **Persona Switcher & Profile Drawer**: Switch active user profiles (e.g. Julian, Liam, custom profile) or edit dating intentions, Sunday rituals, and interests to dynamically recalculate compatibility across the network.

### Visual Identity & Theme
- **Aesthetic Direction**: *Editorial Chic & Romantic Glassmorphism*. High-contrast fashion publication layouts, candlelight glow gradients, frosted glass cards, and crisp hairline borders.
- **Color Palette**:
  - Dominant Canvas (60%): `#FAF8FF` / `#FFFFFF` pure white and soft rose water washes.
  - Structural Surfaces (30%): Frosted glass cards (`rgba(255,255,255,0.85)`), `#0F172A` midnight obsidian dark accents, and soft blush dividers.
  - Vibrant Accent (10%): `#E11D48` (Ruby Rose) and `#F43F5E` (Vibrant Crimson) for high-intent actions, heart glows, and verified markers.
- **Typography & Hierarchy**:
  - Display & Headings: `Playfair Display` serif for romantic editorial titles, member names, and poetic prompt callouts.
  - Functional & Body Text: `Plus Jakarta Sans` for clean, swift legibility across metrics, chats, tags, and demographic data.
  - Tabular Numerals: Tabular figures for match percentages, distances, and speed date timers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini Thinking Engine (`gemini-4-argon` with `ThinkingLevel.HIGH`)**
  - *Chosen Approach*: Implement an Express backend proxy route `/api/chemistry/analyze` calling `@google/genai` with `model: "gemini-4-argon"` and `thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }` to produce rich structured compatibility reasoning.
  - *Why*: Provides genuine, nuanced psychological matching explanations rather than static canned strings, fulfilling the high-thinking mandate.
  - *Alternatives Considered*: Client-side Gemini SDK calls (violates security and architecture guidelines) or simple static percentages (fails personalized matching).

- **Decision 2: Rich Curated Roster with Dynamic State Persistence**
  - *Chosen Approach*: Maintain a rich multi-profile database with realistic backgrounds, verified badges, locations, audio transcripts, and prompt quotes, stored with reactive React state + localStorage persistence.
  - *Why*: Delivers an immediate, vibrant application experience with zero broken assets or empty states.

- **Decision 3: Voice Note Player with Interactive Waveform Simulation**
  - *Chosen Approach*: Deliver interactive voice note capsules with play/pause state, animated CSS audio wave pulses, and realistic spoken transcripts.
  - *Why*: Adds high-fidelity intimacy and multisensory presence aligned with premium modern dating platforms.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Aria Dating Web Client               │
│                                                        │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │ TopNavBar        │  │ Mood Radar (Filter Pills)   │ │
│  │ Brand · Nav · Hub│  │ Dinner · Gallery · Walks    │ │
│  └────────┬─────────┘  └──────────────┬──────────────┘ │
│           │                           │                │
│  ┌────────▼───────────────────────────▼──────────────┐ │
│  │ Main Content Grid (12-Col Desktop Shell)          │ │
│  │                                                   │ │
│  │ ┌───────────────────────────┐ ┌─────────────────┐ │ │
│  │ │ Discover Showcase Card    │ │ Spark Lounge &  │ │ │
│  │ │ - High Fashion Photo      │ │ Chats Column    │ │ │
│  │ │ - Voice Note Audio Player │ │ - Crushes Tray  │ │ │
│  │ │ - Romantic Prompt Card    │ │ - Audio Date CTA│ │ │
│  │ │ - Floating Decision Dock  │ │ - Active Chats  │ │ │
│  └─────────────┬─────────────┘ └────────┬────────┘ │ │
│               │                        │          │ │
│  ┌─────────────▼─────────────┐          │          │ │
│  │ Curated For Tonight Grid  │          │          │ │
│  └───────────────────────────┘          │          │ │
│  └───────────────────────┬────────────────┘          │ │
│                          │                           │ │
│  ┌───────────────────────▼─────────────────────────┐ │ │
│  │ Interactive Modals & Drawers                    │ │ │
│  │ - Deep AI Chemistry Breakdown (Gemini Thinking) │ │ │
│  │ - Audio Speed Date Simulator                    │ │ │
│  │ - Send Rose Note Modal                          │ │ │
│  │ - Persona Switcher & Preference Editor          │ │ │
│  └───────────────────────┬─────────────────────────┘ │ │
└──────────────────────────┼─────────────────────────────┘
                           │ POST /api/chemistry/analyze
┌──────────────────────────▼─────────────────────────────┐
│ Express Server Proxy (server.ts)                       │
│ - @google/genai SDK Client with User-Agent header      │
│ - Calls gemini-4-argon with ThinkingLevel.HIGH         │
│ - Formats deep psychological compatibility breakdown   │
└────────────────────────────────────────────────────────┘
```

### Key Data Entities
- **UserProfile**: ID, name, age, occupation, location, distance, verified status, photos, bio quote, Sunday prompt, interests, voice note audio data, and base compatibility vector.
- **CurrentUserPersona**: Active profile preferences, lifestyle values, relationship goal, and custom prompt responses.
- **ChemistryAnalysis**: Overall compatibility score, emotional resonance, lifestyle sync, communication harmony, potential friction, and tailored date concept.
- **ConversationThread**: Partner profile, messages list with timestamps, unread status, and date invitation states.
