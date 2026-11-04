---
version: alpha
name: Dailylexis
description: |
  Daily Lexis presents a warm, educational aesthetic built on organic, flowing
  design language. The visual identity balances playfulness with
  professionalism, using soft color transitions, generous whitespace, and
  hand-crafted illustrations to create an inviting learning environment. The
  palette emphasizes natural earth tones and muted greens, evoking calm focus
  and growth. Decorative elements—rounded shapes, gradient backgrounds, and
  illustrated characters—soften the interface while maintaining clarity and
  legibility essential to language education. The typography combines bold,
  confident headings with approachable body text, reinforcing the brand's
  position as both authoritative and accessible.
source:
  url: "https://dailylexis.com/"
  pagesAnalyzed: 1
  extractedAt: 2026-11-04
  tokensMeasured: true
colors:
  primary: "#2E7D5B"
  accent: "#303840"
  link: "#235F46"
  canvas: "#FBF8F1"
  on-primary: "#FFFFFF"
  ink: "#303840"
  body: "#405D4B"
  muted: "#6B7280"
  hairline: "#E8E2D8"
  accent-1: "#DF7059"
  accent-2: "#D3A349"
  accent-3: "#708F82"
  accent-4: "#684E20"
  accent-5: "#F5E7C8"
  neutral-1: "#E5F1EB"
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 50px
    fontWeight: 800
    letterSpacing: -2.2px
  display-md:
    fontFamily: Manrope
    fontSize: 46px
    fontWeight: 650
    letterSpacing: -2px
  display-sm:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -1px
  heading-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: -0.9px
  heading-md:
    fontFamily: Manrope
    fontSize: 27px
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: -0.4px
  heading-md-tight:
    fontFamily: Manrope
    fontSize: 27px
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: -0.4px
  heading-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 800
    lineHeight: 1.6
    letterSpacing: 0px
  heading-sm-tight:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: 0px
  heading-xs:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 700
    letterSpacing: 0px
  body-md:
    fontFamily: "DM Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: 0px
  body-sm:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0px
  body-sm-dm-sans:
    fontFamily: "DM Sans"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: 0px
  body-xs:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0px
  body-xs-loose:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: 0px
  body-xs-2:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0px
  button:
    fontFamily: "DM Sans"
    fontSize: 11px
    fontWeight: 700
    letterSpacing: 0px
  caption-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.85
    letterSpacing: 0px
  caption-xs:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: 600
    letterSpacing: 0px
rounded:
  none: 0px
  xs: 9px
  sm: 18px
  md: 22px
  lg: 24px
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 36px
  section: 40px
  band: 44px
borderWidths:
  thin: 1px
  medium: 2px
shadows:
  sm: "rgba(35, 58, 44, 0.01) 0px 4px 6px 0px, rgba(35, 58, 44, 0.027) 0px 14px 36px 0px"
  md: "color(srgb 0.439216 0.560784 0.509804 / 0.13) 0px 0px 0px 3px, color(srgb 0.439216 0.560784 0.509804 / 0.18) 0px 12px 30px 0px, color(srgb 0.439216 0.560784 0.509804 / 0.05) 0px 0px 32px 0px inset"
  lg: "rgba(23, 32, 25, 0.05) 0px 8px 28px 0px"
  xl: "rgba(198, 63, 44, 0.2) 0px 4px 10px 0px"
elevationStrategy: progressive
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#FBF8F1"
    surface: "#F3F1EA"
    surfaceRaised: "#EBEAE3"
    text: "#303840"
    textMuted: "#405D4B"
    border: "#E8E2D8"
    accent: "#2E7D5B"
    accentFg: "#FFFFFF"
    focusRing: "#2E7D5B"
    elevation: shadow
  dark:
    bg: "#0D1211"
    surface: "#1C201F"
    surfaceRaised: "#282C2B"
    text: "#F7FAF8"
    textMuted: "#9EA2A0"
    border: "#343837"
    accent: "#338C66"
    accentFg: "#0B0B0C"
    focusRing: "#2E7D5B"
    elevation: "border+surface"
