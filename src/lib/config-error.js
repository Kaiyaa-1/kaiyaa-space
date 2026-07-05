import { escapeHtml } from '../lib/escape.js';

export function showConfigError(message) {
  const types = ['reading', 'watching', 'listening'];
  types.forEach((type) => {
    const ul = document.getElementById(`list-${type}`);
    if (ul) {
      ul.innerHTML = `<li class="text-red-500 text-xs p-3 bg-red-50 rounded border border-red-100">${escapeHtml(message)}</li>`;
    }
  });
  const decks = document.getElementById('list-hearthstone');
  if (decks) {
    decks.innerHTML = `<p class="text-red-500 text-xs p-3 bg-red-50 rounded border border-red-100">${escapeHtml(message)}</p>`;
  }
}
