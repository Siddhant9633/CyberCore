# CYBERCORE — Design System Documentation

> **Source**: Derived from Google Stitch MCP (Project ID: `16208783007076169333`)  
> **Approved Screens**: Bento Analytics Dashboard (Desktop) · Tablet Bento Dashboard (Tablet) · Mobile Bento Dashboard (Mobile)  
> **Last Updated**: 2026-10-31

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette & Tokens](#2-color-palette--tokens)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Border Radius](#5-border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Component Library](#7-component-library)
   - [Buttons](#buttons)
   - [Inputs & Forms](#inputs--forms)
   - [Cards & Bento Tiles](#cards--bento-tiles)
   - [Navigation](#navigation)
   - [Badges & Pills](#badges--pills)
   - [Charts & Data Visualizations](#charts--data-visualizations)
   - [Tables](#tables)
   - [Status Indicators](#status-indicators)
8. [Breakpoints & Responsive Layout](#8-breakpoints--responsive-layout)
9. [Layout Architecture](#9-layout-architecture)
10. [Icons & Imagery](#10-icons--imagery)
11. [Motion & Interaction](#11-motion--interaction)

---

## 1. Design Philosophy

CYBERCORE uses a **"Obsidian Cyber Precision"** design language — a dark, data-dense interface built for security operations centers. The aesthetic is:

- **Dark-first**: All surfaces use deep navy/charcoal tones with zero light-mode variants in the current design scope.
- **Bento grid layout**: Content is organized into modular, independently-scrollable grid tiles across all breakpoints.
- **Monospace accents**: Technical data (IPs, hashes, labels, timestamps) uses `JetBrains Mono` to convey precision and authenticity.
- **Cyan-primary accent**: `#38BDF8` (sky-400) is the primary interactive color, representing active protection and trust.
- **Semantic color coding**: Threat states use strictly consistent colors — green = safe, red = malicious, amber = suspicious.

---

## 2. Color Palette & Tokens

### Core Brand Tokens (Desktop & Tablet)

| Token | Hex | Usage |
|---|---|---|
| `brand.bg` | `#0B0F14` | Page background, deepest layer |
| `brand.sidebar` | `#10151D` | Sidebar, top header, navigation rail |
| `brand.surface` | `#141B24` | Card surfaces, elevated containers |
| `brand.elevated` | `#192330` | Hover states, secondary surfaces, icon backgrounds |
| `brand.border` | `#263241` | Default border for all cards and dividers |
| `brand.borderLight` | `#2E3B4C` | Lighter border variant, focus ring accents |
| `brand.blue` | `#3B82F6` | Primary action buttons (CTA), active sidebar indicator |
| `brand.cyan` | `#38BDF8` | Primary accent, active links, icons, chart lines |
| `brand.green` | `#22C55E` | Safe status, positive metrics, success states |
| `brand.amber` | `#F59E0B` | Suspicious/warning states, quarantine indicators |
| `brand.red` | `#EF4444` | Threat/malicious indicators, danger states |
| `brand.primary` | `#F8FAFC` | Primary text (headings, values, body) |
| `brand.secondary` | `#94A3B8` | Secondary text, metadata, placeholders |
| `brand.muted` | `#64748B` | Muted labels, timestamps, axis text, dividers |

### Extended Semantic Tokens (Mobile — Material Design 3 derived)

| Token | Hex | Role |
|---|---|---|
| `surface` | `#051424` | Base background |
| `surface-dim` | `#051424` | Dimmed background variant |
| `surface-container-lowest` | `#010f1f` | Lowest container elevation |
| `surface-container-low` | `#0d1c2d` | Low container |
| `surface-container` | `#122131` | Standard container |
| `surface-container-high` | `#1c2b3c` | High-elevation cards |
| `surface-container-highest` | `#273647` | Highest elevation, selected states |
| `surface-bright` | `#2c3a4c` | Brightest surface variant |
| `on-surface` | `#d4e4fa` | Text on surface |
| `on-surface-variant` | `#c2c6d6` | Secondary text on surface |
| `outline` | `#8c909f` | Borders, dividers |
| `outline-variant` | `#424754` | Subtle borders |
| `primary` | `#adc6ff` | Primary color (mobile system) |
| `on-primary` | `#002e6a` | Text on primary |
| `primary-container` | `#4d8eff` | Container for primary |
| `secondary` | `#4cd7f6` | Secondary/cyan accent (mobile) |
| `on-secondary` | `#003640` | Text on secondary |
| `secondary-container` | `#03b5d3` | Container for secondary |
| `tertiary` | `#c0c1ff` | Tertiary/purple accent |
| `tertiary-container` | `#8083ff` | Container for tertiary |
| `error` | `#ffb4ab` | Error color (mobile) |
| `error-container` | `#93000a` | Error container background |
| `on-error` | `#690005` | Text on error |
| `inverse-surface` | `#d4e4fa` | Inverse surface for toasts/tooltips |
| `inverse-on-surface` | `#233143` | Text on inverse surface |

### Semantic Color Usage

```
Safe / Verified:    #22C55E (desktop) / secondary #4cd7f6 (mobile)
Threat / Malicious: #EF4444 (desktop) / error #ffb4ab (mobile)
Suspicious / Warn:  #F59E0B
Phishing:           #EF4444 (red)
Malware:            #F59E0B (amber)
Domain threats:     #38BDF8 (cyan)
Spam/Other:         #8B5CF6 / #64748B (muted)
Active/Live state:  animate-pulse on colored dot
```

---

## 3. Typography

### Font Families

| Role | Family | Fallbacks |
|---|---|---|
| **Sans (Body/UI)** | `Geist` | `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif` |
| **Mono (Code/Labels)** | `JetBrains Mono` | `monospace` |

Both fonts are loaded via Google Fonts with full weight ranges (`100–900`).

### Type Scale

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
|---|---|---|---|---|---|
| `display-hero` | 40px | 48px | −0.03em | 600 | Hero headlines (desktop) |
| `display-hero-mobile` | 30px | 36px | −0.02em | 600 | Hero headlines (mobile) |
| `headline-lg` | 28px | 34px | −0.02em | 600 | Section titles |
| `headline-md` | 20px | 26px | −0.015em | 600 | Card headings |
| `headline-sm` | 16px | 22px | −0.01em | 500 | Sub-headings, module titles |
| `body-lg` | 15px | 22px | −0.005em | 400 | Body copy, descriptions |
| `body-md` | 13px | 18px | 0em | 400 | Standard body text |
| `body-sm` | 12px | 16px | +0.005em | 400 | Small descriptions, captions |
| `label-mono` | 12px | 16px | −0.01em | 500 | Monospace labels, codes |
| `label-mono-xs` | 11px | 14px | 0em | 400 | Timestamps, axis labels |
| `label-ui` | 12px | 16px | +0.01em | 500 | UI labels, badge text |

### Typography Conventions

- **Section labels / nav categories**: `font-mono`, `10px`, `uppercase`, `tracking-wider`, `text-[#64748B]`
- **Page h1**: `text-2xl md:text-[28px]`, `font-semibold`, `tracking-tight`, `text-[#F8FAFC]`
- **Card titles**: `text-base font-semibold text-[#F8FAFC]`
- **KPI values**: `text-2xl font-bold tracking-tight text-[#F8FAFC]`
- **Timestamps / metadata**: `font-mono text-[11px] text-[#64748B]`
- **Status badges**: `font-mono text-[10px–11px]`
- **Breadcrumbs**: `text-xs text-[#64748B]`, active segment `text-[#F8FAFC] font-medium`

---

## 4. Spacing System

### Named Spacing Scale (Mobile token system)

| Token | Value | rem |
|---|---|---|
| `space-xxs` | 2px | 0.125rem |
| `space-xs` | 4px | 0.25rem |
| `space-sm` | 8px | 0.5rem |
| `space-md` | 12px | 0.75rem |
| `space-lg` | 16px | 1rem |
| `space-xl` | 24px | 1.5rem |
| `space-2xl` | 32px | 2rem |
| `gutter` | 16px | 1rem |
| `gutter-compact` | 8px | 0.5rem |
| `margin` | 24px | 1.5rem |
| `margin-mobile` | 16px | 1rem |

### Layout Spacing

- **Desktop main padding**: `px-8 pb-16 pt-24` (32px horizontal, 64px bottom, 96px top for fixed header)
- **Desktop max content width**: `max-w-[1360px]`
- **Section gaps**: `gap-6` (24px) between bento rows
- **Card internal padding**: `p-5` (20px) KPI cards, `p-6` (24px) primary cards
- **Tablet main padding**: `p-6` (24px), `max-w-[960px]`
- **Mobile main padding**: `px-space-lg` (16px), stacked single-column

---

## 5. Border Radius

### Desktop & Tablet

| Class | Value | Usage |
|---|---|---|
| `rounded` | 4px | Small inline elements, table badges |
| `rounded-lg` | 8px | Icon containers, nav items, small buttons |
| `rounded-xl` | 14px (0.875rem) | Primary cards, bento tiles |
| `rounded-2xl` | 16px (1rem) | Input containers, pill filters |
| `rounded-full` | 9999px | Circular avatars, status dots, badge pills |

### Mobile (Material Design 3 tokens)

| Token | Value | Usage |
|---|---|---|
| `DEFAULT` | 2px (0.125rem) | Minimal rounding |
| `lg` | 4px (0.25rem) | Moderate rounding |
| `xl` | 8px (0.5rem) | Cards, containers |
| `full` | 12px (0.75rem) | Pills, chips |

---

## 6. Shadows & Elevation

| Level | Class / Style | Usage |
|---|---|---|
| **L0 — Base** | No shadow | Page background |
| **L1 — Surface** | `shadow-sm` | KPI cards, bento tiles |
| **L2 — Elevated** | `shadow-md` | Primary scanner card, analytics cards |
| **L3 — Overlay** | `shadow-[4px_0_24px_rgba(0,0,0,0.6)]` | Mobile slide-out drawer |
| **L4 — Header** | `shadow-[0_1px_8px_rgba(0,0,0,0.25)]` | Fixed mobile top header |
| **Glow** | `shadow-blue-500/20` | Primary CTA buttons (blue glow) |
| **Inner glow** | `shadow-inner` | Brand icon container, dark insets |

### Backdrop Blur

Used on sticky headers for frosted glass effect:
- **Desktop/Tablet header**: `bg-[#10151D]/95 backdrop-blur-md`
- **Mobile header**: `bg-surface-container-lowest/85 backdrop-blur-xl`
- **Mobile drawer backdrop**: `bg-surface-container-lowest/80 backdrop-blur-sm`

---

## 7. Component Library

### Buttons

#### Primary CTA Button (Blue)
```
h-11 px-5 rounded-lg
bg-[#3B82F6] hover:bg-[#2563EB] active:scale-[0.98]
text-white font-medium text-sm
flex items-center gap-2
shadow-md
transition-all
```
Example: "Analyze Website" — includes leading Material Symbol icon + optional keyboard shortcut badge.

#### Primary CTA Button (Mobile — Full Width)
```
w-full h-11 rounded-lg
bg-primary text-on-primary
font-body-md font-semibold
flex items-center justify-center gap-2
active:scale-[0.99]
shadow-sm
```

#### Ghost / Icon Button
```
p-1 rounded
text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#192330]
transition-colors
```

#### Segmented Filter Button (Active)
```
px-3 py-1.5 rounded-lg
text-xs font-medium font-mono
text-[#38BDF8] bg-[#192330] border border-[#263241]
shadow-sm
```

#### Segmented Filter Button (Inactive)
```
px-3 py-1.5 rounded-lg
text-xs font-medium font-mono
text-[#94A3B8] hover:text-[#F8FAFC]
transition-colors
```

#### Text Link Button
```
text-xs font-mono text-[#38BDF8] hover:underline
flex items-center gap-1
```
Includes arrow icon with `group-hover:translate-x-0.5 transition-transform`.

---

### Inputs & Forms

#### URL / Search Input (Desktop)
```
Container: relative flex items-center
           p-1.5 rounded-xl bg-[#0B0F14] border border-[#263241]
           focus-within:border-[#38BDF8]/60 focus-within:ring-1 focus-within:ring-[#38BDF8]/20
           shadow-inner transition-all

Input:     w-full h-11 pl-10 pr-3 bg-transparent
           text-sm text-[#F8FAFC] placeholder-[#64748B]
           focus:outline-none font-sans
```
Left icon: `material-symbols-outlined` at 20px in `text-[#64748B]`.

#### Search Bar (Header)
```
w-full h-9 pl-9 pr-14 rounded-lg
bg-[#141B24] border border-[#263241]
text-xs text-[#F8FAFC] placeholder-[#64748B]
focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/40
transition-all
```
Right shortcut badge: `⌘K` in `font-mono text-[10px] bg-[#192330] border border-[#263241] text-[#94A3B8] rounded`.

#### Input (Mobile — Full Width)
```
w-full h-11 px-3 rounded-lg
bg-surface-container-lowest
focus-within:ring-2 focus-within:ring-secondary/30
font-label-mono text-label-mono text-on-surface
placeholder:text-outline/70
```

---

### Cards & Bento Tiles

#### Standard Card (Surface Level)
```
rounded-xl bg-[#141B24] border border-[#263241]
p-5 (KPI) or p-6 (primary)
shadow-sm
flex flex-col justify-between
transition-colors hover:border-[#2E3B4C]
```

#### Primary Hero Card
```
rounded-xl bg-[#141B24] border border-[#263241]
p-6 shadow-sm
flex flex-col justify-between
relative overflow-hidden group
```
Includes a `absolute` decorative radial blur: `w-72 h-72 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none`

#### Tool Module Card (Hover)
```
group rounded-xl bg-[#141B24] border border-[#263241]
p-5 shadow-sm
hover:border-[#38BDF8]/50 hover:bg-[#161F2A]
transition-all
flex flex-col justify-between
```
Arrow icon animates: `group-hover:translate-x-1 transition-all`.

#### KPI Metric Card
```
rounded-xl bg-[#141B24] border border-[#263241]
p-5 shadow-sm
flex flex-col justify-between
transition-colors hover:border-[#2E3B4C]

Structure:
  ┌─ Label (text-xs text-[#94A3B8])  ─── Icon (w-7 h-7 rounded-md bg-[#192330]) ─┐
  │                                                                                 │
  │  Value (text-2xl font-bold text-[#F8FAFC])                                     │
  │                                                                                 │
  └─ Trend (font-mono text-[11px] colored) ──────── Sub-label (text-[#64748B]) ───┘
```

#### Mobile Card (Surface Container High)
```
flex flex-col p-space-lg rounded-xl
bg-surface-container-high shadow-md
```

---

### Navigation

#### Desktop Sidebar (240px fixed)
```
fixed left-0 top-0 h-full w-[240px] z-50
flex flex-col justify-between overflow-y-auto
bg-[#10151D] border-r border-[#263241]
```

**Brand Header (h-16)**:
- Logo icon: `w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#141B24] border border-[#2B3A4F] text-[#38BDF8]`
- Brand name: `font-sans font-semibold text-sm tracking-wider text-[#F8FAFC]`
- Sub-tagline: `font-mono text-[10px] tracking-widest uppercase text-[#64748B]`

**Nav Section Labels**: `font-mono text-[10px] font-medium tracking-wider uppercase text-[#64748B]`

**Nav Item (Active)**:
```
flex items-center gap-2.5 px-3 py-2 rounded-lg
font-medium text-xs
bg-[#192330] text-[#38BDF8]
border-l-2 border-[#3B82F6]
shadow-sm
```

**Nav Item (Default)**:
```
flex items-center gap-2.5 px-3 py-2 rounded-lg
font-medium text-xs
text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#141B24]
transition-colors
```

**Nav Sections**: OVERVIEW · SECURITY TOOLS · PROTECTION · GENERAL

#### Tablet Sidebar (72px icon rail, fixed)
```
fixed left-0 top-0 h-full w-[72px] z-50
flex flex-col justify-between
bg-[#10151D] border-r border-[#263241]
```
Icon nav buttons: `w-12 h-11 rounded-lg flex items-center justify-center`  
Active: `bg-[#192330] text-[#38BDF8] border-l-2 border-[#3B82F6]`  
Has tooltip via `title` attribute.

#### Mobile Navigation

**Top Header (h-14, fixed)**:
```
fixed top-0 w-full z-50 pt-safe
bg-surface-container-lowest/85 backdrop-blur-xl
shadow-[0_1px_8px_rgba(0,0,0,0.25)]
h-14 px-space-lg flex items-center justify-between
```
- Left: Hamburger menu button (`menu` icon) + brand logo + name
- Right: Notification bell + avatar

**Slide-out Drawer (310px)**:
```
fixed top-0 bottom-0 left-0 w-[310px] z-50
bg-surface-container-low
shadow-[4px_0_24px_rgba(0,0,0,0.6)]
transform -translate-x-full transition-transform duration-300 ease-out
pt-safe pb-safe
```
Opens via JS classList toggle. Backdrop overlay closes on click.

**Mobile Bottom Nav**: Not present in current designs — navigation is drawer-only on mobile.

#### Top Header (Desktop, fixed h-16)
```
fixed top-0 left-[240px] right-0 h-16 z-40 px-8
flex items-center justify-between gap-6
bg-[#10151D]/95 backdrop-blur-md border-b border-[#263241]
```
Contains: Breadcrumbs · Search Bar · Notification Bell · User Avatar

---

### Badges & Pills

#### Status Badge — Safe
```
inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
font-mono text-[10px] font-medium
text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30
```
Includes `w-1.5 h-1.5 rounded-full bg-[#22C55E]` dot.

#### Status Badge — Threat (High Risk)
```
inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
font-mono text-[10px] font-medium
text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30
```

#### Status Badge — Suspicious
```
inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
font-mono text-[10px] font-medium
text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20
```

#### Inline Tag / Chip
```
px-2 py-0.5 rounded
font-mono text-[10px–11px]
bg-[#192330] border border-[#263241]
text-[#94A3B8]
```
Used for: scan type labels, demo data markers, version indicators.

#### Live / Active Pill
```
inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
font-mono text-[11px] font-medium
text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20
```
Animated dot: `w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse`

#### "Pro" Account Badge
```
px-1.5 py-0.5 rounded
text-[10px] font-mono text-[#94A3B8]
bg-[#192330] border border-[#263241]
```

---

### Charts & Data Visualizations

All charts are hand-coded SVG — no charting library dependency.

#### Security Activity Line + Area Chart
- **SVG viewBox**: `0 0 700 200` (desktop) · `0 0 450 160` (tablet) · `0 0 320 120` (mobile)
- **Background track**: `fill: #192330`, horizontal dashed lines at equal intervals
- **Area fill** (Scans): `linearGradient` from `#38BDF8` at 28% opacity to 0%
- **Scans line**: stroke `#38BDF8`, `stroke-width: 2.5`, `stroke-linecap: round`
- **Threats line**: stroke `#EF4444` (desktop) or `#4cd7f6` (mobile), `stroke-dasharray: 4 4` (dashed)
- **Highlight dot**: `r=4.5`, fill = line color, `stroke: #0B0F14 stroke-width: 2`
- **X-axis labels**: Mon–Sun, `font-mono text-[11px] text-[#64748B]`

#### Security Score Gauge (Circular)
- **SVG viewBox**: `0 0 120 120` (desktop) or `0 0 36 36` (tablet) or `0 0 96 96` (mobile)
- **Background ring**: stroke `#192330`, `stroke-width: 9`
- **Progress arc**: Uses `stroke-dasharray` + `stroke-dashoffset` to represent 86/100
  - Desktop: `linearGradient` from `#38BDF8` → `#22C55E`
  - Tablet/Mobile: `stroke: #38BDF8` (solid cyan)
- **Center label**: `text-3xl font-bold text-[#F8FAFC]` + `font-mono text-[11px] text-[#64748B]`
- **Transform**: `-rotate-90` on SVG to start arc from 12 o'clock

#### Threat Distribution Doughnut Chart
- **SVG viewBox**: `0 0 100 100`
- **Radius**: 38 (desktop) or 15.9 (tablet) or 38 (mobile)
- **Stroke-width**: 12 (desktop) · 4.5 (tablet) · 10 (mobile)
- **Segments**:
  | Segment | Color | Desktop % |
  |---|---|---|
  | Phishing | `#EF4444` | 45% |
  | Malware | `#F59E0B` | 28% |
  | Domains | `#38BDF8` | 18% |
  | Spam | `#8B5CF6` / `#64748B` | 9% |
- **Center label**: threat count `text-xl font-bold` + "Threats" `text-[10px] font-mono uppercase text-[#64748B]`
- **Legend**: 2×2 grid of mini cards (`bg-[#192330] border border-[#263241]/70 p-2 rounded-lg`)

#### Progress Bars (Security Score Breakdown)
- **Track**: `w-24 h-1.5 bg-[#192330] rounded-full overflow-hidden`
- **Fill**: `h-full rounded-full` with inline `style="width: XX%"` and semantic color
  - Web Protection: `bg-[#38BDF8]` at 92%
  - Network Security: `bg-[#22C55E]` at 84%
  - Identity & Passwords: `bg-[#F59E0B]` at 82%

---

### Tables

#### Recent Scans Table (Desktop / Tablet)
```
Container:  rounded-xl bg-[#141B24] border border-[#263241] overflow-hidden shadow-sm
Header row: bg-[#192330]/50 (desktop) or bg-[#10151D]/60 (tablet)
            border-b border-[#263241]
            font-mono text-[11px] uppercase tracking-wider text-[#64748B]
Body rows:  divide-y divide-[#263241]/60
            text-xs
            hover:bg-[#192330]/40 transition-colors
Cell padding: py-3.5 px-6 (first/last) · py-3.5 px-4 (middle)
```

**Columns**: Website / Target · Scan Type · Risk Status · Date/Time · Action

**Row content patterns**:
- Target: `font-mono font-medium text-[#F8FAFC]` + status icon (colored Material Symbol)
- Scan type: inline chip `px-2 py-0.5 rounded font-mono text-[11px] bg-[#192330] border border-[#263241] text-[#94A3B8]`
- Status: full-color pill badge (see Badges section)
- Timestamp: `font-mono text-[11px] text-[#94A3B8]`
- Action: ghost icon button

#### Mobile Activity Cards (replaces table on mobile)
```
flex flex-col p-space-md rounded-xl bg-surface-container-high shadow-sm gap-2
```
Each card shows: target entity + risk badge (top row), scan type + timestamp, and action button.

---

### Status Indicators

| Indicator | Pattern |
|---|---|
| **Live dot (animated)** | `w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse` |
| **Active/Online** | `w-2 h-2 rounded-full bg-[#22C55E]` (static or animate-ping) |
| **Notification badge** | `absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#38BDF8] ring-2 ring-[#10151D]` |
| **System engines live** | `ENGINES LIVE` pill — `bg-[#141B24] border border-[#263241] font-mono text-[11px] text-[#94A3B8]` + green dot |

---

## 8. Breakpoints & Responsive Layout

### Breakpoint Definitions

| Name | Width | Shell Type | Sidebar |
|---|---|---|---|
| **Mobile** | ≤ 767px | `mobile_tab` | Slide-out drawer (310px) |
| **Tablet** | 768px – 1279px | `tablet_dashboard` | Icon rail (72px, fixed) |
| **Desktop** | ≥ 1280px | `web_dashboard` | Full sidebar (240px, fixed) |

> The Stitch designs use `shell-type` meta tags (`web_dashboard`, `tablet_dashboard`, `mobile_tab`) to signal layout intent.

### Tailwind Breakpoint Mapping

```
sm: 640px   — Two-column KPI grid, horizontal nav elements
md: 768px   — Tablet layout kicks in, 4-column KPI grid
lg: 1024px  — Full 12-column bento grid activates
xl: 1280px  — Standard desktop viewport
```

---

## 9. Layout Architecture

### Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (fixed, 240px)  │  HEADER (fixed, h-16)        │
│ Brand                   │  Breadcrumb / Search / User  │
│ Nav sections            │                              │
│ User profile            ├──────────────────────────────┤
│                         │  MAIN CONTENT                │
│                         │  pt-24 px-8 pb-16            │
│                         │  max-w-[1360px] mx-auto      │
│                         │                              │
│                         │  ┌─ BENTO GRID (12-col) ───┐ │
│                         │  │ A: Welcome + Filter      │ │
│                         │  │ B: Scanner(8) + Score(4) │ │
│                         │  │ C: 4x KPI Cards          │ │
│                         │  │ D: Chart(8) + Donut(4)   │ │
│                         │  │ E: 3x3 Tool Grid         │ │
│                         │  │ F: Recent Scans Table    │ │
│                         │  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Bento Grid Spans (Desktop)

| Section | Layout |
|---|---|
| Welcome + time filter | `flex-row justify-between` |
| Primary row | `grid-cols-12`: Scanner `col-span-8`, Score `col-span-4` |
| KPI cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` |
| Analytics row | `grid-cols-12`: Chart `col-span-8`, Donut `col-span-4` |
| Security tools | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` |
| Recent scans | Full-width table |

### Tablet Layout

```
┌─────────────────────────────────────────────┐
│ ICON RAIL (72px) │ HEADER (h-16, sticky)    │
│ Brand icon       │ Breadcrumb / Search      │
│ Tool icons       │ Status pill / Bell       │
│ Profile avatar   ├──────────────────────────┤
│                  │ MAIN: max-w-[960px]      │
│                  │ p-6 space-y-6            │
│                  │                          │
│                  │ ┌─ BENTO GRID ─────────┐ │
│                  │ │ Welcome + Time Filter │ │
│                  │ │ Scanner(7) + Score(5) │ │
│                  │ │ 2x2 + 4-col KPIs     │ │
│                  │ │ Chart(7) + Donut(5)  │ │
│                  │ │ 2-col Tool Grid      │ │
│                  │ │ Recent Scans Table   │ │
│                  │ └──────────────────────┘ │
└─────────────────────────────────────────────┘
```

Tablet bento spans: Scanner `col-span-7`, Score `col-span-5` · Chart `col-span-7`, Donut `col-span-5`

### Mobile Layout

```
┌────────────────────────────┐
│ HEADER (h-14, fixed)       │  ← Menu + Brand + Bell + Avatar
├────────────────────────────┤
│ MAIN (pt-14 pb-20)         │
│ px-space-lg (16px)         │
│ space-y-space-lg           │
│                            │
│ Welcome section            │
│ Time filter pills (row)    │
│ Scanner card (full width)  │
│ Security score card        │
│ KPI 2x2 grid               │
│ Security activity chart    │
│ Threat distribution donut  │
│ Tool list (1-col, full)    │
│ Recent activity cards      │
│                            │
├────────────────────────────┤
│ (Bottom padding: pb-20)    │  ← Space for potential bottom nav
└────────────────────────────┘
```

Mobile has no persistent bottom nav in the current designs; `pb-20` leaves room for future implementation.

---

## 10. Icons & Imagery

### Icon Library

**Material Symbols Outlined** — loaded from Google Fonts CDN.  
Configuration: `opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`

#### Icon Size Conventions

| Context | Size |
|---|---|
| Nav items (desktop full sidebar) | 18px |
| Nav items (tablet icon rail) | 21px |
| Nav items (mobile drawer) | 20px |
| Top header / header icons | 19–22px |
| Card section icons | 17–20px |
| Inline status/action icons | 14–17px |
| Small badge/annotation icons | 13–14px |

#### Icon Usage by Section

| Icon | Usage |
|---|---|
| `shield` | Brand logo, browser protection |
| `dashboard` | Dashboard nav |
| `link` | URL Scanner |
| `mark_email_read` / `chat` | Message Scanner |
| `password` | Password Security |
| `dns` / `travel_explore` | Domain Intelligence |
| `document_scanner` / `file_open` | File Scanner |
| `security` / `vpn_lock` | Browser Protection |
| `smart_toy` | AI Assistant |
| `history` / `manage_search` | Scan History |
| `settings` | Settings |
| `search` | Search bars |
| `notifications` | Notification bell |
| `help_outline` | Docs & Support |
| `trending_up` | Positive metric trend |
| `warning` / `gpp_maybe` | Threat/alert indicators |
| `verified_user` / `check_circle` | Safe/verified status |
| `arrow_forward` / `chevron_right` | Navigation forward |
| `open_in_new` | External link |
| `psychology` | Phishing detection |
| `pie_chart` | Threat distribution chart |

### Avatar / User Badge
- Initials-based avatar: `w-8 h-8 rounded-full font-mono font-medium text-xs bg-[#192330] text-[#38BDF8] border border-[#2B3A4F]`
- Mobile avatar: Uses `person` Material Symbol on `bg-primary` circle
- Hover: `group-hover:border-[#38BDF8]/50 transition-colors`

### Decorative Elements
- **Radial blur orb**: `absolute w-72 h-72 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none` in primary hero card
- **Radial blur (tablet)**: `w-44 h-44 bg-[#3B82F6]/5 rounded-full blur-2xl`
- **Divider dots**: `w-1.5 h-1.5 rounded-full` in themed colors

---

## 11. Motion & Interaction

### Transition Utilities

| Pattern | Class |
|---|---|
| Standard element transitions | `transition-colors` |
| Multi-property (layout) | `transition-all` |
| Duration (default Tailwind) | 150ms |
| Sidebar drawer slide | `transition-transform duration-300 ease-out` |

### Interactive States

| State | Pattern |
|---|---|
| **Hover — card** | `hover:border-[#2E3B4C]` (subtle border lighten) |
| **Hover — tool card** | `hover:border-[#38BDF8]/50 hover:bg-[#161F2A]` |
| **Hover — nav item** | `hover:text-[#F8FAFC] hover:bg-[#141B24]` |
| **Hover — link** | `hover:text-[#F8FAFC]` |
| **Active — button** | `active:scale-[0.98]` or `active:scale-[0.99]` |
| **Focus — input** | `focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/40` |
| **Group hover — arrow** | `group-hover:translate-x-1 transition-all` |
| **Group hover — icon border** | `group-hover:border-[#38BDF8]/40 transition-colors` |
| **Group hover — scale** | `group-hover:scale-105 transition-transform` (tablet tool icons) |

### Animations

| Animation | CSS | Usage |
|---|---|---|
| `animate-pulse` | CSS pulse opacity loop | Live status dots, real-time indicators |
| `animate-ping` | CSS ping scale+fade | Active browser protection indicator (mobile) |

### Selection Styles

```css
selection:bg-sky-500/20
selection:text-sky-300
```

### Scrollbar

All scrollbars are hidden globally:
```css
::-webkit-scrollbar { display: none; }
```

### Safe Area Support (Mobile)

```css
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.pt-safe { padding-top: env(safe-area-inset-top, 0px); }
```
Applied to mobile fixed header and slide-out drawer for notch/home-indicator compatibility.

---

## Appendix — Design Token Quick Reference

```json
{
  "colors": {
    "bg":           "#0B0F14",
    "sidebar":      "#10151D",
    "surface":      "#141B24",
    "elevated":     "#192330",
    "border":       "#263241",
    "borderLight":  "#2E3B4C",
    "blue":         "#3B82F6",
    "cyan":         "#38BDF8",
    "green":        "#22C55E",
    "amber":        "#F59E0B",
    "red":          "#EF4444",
    "purple":       "#8B5CF6",
    "textPrimary":  "#F8FAFC",
    "textSecond":   "#94A3B8",
    "textMuted":    "#64748B"
  },
  "fonts": {
    "sans": "Geist",
    "mono": "JetBrains Mono"
  },
  "radius": {
    "sm": "8px",
    "md": "14px",
    "lg": "16px",
    "full": "9999px"
  },
  "sidebar": {
    "desktop": "240px",
    "tablet":  "72px",
    "mobile":  "310px (drawer, off-canvas)"
  },
  "header": {
    "desktop": "h-16 (64px)",
    "tablet":  "h-16 (64px, sticky)",
    "mobile":  "h-14 (56px, fixed)"
  },
  "breakpoints": {
    "mobile":  "< 768px",
    "tablet":  "768px – 1279px",
    "desktop": "≥ 1280px"
  }
}
```

