let container;

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm';
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'info', duration = 3000) {
  const root = ensureContainer();
  const colors = {
    info: 'bg-stone-800 text-white',
    success: 'bg-douban text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-hearthstone text-white',
  };

  const toast = document.createElement('div');
  toast.className = `toast-item px-4 py-2.5 rounded-lg shadow-lg text-sm animate-slide-up ${colors[type] || colors.info}`;
  toast.textContent = message;
  root.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
