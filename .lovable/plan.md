# Three Visual Upgrades

Three focused enhancements: richer mega menu, illustrated "Shows Up" accordion, and an animated rotating card stack on the "Share a moment" section.

---

## 1. Mega Menu Thumbnails (Navbar)

**File:** `src/components/layout/Navbar.tsx`

- Extend each `MegaItem` in the `megaMenu` array with an `image` field (Unsplash URL matching the section: about, events, programs, news, gallery, membership, donate, contact).
- Restructure the dropdown panel grid from `[1fr_240px]` to `[1fr_280px]`. Replace the current right-side solid sky panel with a **stacked card**:
  - Top: thumbnail image (aspect 4/3, rounded, object-cover)
  - Bottom: sky-colored label + blurb + "Explore" button (current content preserved)
- Keep desktop-only (mega menu is already hidden on mobile, no mobile change needed).

---

## 2. "A Community That SHOWS UP" — Image + Paragraph per Accordion Item

**File:** `src/pages/Home.tsx` (priorities accordion, ~lines 320–334)

- Extend `prioritiesFallback` items with two new fields: `description` (a longer paragraph, distinct from the short `body` label use) and `image` (representative photo URL). Keep `label` and `body` for backward compatibility with CMS data.
- When an accordion item is opened, the `AccordionContent` becomes a 2-column grid:
  - **Left:** the paragraph (`body` or new `description`)
  - **Right:** rounded image thumbnail (aspect 4/3, shadow-card)
- On mobile, stacks vertically (image first, then text).
- The `useSetting("priorities", ...)` fallback object will include the new fields so the section renders richly even before the admin adds CMS data. Existing CMS entries that lack `image` will gracefully fall back to a default Unsplash image per index.

---

## 3. "Share a Moment" — Rotating Color-Changing Card Stack

**File:** `src/pages/Home.tsx` (right column, ~lines 379–390)

Replace the two static rotated cards with an animated stack of 4–5 greeting cards that auto-cycle every ~2.5 seconds.

- Define a local array of card objects: `{ message, palette }` where palette picks from existing design tokens (`bg-sky` / `text-sky-foreground`, `bg-accent-soft` / `text-primary`, `bg-sky-soft` / `text-primary`, `bg-primary` / `text-primary-foreground`, `bg-secondary` / `text-foreground`).
- Use a `useState` index + `useEffect` `setInterval` to advance the active card.
- Render all cards absolutely positioned in the same container; the active card is centered/upright with shadow-soft, the next two are visible behind it slightly rotated and scaled down (stack effect). Use `transition-all duration-700 ease-out` for color, rotation, scale, and opacity transitions.
- Preserve the existing left column (heading, paragraph, Send a card button) unchanged.

---

## Technical Notes

- No new dependencies; uses existing Tailwind tokens (`sky`, `sky-foreground`, `sky-soft`, `accent-soft`, `primary`, `shadow-card`, `shadow-soft`, `transition-smooth`).
- No database / CMS schema changes. The priorities admin already stores arbitrary JSON via `site_settings`, so future admin-added `image` and `description` fields will flow through automatically once the `HomepageAdmin` form is extended (out of scope here — fallback covers it).
- Animation uses simple `setInterval` cleanup in `useEffect` — no extra animation libs.
