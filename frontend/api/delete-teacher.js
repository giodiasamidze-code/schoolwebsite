import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { teacherId } = req.body || {};

  if (!teacherId) {
    return res.status(400).json({ success: false, message: 'teacherId is required' });
  }

  try {
    // 1. Fetch teacher to get user_id
    const { data: teacherData } = await supabaseAdmin
      .from('teachers')
      .select('id, user_id, full_name')
      .eq('id', teacherId)
      .maybeSingle();

    // 2. Delete pending profile edits
    await supabaseAdmin
      .from('teacher_profile_edits')
      .delete()
      .eq('teacher_id', teacherId);

    // 3. Delete from teachers table
    const { error: teacherDelError } = await supabaseAdmin
      .from('teachers')
      .delete()
      .eq('id', teacherId);

    if (teacherDelError) throw teacherDelError;

    // 4. Delete from users table & auth if user_id exists
    if (teacherData?.user_id) {
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', teacherData.user_id);

      try {
        await supabaseAdmin.auth.admin.deleteUser(teacherData.user_id);
      } catch (authDelErr) {
        console.warn('Auth user deletion warning:', authDelErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `მასწავლებელი "${teacherData?.full_name || ''}" წარმატებით წაიშალა სისტემიდან.`
    });

  } catch (err) {
    console.error('Delete teacher error:', err);
    return res.status(500).json({ success: false, message: err.message || 'მასწავლებლის წაშლა ვერ მოხერხდა.' });
  }
}