gradients:
  - context: hero
    kind: radial
    value: "radial-gradient(circle at 50% 0px, rgb(255, 255, 255) 0px, rgb(250, 249, 244) 38%, rgb(243, 242, 234) 100%)"
  - context: section
    kind: linear
    value: "linear-gradient(155deg, color(srgb 0.993725 0.96451 0.948824), rgb(255, 253, 250) 68%)"
  - context: section
    kind: linear
    value: "linear-gradient(155deg, color(srgb 0.991373 0.97451 0.945686), rgb(255, 253, 250) 68%)"
  - context: section
    kind: linear
    value: "linear-gradient(155deg, color(srgb 0.971961 0.970588 0.956863), rgb(255, 253, 250) 68%)"
  - context: section
    kind: linear
    value: "linear-gradient(140deg, rgb(237, 246, 237), rgb(248, 245, 223))"
components:
  button-filled:
    typography: "{typography.button}"
    textColor: "{colors.accent-4}"
    border: "1px solid rgb(232, 212, 165)"
    height: 38px
    padding: "0px 12px 0px 12px"
    rounded: "{rounded.xs}"
    backgroundColor: "{colors.accent-5}"
  button-filled-2:
    typography: "{typography.button}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    height: 38px
    padding: "0px 12px 0px 12px"
    rounded: "{rounded.xs}"
    backgroundColor: "rgb(255, 253, 250)"
  button-primary:
    typography: "{typography.button}"
    textColor: "{colors.on-primary}"
    border: "1px solid {colors.primary}"
    height: 38px
    padding: "0px 12px 0px 12px"
    rounded: "{rounded.xs}"
    backgroundColor: "{colors.primary}"
  card:
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    fontSize: 16px
    fontFamily: "DM Sans"
    fontWeight: 400
    rounded: "{rounded.sm}"
    backgroundColor: "rgb(255, 253, 250)"
  card-lg:
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    padding: "42px 86.4px 42px 86.4px"
    fontSize: 16px
    fontFamily: "DM Sans"
    fontWeight: 400
    rounded: "{rounded.md}"
    backgroundColor: "rgb(255, 253, 250)"
  badge-filled:
    textColor: "{colors.on-primary}"
    border: "2px solid rgb(255, 253, 250)"
    height: 18px
    padding: "0px 5px 0px 5px"
    fontSize: 10px
    boxShadow: "rgba(107, 23, 23, 0.2) 0px 2px 5px 0px"
    fontFamily: Manrope
    fontWeight: 800
    lineHeight: 1
    rounded: 999px
    backgroundColor: "rgb(217, 63, 53)"
  badge-text:
    textColor: "{colors.muted}"
    height: 19px
    fontSize: 14px
    fontFamily: Manrope
    fontWeight: 600
  navigation:
    textColor: "{colors.link}"
    border: "1px solid {colors.hairline}"
    padding: "25px 30px 25px 30px"
    fontSize: 16px
    fontFamily: "DM Sans"
    fontWeight: 400
    rounded: 16px
    backgroundColor: "{colors.neutral-1}"
  footer:
    textColor: "rgb(160, 160, 152)"
    border: "1px solid {colors.hairline}"
    padding: "24px 0px 25px 0px"
    fontSize: 11px
    fontFamily: "DM Sans"
    fontWeight: 400
  link:
    textColor: "{colors.ink}"
    border: "1px solid color(srgb 0.607451 0.690196 0.65098)"
    padding: "23px 27px 25px 27px"
    fontSize: 16px
    boxShadow: "color(srgb 0.439216 0.560784 0.509804 / 0.13) 0px 0px 0px 3px, color(srgb 0.439216 0.560784 0.509804 / 0.18) 0px 12px 30px 0px, color(srgb 0.439216 0.560784 0.509804 / 0.05) 0px 0px 32px 0px inset"
    fontFamily: Manrope
    fontWeight: 400
    rounded: "{rounded.lg}"
  link-sm:
    textColor: "{colors.on-primary}"
    padding: "11px 18px 11px 18px"
    fontSize: 13px
    fontFamily: "DM Sans"
    fontWeight: 700
    rounded: "{rounded.xs}"
    backgroundColor: "rgb(50, 108, 84)"
