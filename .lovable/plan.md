## Why you didn't see a difference

The donate page and admin still show the old code: the "Send a Card" tab is still there, currency is hard-coded to KES, and the admin has no "Total Received" tile or received-amount workflow. The previous edit attempts didn't actually overwrite the files. I'll rewrite both files cleanly this time.

## 1. Donate page — remove "Send a Card", add country-based currency

`src/pages/Donate.tsx`:
- Remove the "card" tab, `CARD_AMOUNTS`, `OCCASIONS`, and the entire `SendCardForm` component.
- Tabs become a 2-up grid: One-Time Gift, Monthly Gift.
- Add a `COUNTRY_CURRENCY` map (Kenya → KES/KSh, Uganda → UGX/USh, Tanzania → TZS/TSh, US → USD/$, UK → GBP/£, Canada → CAD/$, Israel → ILS/₪, Other → USD/$).
- All amount chips, "Other" placeholder, helper text ("All amounts in …"), tax-receipt fine print, and the success card now read from the selected country's currency.
- The insert into `donations` writes the resolved `currency` (not always "KES").

## 2. Admin donations — pledged vs received

`src/pages/admin/DonationsAdmin.tsx`:
- Add `received_amount` and `received_at` to the `Donation` type.
- Summary tiles become: Records · Total Pledged · **Total Received** · Pending.
  - Totals are grouped per currency (e.g. "KES 45,000 · USD 200") so mixed-currency data stays correct.
- When admin changes a row's status to **received**, open a small dialog asking for "Amount received" (defaults to the pledged amount), then update `status`, `received_amount`, and `received_at = now()`.
- Each card shows pledged amount, and if `received_amount` is set, also "Received: <currency> <amount>" with a green/red variance label (e.g. "+500 over", "−200 short").

## 3. Gate the contact form behind sign-in

Reason: replies happen inside the system, so we need an authenticated sender.

`src/pages/Contact.tsx`:
- Use the existing `useAuth()` hook.
- If `!user`: replace the form area with a card that says "Sign in to send us a message — replies are delivered to your account inbox" and a button linking to `/auth?redirect=/contact#message`.
- If signed in: prefill name (from `profiles.display_name`) and email (from `user.email`) as read-only, and on submit insert into `contact_messages` with a new `user_id` column so the admin can reply back to the right account.

DB migration:
- `ALTER TABLE contact_messages ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;`
- Tighten the insert RLS policy: only `authenticated` users may insert, and `user_id` must equal `auth.uid()`.
- (Select/update/delete remain admin-only as today.)

`src/pages/Auth.tsx`: honour a `?redirect=` query param after login so users return to `/contact#message` (small change to `redirectByRole` and the OAuth `redirect_uri`).

(Future step — not in this plan: build an in-app reply inbox for users at `/account/messages`. Right now admins still reply via email, but every message is tied to a user account so we have the foundation.)

## 4. Branded verification email

Set up Lovable's branded auth emails so signups get a Kisii Jewish Community-branded "Confirm your email" message instead of the default Supabase template.

Steps:
1. Check if an email sender domain is already configured for the project. If not, surface the email setup dialog so you can pick a domain (e.g. `notify.kisiijewishcommunity.com`).
2. Once a domain exists, scaffold the auth email templates (signup confirmation, magic link, password recovery, invite, email change, reauthentication).
3. Style the templates with the site brand: logo from `src/assets`/`public`, primary `sky` colour from `src/index.css`, display font, "Kisii Jewish Community" wordmark, friendly Shalom-style copy, and white email body background.
4. Deploy the `auth-email-hook` edge function. Branded emails activate automatically once DNS verifies (monitored under Cloud → Emails). Default Supabase emails keep sending in the meantime so signups never break.

Email confirmation is already required (auto-confirm is off), so as soon as branded emails go live, every new signup will receive the branded "Verify your email" message before they can sign in.

## Files touched

- `src/pages/Donate.tsx` — full rewrite (remove Send-a-Card, add currency).
- `src/pages/admin/DonationsAdmin.tsx` — pledged vs received UI + dialog.
- `src/pages/Contact.tsx` — gate behind auth, prefill from profile.
- `src/pages/Auth.tsx` — support `?redirect=` after login.
- New migration — `contact_messages.user_id` + tightened RLS.
- New `supabase/functions/auth-email-hook/` + `supabase/functions/_shared/email-templates/*.tsx` (scaffolded, then brand-styled).

## Open question

For branded auth emails I need to set up a sender subdomain (default suggestion: `notify.kisiijewishcommunity.com`). Confirm that's the subdomain you want, or tell me a different one — then on approval I'll run the setup and scaffold step in one go.