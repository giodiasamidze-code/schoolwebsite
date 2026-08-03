-- Supabase Schema setup for Solomon Academy School Website

-- 1. Create public.users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'parent', -- 'parent', 'teacher', or 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS policies for users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. Create teachers table
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

-- Enable RLS on teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to teachers"
  ON public.teachers FOR SELECT
  USING (true);

CREATE POLICY "Teachers and Admins can insert teachers"
  ON public.teachers FOR INSERT
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Teachers and Admins can update teachers"
  ON public.teachers FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete teachers"
  ON public.teachers FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 3. Create teacher_profile_edits table (for Admin moderation queue)
CREATE TABLE IF NOT EXISTS public.teacher_profile_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  proposed_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_note TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.teacher_profile_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their own profile edits"
  ON public.teacher_profile_edits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE id = teacher_profile_edits.teacher_id
      AND user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Teachers can insert their own profile edits"
  ON public.teacher_profile_edits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE id = teacher_profile_edits.teacher_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update profile edits"
  ON public.teacher_profile_edits FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 4. Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  used_by UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check active invite codes"
  ON public.invite_codes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update invite codes upon redemption"
  ON public.invite_codes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Seed initial invite codes
INSERT INTO public.invite_codes (code, is_active)
VALUES ('TEACHER2026', true), ('SOLOMON-TEACHER', true)
ON CONFLICT (code) DO NOTHING;


-- 5. Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  class_stage TEXT,
  class_section TEXT,
  category TEXT DEFAULT 'basic',
  media_url TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to activities"
  ON public.activities FOR SELECT
  USING (true);

CREATE POLICY "Teachers can insert activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE id = activities.teacher_id
      AND user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Teachers and admins can update activities"
  ON public.activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE id = activities.teacher_id
      AND user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Teachers and admins can delete activities"
  ON public.activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers
      WHERE id = activities.teacher_id
      AND user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- 6. Create admissions_steps table (admin-editable timeline)
CREATE TABLE IF NOT EXISTS public.admissions_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admissions_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to admissions_steps"
  ON public.admissions_steps FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert/update/delete admissions_steps"
  ON public.admissions_steps FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Seed initial admissions steps
INSERT INTO public.admissions_steps (step_number, title, description, deadline)
VALUES 
  (1, 'განაცხადის შევსება', 'ონლაინ სარეგისტრაციო ფორმის შევსება ჩვენს ვებგვერდზე.', '15 მაისი, 2026'),
  (2, 'საბუთების წარდგენა', 'საჭირო დოკუმენტაციის წარდგენა სკოლის საინფორმაციო ცენტრში.', '30 მაისი, 2026'),
  (3, 'გასაუბრება & შეფასება', 'მოსწავლის აკადემიური და ფსიქო-ემოციური მზაობის შეფასება.', '15 ივნისი, 2026'),
  (4, 'შედეგების გამოცხადება', 'მიღების შესახებ გადაწყვეტილების მშობლისთვის შეტყობინება.', '1 ივლისი, 2026'),
  (5, 'ხელშეკრულების გაფორმება', 'სწავლის ხელშეკრულების გაფორმება და პირველი შენატანის განხორციელება.', '15 ივლისი, 2026')
ON CONFLICT DO NOTHING;


-- 7. Create news table (School News & Announcements)
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to published news"
  ON public.news FOR SELECT
  USING (is_published = true OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 8. Create visit_bookings table
CREATE TABLE IF NOT EXISTS public.visit_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_date DATE NOT NULL,
  grade_stage TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'declined'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.visit_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own visit bookings"
  ON public.visit_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own visit bookings"
  ON public.visit_bookings FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update visit bookings status"
  ON public.visit_bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 9. Create applications table
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
  status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update application status"
  ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 10. Create application_documents table
CREATE TABLE IF NOT EXISTS public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

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


-- 11. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('application-documents', 'application-documents', true),
  ('activity-media', 'activity-media', true),
  ('teacher-photos', 'teacher-photos', true),
  ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for activity media, teacher photos, and news images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('activity-media', 'teacher-photos', 'news-images', 'application-documents'));

CREATE POLICY "Authenticated users can upload media and photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('activity-media', 'teacher-photos', 'news-images', 'application-documents'));

CREATE POLICY "Authenticated users can update/delete media and photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('activity-media', 'teacher-photos', 'news-images', 'application-documents'));