states:
  button-hover:
    target: button
    state: hover
    filter: "brightness(0.96)"
  button-disabled:
    target: button
    state: disabled
    opacity: 0.6
  link-hover:
    target: link
    state: hover
    boxShadow: "rgba(26, 70, 53, 0.047) 0px 2px 5px"
    textDecoration: underline
  link-focus-visible:
    target: link
    state: focus-visible
    rounded: "{rounded.xs}"
    textDecoration: underline
  link-active:
    target: link
    state: active
    boxShadow: "rgba(24, 62, 43, 0.094) 0px 1px 3px inset"
  nav-hover:
    target: nav
    state: hover
    textColor: "{colors.accent-4}"
    backgroundColor: "rgb(239, 219, 173)"
  input-focus:
    target: input
    state: focus
    boxShadow: "rgb(232, 240, 235) 0px 0px 0px 3px"
    borderColor: "rgb(114, 150, 128)"
  card-hover:
    target: card
    state: hover
    boxShadow: "rgba(62, 70, 60, 0.106) 0px 22px 45px"
    transform: "translateY(-7px)"
  card-active:
    target: card
    state: active
    boxShadow: "rgba(32, 55, 43, 0.08) 0px 4px 12px"
    transform: "translateY(0px)"
  other-hover:
    target: other
    state: hover
    transform: "scale(1.04)"
  input-disabled:
    target: input
    state: disabled
    opacity: 0.45
breakpoints:
  - width: 375
    containerWidth: 335
    gridColumns: 1
    navLinksVisible: 0
    menuToggleVisible: true
    headingPx: 30
    bodyPx: 16
    sectionPaddingX: 0
  - width: 768
    containerWidth: 520
    gridColumns: 1
    navLinksVisible: 0
    menuToggleVisible: true
    headingPx: 30
    bodyPx: 16
    sectionPaddingX: 0
  - width: 1024
    containerWidth: 976
    gridColumns: 3
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 36
    bodyPx: 16
    sectionPaddingX: 0
  - width: 1280
    containerWidth: 1120
    gridColumns: 3
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 36
    bodyPx: 16
    sectionPaddingX: 0
  - width: 1440
    containerWidth: 1120
    gridColumns: 3
    navLinksVisible: 6
    menuToggleVisible: true
    headingPx: 36
    bodyPx: 16
    sectionPaddingX: 0
coverage:
  statesFound: 61
  gradientsFound: 5
  rolesUnassigned: 6
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: false
  semanticRampDeclared: false
---

# Design System Inspired by Daily Lexis

## 1. Visual Theme & Atmosphere

Daily Lexis presents a warm, educational aesthetic built on organic, flowing design language. The visual identity balances playfulness with professionalism, using soft color transitions, generous whitespace, and hand-crafted illustrations to create an inviting learning environment. The palette emphasizes natural earth tones and muted greens, evoking calm focus and growth. Decorative elements—rounded shapes, gradient backgrounds, and illustrated characters—soften the interface while maintaining clarity and legibility essential to language education. The typography combines bold, confident headings with approachable body text, reinforcing the brand's position as both authoritative and accessible.

**Key Characteristics**

- Soft, warm neutral background (`{colors.canvas}` — `#FBF8F1`) as primary surface
- Muted green as primary brand accent (`{colors.primary}` — `#2E7D5B`), signaling growth and learning
- Radial and linear gradients for subtle depth and visual interest
- Rounded corners applied selectively: pills (`{rounded.full}`) for badges, moderate rounding (`{rounded.xs}` to `{rounded.md}`) for interactive elements
- Generous spacing creating breathing room around content
- Illustrated, character-driven visual language in place of photography
- Multi-language support with color-coded language cards

## 2. Color Palette & Roles

### Primary

- **Primary / Brand** (`{colors.primary}` — `#2E7D5B`): Primary call-to-action buttons, active states, brand accent elements, and key interactive states. Represents growth and learning.
- **Brand Strong** (`{colors.link}` — `#235F46`): Inline links and secondary brand reinforcement; a deeper variant for hierarchy.

### Accent Colors

- **Accent / Ink** (`{colors.accent}` — `#303840`): Secondary accent and hero band backgrounds; primary text headings and strong ink color.
- **Decorative Coral** (`{colors.accent-1}` — `#DF7059`): Ornamental use in language card headers and decorative iconography; no semantic role.
- **Decorative Gold** (`{colors.accent-2}` — `#D3A349`): Ornamental use in language cards and accent borders; no semantic role.
- **Decorative Sage** (`{colors.accent-3}` — `#708F82`): Neutral accent for subtle decorative elements; no semantic role.
- **Decorative Brown** (`{colors.accent-4}` — `#684E20`): Warm decorative tone for text and borders in themed sections; no semantic role.
- **Decorative Cream** (`{colors.accent-5}` — `#F5E7C8`): Very light background tint for soft feature sections; no semantic role.

### Interactive

- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): Label and text color on brand-colored surfaces; ensures legibility on primary backgrounds.

### Neutral Scale

- **Body** (`{colors.body}` — `#405D4B`): Primary body text and content; warm mid-tone for readability.
- **Muted** (`{colors.muted}` — `#6B7280`): Captions, secondary text, and de-emphasized content.

