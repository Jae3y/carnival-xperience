# DESIGN SYSTEM — CarnivalXperience
**Cultural Identity, Editorial Typography & Tactile Design Engineering**

---

## 1. Visual World & Philosophy
CarnivalXperience is the digital companion for **Calabar Carnival** — "Africa's Biggest Street Party" — held annually across December in Calabar, Cross River State, Nigeria.

### The Problem With AI Slop
AI-generated web apps fall into predictable, lazy patterns:
- Floating neon/purple/pink gradient orbs (`cx-orb`) looping with generic sine easings.
- Rainbow linear gradient text on all headings.
- Repetitive, identical bento cards (icon + badge + title + text + arrow link).
- The hero-metric template (big number, small label, supporting stats).
- Mushy, delayed animations with `transition: all` and `ease-in`.
- Lack of tactile physical feedback on press.

### The Crafted Standard
Our aesthetic is **Warm Editorial Carnival**:
- **Canvas**: Deep nocturnal obsidian surfaces (`hsl(228 35% 6%)` to `hsl(230 45% 4%)`) that feel like the African night sky along Mary Slessor Avenue, rather than flat synthetic gray or washed-out purple sludge.
- **Elevation & Specular Highlights**: Surfaces have a 1px border (`border-white/[0.08]`) and an inner specular edge highlight (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]`) that simulates physical light hitting the top edge of a physical device or card.
- **Typography with Character**: Razor-sharp, high-contrast typography. Clear scale steps, generous line-height, tight tracking on display headings (`tracking-tight`), and zero gradient text on critical copy.
- **Authentic Cultural Grounding**: The real 5 competing carnival bands (Seagull, Passion 4, Masta Blasta, Freedom, Bayside), real landmarks (Millennium Park, Mary Slessor Avenue, Marian Road, U.J. Esuene Stadium), and the authentic 31-day December festival calendar.

---

## 2. Motion & Interaction Rules (Emil Kowalski Philosophy)
Referenced from [animations.dev](https://animations.dev/) and `emil-design-eng`:

### Core Curves
```css
:root {
  /* Fast, punchy ease-out for UI entries, hovers, and feedback */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  /* Natural acceleration/deceleration for movement across screen */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  /* Sheet / drawer curve */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

### Durations & Timing
- **Button / Press Feedback**: 100ms – 160ms.
- **Small Dropdowns / Tooltips**: 125ms – 200ms.
- **Tabs / Panel Transitions**: 150ms – 220ms.
- **Never animate keyboard actions**: Command palette and keyboard navigation must be instantaneous.
- **Never use `ease-in`**: Sluggish start makes UI feel unresponsive.
- **Never use `transition: all`**: Explicitly declare animated properties (e.g. `transition: transform 140ms var(--ease-out), background-color 140ms ease`).

### Tactile Press
Every pressable element (buttons, cards, chips, tabs) must provide instant tactile feedback on `:active`:
```css
.button:active,
[role="button"]:active {
  transform: scale(0.97);
}
```

### Entering Elements
Never animate from `scale(0)`. Elements enter from `scale(0.95)` with `opacity: 0` to `scale(1)` with `opacity: 1`.

---

## 3. Review Format (Required)
Every UI review must be presented in the Emil Kowalski table format:
| Before | After | Why |
| --- | --- | --- |
| `cx-orb` floating blurred orbs | Nocturnal atmospheric texture with specular cards | Removes generic AI template trope; adds tangible craft depth |
| Rainbow gradient headline text | High-contrast editorial white with calibrated golden accents | Improves readability; passes 4.5:1 contrast; looks human-designed |
| Repeated identical bento cards | Interactive tabbed route & band explorer | Provides real utility, interactive agency, and rich cultural information |
| `motion-safe:hover:scale-[1.02]` with no active state | `active:scale-[0.97] transition-transform duration-140` | Instant physical feedback; UI feels responsive to human touch |
