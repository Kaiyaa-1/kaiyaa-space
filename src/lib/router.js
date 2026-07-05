import { state, VIEWS } from '../state.js';

let switchViewCallback = null;

export function initRouter(onSwitchView) {
  switchViewCallback = onSwitchView;
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

export function navigateToView(viewId) {
  if (!VIEWS.includes(viewId)) return;
  const hash = `#${viewId}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    switchViewCallback?.(viewId);
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  const viewId = VIEWS.includes(hash) ? hash : 'reading';
  switchViewCallback?.(viewId);
}

export function getInitialView() {
  const hash = window.location.hash.replace('#', '');
  return VIEWS.includes(hash) ? hash : 'reading';
}