### Surface & Borders

- **Canvas** (`{colors.canvas}` — `#FBF8F1`): Default page background; warm off-white base for all content.
- **Hairline** (`{colors.hairline}` — `#E8E2D8`): 1px borders and dividers between elements; subtle visual separation.
- **Neutral Surface** (`{colors.neutral-1}` — `#E5F1EB`): Subtle background tint for secondary surfaces and inactive states.

## 3. Typography Rules

### Font Family

**Primary: Manrope**
Fallback stack: `Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`

Used for display, headings, and captions. Weighted 500–800 for bold, confident voice.

**Secondary: DM Sans**
Fallback stack: `DM Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`

Used for body text, buttons, and smaller form elements. Weighted 400–700 for clear, approachable content.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display Large | Manrope | 50px | 800 | Not measured | −2.2px | Hero display; maximum emphasis |
| Display Medium | Manrope | 46px | 650 | Not measured | −2px | Alternate large display size |
| Display Small | Manrope | 40px | 800 | 1.2 | −1px | Secondary display headline |
| Heading Large | Manrope | 36px | 800 | 1.4 | −0.9px | Major section headings |
| Heading Medium | Manrope | 27px | 800 | 1.5 | −0.4px | Subsection headings; default heading size |
| Heading Small | Manrope | 18px | 800 | 1.6 | 0px | Card titles and smaller headings |
| Heading XS | Manrope | 16px | 700 | Not measured | 0px | Minimal heading emphasis |
| Body Medium | DM Sans | 16px | 400 | 1.95 | 0px | Primary body copy; default paragraph size |
| Body Small | DM Sans | 15px | 400 | 1.95 | 0px | Compact body text variant |
| Body XS | DM Sans | 14px | 400 | 1.65 | 0px | List items and secondary body |
| Caption Small | Manrope | 12px | 400 | 1.85 | 0px | Fine print; secondary captions |
| Caption XS | Manrope | 11px | 600 | Not measured | 0px | Smallest caption; metadata |
| Button | DM Sans | 11px | 700 | Not measured | 0px | All button labels; strong weight |

### Principles

- **Display sizes employ negative letter-spacing** (−2.2px to −1px) to create visual impact and tightness befitting headlines.
- **Manrope drives hierarchy**: bold, geometric forms command attention in headings and decorative contexts.
- **DM Sans ensures readability**: open, humanist proportions support long-form body text and interface labels.
- **Line height increases with size reduction**: captions at 1.85 and body at 1.95 ensure breathing room in smaller text.
- **All button text is 11px, weight 700**, maintaining consistent interaction affordance across the UI.

## 4. Component Stylings

### Buttons

**Primary**
- Background: `#2E7D5B` (`{colors.primary}`)
- Text Color: `#FFFFFF` (`{colors.on-primary}`)
- Font: DM Sans, 11px, weight 700
- Padding: 0px 12px
- Height: 38px
- Border: 1px solid `#2E7D5B`
- Border Radius: `{rounded.xs}` (9px)
- Hover: `brightness(0.96)` filter; background becomes `#1F5D3B`; border updates to `#1F5D3B`
- Disabled: opacity 0.45; no transform
- Focus Visible: 3px solid focus-ring outline

**Secondary / Filled (Light)**
- Background: `#FEE8C8` (light warm beige)
- Text Color: `#684E20` (warm brown)
- Font: DM Sans, 11px, weight 700
- Padding: 0px 12px
- Height: 38px
- Border: 1px solid `#E8D4A5`
- Border Radius: `{rounded.xs}` (9px)
- Hover: background `#F5E3B8`, border `#E8C881`, text color `#5C411A`; transform: `translateY(−1px)`
- Disabled: opacity 0.35
- Focus Visible: 2px solid focus-ring outline

**Tertiary / Neutral**
- Background: `#FFFDFAF` (near white)
- Text Color: `#303840` (`{colors.accent}`)
- Font: DM Sans, 11px, weight 700
- Padding: 0px 12px
- Height: 38px
- Border: 1px solid `#E8E2D8` (`{colors.hairline}`)
- Border Radius: `{rounded.xs}` (9px)
- Hover: background `#F5F3ED`
- Focus Visible: 3px solid focus-ring outline

### Cards & Containers

