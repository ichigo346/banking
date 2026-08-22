---
name: Horizon
description: One unified view of your money — wherever it lives.
colors:
  bank-blue: "#0179FE"
  bank-blue-light: "#4893FF"
  indigo-mid: "#6172F3"
  indigo-deep: "#3538CD"
  success-green: "#039855"
  success-green-dark: "#027A48"
  pink-accent: "#EE46BC"
  pink-deep: "#C11574"
  navy-brand: "#00214F"
  charcoal: "#344054"
  gray-body: "#475467"
  gray-muted: "#667085"
  gray-border: "#D0D5DD"
  gray-divider: "#EAECF0"
  gray-surface: "#FCFCFD"
  sky-auth: "#F3F9FF"
  white: "#FFFFFF"
  debit-surface: "#FFFBFA"
  credit-surface: "#F6FEF9"
typography:
  display:
    fontFamily: "IBM Plex Serif, Georgia, serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "32px"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "30px"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  card: "20px"
  panel: "12px"
  badge: "16px"
  input: "8px"
  button: "8px"
  avatar: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.bank-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.bank-blue-light}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bank-blue}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  nav-link-active:
    backgroundColor: "{colors.bank-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.input}"
    padding: "4px 12px"
  nav-link-default:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.input}"
    padding: "4px 12px"
  bank-card:
    backgroundColor: "{colors.bank-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "20px"
  input-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.input}"
    padding: "10px 14px"
  category-badge-success:
    backgroundColor: "{colors.credit-surface}"
    textColor: "{colors.success-green}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
  category-badge-debit:
    backgroundColor: "{colors.debit-surface}"
    textColor: "{colors.pink-deep}"
    rounded: "{rounded.badge}"
    padding: "2px 8px"
---

# Design System: Horizon

## Overview

**Creative North Star: "The Trusted Navigator"**

Horizon is built on calm authority. The interface never shouts, never decorates for its own sake — every color, every divider, every space exists to help a user understand where their money is and what to do next. The blue gradient that anchors the brand is not accent color for flair; it is a deliberate signal of reliability and forward momentum, used sparingly so it retains meaning when it appears.

The layout is structured and predictable. The left sidebar is a fixed landmark — always there, always quiet. The main content area opens wide and breathes. The right sidebar carries a compact personal summary so users see their own identity alongside their data. This tri-column architecture is never disrupted; orientation is a product promise, not a layout detail.

Depth is purely tonal. Surfaces at rest are flat; hierarchy is communicated through lightness steps — the near-white page ground (`#FCFCFD`), the white panels, the blue-tinted authentication canvas (`#F3F9FF`). Shadows exist in the token library for rare interactive moments (card hover, profile lift) but are not used to layer static surfaces. The system rewards careful reading, not visual spectacle.

**Key Characteristics:**
- Blue gradient is the sole primary accent; used on active nav items, primary buttons, and bank card surfaces only
- Two typefaces with strict role separation: IBM Plex Serif for brand marks, Inter for all functional UI
- Tonal depth only; shadows reserved for interactive and floating states
- Debit/credit color coding (warm-red tint vs. soft-green tint) is the only place color carries semantic meaning in data rows
- All authenticated screens share the same shell; orientation is always maintained

## Colors

A blue-dominant palette anchored in trust, with green and pink reserved strictly for transaction semantics.

### Primary
- **Horizon Blue** (`#0179FE`): The sole primary accent. Used on the bank gradient (buttons, active nav, bank cards, Plaid link CTA). Its gradient end — **Sky Reach** (`#4893FF`) — is never used standalone; it only appears as the gradient terminus.

### Secondary
- **Indigo Mid** (`#6172F3`): Category chip accent, alternative badge accents. Keeps visual interest in data-dense tables without competing with the primary gradient.
- **Indigo Deep** (`#3538CD`): Hover and pressed state for indigo-accented elements.

