import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

if (!url || !key) {
  console.warn('[kaiyaa-space] 缺少 Supabase 环境变量，请复制 .env.example 为 .env 并填写配置');
}

export const supabase = createClient(url || '', key || '');
