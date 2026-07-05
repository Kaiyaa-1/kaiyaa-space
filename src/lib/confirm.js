import { showToast } from './toast.js';

let resolveConfirm = null;

export function initConfirmDialog() {
  const modal = document.getElementById('confirm-modal');
  const cancelBtn = document.getElementById('confirm-cancel');
  const okBtn = document.getElementById('confirm-ok');

  cancelBtn?.addEventListener('click', () => closeConfirm(false));
  okBtn?.addEventListener('click', () => closeConfirm(true));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeConfirm(false);
  });
}

function closeConfirm(result) {
  document.getElementById('confirm-modal')?.classList.add('hidden');
  if (resolveConfirm) {
    resolveConfirm(result);
    resolveConfirm = null;
  }
}

export function showConfirm(message, { title = '确认操作', confirmText = '确定', danger = false } = {}) {
  return new Promise((resolve) => {
    resolveConfirm = resolve;
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    const okBtn = document.getElementById('confirm-ok');
    okBtn.textContent = confirmText;
    okBtn.className = danger
      ? 'px-4 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition shadow-sm'
      : 'px-4 py-2 text-xs bg-stone-800 text-white rounded hover:bg-stone-700 transition shadow-sm';
    modal?.classList.remove('hidden');
  });
}

export async function confirmOrToast(message, options) {
  const ok = await showConfirm(message, options);
  if (!ok) showToast('已取消', 'info', 1500);
  return ok;
}
