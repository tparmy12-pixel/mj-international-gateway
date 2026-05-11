
-- Order status enum
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('none','created','billed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscription plan enum
DO $$ BEGIN
  CREATE TYPE public.subscription_plan AS ENUM ('unique','infinity','global');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend applications table
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS order_address text,
  ADD COLUMN IF NOT EXISTS order_city text,
  ADD COLUMN IF NOT EXISTS order_state text,
  ADD COLUMN IF NOT EXISTS order_pincode text,
  ADD COLUMN IF NOT EXISTS order_status public.order_status NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS order_created_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

-- User-facing RLS policies on applications
DROP POLICY IF EXISTS "Users view own applications" ON public.applications;
CREATE POLICY "Users view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own applications" ON public.applications;
CREATE POLICY "Users update own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text,
  phone text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan public.subscription_plan NOT NULL,
  amount integer NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own subs" ON public.subscriptions;
CREATE POLICY "Users view own subs" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own subs" ON public.subscriptions;
CREATE POLICY "Users insert own subs" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own subs" ON public.subscriptions;
CREATE POLICY "Users update own subs" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage subs" ON public.subscriptions;
CREATE POLICY "Admins manage subs" ON public.subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at triggers
DROP TRIGGER IF EXISTS profiles_touch ON public.profiles;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS subs_touch ON public.subscriptions;
CREATE TRIGGER subs_touch BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile + auto-grant admin to specific email on new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, phone, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'full_name'
  ) ON CONFLICT (user_id) DO NOTHING;

  IF lower(NEW.email) = 'alviibrahim29@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER TABLE public.applications REPLICA IDENTITY FULL;
ALTER TABLE public.subscriptions REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
