import { state } from '../state.js';
import { fetchMedia, saveMediaItem, deleteMediaItem, getMediaById } from '../api/media.js';
import { fetchDecks, saveDeck, deleteDeckItem, getDeckById } from '../api/decks.js';
import { updateSettingDB } from '../api/settings.js';
import { uploadFilesToSupabase } from '../lib/upload.js';
import { showToast } from '../lib/toast.js';
import { showConfirm } from '../lib/confirm.js';
import { switchView, toggleAdminPanel, toggleFormType, resetForms } from './sidebar.js';

export function initForms() {
  document.getElementById('add-btn')?.addEventListener('click', addItem);
  document.getElementById('deck-add-btn')?.addEventListener('click', addDeck);
  document.getElementById('reset-media-btn')?.addEventListener('click', resetForms);
  document.getElementById('reset-deck-btn')?.addEventListener('click', resetForms);

  document.getElementById('tab-media')?.addEventListener('click', () => toggleFormType('media'));
  document.getElementById('tab-hearthstone')?.addEventListener('click', () => toggleFormType('hearthstone'));
  document.getElementById('tab-settings')?.addEventListener('click', () => toggleFormType('settings'));
  document.getElementById('admin-close')?.addEventListener('click', toggleAdminPanel);

  ['reading', 'watching', 'listening', 'hearthstone'].forEach((key) => {
    document.getElementById(`set-${key}`)?.addEventListener('change', async (e) => {
      try {
        await updateSettingDB(`${key}_visible`, e.target.checked);
        showToast('板块可见性已更新', 'success');
        window.dispatchEvent(new CustomEvent('settings-updated'));
      } catch (err) {
        showToast(`设置保存失败：${err.message}`, 'error');
      }
    });
  });
}

