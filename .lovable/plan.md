# Live CMS + Realtime Updates

Right now the admin dashboard saves edits to the database, but the public pages don't read from those tables — they show hardcoded text and images. On top of that, even the components that *do* read live data (events, news, announcements) only refetch on page load. We'll fix both: wire every public surface to the CMS, and add realtime so changes appear within ~1 second of saving.

## What you'll get

- Edits in `/admin/homepage`, `/admin/site-settings`, `/admin/footer` immediately update the public site
- Adding/editing/deleting events, news, announcements, gallery albums updates public pages instantly — no refresh
- Multiple browser tabs (e.g. admin in one, site in another) stay in sync

## Changes

### 1. Realtime infrastructure

- Enable Postgres realtime on the CMS tables: `site_settings`, `events`, `news_posts`, `announcements`, `gallery_albums`, `gallery_photos`, `profiles`
- New hook `useRealtimeInvalidate(table, queryKey)` — subscribes to a table and invalidates the matching React Query cache on any insert/update/delete, with proper cleanup
- Mount one global subscription provider (in `App.tsx` or a small `RealtimeBridge` component) so every page benefits without each component setting up its own channel

### 2. Wire the public homepage to live CMS data

`src/pages/Home.tsx` currently uses hardcoded strings, images, and a hardcoded `priorities` array. Replace with `useSetting()` reads (with sensible fallbacks so nothing breaks if a setting is missing):

- Hero section → reads `hero` setting (eyebrow, title, subtitle, tagline words, image, primary/secondary CTAs)
- Action bar under hero → uses hero CTA settings
- "Our Community Promise" block → reads `promise` setting (3 headline words, two taglines, image)
- Priorities accordion → reads `priorities` setting array
- CTA strip → reads `cta_strip` setting (heading + buttons)

### 3. Wire the footer to live CMS data

`src/components/layout/Footer.tsx` currently hardcodes columns, contact info, and socials. Update to read:

- `footer` setting → tagline + link columns (already managed by `FooterAdmin`)
- `contact_info` setting → email, phone, address
- `social_links` setting → facebook/instagram/youtube/whatsapp URLs (hide icons whose URL is empty)

### 4. Wire the Contact and Donate pages

- `src/pages/Contact.tsx` → read `contact_info` for the displayed details
- `src/pages/Donate.tsx` → read `donate_info` (intro, mpesa, paypal, bank)

### 5. Subscribe content hooks to realtime

Update `src/hooks/useContent.ts` and `src/hooks/useSiteSettings.ts` so each consumer also gets realtime invalidation:

- `useEvents`, `useNews`, `useAnnouncements`, `useAlbums` → subscribe to their respective tables
- `useSetting(key)` → subscribe to `site_settings` filtered by that key

### 6. Fallback safety

Every `useSetting` call gets a hardcoded fallback object matching today's homepage/footer copy, so:
- The page never renders blank while data is loading
- If an admin clears a field, the site shows the fallback rather than breaking layout

## Technical details

- **Realtime enable (SQL migration):** `ALTER PUBLICATION supabase_realtime ADD TABLE public.<table>` for each of the 7 tables, plus `ALTER TABLE ... REPLICA IDENTITY FULL` so update payloads include the row data needed for filtering
- **Hook shape:**
  ```ts
  useRealtimeInvalidate('site_settings', ['site_settings'])
  // listens to postgres_changes event '*', calls queryClient.invalidateQueries
  // cleans up channel in useEffect return
  ```
- **No new tables** — all existing `site_settings` keys (`hero`, `promise`, `priorities`, `cta_strip`, `footer`, `contact_info`, `social_links`, `donate_info`) are already populated by the seed migration and editable in admin
- **No RLS changes** — public read policies already exist on every table involved
- **Channel naming:** unique per table (e.g. `realtime:site_settings`) to avoid collisions

## Out of scope

- Realtime on RSVPs / contact messages / membership applications (admin-only screens, refresh-on-load is fine)
- Editing the priorities accordion icons (text/body only, as today)
- A "preview as draft before publish" workflow — every save goes live immediately