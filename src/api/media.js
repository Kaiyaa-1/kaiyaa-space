import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { state } from '../state.js';
import { renderLists, showMediaLoading } from '../render/media.js';

function showMediaError(message) {
  const types = ['reading', 'watching', 'listening'];
  types.forEach((type) => {
    const ul = document.getElementById(`list-${type}`);
    if (ul) ul.innerHTML = `<li class="text-red-400 text-xs">加载失败：${message}</li>`;
  });
}

export async function fetchMedia() {
  showMediaLoading();

  if (!isSupabaseConfigured) {
    showMediaError('未配置数据库，请在 Vercel 填写环境变量后重新部署');
    return;
  }

  try {
    let query = supabase.from('media_items').select('*').order('created_at', { ascending: false });
    if (!state.isOwnerMode) query = query.eq('is_public', true);

    const { data, error } = await query;
    if (error) {
      showMediaError(error.message);
      return;
    }

    state.globalMediaData = data;
    renderLists(data);
  } catch (err) {
    showMediaError(err?.message || String(err));
  }
}

export async function saveMediaItem(payload, editingId) {
  if (editingId) {
    return supabase.from('media_items').update(payload).eq('id', editingId);
  }
  return supabase.from('media_items').insert([payload]);
}

export async function deleteMediaItem(id) {
  return supabase.from('media_items').delete().eq('id', id);
}

export function getMediaById(id) {
  return state.globalMediaData.find((i) => i.id === id);
}
