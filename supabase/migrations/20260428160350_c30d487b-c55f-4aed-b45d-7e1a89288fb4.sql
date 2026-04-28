ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS contact_messages_user_id_idx ON public.contact_messages(user_id);

-- Drop any existing insert policies to replace with stricter one
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='contact_messages' AND cmd='INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.contact_messages', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated users can send messages"
  ON public.contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(subject) BETWEEN 1 AND 200
    AND char_length(message) BETWEEN 1 AND 5000
  );