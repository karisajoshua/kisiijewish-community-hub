## Goals

1. Donate page: remove the "Send a Card" tab entirely.
2. Currency on the donate form changes automatically based on the donor's selected country.
3. When an admin moves a donation from `pending` to `received`, capture the actual amount received and show both the **pledged** amount and the **received** amount everywhere donations are displayed.

---

## 1. Remove "Send a Card" from the donate page

**File: `src/pages/Donate.tsx`**
- Remove `card` from `TabKey`, `tabs[]`, `CARD_AMOUNTS`, `OCCASIONS`, the `#card` hash mapping, and the `<SendCardForm/>` render branch.
- Tab grid becomes `sm:grid-cols-2` (One-Time + Monthly only).
- Delete the `SendCardForm` component definition (and unused `Gift`, `MailIcon` imports).

No DB changes — existing `donation_type='tribute_card'` rows in admin still display fine.

---

## 2. Country-based currency

Map country → currency at the top of `Donate.tsx`:

```ts
const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string }> = {
  Kenya: { code: "KES", symbol: "KSh" },
  Uganda: { code: "UGX", symbol: "USh" },
  Tanzania: { code: "TZS", symbol: "TSh" },
  "United States": { code: "USD", symbol: "$" },
  "United Kingdom": { code: "GBP", symbol: "£" },
  Canada: { code: "CAD", symbol: "C$" },
  Israel: { code: "ILS", symbol: "₪" },
  Other: { code: "USD", symbol: "$" },
};
```

In `DonationForm`:
- Derive `const currency = COUNTRY_CURRENCY[country] ?? COUNTRY_CURRENCY.Kenya;`
- Replace hardcoded "KES" / "KSh" labels in amount chips, helper text, "Other" placeholder, and the fine-print receipt copy with `currency.symbol` / `currency.code`.
- On insert, send `currency: currency.code` instead of the hardcoded `"KES"`.
- Amount preset chips stay as numeric values (we are not doing FX conversion — same numeric presets, just relabeled with the new symbol). A small note added: "Amounts shown in {currency.code}."

The "Tax receipts are issued for donations of KSh 1,000 and above" line in the outer card stays generic ("equivalent of KSh 1,000") since it's informational.

---

## 3. Pledged vs. received tracking

### Schema migration

Add two columns to `donations`:

```sql
ALTER TABLE public.donations
  ADD COLUMN received_amount numeric,
  ADD COLUMN received_at timestamptz;
```

- `amount` continues to mean **pledged amount** (existing semantics preserved).
- `received_amount` is null until status transitions to `received`.
- No CHECK constraint; validated in app + admin UI.

### Admin UI (`src/pages/admin/DonationsAdmin.tsx`)

When the admin changes status to `received` via the existing `<Select>`:
- Open a small inline confirm UI (input prefilled with `amount`) asking "Amount received" before saving.
- Save updates `{ status: 'received', received_amount: <value>, received_at: now() }` in one call.
- Other status transitions work as before (don't touch received fields, but if moved away from `received`, clear `received_amount` / `received_at`).

Card display per donation:
- Show **Pledged: {currency} {amount}** always.
- If `status === 'received'`: also show **Received: {currency} {received_amount}** in green; if it differs from pledged, show a small "(short by …)" or "(over by …)" hint.

Stats row (top of page):
- **Total pledged** = sum of `amount` over filtered set (existing).
- **Total received** = sum of `received_amount` where status='received' (new tile).
- **Pending** count stays.
- All amount totals continue to display in KES symbol on the admin (mixed currency note added underneath totals: "Mixed-currency totals shown as raw sums; see individual records for currency.") — we are not doing FX conversion in this iteration.

### Type regeneration
`src/integrations/supabase/types.ts` regenerates automatically after the migration.

---

## Files touched

- migration: `supabase/migrations/<new>_donations_received.sql` (adds `received_amount`, `received_at`)
- `src/pages/Donate.tsx` — remove Card tab, add country→currency mapping, send dynamic currency on insert
- `src/pages/admin/DonationsAdmin.tsx` — received-amount prompt on status change, pledged vs received display, new total tile

## Out of scope

- Live FX conversion between currencies (presets stay as raw numbers in the selected currency).
- Editing past Send-a-Card records (existing rows remain visible in admin).
