## Issues found

### 1. Verification email never sent
The new user (`jojeham13@gmail.com`) signed up via **Google OAuth**, which does NOT trigger a verification email — Google has already verified the address, so Supabase auto-confirms it. They are already a fully active user. No email was supposed to be sent.

However, if a user signs up via **email + password**, they currently also won't get an email. Reason: the email send log is empty (`0 rows`), and `notify.kisiijewishcommunity.com` is **still in Pending status — DNS records have not been verified yet**. Until DNS is verified, Lovable cannot send branded emails on your behalf, so signup confirmations are dropped.

### 2. Google sign-in shows the Lovable logo
On the Google consent screen, users currently see "Sign in to continue to Lovable" with the Lovable logo. This is because the project is using Lovable's **managed/shared Google OAuth credentials**. To show your own community name and logo, you need your own Google OAuth Client ID + Secret registered under your own Google Cloud project, then plug them into Cloud → Authentication.

---

## Plan

### Step 1 — Confirm the email situation (no code change)
- Tell you clearly: Google sign-ups don't need verification emails (auto-verified). They appear instantly as active users.
- Email-password sign-ups will start receiving the branded verification email **automatically** as soon as DNS verification completes for `notify.kisiijewishcommunity.com`. No code change required on our side; the templates and edge function are already deployed and waiting.
- Provide a button to open Cloud → Emails so you can monitor DNS verification status and click "Verify Domain" to retry the check.

### Step 2 — Optional fallback while DNS verifies
If you want users to be able to sign up and use the site immediately even before DNS verifies, I can enable **auto-confirm** on email signups temporarily (so they don't need to click a verification link). I'd revert this once DNS is verified. This is a one-line auth setting change. **I'll only do this if you confirm** — by default, email verification stays required for security.

### Step 3 — Rebrand Google OAuth (remove Lovable logo)
This requires you to create your own Google OAuth credentials. I cannot do this from inside Lovable — it must happen in your Google Cloud Console. I'll guide you with the exact steps:

1. Go to Google Cloud Console → create/select a project named "Kisii Jewish Community"
2. Configure the OAuth Consent Screen:
   - App name: **Kisii Jewish Community**
   - User support email: your community email
   - App logo: upload the community logo (the same one used in emails)
   - Authorized domains: `kisiijewishcommunity.com`
   - Scopes: `openid`, `userinfo.email`, `userinfo.profile`
3. Create credentials → OAuth Client ID → Web application
   - Authorized redirect URI: I'll provide the exact callback URL from Cloud → Authentication → Google
4. Copy the **Client ID** and **Client Secret** back into Cloud → Authentication → Sign-in methods → Google → "Use your own credentials"

After that, the consent screen will display your community name + logo instead of Lovable.

I'll provide a button to open Cloud → Authentication so you can paste the credentials.

### Step 4 — Verify
- Once DNS is green and a test email signup is performed, confirm the branded email arrives.
- Once Google credentials are saved, sign out and sign in again with Google — the consent screen should now show "Continue to Kisii Jewish Community" with your logo.

---

## What I will NOT do
- Won't change Auth.tsx — the code is correct.
- Won't re-scaffold email templates — they're already in place.
- Won't modify `src/integrations/lovable/index.ts` (auto-generated).

## Files touched (only if you approve Step 2)
- Auth config flag: `mailer_autoconfirm = true` (temporary), reverted later.
