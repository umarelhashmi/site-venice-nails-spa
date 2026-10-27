# Venice Nails & Spa — Design Plan (`/frontend-design`)

## 1. Subject Matter & Creative Direction
- **Subject**: **Venice Nails & Spa** (`9971 Tagore Pl Ste# 5, Orlando, FL 32827` — Lake Nona Landing).
- **Core Concept**: **Futuristic Venetian Lacquer Atelier & Sculpted Nail-Tip Console**.
- **Why Standard Layouts Fail Here**: Standard business websites stack a horizontal navbar, a massive full-bleed text hero, three equal rectangular cards, and a square gallery grid. For a nail studio, that hides what clients actually come for: **the nail silhouettes, the gloss finishes, and the exact service menu + price list**.

## 2. Compact Token System

### Color Palette (5 Core Hex Tokens)
- **Obsidian Gel Base (`#0D0C10`)**: Deep cured-gel lacquer canvas inspired by the original dark slate signage behind the gold `"Venice"` calligraphy.
- **Smoked Pearl Glass (`#17151D`)**: Translucent elevated surface for the swatch dock and price matrix tiles.
- **Venetian Champagne Gold (`#FCE892`)**: Sampled directly from the redrawn `"Venice"` calligraphic brushstroke logo.
- **Rose-Quartz Jelly (`#C04063`)**: Exact accent hue (`#c04063`) extracted from `venice-nails-spa-orlando.nailsites.com`, paired with soft sheer blush (`#F4C6D3`).
- **Porcelain Silk (`#F8F5F0`) & Warm Taupe (`#A9A29C`)**: High-contrast primary and secondary typography tokens.

### Typography
- **Display / Headings**: `'Cormorant Garamond'` (600/700, sculptural high-fashion serif echoing the `"NAILS & SPA"` serif in the logo).
- **UI & Price Ledger**: `'Plus Jakarta Sans'` (400/500/600, crisp geometric grotesque for fast scanning of service names, durations, and prices, with `font-variant-numeric: tabular-nums`).

### Spatial Layout Concept (Pass 1 -> Pass 2 Critique & Revision)
- **Pass 1 Critique**: An initial draft considered a top header with a full-width hero split. Rejected because it still reads like a conventional local-business landing page.
- **Pass 2 Final Layout ("The Left-Rail Atelier Dock + Sculpted Nail-Tip Fan Stage")**:
  ```text
  +----------------------+-----------------------------------------------------------+
  |                      | [01] SCULPTED NAIL-TIP LOOKBOOK FAN + SPOTLIGHT STRIP     |
  |  STICKY LEFT DOCK    |  ┌─────────────────────┐   ╭───╮ ╭───╮ ╭───╮ ╭───╮ ╭───╮  |
  |  (Venice Logo,       |  │ Minimal Headline &  │   │Tip│ │Tip│ │Tip│ │Tip│ │Tip│  |
  |   Live Open/Closed,  |  │ 4 Original Services │   │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │  |
  |   9971 Tagore Pl #5, |  └─────────────────────┘   ╰───╯ ╰───╯ ╰───╯ ╰───╯ ╰───╯  |
  |   (407) 313-8810,    +-----------------------------------------------------------+
  |   Lacquer Book CTA,  | [02] INTERACTIVE 24-SERVICE LACQUER MATRIX & TRAY         |
  |   8-Cat Quick Jump)  |  [Category Orbit Pills]  |  2-Col Tabular Price Ledger    |
  |                      +-----------------------------------------------------------+
  |                      | [03] "LATEST from Venice Nails:" (3 Live Media Triptych)  |
  |                      +-----------------------------------------------------------+
  |                      | [04] CLIENT HANDS STRIP + VERIFIED REVIEWS & SALON TOUR   |
  +----------------------+-----------------------------------------------------------+
  ```
- **Geometry & Shapes**:
  - Nail work photos are framed inside **sculpted nail-tip silhouettes** (`border-radius: 110px 110px 22px 22px` for Almond/Oval arches; tapered radius for Coffin/Squoval), while salon interior views use wide horizontal panoramic vitrines (`aspect-ratio: 16 / 10`).
  - **Strict Viewport-Safe Image Rule**: Every image on desktop and mobile is capped (`max-block-size: min(260px, 34dvh)` on desktop, `min(200px, 30dvh)` on mobile) so no image ever forces the user to scroll an entire screen to get past it.
  - **Minimal Copy Rule**: Zero AI filler text. Every line of copy comes verbatim from `venice-nails-spa-orlando.nailsites.com`, `lacquer.beauty/venice-nails-spa-orlando`, Google Maps, and their official social posts.
