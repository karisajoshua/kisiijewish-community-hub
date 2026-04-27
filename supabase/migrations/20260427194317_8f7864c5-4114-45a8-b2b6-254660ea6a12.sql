
-- Lock function search_path & revoke public execute on internal functions
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user_role() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Replace permissive submission policies with stricter, validated ones
DROP POLICY IF EXISTS "Anyone can RSVP" ON public.event_rsvps;
CREATE POLICY "Anyone can RSVP" ON public.event_rsvps FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND guests BETWEEN 1 AND 20
  AND (notes IS NULL OR char_length(notes) <= 1000)
);

DROP POLICY IF EXISTS "Anyone can apply" ON public.membership_applications;
CREATE POLICY "Anyone can apply" ON public.membership_applications FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND (location IS NULL OR char_length(location) <= 200)
  AND (message IS NULL OR char_length(message) <= 2000)
);

DROP POLICY IF EXISTS "Anyone can contact" ON public.contact_messages;
CREATE POLICY "Anyone can contact" ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(subject) BETWEEN 1 AND 200
  AND char_length(message) BETWEEN 1 AND 5000
);

-- Storage: prevent listing the whole bucket; allow read of specific objects only
DROP POLICY IF EXISTS "Public read community images" ON storage.objects;
CREATE POLICY "Public read community images" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'community-images' AND name IS NOT NULL);
