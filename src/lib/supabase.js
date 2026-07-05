import { createClient } from '@supabase/supabase-js';

function cleanEnv(value) {
  if (value == null) return '';
  return String(value).trim().replace(/^['"]|['"]$/g, '');
}

const url = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
const key = cleanEnv(import.meta.env.VITE_SUPABASE_KEY);

export const supabaseConfig = { url, key };
export const isSupabaseConfigured = Boolean(url && key);

if (!isSupabaseConfigured) {
  console.warn('[kaiyaa-space] 缺少 Supabase 环境变量，请在 Vercel 配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_KEY 后重新部署');
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
