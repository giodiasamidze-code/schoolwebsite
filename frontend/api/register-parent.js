import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { email, password, fullName, phone } = req.body || {};

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
}
