import { supabase } from '../lib/supabase.js';
import { state } from '../state.js';
import { renderLists, showMediaLoading } from '../render/media.js';

export async function fetchMedia() {
  showMediaLoading();
  let query = supabase.from('media_items').select('*').order('created_at', { ascending: false });
  if (!state.isOwnerMode) query = query.eq('is_public', true);

  const { data, error } = await query;
  if (!error) {
    state.globalMediaData = data;
    renderLists(data);
  } else {
    const types = ['reading', 'watching', 'listening'];
    types.forEach((type) => {
      const ul = document.getElementById(`list-${type}`);
      if (ul) ul.innerHTML = `<li class="text-red-400 text-xs">加载失败：${error.message}</li>`;
    });
    throw error;
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