**Standard Card**
- Background: `#FFFDFAF` (near white)
- Text Color: `#303840` (`{colors.accent}`)
- Border: 1px solid `#E8E2D8` (`{colors.hairline}`)
- Border Radius: `{rounded.sm}` (18px)
- Padding: varies by type; often 0px for image-containing cards
- Font: DM Sans, 16px, weight 400
- Box Shadow: `rgba(35, 58, 44, 0.01) 0px 4px 6px 0px, rgba(35, 58, 44, 0.027) 0px 14px 36px 0px`
- Hover: box-shadow `rgba(32, 55, 43, 0.094) 0px 13px 30px`; transform `translateY(−2px)`; border-color `#82AD94`
- Active: box-shadow `rgba(32, 55, 43, 0.08) 0px 4px 12px`; transform `translateY(0px)`
- Focus Visible: 3px solid focus-ring outline

**Large Card (Feature)**
- Background: `#FFFDFAF`
- Text Color: `#303840`
- Border: 1px solid `#E8E2D8`
- Border Radius: `{rounded.md}` (22px)
- Padding: 42px 86.4px
- Font: DM Sans, 16px, weight 400
- Box Shadow: `color(srgb 0.439216 0.560784 0.509804 / 0.13) 0px 0px 0px 3px, color(srgb 0.439216 0.560784 0.509804 / 0.18) 0px 12px 30px 0px, color(srgb 0.439216 0.560784 0.509804 / 0.05) 0px 0px 32px 0px inset`

### Inputs & Forms

**Text Input (Focus)**
- Border Color: `#7EA18F` (green-tinted focus state)
- Box Shadow: `rgb(233, 240, 236) 0px 0px 0px 3px` (inset light green ring)
- Transition: smooth border and shadow change

**Input Disabled**
- Opacity: 0.45
- Cursor: not-allowed

### Navigation

**Primary Navigation Bar**
- Background: `#E5F1EB` (`{colors.neutral-1}`)
- Text Color: `#235F46` (`{colors.link}`)
- Border: 1px solid `#E8E2D8` (`{colors.hairline}`)
- Border Radius: 16px
- Padding: 25px 30px
- Font: DM Sans, 16px, weight 400
- Hover: background `#D0E9D8`; text color `#1F5D3B`; optional color shifts per language context
- Focus Visible: 3px solid focus-ring outline; border-color updates to `{colors.primary}`

### Badges

**Notification Badge (Filled)**
- Background: `#D93F35` (coral red)
- Text Color: `#FFFFFF`
- Border: 2px solid `#FFFDFAF`
- Border Radius: `{rounded.full}` (9999px)
- Font: Manrope, 10px, weight 800
- Line Height: 10px
- Padding: 0px 5px
- Box Shadow: `rgba(107, 23, 23, 0.2) 0px 2px 5px 0px`
- Width / Height: 18px (circle)

**Text Badge**
- Background: transparent
- Text Color: `#6B7280` (`{colors.muted}`)
- Border: none
- Font: Manrope, 14px, weight 600
- Padding: 0px
- Border Radius: 0px

### Language Selection Cards

**Language Card (Interactive)**
- Background: `#FFFDFAF`
- Border: 1px solid; color varies by language theme (coral, gold, sage, etc.)
- Border Radius: `{rounded.sm}` (18px)
- Padding: varies
- Hover: transform `rotate(−3deg) scale(1.04)` or `translateY(−4px)` depending on position; enhanced box-shadow; border-color brightened
- Focus Visible: 3px solid focus-ring outline; outline-color matches language theme

## 5. Layout Principles

### Spacing System

Base unit: **4px** (`{spacing.xxs}`)

Scale progression:
- `{spacing.xxs}` = 4px — micro-spacing inside badges or tight button padding
- `{spacing.xs}` = 8px — minimal gaps between inline elements
- `{spacing.sm}` = 12px — compact spacing within components
- `{spacing.md}` = 16px — default inner spacing and small section gaps
- `{spacing.lg}` = 20px — breathing room between content blocks
- `{spacing.xl}` = 24px — moderate section gaps
- `{spacing.xxl}` = 32px — larger separations between major sections
- `{spacing.xxxl}` = 36px — significant breathing room
- `{spacing.section}` = 40px — full section padding or gap
- `{spacing.band}` = 44px — largest section spacing; used in hero and major band separations

**Usage Context:**
- Buttons and form fields: `{spacing.md}` (16px) horizontal padding
- Card padding: `{spacing.xl}` to `{spacing.section}` (24–40px) outer margin
- Section gaps: `{spacing.section}` to `{spacing.band}` (40–44px) vertical
- Header/footer: `{spacing.xl}` (24px) vertical padding