### Tertiary
- **Signal Green** (`#039855`): Credit amounts and success states. Used only in transaction rows and success confirmation surfaces.
- **Signal Green Dark** (`#027A48`): Hover state for green elements; also used in success-900 (`#054F31`) for text in dark success badges.
- **Blush Accent** (`#EE46BC`): Category badge for specific spend categories (e.g. Food & Drink, Travel). Never used for primary CTAs.
- **Blush Deep** (`#C11574`): Debit amount text and error-adjacent states in transaction rows.

### Neutral
- **Navy Brand** (`#00214F`): Brand wordmark color for "Horizon" in sidebar and auth header. Not used for body text.
- **Charcoal** (`#344054`): Primary text on white surfaces — page headings, table cell names, form labels.
- **Stone Body** (`#475467`): Secondary body text, sidebar labels, subtext.
- **Muted Gray** (`#667085`): Placeholder text, deemphasized metadata.
- **Border Gray** (`#D0D5DD`): Input and card borders. The lightest border that still registers on white.
- **Divider Gray** (`#EAECF0`): Section dividers, table header bottom borders.
- **Page Ground** (`#FCFCFD`): The background of all authenticated app surfaces (My Banks, Transaction History, Payment Transfer). Not pure white — the slight warmth reduces eye fatigue in data-dense views.
- **Auth Canvas** (`#F3F9FF`): The right-panel background on the sign-in/sign-up screen. Its blue tint reinforces the brand in the only screen a new user sees before entering the product.

### Named Rules
**The Blue Gradient Rule.** The `bank-gradient` (`#0179FE → #4893FF`) is the only background allowed on primary buttons, active nav items, bank cards, and the Plaid CTA. It never appears on decorative surfaces, backgrounds, or section dividers. Its rarity is its authority.

**The Semantic Color Rule.** Green is for credit and success only. Warm-pink/red is for debit and error only. Neither color may appear in navigation, buttons, or decorative elements.

## Typography

**Display Font:** IBM Plex Serif (Georgia, serif)
**Body Font:** Inter (system-ui, sans-serif)

**Character:** IBM Plex Serif carries the brand — precise, institutional, slightly editorial — and appears only in wordmarks and balance figures to give them weight. Inter runs everything else: clean, legible at any size, invisible in the best way.

### Hierarchy
- **Display** (bold 700, 26px/32px): "Horizon" wordmark in sidebar and auth header. One instance per surface.
- **Headline** (semibold 600, 24px/30px–36px/44px): Page titles ("Welcome", "Transaction History", "Manage my Banks"). One per page.
- **Title** (semibold 600, 18px/22px–20px/24px): Section headers within a page ("My Banks", "Your cards", "Top categories", "Recent Transactions").
- **Body** (regular 400, 14px/20px–16px/24px): All descriptive text, table cell content, subtext, form helper copy. Line length should not exceed 75ch in reading contexts.
- **Label** (medium 500, 12px/16px, +0.01em tracking): Category badges, timestamps, card masks, chip text. Uppercase is never used.

### Named Rules
**The Two-Font Rule.** IBM Plex Serif is the brand voice; Inter is the product voice. No third typeface is permitted. IBM Plex Serif appears only in wordmarks (`sidebar-logo`) and financial figures on bank cards; all other UI text is Inter.

## Layout

Horizon uses a fixed three-column shell on desktop: a collapsible left sidebar (fixed width `355px` on 2xl, icon-only on xl and below), a fluid main content area, and a fixed right sidebar (`355px`, hidden below xl). The main content column handles all scrolling independently via `overflow-y-scroll`; the sidebars are sticky and never scroll with content.

Content within the main column uses 8-column implicit grid behavior via flexbox. Page-level padding is `px-5 sm:px-8 py-7 lg:py-12`. Section spacing within a page uses a consistent `gap-8` rhythm (32px). Sub-section spacing uses `gap-4` to `gap-6`.

On screens below `md` (768px), the left sidebar hides and is replaced by a mobile nav header (`h-16`, full-width, renders a sheet-based drawer). The right sidebar is hidden below `xl` (1280px). The app is usable on mobile but optimised for desktop.

**The Three-Column Rule.** The shell layout is invariant across all authenticated routes. No page may add a fourth column, remove the sidebar, or break the established column widths. Orientation is a product promise.

## Elevation & Depth

