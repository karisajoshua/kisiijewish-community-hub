
# Kisiijewish Community Website — Build Plan

A warm, modern, mobile-friendly community site inspired by jewishtoronto.com's structure, with a real backend so events, news, gallery, RSVPs, and membership applications are all live and manageable.

## Design System

- **Palette**: Navy (primary), gold (accent), soft beige (background), white (surface). All defined as HSL tokens in `index.css` and Tailwind.
- **Typography**: Serif display headings (Playfair Display) + clean sans body (Inter) for a warm, dignified feel.
- **Components**: Rounded cards, soft shadows, subtle gold dividers, smooth fade/slide animations on scroll, sticky translucent nav with blur.
- **Imagery**: Tasteful warm community placeholder photos (Unsplash-style) ready to swap.
- **Accessibility**: WCAG-AA contrast, keyboard navigation, semantic HTML, focus rings.

## Site Structure (9 pages + admin)

```text
/                  Home
/about             About Us
/events            Events (upcoming + past gallery)
/programs          Programs
/news              News & Announcements (search + categories)
/news/:slug        News post detail
/gallery           Gallery (albums + lightbox)
/membership        Membership info + form
/donate            Donations info + areas of impact
/contact           Contact form + map placeholder + socials
/auth              Login / Sign up (admin access)
/admin             Admin dashboard (events, news, gallery, submissions)
```

Sticky nav on every page; consistent footer with quick links, contact, and social icons.

## Page Details

**Home**: Hero with name + welcome + 3 CTAs (Join Us / View Events / Contact). Featured announcements strip. Upcoming events (3 cards from DB). About preview. Programs preview grid. Gallery preview. Join/donate CTA band. Footer.

**About**: Mission & vision, history timeline, leadership cards (photo/name/role), values grid.

**Events**: Filterable upcoming list with date/time/location/description and RSVP button (modal form). Past events photo gallery section.

**Programs**: 5 category sections (Education, Youth, Cultural, Community Support, Volunteer) with descriptive cards and "Get involved" links.

**News**: Featured post hero, search bar, category filter chips, paginated post grid, individual post pages.

**Gallery**: Album grid → click to open album with lightbox/preview.

**Membership**: Benefits grid + application form (name, email, phone, location, message).

**Donate**: Impact areas (cards), suggested amounts displayed, bank/contact instructions block, "Contact treasurer" CTA. No payment processing.

**Contact**: Form (name, email, subject, message), email/phone/address block, embedded map placeholder (static iframe), social icons.

## Backend (Lovable Cloud)

Tables with Row-Level Security:
- `events` — title, description, date, time, location, image, is_past
- `event_rsvps` — event_id, name, email, phone, guests, notes
- `news_posts` — title, slug, excerpt, content, category, image, featured, published_at
- `gallery_albums` — title, description, cover_image, event_date
- `gallery_photos` — album_id, image_url, caption
- `membership_applications` — name, email, phone, location, message, status
- `contact_messages` — name, email, subject, message
- `announcements` — message, link, active
- `user_roles` (separate table) — user_id, role enum (`admin`, `member`) + `has_role()` security-definer function

**Public access**: read events/news/gallery/announcements; insert into RSVP, membership, and contact tables.
**Admin only**: full CRUD on all content tables; view submissions.

## Auth & Admin

- Email/password + Google sign-in via Lovable Cloud.
- `/auth` page (login + signup, auto-confirm enabled for fast testing).
- `/admin` protected route — checks `has_role(uid, 'admin')`.
- Admin dashboard tabs: **Events** (create/edit/delete, mark past), **News** (rich text), **Gallery** (albums + photo upload to Storage), **Submissions** (RSVPs, membership apps, contact messages).
- First user can be promoted to admin via a one-time SQL helper noted in the README.

## Forms & Validation

All forms use `react-hook-form` + `zod` schemas with length limits, email validation, and trimmed strings. Toast feedback on success/error. Server-side RLS enforces who can write what.

## Technical Notes

- React Router for all routes; lazy-load admin bundle.
- TanStack Query for data fetching/caching with optimistic updates in admin.
- Tailwind tokens only — no hardcoded colors in components.
- Image storage via Lovable Cloud Storage bucket `gallery` (public read).
- Smooth scroll animations via Tailwind transitions + IntersectionObserver hook.
- Fully responsive: mobile hamburger menu, tablet 2-col grids, desktop 3-4 col.

## What you'll get to swap later

Placeholder text for mission, history, leadership names/photos, program descriptions, and gallery images — all easy to edit through the admin panel or directly in seed data.