### Grid & Container

- **Max container width**: 1120px (maintained from 1024px upward breakpoint)
- **Column strategy**: 1 column on mobile/tablet (375–768px); 3 columns on desktop (1024px+)
- **Content column width** (mobile to desktop): 335px → 520px → 976px → 1120px
- **Section patterns**: full-width hero at top; constrained content cards in 3-column grid below
- **Horizontal padding**: section-level padding applied via container, not individual elements (grid items flush)

### Whitespace Philosophy

Daily Lexis employs generous whitespace to reduce cognitive load and guide the learner's eye. Spacing increases with viewport size, never crowding elements. Section bands use gradient backgrounds to delineate areas without hard lines, maintaining visual softness. Margins around language cards and content blocks create clear visual hierarchy, preventing overwhelm. The warm canvas background (`#FBF8F1`) breathes alongside content, making negative space feel intentional rather than empty.

### Border Radius Scale

- `{rounded.none}` = 0px — images and large container backgrounds (no rounding on photos or full-width sections)
- `{rounded.xs}` = 9px — buttons, small interactive elements, badge containers (subtle rounding for tappability)
- `{rounded.sm}` = 18px — standard card containers and language cards
- `{rounded.md}` = 22px — large featured cards and prominent containers
- `{rounded.lg}` = 24px — feature-width containers, modals, and large overlays
- `{rounded.full}` = 9999px — notification badges, avatar circles, and pill-shaped buttons (when applicable)

### Border Widths

- **Thin**: 1px — used on card and button borders; hairline between elements
- **Medium**: 2px — notification badges (circular notification dots on profile icons)

## 6. Depth & Elevation

Depth in Daily Lexis is achieved through progressive shadow layering and subtle elevation transforms rather than flat design. The system uses three primary shadow scales, each tailored to a specific component role.

| Level | Treatment | Use |
|---|---|---|
| Flat / Base | No shadow; color-blocked surface | Canvas, backgrounds, disabled states |
| Card (Subtle) | `rgba(35, 58, 44, 0.01) 0px 4px 6px 0px, rgba(35, 58, 44, 0.027) 0px 14px 36px 0px` | Default card resting state; minimal lift |
| Card (Enhanced) | `color(srgb 0.439216 0.560784 0.509804 / 0.13) 0px 0px 0px 3px, color(srgb 0.439216 0.560784 0.509804 / 0.18) 0px 12px 30px 0px, color(srgb 0.439216 0.560784 0.509804 / 0.05) 0px 0px 32px 0px inset` | Large featured cards; prominent containers |
| Card (Hover) | `rgba(32, 55, 43, 0.094) 0px 13px 30px` | Interactive card on hover; increased lift |
| Modal / Overlay | `rgba(23, 32, 25, 0.05) 0px 8px 28px 0px` | Dialogs, modals, and fixed overlays; strong depth |
| Button (Accent) | `rgba(198, 63, 44, 0.2) 0px 4px 10px 0px` | Accent buttons (coral/orange); subtle shadow for CTAs |

**Shadow Philosophy:**
Layered, micro-contrast shadows create visual hierarchy without harsh contrast. Primary shadows use semi-transparent dark neutrals, maintaining harmony with the warm palette. Inset shadows on large cards reinforce container boundaries. Hover and active states progressively increase shadow intensity, providing tactile feedback. All shadows employ warm-tinted neutrals (`rgba(35, 58, 44, ...)`) to harmonize with the brand's earthy color foundation.

### Opacity Levels

- **75%** (0.75 / `opacity: 0.75`) — used for hover states on subtle elements; maintains visibility while signaling interaction
- **55%** (0.55 / `opacity: 0.55`) — decorative overlay opacity; background imagery or pattern depth
- **45%** (0.45 / `opacity: 0.45`) — disabled button states; clear visual de-emphasis
- **35%** (0.35 / `opacity: 0.35`) — secondary disabled state; minimal interactivity signal

### Z-index / Layering

- **Base**: z-index 2 — default stacking for standard content and components
- **Base (Alternative)**: z-index 3 — slightly elevated from base, for subtle depth differentiation
- Navigation and dropdowns follow a similar layering; modals and fixed overlays elevate above these defaults as required by interaction context

## 7. Do's and Don'ts

### Do

