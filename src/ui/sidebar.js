import { state } from '../state.js';
import { refreshIcons } from '../lib/icons.js';
import { navigateToView } from '../lib/router.js';

export function initSidebar() {
  document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', collapseSidebar);
  document.getElementById('edit-toggle-btn')?.addEventListener('click', () => {
    if (state.isOwnerMode) toggleAdminPanel();
  });

  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToView(el.dataset.view);
      if (window.innerWidth < 640) collapseSidebar();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) {
      document.getElementById('sidebar-overlay')?.classList.add('hidden');
      document.body.classList.remove('sidebar-expanded');
    }
  });
}

export function toggleSidebar() {
  const sidebar = document.getElementById('left-sidebar');
  const isExpanded = sidebar?.classList.contains('w-48');
  if (isExpanded) {
    collapseSidebar();
  } else {
    expandSidebar();
  }
}

function expandSidebar() {
  const sidebar = document.getElementById('left-sidebar');
  const body = document.body;
  sidebar?.classList.replace('w-16', 'w-48');
  sidebar?.classList.add('is-expanded');
  body.classList.replace('pl-16', 'pl-48');

  if (window.innerWidth < 640) {
    body.classList.add('sidebar-expanded');
    document.getElementById('sidebar-overlay')?.classList.remove('hidden');
  }
}

function collapseSidebar() {
  const sidebar = document.getElementById('left-sidebar');
  const body = document.body;
  sidebar?.classList.replace('w-48', 'w-16');
  sidebar?.classList.remove('is-expanded');
  body.classList.replace('pl-48', 'pl-16');
  body.classList.remove('sidebar-expanded');
  document.getElementById('sidebar-overlay')?.classList.add('hidden');
}

export function switchView(viewId) {
  state.currentActiveView = viewId;
  const views = ['reading', 'watching', 'listening', 'hearthstone'];

  views.forEach((v) => {
    const el = document.getElementById(`section-${v}`);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('animate-fade-in');
    }
    const navEl = document.getElementById(`nav-${v}`);
    if (navEl) {
      navEl.classList.remove('bg-stone-50', 'text-douban', 'text-hearthstone');
      navEl.classList.add('text-stone-600');
    }
  });

  const targetEl = document.getElementById(`section-${viewId}`);
  if (targetEl) {
    targetEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => targetEl.classList.add('animate-fade-in'));
    });
  }

  const targetNav = document.getElementById(`nav-${viewId}`);
  if (targetNav) {
    targetNav.classList.remove('text-stone-600');
    targetNav.classList.add('bg-stone-50');
    targetNav.classList.add(viewId === 'hearthstone' ? 'text-hearthstone' : 'text-douban');
  }

  if (viewId === 'hearthstone') {
    toggleFormType('hearthstone');
  } else {
    toggleFormType('media');
    document.getElementById('item-type').value = viewId;
  }
  refreshIcons();
}

export function toggleAdminPanel() {
  if (!state.isOwnerMode) return;
  const panel = document.getElementById('admin-panel');
  const wasHidden = panel?.classList.contains('hidden');
  panel?.classList.toggle('hidden');
  if (panel?.classList.contains('hidden')) {
    resetForms();
  } else if (wasHidden) {
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  updateEditButtonState();
}

export function updateEditButtonState() {
  const btn = document.getElementById('edit-toggle-btn');
  const panel = document.getElementById('admin-panel');
  if (!btn) return;
  const isOpen = panel && !panel.classList.contains('hidden');
  btn.classList.toggle('bg-orange-500', isOpen);
  btn.classList.toggle('bg-douban', !isOpen);
  btn.setAttribute('aria-pressed', isOpen ? 'true' : 'false');
}

export function toggleFormType(type) {
  ['media', 'hearthstone', 'settings'].forEach((t) => {
    document.getElementById(`form-${t}`)?.classList.add('hidden');
    const tabEl = document.getElementById(`tab-${t}`);
    tabEl?.classList.remove('bg-white', 'shadow-sm', 'text-stone-800');
    tabEl?.classList.add('text-stone-500');
  });

  document.getElementById(`form-${type}`)?.classList.remove('hidden');
  const activeTab = document.getElementById(`tab-${type}`);
  activeTab?.classList.remove('text-stone-500');
  activeTab?.classList.add('bg-white', 'shadow-sm', 'text-stone-800');
}

export function resetForms() {
  state.editingMediaId = null;
  state.editingDeckId = null;

  document.getElementById('item-title').value = '';
  document.getElementById('item-author').value = '';
  document.getElementById('item-comment').value = '';
  document.getElementById('item-file').value = '';
  const addBtn = document.getElementById('add-btn');
  addBtn.innerText = '添加';
  addBtn.classList.replace('bg-orange-500', 'bg-douban');

  document.getElementById('deck-name').value = '';
  document.getElementById('deck-code').value = '';
  document.getElementById('deck-desc').value = '';
  document.getElementById('deck-file').value = '';
  const deckBtn = document.getElementById('deck-add-btn');
  deckBtn.innerText = '发布卡组';
  deckBtn.classList.replace('bg-orange-500', 'bg-hearthstone');
}
