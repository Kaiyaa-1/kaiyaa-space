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

  await fetchSettings();
  updateNavVisibility(switchView);
  await Promise.all([fetchMedia(), fetchDecks()]);
  switchView(getInitialView());
  refreshIcons();
}

init();