- **Use the primary brand green** (`{colors.primary}` — `#2E7D5B`) for all primary CTAs and affirmation states; it signals growth and learning.
- **Apply generous spacing** between content blocks; the system's warmth comes partly from breathing room. Minimum `{spacing.xl}` (24px) between sections.
- **Employ Manrope for all display and heading text**; its bold, geometric character reinforces brand confidence.
- **Layer shadows progressively**: use the subtle shadow for resting cards, enhanced shadow for featured content, and hover shadows for interaction feedback.
- **Maintain the warm canvas background** (`{colors.canvas}` — `#FBF8F1`) on all page surfaces; it is the system's visual anchor.
- **Use border-radius contextually**: pills (`{rounded.full}`) for badges only; moderate rounding (`{rounded.xs}` to `{rounded.md}`) for buttons and cards to maintain friendly, approachable tone.
- **Leverage the neutral surface color** (`{colors.neutral-1}` — `#E5F1EB`) for secondary containers and navigation backgrounds; it is subtle enough to recede without feeling cold.
- **Craft interaction states with transforms and shadow shifts**: `translateY(−1px)` or `translateY(−2px)` on hover combined with enhanced shadows create tactile feedback.
- **Keep body text in DM Sans, 14–16px**; its open letterforms ensure readability across all contexts, especially important for language learners.

### Don't

- **Avoid harsh shadows or high-contrast overlays**; the system prioritizes softness and approachability.
- **Do not invent new color roles** outside the defined accent and decorative set; stick to Primary, Accent, Link, and the neutral scale.
- **Never flatten borders to 0px on interactive components** like buttons and cards; the 1px hairline (`{colors.hairline}`) is essential to definition.
- **Do not increase button text size above 11px**; consistency across all buttons maintains interface coherence.
- **Avoid mixing Manrope and DM Sans at the same size/weight** in body contexts; Manrope is for headings and display only.
- **Do not nest cards inside cards without clear visual separation**; use spacing (`{spacing.section}` minimum) or background color shifts to delineate hierarchy.
- **Never disable hover states on interactive elements**; even secondary buttons must have a discernible `:hover` appearance.
- **Do not use focus states other than the 2–3px solid focus-ring outline**; keep focus-visible consistent across all interactive elements.
- **Avoid letter-spacing adjustments on body text**; only display sizes employ negative tracking (−2.2px, −2px, −1px as defined).
- **Do not override the gradient hero background** (`radial-gradient(circle at 50% 0px, rgb(255, 255, 255) 0px, rgb(250, 249, 244) 38%, rgb(243, 242, 234) 100%)`); it is a defining visual element.

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Viewport Width | Content Column | Grid Columns | Heading Size | Body Text | Section Padding-X | Key Changes |
|---|---|---|---|---|---|---|---|
| Mobile | 375px | 335px | 1 | 30px | 16px | Varies | Single-column layout; navigation toggles to menu |
| Tablet | 768px | 520px | 1 | 30px | 16px | Varies | Still single-column; wider content; same nav behavior |
| Desktop | 1024px | 976px | 3 | 36px | 16px | 0px | 3-column grid activates; navigation fully visible; max width constrained |
| Large Desktop | 1280px+ | 1120px | 3 | 36px | 16px | 0px | Container width caps at 1120px; maintains 3-column layout |

**Collapse Point:** Navigation menu toggle appears at 768px and below (0 visible nav links); fully visible navigation returns at 1024px (6+ visible links).

### Touch Targets

- **Minimum button height**: 38px (Consistent across all button styles; exceeds 44px mobile guideline in some contexts but maintained for visual harmony)
- **Minimum touch area**: 44px × 44px recommended for standalone interactive elements
- **Card hover zones**: Full card is interactive; minimum 358px width on mobile, expanding with viewport
- **Link/text area**: 16–18px text with 1px border or underline; 20px minimum vertical spacing between adjacent links

### Collapsing Strategy

1. **Mobile (375–768px)**:
   - Single-column layout for all card grids
   - Heading sizes reduce from 36px to 30px (display remains 40px where critical)
   - Navigation collapses to hamburger toggle; header links hidden
   - Section padding tightens; `{spacing.section}` (40px) margins reduce to `{spacing.lg}` (20px) vertically
   - Language cards stack vertically with full viewport width (minus safe margins)
   - Button full width or constrained by container

2. **Tablet (768px–1023px)**:
   - Remain single-column; content column widens to 520px
   - Headings still compact (30px)
   - Navigation still toggled; no visible links in header
   - Card widths increase but maintain single-column stacking
   - Body text remains 16px

