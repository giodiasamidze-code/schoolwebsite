-- ============================================================
-- Solomon Academy - SAFE Schema (re-runnable, drops existing policies first)
-- ============================================================

-- ==============================
-- 1. public.users
-- ==============================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ==============================
-- 2. public.teachers
-- ==============================
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  education TEXT,
  experience_years TEXT,
  certifications TEXT,
  years_at_school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers and Admins can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers and Admins can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can delete teachers" ON public.teachers;

CREATE POLICY "Public read access to teachers"
  ON public.teachers FOR SELECT USING (true);

CREATE POLICY "Teachers and Admins can insert teachers"
  ON public.teachers FOR INSERT
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers and Admins can update teachers"
  ON public.teachers FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete teachers"
  ON public.teachers FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- ==============================
-- 3. public.teacher_profile_edits
-- ==============================
CREATE TABLE IF NOT EXISTS public.teacher_profile_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  proposed_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  rejection_note TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);
ALTER TABLE public.teacher_profile_edits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can view their own profile edits" ON public.teacher_profile_edits;
DROP POLICY IF EXISTS "Teachers can insert their own profile edits" ON public.teacher_profile_edits;
DROP POLICY IF EXISTS "Admins can update profile edits" ON public.teacher_profile_edits;

CREATE POLICY "Teachers can view their own profile edits"
  ON public.teacher_profile_edits FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.teachers WHERE id = teacher_profile_edits.teacher_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Teachers can insert their own profile edits"
  ON public.teacher_profile_edits FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.teachers WHERE id = teacher_profile_edits.teacher_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can update profile edits"
  ON public.teacher_profile_edits FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- ==============================
-- 4. public.invite_codes
-- ==============================
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  used_by UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can check active invite codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Authenticated users can update invite codes upon redemption" ON public.invite_codes;

CREATE POLICY "Anyone can check active invite codes"
  ON public.invite_codes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update invite codes upon redemption"
  ON public.invite_codes FOR UPDATE
  USING (auth.role() = 'authenticated');

INSERT INTO public.invite_codes (code, is_active)
VALUES ('TEACHER2026', true), ('SOLOMON-TEACHER', true)
ON CONFLICT (code) DO NOTHING;


-- ==============================
-- 5. public.news
-- ==============================
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to published news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;

CREATE POLICY "Public read access to published news"
  ON public.news FOR SELECT
  USING (is_published = true OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- ==============================
-- 6. public.applications
-- ==============================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_full_name TEXT NOT NULL,
  parent_address TEXT,
  parent_id_number TEXT,
  student_full_name TEXT NOT NULL,
  student_date_of_birth DATE,
  grade_stage TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update application status" ON public.applications;

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update application status"
  ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- ==============================
-- 7. public.application_documents
-- ==============================
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert documents for their applications" ON public.application_documents;
DROP POLICY IF EXISTS "Users and Admins can view documents for applications" ON public.application_documents;

CREATE POLICY "Users can insert documents for their applications"
  ON public.application_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_documents.application_id
      AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Users and Admins can view documents for applications"
  ON public.application_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_documents.application_id
      AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );


-- ==============================
-- 8. Storage Buckets
-- ==============================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('application-documents', 'application-documents', true),
  ('teacher-photos', 'teacher-photos', true),
  ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read for media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media and photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update/delete media and photos" ON storage.objects;

CREATE POLICY "Public read for media"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('teacher-photos', 'news-images', 'application-documents'));

CREATE POLICY "Authenticated users can upload media and photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('teacher-photos', 'news-images', 'application-documents'));

CREATE POLICY "Authenticated users can update/delete media and photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('teacher-photos', 'news-images', 'application-documents'));
