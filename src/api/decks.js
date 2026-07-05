import { supabase } from '../lib/supabase.js';
import { state } from '../state.js';
import { renderDecks, showDecksLoading } from '../render/decks.js';

export async function fetchDecks() {
  showDecksLoading();
  let query = supabase.from('hearthstone_decks').select('*').order('created_at', { ascending: false });
  if (!state.isOwnerMode) query = query.eq('is_public', true);

  const { data, error } = await query;
  if (!error) {
    state.globalDecksData = data;
    renderDecks(data);
  } else {
    const container = document.getElementById('list-hearthstone');
    if (container) container.innerHTML = `<p class="text-red-400 text-xs">加载失败：${error.message}</p>`;
    throw error;
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
