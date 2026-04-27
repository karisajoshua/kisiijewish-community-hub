-- 1. profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

INSERT INTO public.profiles (id, display_name)
SELECT id, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. site_settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"eyebrow":"KISIIJEWISH","title":"COMMUNITY","subtitle":"TOGETHER · 2026","tagline":["Faith","Family","Tradition"],"image_url":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800","cta_label":"2026 Community Gathering","primary_cta":{"label":"Register","href":"/events"},"secondary_cta":{"label":"Join Us","href":"/membership"}}'::jsonb),
('promise', '{"headline_top":"OUR","headline_mid":"COMMUNITY","headline_bottom":"PROMISE","line1":"Proudly Jewish.","line2":"Standing together — it''s what we do.","video_image":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200"}'::jsonb),
('priorities', '[{"label":"Heritage","body":"Preserving the traditions, language, and stories that shape who we are — for our children and the generations to come."},{"label":"Education","body":"Hebrew classes, Torah study, and lifelong learning circles open to every member of the community."},{"label":"Community Support","body":"Caring for elders, families in need, and welcoming newcomers with warmth and practical help."},{"label":"Youth & Identity","body":"Investing in the next generation through mentorship, leadership retreats, and proud Jewish identity."}]'::jsonb),
('cta_strip', '{"heading":"Will you stand with our community?","buttons":[{"label":"Donate","href":"/donate"},{"label":"Get Involved","href":"/membership"},{"label":"Contact Us","href":"/contact"}]}'::jsonb),
('contact_info', '{"email":"hello@kisiijewish.org","phone":"+254 700 000 000","address":"Kisii, Kenya","hours":"Sun–Thu 9am–5pm"}'::jsonb),
('social_links', '{"facebook":"","instagram":"","youtube":"","whatsapp":""}'::jsonb),
('donate_info', '{"intro":"Your donation helps preserve our heritage, educate our youth, and support families in need.","mpesa":"","paypal":"","bank":""}'::jsonb),
('footer', '{"tagline":"Faith. Family. Tradition.","columns":[{"title":"Community","links":[{"label":"About","href":"/about"},{"label":"Events","href":"/events"},{"label":"Programs","href":"/programs"}]},{"title":"Get Involved","links":[{"label":"Membership","href":"/membership"},{"label":"Donate","href":"/donate"},{"label":"Contact","href":"/contact"}]}]}'::jsonb);

-- 3. Last-admin protection
CREATE OR REPLACE FUNCTION public.prevent_last_admin_removal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE admin_count int;
BEGIN
  IF (TG_OP = 'DELETE' AND OLD.role = 'admin') OR (TG_OP = 'UPDATE' AND OLD.role = 'admin' AND NEW.role <> 'admin') THEN
    SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
    IF admin_count <= 1 THEN
      RAISE EXCEPTION 'Cannot remove the last admin';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER protect_last_admin
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_removal();