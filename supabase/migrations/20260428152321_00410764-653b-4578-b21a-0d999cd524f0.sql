CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  donation_type TEXT NOT NULL CHECK (donation_type IN ('one_time','monthly','tribute_card')),
  frequency TEXT NOT NULL DEFAULT 'once' CHECK (frequency IN ('once','monthly')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'KES',
  donor_type TEXT NOT NULL DEFAULT 'personal' CHECK (donor_type IN ('personal','company')),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Kenya',
  state_region TEXT,
  postal_code TEXT,
  account_number TEXT,
  payment_method TEXT NOT NULL DEFAULT 'pending' CHECK (payment_method IN ('mpesa','bank','paypal','pending')),
  is_tribute BOOLEAN NOT NULL DEFAULT false,
  tribute_name TEXT,
  tribute_recipient_email TEXT,
  tribute_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can donate"
ON public.donations FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(donor_name) BETWEEN 1 AND 120
  AND char_length(donor_email) BETWEEN 3 AND 255
  AND donor_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (donor_phone IS NULL OR char_length(donor_phone) <= 40)
  AND (notes IS NULL OR char_length(notes) <= 2000)
  AND (tribute_message IS NULL OR char_length(tribute_message) <= 2000)
  AND amount <= 10000000
);

CREATE POLICY "Admins view donations"
ON public.donations FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update donations"
ON public.donations FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete donations"
ON public.donations FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;