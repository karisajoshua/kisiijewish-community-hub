# Plan: Mega Menu Anchors + Redesigned Donate Page

## Part 1 — Mega menu deep-links to sections

Right now every sub-link in the mega menu (e.g. About → "Our Story", "Mission & Vision", "Leadership"…) points to the same page root (e.g. `/about`). I'll change them to anchor URLs (`/about#mission`, `/about#leadership`, etc.) and add matching `id="..."` attributes on each section so clicking a sub-link scrolls directly to that section.

**Files updated:**
- `src/components/layout/Navbar.tsx` — change every `to:` in `megaMenu` sub-links from `/page` to `/page#section-id`.
- `src/pages/About.tsx` — add `id="story"`, `id="mission"`, `id="leadership"`, `id="history"`, `id="values"` on the corresponding sections.
- `src/pages/Events.tsx` — `id="upcoming"`, `id="past"`, `id="holidays"`, `id="rsvp"`.
- `src/pages/Programs.tsx` — `id="education"`, `id="youth"`, `id="cultural"`, `id="support"`, `id="volunteer"`.
- `src/pages/News.tsx` — `id="latest"`, `id="announcements"`, `id="newsletter"`.
- `src/pages/Gallery.tsx` — `id="albums"`, `id="videos"`, `id="submit"`.
- `src/pages/Membership.tsx` — `id="join"`, `id="benefits"`, `id="renew"`, `id="directory"`.
- `src/pages/Donate.tsx` — `id="ways"`, `id="instructions"`, `id="sponsor"`, `id="faq"` (after redesign below).
- `src/pages/Contact.tsx` — `id="message"`, `id="visit"`, `id="leadership"`, `id="prayer"`.
- `src/App.tsx` — add a small `ScrollToHash` component (uses `useLocation`, scrolls to `#hash` on route change with `scroll-margin-top` for the sticky navbar) so anchor links work even when navigating between pages.

Add `scroll-mt-28` (matches `h-28` navbar height) on each anchor section so headings aren't hidden under the sticky header.

## Part 2 — Redesigned Donate page (UJA-style)

Replace the current Donate page layout with the design from the screenshot: clean white background, centered headline, three large pill-style toggle buttons (**Make a One-Time Gift**, **Make a Monthly Gift**, **Send a Card**), and on click reveal a multi-step form below — exactly mirroring the PDF flow.

### Layout
```text
[ Hero: "Donate Today" + supporting paragraph ]

[  ☐ ONE-TIME GIFT    ☐ MONTHLY GIFT    ☐ SEND A CARD  ]   ← toggle pills

[ Selected tab content appears below in a card ]
```

### Tab 1 — One-Time Gift (from One_time_donation.pdf)
- **Step 1 — Amount:** preset chips `KSh 1,000 / 3,000 / 5,000 / 10,000 / 20,000` + "Other" with min input.
- **Step 2 — Donor info:** Personal/Company toggle, First/Last name, Address, City, Country (default Kenya), County/State, Postal code, Phone, Email, optional Account number, "Tribute in honour/memory" Yes/No.
- **Step 3 — Payment method:** radio choices for **M-Pesa**, **Bank transfer**, **PayPal** (we don't process cards directly — selecting one shows the matching instructions pulled from the existing `donate_info` site setting). A "Submit pledge" button records the donor's intent in a new `donations` table and shows a thank-you panel with reference instructions.

### Tab 2 — Monthly Gift (from monthly_gift.pdf)
- Same three-step structure with monthly amount chips `KSh 500 / 1,000 / 2,000 / 5,000 / 10,000`.
- Important notice block: "To pause or cancel, contact us" + treasurer email/phone (pulled from site settings).
- Saves to `donations` with `frequency = 'monthly'`.

### Tab 3 — Send a Card
- Simple form: recipient name + email, sender name + email, occasion (dropdown), personal message, donation amount.
- Saves to `donations` with `is_tribute = true` and tribute fields.

### Footer block (always visible)
The fine-print box from the screenshot: tax-receipt note, contact phone/email for questions — content editable from admin via `donate_info` setting.

### Backend
New table `donations` (admins read; anyone insert with validation):
- `id`, `created_at`
- `donation_type` ('one_time' | 'monthly' | 'tribute_card')
- `amount`, `currency` (default 'KES')
- `frequency` ('once' | 'monthly')
- `donor_type` ('personal' | 'company'), donor name/email/phone/address fields
- `payment_method` ('mpesa' | 'bank' | 'paypal' | 'pending')
- `is_tribute` boolean, tribute name, tribute message, recipient email
- `status` default 'pending'
- `notes`

RLS: public INSERT with field-length checks; admins SELECT/DELETE.

New admin page `src/pages/admin/DonationsAdmin.tsx` to view/manage submissions, added to the admin sidebar.

## Technical details

- Tab state managed with `useState<'one_time' | 'monthly' | 'card'>` + URL hash sync (`#one-time`, `#monthly`, `#card`) so mega-menu deep-links can open a specific tab.
- Form built with `react-hook-form` + `zod` (already in stack via shadcn `Form`).
- Amount chips toggle a controlled value; "Other" reveals a number input.
- After successful submit, the form is replaced by a confirmation card showing: reference number (last 8 of `id`), chosen payment method instructions, and a "Make another gift" button.
- Realtime invalidation of `donations` query on the admin list using existing `useRealtimeInvalidate` hook.
- Pill toggle styled with `bg-sky-soft` (inactive) and `bg-sky text-sky-foreground` (active), matching the screenshot's light-blue look.

## Files created
- `supabase/migrations/<ts>_donations.sql`
- `src/pages/admin/DonationsAdmin.tsx`
- `src/components/donate/DonateTabs.tsx`
- `src/components/donate/OneTimeForm.tsx`
- `src/components/donate/MonthlyForm.tsx`
- `src/components/donate/SendCardForm.tsx`
- `src/components/ScrollToHash.tsx`

## Files edited
- `src/pages/Donate.tsx` (full rewrite around new tabs)
- `src/components/layout/Navbar.tsx` (anchor URLs in megaMenu)
- `src/pages/About.tsx`, `Events.tsx`, `Programs.tsx`, `News.tsx`, `Gallery.tsx`, `Membership.tsx`, `Contact.tsx` (section IDs + `scroll-mt-28`)
- `src/App.tsx` (mount `ScrollToHash`)
- `src/pages/admin/AdminLayout.tsx` (add Donations nav item)
- `src/integrations/supabase/types.ts` (auto-regenerated)
