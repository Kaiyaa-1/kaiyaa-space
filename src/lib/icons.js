import { createIcons } from 'lucide';

let iconTimeout;

export function refreshIcons() {
  clearTimeout(iconTimeout);
  iconTimeout = setTimeout(() => {
    createIcons();
  }, 10);
}
