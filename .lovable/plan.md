## Goal

Three coordinated changes:
1. Use the uploaded "Kisii Jewish Community" logo image in the navbar and footer (replacing the gold star + text mark).
2. Remove the gold accent color throughout the site — replace it with the existing community blue (`sky` / `primary`) so the palette becomes blue + navy + neutrals.
3. Convert the top navigation into a mega-menu where every primary item opens a rich dropdown panel with sub-links and a short description.

## What the user will see

**Navbar**
- The uploaded logo (image) replaces the gold star + text on the left of every page. Footer also uses the same logo.
- Hovering or focusing a top-level item (About, Events, Programs, News, Gallery, Membership, Donate, Contact) opens a wide mega-menu panel below the bar with grouped sub-links + a short blurb. Home stays a simple link. On mobile the dropdowns become collapsible accordions inside the existing slide-out menu.
- The "Join Us" CTA button changes from gold to community blue.

**Color palette**
- All gold/amber accents (badges, icon chips, dividers, hover states, "Send a card" button, hero accent line, footer headings, link hovers, timeline dots, value icon tiles, program icon tiles, etc.) become blue (`sky` / `primary`).
- The gold gradient utilities (`gradient-gold`, `shadow-gold`) are remapped to a blue equivalent so existing class usages keep working without touching every file.

## Mega-menu content map

```text
About        → Our Story · Mission & Vision · Leadership · History · Values
Events       → Upcoming Events · Past Events · Holidays & Shabbat · Register / RSVP
Programs     → Education · Youth · Cultural · Community Support · Volunteer
News         → Latest News · Announcements · Newsletter
Gallery      → Photo Albums · Videos · Submit Photos
Membership   → Become a Member · Member Benefits · Renew · Member Directory
Donate       → Ways to Give · Donation Instructions · Sponsor a Program · FAQ
Contact      → Get in Touch · Visit Us · Leadership Contacts · Prayer Requests
```
Each panel: 2-column grid of sub-links with a one-line description per link, plus a small promo block on the right (e.g. featured event/news thumbnail or CTA to the section's main page).

## Technical changes

1. **Logo asset**
   - Copy `user-uploads://kisii_-_Edited.png` to `src/assets/logo-kisii-jewish.png`.
   - New `src/components/Logo.tsx` that imports the asset and renders it at appropriate sizes (variant prop for navbar vs footer; navbar uses dark version on light bg, footer wraps it on the navy bg — we'll display as-is since it's blue-on-transparent which works on both).

2. **Color de-gold**
   - `src/index.css`: change `--accent` to match `--sky` (or `--primary`), repoint `--accent-soft` to `--sky-soft`, replace the `--gradient-gold` definition with a blue gradient, and `--shadow-gold` with a blue-tinted shadow. This auto-updates ~all `text-accent`, `bg-accent`, `gradient-gold`, `shadow-gold` usages without per-file edits.
   - Quick sweep for any hardcoded gold/amber Tailwind classes in pages (none expected — usage is via tokens).

3. **Mega-menu Navbar (`src/components/layout/Navbar.tsx`)**
   - Replace the current flat link list with shadcn `NavigationMenu` (`@/components/ui/navigation-menu`, already in project).
   - Define a `megaMenu` config array (label → groups of {to, title, desc}, plus optional feature card).
   - Each `NavigationMenuTrigger` opens a `NavigationMenuContent` panel (~600–720px wide) styled with sharp edges (matches global radius=0), navy text on white, blue hover states.
   - Mobile: keep existing slide-out, but render each top item as an `Accordion` with its sub-links inside.
   - Replace the gold "Join Us" button with `bg-sky` / `bg-primary`.

4. **Footer (`src/components/layout/Footer.tsx`)**
   - Replace the gold star + text block with the `<Logo variant="footer" />`.
   - Footer headings change from `text-accent` to `text-sky` (will happen automatically via token remap, no edit needed).

## Out of scope

- No changes to page content, hero copy, or routes themselves.
- Not creating new pages for sub-links that don't exist yet — sub-links route to the closest existing page (e.g. "Member Benefits" → `/membership`, "Sponsor a Program" → `/donate`). This can be expanded later.
- Not touching the global `border-radius: 0` rule.
