ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS received_amount numeric,
  ADD COLUMN IF NOT EXISTS received_at timestamptz;