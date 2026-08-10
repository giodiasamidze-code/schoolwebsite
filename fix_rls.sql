-- Fix: Infinite recursion in users table RLS policies
-- The problem: policies on "users" table reference "users" table themselves → infinite loop
-- Solution: Use SECURITY DEFINER function to break the recursion

-- Step 1: Drop the recursive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Step 2: Create a SECURITY DEFINER function (bypasses RLS, breaks recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Step 3: Recreate policies using the function (no more recursion!)
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also fix other tables that had the same recursion pattern
-- teachers table
DROP POLICY IF EXISTS "Teachers and Admins can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers and Admins can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can delete teachers" ON public.teachers;

CREATE POLICY "Teachers and Admins can insert teachers"
  ON public.teachers FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Teachers and Admins can update teachers"
  ON public.teachers FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can delete teachers"
  ON public.teachers FOR DELETE
  USING (public.is_admin());

-- teacher_profile_edits table
DROP POLICY IF EXISTS "Teachers can view their own profile edits" ON public.teacher_profile_edits;
DROP POLICY IF EXISTS "Teachers can insert their own profile edits" ON public.teacher_profile_edits;
DROP POLICY IF EXISTS "Admins can update profile edits" ON public.teacher_profile_edits;

CREATE POLICY "Teachers can view their own profile edits"
  ON public.teacher_profile_edits FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.teachers WHERE id = teacher_profile_edits.teacher_id AND user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Teachers can insert their own profile edits"
  ON public.teacher_profile_edits FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.teachers WHERE id = teacher_profile_edits.teacher_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can update profile edits"
  ON public.teacher_profile_edits FOR UPDATE
  USING (public.is_admin());

-- applications table
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update application status" ON public.applications;

CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update application status"
  ON public.applications FOR UPDATE
  USING (public.is_admin());

-- application_documents table
DROP POLICY IF EXISTS "Users can insert documents for their applications" ON public.application_documents;
DROP POLICY IF EXISTS "Users and Admins can view documents for applications" ON public.application_documents;

CREATE POLICY "Users can insert documents for their applications"
  ON public.application_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_documents.application_id
      AND (user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users and Admins can view documents for applications"
  ON public.application_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_documents.application_id
      AND (user_id = auth.uid() OR public.is_admin())
    )
  );

-- news table
DROP POLICY IF EXISTS "Public read access to published news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;

CREATE POLICY "Public read access to published news"
  ON public.news FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (public.is_admin());
