const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;

// Supabase Admin Client (service role — bypasses RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// =====================================================
// Teacher Registration (service role bypasses RLS)
// =====================================================
app.post('/api/register-teacher', async (req, res) => {
  const { email, password, fullName, phone, subject, inviteCode } = req.body;

  if (!email || !password || !fullName || !subject || !inviteCode) {
    return res.status(400).json({ success: false, message: 'ყველა სავალდებულო ველი შევსებული უნდა იყოს.' });
  }

  try {
    // 1. Validate invite code (Allow standard codes or active database codes)
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

    // 2. Create auth user (auto-confirmed — no email needed)
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
    const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert({ id: userId, full_name: fullName, phone: phone || '', email, role: 'teacher' });

    if (userError) {
      console.error('Users insert error:', userError);
    }

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
      console.error('Teachers insert error:', teacherError);
      return res.status(500).json({ success: false, message: 'Teacher profile შეცდომა: ' + teacherError.message });
    }

    // 5. Mark invite code as used if it was a specific DB code
    if (codeId) {
      await supabaseAdmin
        .from('invite_codes')
        .update({ is_active: false, used_by: newTeacher.id })
        .eq('id', codeId);
    }

    return res.status(200).json({ success: true, userId, message: 'მასწავლებელი წარმატებით დარეგისტრირდა.' });

  } catch (err) {
    console.error('Register teacher error:', err);
    return res.status(500).json({ success: false, message: err.message || 'სერვერის შეცდომა.' });
  }
});

// =====================================================
// Parent Registration (service role — creates profile after email confirm)
// =====================================================
app.post('/api/register-parent', async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  if (!email || !password || !fullName || !phone) {
    return res.status(400).json({ success: false, message: 'ყველა სავალდებულო ველი შევსებული უნდა იყოს.' });
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, phone, role: 'parent' }
    });

    if (authError) {
      return res.status(400).json({ success: false, message: 'Auth შეცდომა: ' + authError.message });
    }

    const userId = authData.user.id;

    await supabaseAdmin
      .from('users')
      .upsert({ id: userId, full_name: fullName, phone, email, role: 'parent' });

    return res.status(200).json({ success: true, userId, message: 'მშობელი წარმატებით დარეგისტრირდა.' });

  } catch (err) {
    console.error('Register parent error:', err);
    return res.status(500).json({ success: false, message: err.message || 'სერვერის შეცდომა.' });
  }
});

// =====================================================
// Invite Codes API
// =====================================================
app.get('/api/create-invite-code', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('invite_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, codes: data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/create-invite-code', async (req, res) => {
  try {
    let { code, generateBatch } = req.body || {};

    if (generateBatch && typeof generateBatch === 'number') {
      const batchCount = Math.min(Math.max(generateBatch, 1), 50);
      const codesToInsert = [];
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (let i = 0; i < batchCount; i++) {
        const rand = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        codesToInsert.push({
          code: `SOL-${new Date().getFullYear()}-${rand}`,
          is_active: true
        });
      }
      const { data, error } = await supabaseAdmin.from('invite_codes').insert(codesToInsert).select();
      if (error) throw error;
      return res.json({ success: true, message: `${batchCount} კოდი წარმატებით შეიქმნა!`, codes: data });
    }

    if (!code || !code.trim()) {
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `SOL-${new Date().getFullYear()}-${rand}`;
    } else {
      code = code.trim().toUpperCase();
    }

    const { data, error } = await supabaseAdmin
      .from('invite_codes')
      .insert([{ code, is_active: true }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505' || error.message.includes('unique')) {
        return res.status(400).json({ success: false, message: `კოდი "${code}" უკვე არსებობს.` });
      }
      throw error;
    }

    res.json({ success: true, message: `კოდი "${code}" წარმატებით შეიქმნა!`, code: data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.delete('/api/create-invite-code', async (req, res) => {
  try {
    const { id } = req.body || {};
    const { error } = await supabaseAdmin.from('invite_codes').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'კოდი წაიშალა.' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('Georgian Private School API Server is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

