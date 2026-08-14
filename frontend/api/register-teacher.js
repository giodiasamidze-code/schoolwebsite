const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { email, password, fullName, phone, subject, inviteCode } = req.body;

  if (!email || !password || !fullName || !subject || !inviteCode) {
    return res.status(400).json({ success: false, message: 'ყველა სავალდებულო ველი შევსებული უნდა იყოს.' });
  }

  try {
    // 1. Validate invite code
    const validStandardCodes = ['TEACHER2026', 'SOLOMON-TEACHER', 'SOLOMON2026'];
    const cleanCode = inviteCode.trim().toUpperCase();

    let isValid = validStandardCodes.includes(cleanCode);
    let codeId = null;

    if (!isValid) {
      const { data: codeData, error: codeError } = await supabaseAdmin
        .from('invite_codes')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (codeData && !codeError) {
        isValid = true;
        codeId = codeData.id;
      }
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'მოწვევის კოდი არასწორია.' });
    }

    // 2. Create auth user (auto-confirmed)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone: phone || '', role: 'teacher' }
    });

    if (authError) {
      return res.status(400).json({ success: false, message: 'Auth შეცდომა: ' + authError.message });
    }

    const userId = authData.user.id;

    // 3. Insert into public.users
    await supabaseAdmin
      .from('users')
      .upsert({ id: userId, full_name: fullName, phone: phone || '', email, role: 'teacher' });

    // 4. Insert into public.teachers
    const { data: newTeacher, error: teacherError } = await supabaseAdmin
      .from('teachers')
      .insert([{
        user_id: userId,
        full_name: fullName,
        subject,
        bio: '',
        photo_url: '',
        education: '',
        experience_years: '',
        certifications: '',
        years_at_school: ''
      }])
      .select()
      .single();

    if (teacherError) {
      return res.status(500).json({ success: false, message: 'Teacher profile შეცდომა: ' + teacherError.message });
    }

    // კოდი მრავალჯერადია — არ ვბლოკავთ გამოყენების შემდეგ

    return res.status(200).json({ success: true, userId, message: 'მასწავლებელი წარმატებით დარეგისტრირდა.' });

  } catch (err) {
    console.error('Register teacher error:', err);
    return res.status(500).json({ success: false, message: err.message || 'სერვერის შეცდომა.' });
  }
};
