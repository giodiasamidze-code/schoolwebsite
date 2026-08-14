import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET: List all codes
    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, codes: data });
    }

    // POST: Create a new code (or bulk generate)
    if (req.method === 'POST') {
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

        const { data, error } = await supabaseAdmin
          .from('invite_codes')
          .insert(codesToInsert)
          .select();

        if (error) throw error;
        return res.status(200).json({ success: true, message: `${batchCount} კოდი წარმატებით შეიქმნა!`, codes: data });
      }

      // Single code insertion
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

      return res.status(200).json({ success: true, message: `კოდი "${code}" წარმატებით შეიქმნა!`, code: data });
    }

    // DELETE: Remove code
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ success: false, message: 'ID is required' });

      const { error } = await supabaseAdmin
        .from('invite_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'კოდი წაიშალა.' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Invite code API error:', err);
    return res.status(500).json({ success: false, message: err.message || 'სერვერის შეცდომა' });
  }
}