Horizon is a tonal system. Surfaces are flat at rest and distinguished solely by background color lightness. The depth hierarchy from back to front:

1. **Page ground** — `#FCFCFD` (near-white, all content backgrounds)
2. **Panel / card surface** — `#FFFFFF` (white; sidebar, table header `#F9FAFB`, modal backgrounds)
3. **Raised interactive** — active blue gradient (nav items, primary buttons, bank cards)

Shadows exist in the token library but serve specific interactive purposes only:

### Shadow Vocabulary
- **form** (`0px 1px 2px 0px rgba(16,24,40,0.05)`): Applied to primary buttons and form fields. Barely perceptible — exists to give form controls tactile definition against white backgrounds.
- **chart** (`0px 1px 3px rgba(16,24,40,0.10), 0px 1px 2px rgba(16,24,40,0.06)`): Applied to the Total Balance container. Separates the chart panel from the page ground.
- **profile** (`0px 12px 16px -4px rgba(16,24,40,0.08), 0px 4px 6px -2px rgba(16,24,40,0.03)`): Applied to the circular profile avatar in the right sidebar. Its size is deliberate — the avatar floats above the gradient-mesh profile banner.
- **creditCard** (`8px 10px 16px 0px rgba(0,0,0,0.05)`): Applied to bank cards. Gives the stacked card pattern a subtle sense of physical layering.

### Named Rules
**The Flat-By-Default Rule.** Static content surfaces (sections, tables, list rows, page backgrounds) carry no shadow. Shadows appear only on interactive components (buttons, inputs) or explicitly floating elements (profile avatar, bank cards, data panels). If a surface doesn't move or float, it doesn't shadow.

## Shapes

Horizon uses a graduated radius vocabulary — larger radii for large surfaces, tighter for controls.

- **Bank cards** (20px, `rounded-[20px]`): The most distinctive shape in the system. The generous radius, combined with the blue gradient and card texture lines, makes cards feel physical.
- **Panels and containers** (12px, `rounded-xl`): Used on the Total Balance box, transaction account panel on Transaction History, and other data containers.
- **Buttons and inputs** (8px, `rounded-lg`): Consistent across all form controls and action buttons. Gently curved — approachable but not playful.
- **Category badges and chips** (16px, `rounded-2xl`): Pill-adjacent; the high radius makes badges read as tags, not boxes.
- **Avatars** (full circle, `rounded-full`): Profile image container in the right sidebar footer and right-sidebar profile section.

No sharp (0px) corners appear in the UI. Brutalist or square treatments would conflict with the "Trusted Navigator" north star.

**The No-Sharp Rule.** Every interactive surface, card, badge, and container has a border-radius of at least 8px. Zero-radius corners are not permitted anywhere in the Horizon UI.

## Components

### Buttons

**Character:** Purposeful and understated. The primary button is the bank gradient — confident, not decorative. Ghost variant used for secondary actions and link-style navigation.

- **Shape:** 8px radius (`rounded-lg`)
- **Primary:** Blue gradient background (`#0179FE → #4893FF`), white text, semibold 16px. Padding `10px 16px`. Box-shadow: `form`. Full-width in form contexts (`w-full`).
- **Hover / Focus:** Opacity shift or subtle gradient brightening. Focus ring via `focus-visible:ring-2` in `bankGradient` color. Loading state shows `Loader2` spinner inline.
- **Ghost / Link:** Transparent background, `bankGradient` text color (`#0179FE`), no border. Used for auth footer sign-in/sign-up toggles and sidebar "Add Bank" links.

### Cards — Bank Card

**Character:** The signature component. Feels physical in a flat digital UI — gradient surface, card texture overlay, Paypass and Mastercard marks, account mask. Clicking navigates to transaction history for that account.

- **Shape:** 20px radius, `h-[190px] w-full max-w-[320px]`
- **Background:** Full-bleed `bank-gradient` (`linear-gradient(90deg, #0179FE 0%, #4893FF 100%)`), with a `lines.png` texture overlay at absolute position
- **Layout:** Two-column flex — left content column (gradient + text), right icon column (Paypass + Mastercard)
- **Text:** All white; account name in 16px semibold, balance in IBM Plex Serif bold, card mask and user name in 12px semibold
- **Shadow:** `creditCard` (`8px 10px 16px rgba(0,0,0,0.05)`)
- **Stacking:** On the right sidebar, a second card is absolutely positioned behind the first at 90% width, offset 32px down, creating a physical stack effect

