import './style.css';
import { refreshIcons } from './lib/icons.js';
import { initAuth } from './lib/auth.js';
import { initRouter, getInitialView } from './lib/router.js';
import { initConfirmDialog } from './lib/confirm.js';
import { fetchSettings, updateNavVisibility } from './api/settings.js';
import { fetchMedia } from './api/media.js';
import { fetchDecks } from './api/decks.js';
import { initSidebar, switchView, toggleAdminPanel } from './ui/sidebar.js';
import { initPreview } from './ui/preview.js';
import {
  initForms,
  triggerEditMedia,
  triggerEditDeck,
  handleDeleteMedia,
  handleDeleteDeck,
} from './ui/forms.js';
import { copyDeckCode } from './render/decks.js';
import { state } from './state.js';
import { isSupabaseConfigured } from './lib/supabase.js';
import { showConfigError } from './lib/config-error.js';
import { showToast } from './lib/toast.js';

async function reloadAllData() {
  await fetchSettings();
  updateNavVisibility(switchView);
  await Promise.all([fetchMedia(), fetchDecks()]);
}

function initGlobalEvents() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);

    switch (action) {
      case 'edit-media':
        triggerEditMedia(id);
        break;
      case 'delete-media':
        handleDeleteMedia(id);
        break;
      case 'edit-deck':
        triggerEditDeck(id);
        break;
      case 'delete-deck':
        handleDeleteDeck(id);
        break;
      case 'copy-code':
        copyDeckCode(btn, btn.dataset.code);
        break;
      default:
        break;
    }
  });

  window.addEventListener('keydown', (e) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

    const previewModal = document.getElementById('media-preview-modal');
    const isPreviewOpen = previewModal && !previewModal.classList.contains('hidden');
    if (isPreviewOpen) return;

    if (e.key.toLowerCase() === 'i') {
      e.preventDefault();
      if (state.isOwnerMode) toggleAdminPanel();
    }

    if (e.key === 'Escape') {
      const adminPanel = document.getElementById('admin-panel');
      if (adminPanel && !adminPanel.classList.contains('hidden')) {
        toggleAdminPanel();
      }
    }
  });

  window.addEventListener('settings-updated', () => {
    updateNavVisibility(switchView);
  });
}

async function init() {
  initConfirmDialog();
  initSidebar();
  initPreview();
  initForms();
  initGlobalEvents();

  initRouter(switchView);
  initAuth(reloadAllData);

  if (!isSupabaseConfigured) {
    showConfigError('数据库未连接：请在 Vercel → Settings → Environment Variables 配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_KEY，然后 Redeploy。');
    showToast('数据库配置缺失，请检查 Vercel 环境变量', 'error', 5000);
    switchView(getInitialView());
    refreshIcons();
    return;
  }

  try {
    await fetchSettings();
    updateNavVisibility(switchView);
    await Promise.all([fetchMedia(), fetchDecks()]);
    switchView(getInitialView());
    refreshIcons();
  } catch (err) {
    console.error('[kaiyaa-space] 初始化失败:', err);
    showConfigError(`加载失败：${err?.message || err}`);
    showToast('页面加载失败，请刷新重试', 'error');
  }
}

init();