3. **Desktop (1024px+)**:
   - 3-column grid activates
   - Heading sizes expand to 36px
   - Navigation fully visible; 6+ links displayed in header bar
   - Content column expands to 976px (1024px+) or caps at 1120px (1280px+)
   - Cards render side-by-side in 3-column layout
   - Spacing increases; `{spacing.band}` (44px) applied between major sections

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA & Brand Accent**: Primary (`#2E7D5B`)
- **Secondary Link Color**: Link (`#235F46`)
- **Background / Canvas**: Canvas (`#FBF8F1`)
- **Primary Text / Heading**: Accent (`#303840`)
- **Body / Paragraph Text**: Body (`#405D4B`)
- **Secondary / Muted Text**: Muted (`#6B7280`)
- **Borders & Dividers**: Hairline (`#E8E2D8`)
- **Secondary Surface / Navigation Background**: Neutral-1 (`#E5F1EB`)
- **White / Label on Primary**: On Primary (`#FFFFFF`)
- **Decorative Accents** (no semantic role): Coral (`#DF7059`), Gold (`#D3A349`), Sage (`#708F82`), Brown (`#684E20`), Cream (`#F5E7C8`)

### Iteration Guide

1. **Always use `#2E7D5B` for primary interactive CTAs** — buttons, form submissions, primary links. It is the only primary brand color and must not be substituted.

2. **Apply 1px `#E8E2D8` borders to all card, button, and form boundaries**; this hairline is the system's visual glue and differentiator.

3. **Layer typography via Manrope (display/headings) + DM Sans (body/buttons)**; never mix font families at the same size within a functional context.

4. **Apply shadow progressively**: resting cards use subtle shadow; hover cards gain enhanced shadow + `translateY(−2px)`; modals and overlays use the modal shadow.

5. **Maintain `#FBF8F1` canvas as the universal page background**; all content layers on top of this warm base.

6. **Use rounded corners contextually**: `{rounded.xs}` (9px) for buttons; `{rounded.sm}` (18px) for standard cards; `{rounded.full}` for badges only.

7. **Reserve the decorative colors** (`#DF7059`, `#D3A349`, etc.) **for visual interest only**; they have no semantic role and must not replace primary/accent/link colors.

8. **Ensure all interactive elements have a `:hover` state** combining shadow shift and/or subtle transform (`translateY(−1px)` to `−2px`) and/or color shift.

9. **Cap button text at 11px, weight 700 in DM Sans**; consistency across all button labels reinforces interaction paradigm.

10. **On all focus-visible states, apply a 2–3px solid outline in the brand primary or predefined focus-ring color**; never omit focus states.

## 10. Known Gaps

- **No semantic status colors**: The site does not declare or use explicit error, success, warning, or info colors. Any such palette roles are absent and should not be inferred from the decorative accent set.

- **6 unassigned decorative colors** (`#DF7059`, `#D3A349`, `#708F82`, `#684E20`, `#F5E7C8`): These have no measured semantic role and appear only as visual ornament in language card headers, badges, and illustration accents. No functional responsibility has been assigned; treat as brand flourish only.

- **Interaction state coverage partial**: Extracted data includes `:hover`, `:disabled`, `:focus-visible`, and `:active` states for buttons, cards, links, and inputs, but **not all states were present or measured** on all components. Absence of a state (e.g., `:focus` vs. `:focus-visible`) may indicate the site does not ship that variant; implement conservatively from what was measured.

- **Dark mode / theme variants not provided**: The extraction captured a single light theme only. If dark mode or additional themes exist, they were not analyzed and should not be inferred.

- **Animation and transition timing not measured**: No `transition-duration`, `animation-duration`, or easing values were extracted. Interaction feedback (e.g., hover shadow + transform) is documented as CSS properties but without temporal specifications; implement reasonable defaults (200–300ms easing: cubic-bezier).

- **Only one page analyzed**: This design system is built from the Daily Lexis homepage only. Interior surfaces (lesson pages, user account, authenticated flows) were not accessed and are not documented. Patterns observed on the homepage may not fully represent the complete product UI.

- **Overlay and modal styling limited**: While modal shadow is documented, modal structure, backdrop color, close button, and internal layout patterns are not comprehensively captured. Use the documented shadow and assume canvas-colored interior unless observed otherwise.

- **Icon and illustration system not documented**: The site uses hand-drawn illustrations and icons throughout. No icon grid, SVG templates, or illustration guidelines were extracted; these assets fall outside the scope of token extraction and should be sourced separately from the brand team.