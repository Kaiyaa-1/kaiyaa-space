let iconTimeout;

export function refreshIcons() {
  clearTimeout(iconTimeout);
  iconTimeout = setTimeout(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 10);
}
