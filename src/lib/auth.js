import { state, setOwnerMode, VIEWS } from '../state.js';
import { refreshIcons } from './icons.js';
import { showToast } from './toast.js';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export function initAuth(onAuthChange) {
  document.getElementById('secret-login-btn')?.addEventListener('click', secretLogin);
  document.getElementById('login-cancel')?.addEventListener('click', () => hideModal('login-modal'));
  document.getElementById('login-submit')?.addEventListener('click', () => checkPassword(onAuthChange));
  document.getElementById('logout-cancel')?.addEventListener('click', () => hideModal('logout-modal'));
  document.getElementById('logout-submit')?.addEventListener('click', () => confirmLogout(onAuthChange));

  const pwdInput = document.getElementById('secret-pwd');
  pwdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword(onAuthChange);
  });

  updateOwnerUI();
}

function hideModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

function secretLogin() {
  if (state.isOwnerMode) {
    document.getElementById('logout-modal')?.classList.remove('hidden');
    return;
  }
  document.getElementById('login-modal')?.classList.remove('hidden');
  const pwd = document.getElementById('secret-pwd');
  if (pwd) {
    pwd.value = '';
    setTimeout(() => pwd.focus(), 50);
  }
  document.getElementById('pwd-error')?.classList.add('hidden');
}

function checkPassword(onAuthChange) {
  const pwd = document.getElementById('secret-pwd')?.value || '';
  if (!ADMIN_PASSWORD) {
    showToast('未配置站长密码，请设置 VITE_ADMIN_PASSWORD', 'error');
    return;
  }
  if (pwd === ADMIN_PASSWORD) {
    setOwnerMode(true);
    hideModal('login-modal');
    showToast('欢迎回来，站长模式已激活', 'success');
    updateOwnerUI();
    onAuthChange?.();
  } else {
    document.getElementById('pwd-error')?.classList.remove('hidden');
    const modal = document.getElementById('login-modal-content');
    modal?.classList.add('translate-x-2');
    setTimeout(() => modal?.classList.replace('translate-x-2', '-translate-x-2'), 50);
    setTimeout(() => modal?.classList.replace('-translate-x-2', 'translate-x-0'), 100);
  }
}

async function confirmLogout(onAuthChange) {
  setOwnerMode(false);
  hideModal('logout-modal');
  document.getElementById('admin-panel')?.classList.add('hidden');
  showToast('已退出站长模式', 'info');
  updateOwnerUI();
  await onAuthChange?.();
}

function updateOwnerUI() {
  const badge = document.getElementById('owner-badge');
  if (badge) {
    badge.classList.toggle('hidden', !state.isOwnerMode);
  }
  refreshIcons();
}

export { secretLogin };
