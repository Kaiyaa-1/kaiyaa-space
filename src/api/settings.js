import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { state } from '../state.js';

export async function fetchSettings() {
  if (!isSupabaseConfigured) {
    state.currentSettings = {
      reading_visible: true,
      watching_visible: true,
      listening_visible: true,
      hearthstone_visible: true,
    };
    return;
  }

  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (!error && data) {
      state.currentSettings = data;
    } else {
      state.currentSettings = {
        reading_visible: true,
        watching_visible: true,
        listening_visible: true,
        hearthstone_visible: true,
      };
    }
  } catch {
    state.currentSettings = {
      reading_visible: true,
      watching_visible: true,
      listening_visible: true,
      hearthstone_visible: true,
    };
  }

  document.getElementById('set-reading').checked = state.currentSettings.reading_visible;
  document.getElementById('set-watching').checked = state.currentSettings.watching_visible;
  document.getElementById('set-listening').checked = state.currentSettings.listening_visible;
  document.getElementById('set-hearthstone').checked = state.currentSettings.hearthstone_visible;
}

export async function updateSettingDB(column, value) {
  const { error } = await supabase.from('site_settings').update({ [column]: value }).eq('id', 1);
  if (error) {
    const key = column.replace('_visible', '');
    document.getElementById(`set-${key}`).checked = !value;
    throw error;
  }
  await fetchSettings();
}

export function updateNavVisibility(switchViewFn) {
  if (!state.currentSettings) return;

  const views = ['reading', 'watching', 'listening', 'hearthstone'];

  views.forEach((v) => {
    const isVisible = state.isOwnerMode || state.currentSettings[`${v}_visible`];
    const navEl = document.getElementById(`nav-${v}`);
    if (!navEl) return;
    if (isVisible) {
      navEl.classList.remove('hidden');
      navEl.classList.add('flex');
    } else {
      navEl.classList.add('hidden');
      navEl.classList.remove('flex');
    }
  });

  if (!state.isOwnerMode && !state.currentSettings[`${state.currentActiveView}_visible`]) {
    const firstVisible = views.find((v) => state.currentSettings[`${v}_visible`]);
    if (firstVisible) {
      switchViewFn(firstVisible);
    } else {
      document.getElementById(`section-${state.currentActiveView}`)?.classList.add('hidden');
    }
  }
}