### Inputs / Form Fields

**Character:** Clean and unobtrusive. Inputs do not announce themselves — they recede until focused.

- **Style:** White background, `#D0D5DD` border, 8px radius, 16px text, `#6B7280` placeholder
- **Shadow:** `form` (`0px 1px 2px rgba(16,24,40,0.05)`)
- **Focus:** Border shifts to `bankGradient` blue via browser default or custom focus ring; no fill change
- **Error:** Red-500 text below field via `FormMessage` (`text-12`)
- **Disabled:** Reduced opacity (shadcn/ui default)

### Navigation — Left Sidebar

**Character:** Always present, never dominant. The sidebar is white on a white-bordered edge. Nav items are invisible at rest and activate with the full bank gradient.

- **Default state:** Transparent background, `#344054` icon + label (16px semibold Inter). Icon: 24×24px, full opacity.
- **Active state:** `bank-gradient` background, white icon (brightness-[3] invert), white label text. 8px radius on the link row.
- **Width:** Full `355px` on 2xl; collapses to icon-only on xl and below (label hidden via `max-xl:hidden`)
- **Footer:** User avatar (initials in gray circle) + name + email + logout icon. Collapses symmetrically with sidebar width.

### Category Badges

**Character:** Semantic at a glance. The dot + label pattern reads instantly in a data-dense table without adding visual weight.

- **Style:** Pill shape (16px radius), colored border + tinted background, 2px horizontal dot, 12px medium text
- **Variants:** Each transaction category (Food & Drink, Travel, Transfer, etc.) maps to a specific `borderColor`, `backgroundColor`, `textColor`, and `chipBackgroundColor` from `transactionCategoryStyles`
- **Status badges:** "Processing" and "Success" use the same badge pattern, applied to the Status column in the transactions table

### Transaction Table

**Character:** A ledger, not a feed. Dense, scannable, row-striped by transaction type. No hover animations — this is a reference surface, not an interactive one.

- **Header row:** `#F9FAFB` background, gray-500 header text, border-bottom divider
- **Debit rows:** `#FFFBFA` background (warm tint); amount text in warm-pink error color
- **Credit rows:** `#F6FEF9` background (cool green tint); amount text in `#039855`
- **Columns:** Transaction name (truncated at 250px), Amount, Status (badge), Date, Channel, Category (badge)

## Do's and Don'ts

### Do:
- **Do** use the blue gradient (`#0179FE → #4893FF`) exclusively for primary actions, active nav items, and bank card surfaces. Its restraint is the brand.
- **Do** use IBM Plex Serif bold only for the "Horizon" wordmark and bank card balance figures.
- **Do** maintain the three-column shell layout across all authenticated routes.
- **Do** use tonal background shifts (`#FCFCFD` → `#FFFFFF`) to separate surface layers; never add a shadow to a static panel.
- **Do** apply the `form` shadow to buttons and inputs and `chart` shadow to data panel containers.
- **Do** use Signal Green (`#039855`) for credit amounts and Blush Deep (`#C11574`) for debit amounts — these are the only color-coded data signals.
- **Do** keep Inter at 14px/20px for all body copy. Scale up to 16px only for form inputs and prominent secondary text.

### Don't:
- **Don't** use the blue gradient as a page background, section fill, or decorative element.
- **Don't** introduce a third typeface. IBM Plex Serif for brand marks, Inter for everything else — no exceptions.
- **Don't** add shadows to static, non-interactive surfaces. Tonal layering only.
- **Don't** use green or pink/red outside of transaction amount and status contexts.
- **Don't** break the sidebar at any authenticated route. The three-column shell is invariant.
- **Don't** use uppercase type — not for labels, badges, nav items, or headers.
- **Don't** round corners to less than 8px on any interactive element or card.
