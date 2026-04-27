## Goal

Turn the existing minimal Admin into a full Content Management System covering **every section of the public site**, and clean up the auth flow so:

- **Visitors** can browse the site.
- **Members** can sign up / sign in (email+password and Google), view their profile, and submit applications/RSVPs as a logged-in user.
- **Admins** can log in to a full dashboard and **create, edit, delete, and reorder** content for every page — not just add.

No new dependencies needed — uses existing shadcn UI, Supabase, and Lovable Cloud auth.

---

## 1. Public Auth experience

**`/auth` page (existing — polish only)**
- Keep email/password + Google sign-in (already wired via `lovable.auth.signInWithOAuth`).
- After login: members go to `/account`, admins go to `/admin`.
- Replace gold accents with the new community blue (consistent with rebrand).

**New `/account` page (member area)**
- Shows the logged-in user's email, join date, and role badge (Member / Admin).
- Lists their own RSVPs and membership application status (read-only).
- "Sign out" button.
- If the user is an admin, shows a prominent "Open Admin Dashboard" link.

**Navbar updates**
- When logged out: show "Sign in" link.
- When logged in: show user avatar/initial dropdown → Account, Admin (if admin), Sign out.
- Uses `supabase.auth.onAuthStateChange` so it updates instantly.

---

## 2. Database additions

Two small migrations:

**a. `profiles` table** (so we can show display name, avatar, etc. — currently the app has no profile data)
```
profiles (
  id uuid PK references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```
- RLS: anyone can SELECT (public profile), only owner can UPDATE, INSERT via trigger on `auth.users` signup.
- Trigger `handle_new_user_profile` auto-creates a profile row on signup.

**b. `site_settings` table** (key/value store so admins can edit homepage hero text, footer info, contact details, social links, donation links, "promise" priorities, etc. without code changes)
```
site_settings (
  key text PK,
  value jsonb not null,
  updated_at timestamptz default now()
)
```
- RLS: public SELECT, admin-only INSERT/UPDATE/DELETE via `has_role`.
- Seeded keys: `hero`, `promise`, `priorities`, `cta_strip`, `contact_info`, `social_links`, `donate_info`, `footer`.

No changes to existing tables (events, news_posts, announcements, gallery_albums, gallery_photos, membership_applications, contact_messages, event_rsvps, user_roles) — they already cover everything else and have correct RLS.

---

## 3. Admin Dashboard — full rebuild

Replace the single `src/pages/Admin.tsx` file with a **layout + route-based dashboard** at `/admin/*` using a sidebar (shadcn `Sidebar`).

**Layout: `src/pages/admin/AdminLayout.tsx`**
- Left sidebar with grouped nav, top header showing admin email + "View site" + Sign out.
- Sidebar collapsible to icon mode.

**Sidebar groups (mapped to every public section):**

| Group | Items | Public page it controls |
|---|---|---|
| Dashboard | Overview | `/` (stats: counts, recent submissions) |
| Content | Homepage, Site Settings, Footer | `/`, global |
| Community | Events, RSVPs, News, Announcements, Gallery | `/events`, `/news`, `/gallery` |
| People | Membership Applications, Contact Messages, Users & Roles | `/membership`, `/contact` |
| Account | My Profile, Sign out | — |

**Pages built (all support full CRUD — list / create / edit / delete, with edit dialogs, not just an "add" form):**

1. **Overview** (`/admin`) — counts of events, news, RSVPs, pending applications, unread contact messages; recent activity feed.
2. **Homepage CMS** (`/admin/homepage`) — edits the `site_settings.hero`, `promise`, `priorities` (4 cards), `cta_strip` JSON. Form mirrors what's rendered on Home.tsx; `Home.tsx` is refactored to read from `site_settings` with sensible fallbacks.
3. **Site Settings** (`/admin/settings`) — contact info, social links, donate info (used by Donate page + Footer + Contact page).
4. **Footer** (`/admin/footer`) — footer copy & link columns.
5. **Events** (`/admin/events`) — list with filter (upcoming/past), create + **edit dialog** + delete + image upload (uses existing `community-images` bucket).
6. **RSVPs** (`/admin/rsvps`) — grouped by event, export to CSV button.
7. **News** (`/admin/news`) — list, create, **edit (with Markdown-style textarea)**, delete, toggle featured, image upload.
8. **Announcements** (`/admin/announcements`) — list, create, edit, toggle active, delete.
9. **Gallery** (`/admin/gallery`) — manage albums (create/edit/delete), open album → manage photos (upload multiple to `community-images`, caption edit, delete).
10. **Membership Applications** (`/admin/memberships`) — list, change status (pending/approved/rejected), delete, view full message.
11. **Contact Messages** (`/admin/contacts`) — list, mark read (client-side state), delete, reply via mailto.
12. **Users & Roles** (`/admin/users`) — list all profiles + roles, promote/demote member↔admin (admin guard prevents removing the last admin).
13. **My Profile** (`/admin/profile`) — edit display_name, avatar, bio.

**Reusable building blocks (new):**
- `src/components/admin/DataTable.tsx` — simple table with row actions.
- `src/components/admin/ImageUpload.tsx` — uploads to `community-images` bucket, returns public URL.
- `src/components/admin/EditDialog.tsx` — generic edit-in-modal wrapper.
- `src/hooks/useAuth.ts` — exposes `{ user, isAdmin, loading }` based on `onAuthStateChange` + `user_roles` query.
- `src/hooks/useSiteSettings.ts` — `useSetting(key)` + `useUpdateSetting(key)`.

**Route guards:**
- `<RequireAuth>` redirects to `/auth` if no session.
- `<RequireAdmin>` redirects non-admins to `/account`.

---

## 4. Public pages — minor updates to consume CMS data

- **Home.tsx**: hero copy, promise block, priorities accordion, CTA strip read from `site_settings` (fallback to current hard-coded text so nothing breaks before admin edits anything).
- **Footer.tsx / Contact.tsx / Donate.tsx**: read `contact_info`, `social_links`, `donate_info` from settings.
- **Membership.tsx / Contact.tsx**: when a logged-in user submits, prefill name/email from their profile.

---

## 5. Security checklist

- All new RLS policies use the existing `has_role(auth.uid(), 'admin')` security-definer function (no recursion risk).
- `profiles` insert handled by trigger only; updates restricted to `auth.uid() = id`.
- `site_settings` writes admin-only.
- Image uploads go to existing public `community-images` bucket; storage policies limited to authenticated admins for write.
- Last-admin protection on Users & Roles (server-side check in a small DB function `prevent_last_admin_removal`).

---

## Out of scope (ask if you want these)
- Rich text WYSIWYG editor (using plain textarea + line breaks for now).
- Email notifications when new applications/contact messages arrive.
- Audit log of admin edits.
- Per-section reordering with drag-and-drop.

After approval I'll implement migrations first, then the admin layout and pages, then wire the public pages to the new settings.