export function triggerEditMedia(id) {
  const item = getMediaById(id);
  if (!item) return;

  state.editingMediaId = id;
  document.getElementById('item-type').value = item.type || 'reading';
  document.getElementById('item-is-public').value = (item.is_public !== false).toString();
  document.getElementById('item-title').value = (item.title || '').replace(/《|》/g, '');
  document.getElementById('item-author').value = item.author || '';
  document.getElementById('item-status').value = item.status || 'collect';
  document.getElementById('item-rating').value = String(item.rating ?? 5);
  document.getElementById('item-comment').value = item.comment || '';
  document.getElementById('item-file').value = '';

  const btn = document.getElementById('add-btn');
  btn.innerText = '保存修改';
  btn.classList.replace('bg-douban', 'bg-orange-500');

  const panel = document.getElementById('admin-panel');
  if (panel?.classList.contains('hidden')) toggleAdminPanel();
  toggleFormType('media');
  switchView(item.type || 'reading');
  panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function triggerEditDeck(id) {
  const deck = getDeckById(id);
  if (!deck) return;

  state.editingDeckId = id;
  document.getElementById('deck-class').value = deck.class_name || '法师';
  document.getElementById('deck-mode').value = deck.mode || '标准';
  document.getElementById('deck-is-public').value = (deck.is_public !== false).toString();
  document.getElementById('deck-name').value = deck.deck_name || '';
  document.getElementById('deck-code').value = deck.deck_code || '';
  document.getElementById('deck-desc').value = deck.description || '';
  document.getElementById('deck-file').value = '';

  const btn = document.getElementById('deck-add-btn');
  btn.innerText = '保存卡组修改';
  btn.classList.replace('bg-hearthstone', 'bg-orange-500');

  const panel = document.getElementById('admin-panel');
  if (panel?.classList.contains('hidden')) toggleAdminPanel();
  toggleFormType('hearthstone');
  switchView('hearthstone');
  panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function addItem() {
  const addBtn = document.getElementById('add-btn');
  addBtn.innerText = '上传中...';
  addBtn.disabled = true;

  const type = document.getElementById('item-type').value;
  const isPublic = document.getElementById('item-is-public').value === 'true';
  const title = document.getElementById('item-title').value.trim();
  let author = document.getElementById('item-author').value.trim();

  if (!title) {
    showToast('请输入名称', 'warning');
    addBtn.innerText = state.editingMediaId ? '保存修改' : '添加';
    addBtn.disabled = false;
    return;
  }
  if (!author) author = '未知';

  const formattedTitle =
    (type === 'reading' || type === 'watching') && !title.startsWith('《') ? `《${title}》` : title;

  try {
    let uploadedFileUrl = null;
    const fileInput = document.getElementById('item-file');
    if (fileInput?.files?.length > 0) {
      uploadedFileUrl = await uploadFilesToSupabase(fileInput);
    }

    const payload = {
      type,
      title: formattedTitle,
      author,
      status: document.getElementById('item-status').value,
      rating: document.getElementById('item-rating').value,
      comment: document.getElementById('item-comment').value.trim(),
      is_public: isPublic,
    };
    if (uploadedFileUrl) payload.file_url = uploadedFileUrl;

    const wasEditing = !!state.editingMediaId;
    const { error } = await saveMediaItem(payload, state.editingMediaId);
    if (error) throw error;

    resetForms();
    await fetchMedia();
    showToast(wasEditing ? '修改已保存' : '添加成功', 'success');
  } catch (err) {
    showToast(`操作失败：${err.message}`, 'error');
  }

  addBtn.innerText = '添加';
  addBtn.disabled = false;
}

async function addDeck() {
  const addBtn = document.getElementById('deck-add-btn');
  addBtn.innerText = '上传资源中...';
  addBtn.disabled = true;

  const deckName = document.getElementById('deck-name').value.trim();
  const deckCode = document.getElementById('deck-code').value.trim();

  if (!deckName || !deckCode) {
    showToast('名称和代码是必填的哦！', 'warning');
    addBtn.innerText = state.editingDeckId ? '保存卡组修改' : '发布卡组';
    addBtn.disabled = false;
    return;
  }

  try {
    let uploadedFileUrl = null;
    const fileInput = document.getElementById('deck-file');
    if (fileInput?.files?.length > 0) {
      uploadedFileUrl = await uploadFilesToSupabase(fileInput);
    }

    const payload = {
      class_name: document.getElementById('deck-class').value,
      deck_name: deckName,
      deck_code: deckCode,
      description: document.getElementById('deck-desc').value.trim(),
      mode: document.getElementById('deck-mode').value,
      is_public: document.getElementById('deck-is-public').value === 'true',
    };
    if (uploadedFileUrl) payload.image_url = uploadedFileUrl;

    const wasEditing = !!state.editingDeckId;
    const { error } = await saveDeck(payload, state.editingDeckId);
    if (error) throw error;

    resetForms();
    await fetchDecks();
    showToast(wasEditing ? '卡组已更新' : '卡组发布成功', 'success');
  } catch (err) {
    showToast(`上传失败：${err.message}`, 'error');
  }

  addBtn.innerText = '发布卡组';
  addBtn.disabled = false;
}

export async function handleDeleteMedia(id) {
  const ok = await showConfirm('确定彻底删除吗？', { title: '删除记录', confirmText: '删除', danger: true });
  if (!ok) return;
  const { error } = await deleteMediaItem(id);
  if (error) {
    showToast(`删除失败：${error.message}`, 'error');
  } else {
    await fetchMedia();
    showToast('已删除', 'success');
  }
}

export async function handleDeleteDeck(id) {
  const ok = await showConfirm('确定撕毁卡组吗？', { title: '删除卡组', confirmText: '删除', danger: true });
  if (!ok) return;
  const { error } = await deleteDeckItem(id);
  if (error) {
    showToast(`删除失败：${error.message}`, 'error');
  } else {
    await fetchDecks();
    showToast('卡组已删除', 'success');
  }
}
