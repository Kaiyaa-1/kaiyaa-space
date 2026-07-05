import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { state } from '../state.js';
import { renderDecks, showDecksLoading } from '../render/decks.js';

function showDecksError(message) {
  const container = document.getElementById('list-hearthstone');
  if (container) container.innerHTML = `<p class="text-red-400 text-xs">加载失败：${message}</p>`;
}

export async function fetchDecks() {
  showDecksLoading();

  if (!isSupabaseConfigured) {
    showDecksError('未配置数据库，请在 Vercel 填写环境变量后重新部署');
    return;
  }

  try {
    let query = supabase.from('hearthstone_decks').select('*').order('created_at', { ascending: false });
    if (!state.isOwnerMode) query = query.eq('is_public', true);

    const { data, error } = await query;
    if (error) {
      showDecksError(error.message);
      return;
    }

    state.globalDecksData = data;
    renderDecks(data);
  } catch (err) {
    showDecksError(err?.message || String(err));
  }
}

export async function saveDeck(payload, editingId) {
  if (editingId) {
    return supabase.from('hearthstone_decks').update(payload).eq('id', editingId);
  }
  return supabase.from('hearthstone_decks').insert([payload]);
}

export async function deleteDeckItem(id) {
  return supabase.from('hearthstone_decks').delete().eq('id', id);
}

export function getDeckById(id) {
  return state.globalDecksData.find((d) => d.id === id);
}
