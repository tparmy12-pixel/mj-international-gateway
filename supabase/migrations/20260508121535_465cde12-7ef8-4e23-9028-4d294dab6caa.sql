
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Status enums
CREATE TYPE public.application_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'completed');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');

-- Applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  father_name text,
  date_of_birth date,
  gender text,
  nationality text,
  mobile_number text NOT NULL,
  whatsapp_number text,
  email text NOT NULL,
  full_address text,
  passport_number text,
  passport_issue_date date,
  passport_expiry_date date,
  passport_front_url text,
  passport_back_url text,
  country text,
  travel_purpose text,
  departure_date date,
  return_date date,
  num_travelers int DEFAULT 1,
  adults_count int DEFAULT 1,
  children_count int DEFAULT 0,
  services text[] DEFAULT '{}',
  photo_url text,
  aadhaar_url text,
  bank_statement_url text,
  notes text,
  status public.application_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  is_vip boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all applications" ON public.applications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update applications" ON public.applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete applications" ON public.applications
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_country ON public.applications(country);
CREATE INDEX idx_applications_created_at ON public.applications(created_at DESC);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('applications', 'applications', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

CREATE POLICY "Public can upload application docs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'applications');

CREATE POLICY "Admins read application docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'applications' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage application docs" ON storage.objects
  FOR ALL USING (bucket_id = 'applications' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Admins manage gallery" ON storage.objects
  FOR ALL USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
