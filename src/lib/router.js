import { state, VIEWS } from '../state.js';

let switchViewCallback = null;
let routerReady = false;

export function initRouter(onSwitchView) {
  switchViewCallback = onSwitchView;
  window.addEventListener('hashchange', () => {
    if (!routerReady || !state.currentSettings) return;
    const view = resolveView(state.currentSettings);
    switchViewCallback?.(view);
  });
}

export function markRouterReady() {
  routerReady = true;
}

export function resolveView(settings) {
  if (!settings) return 'reading';

  const hash = window.location.hash.replace('#', '');
  const preferred = VIEWS.includes(hash) ? hash : 'reading';

  if (state.isOwnerMode || settings[`${preferred}_visible`]) {
    return preferred;
  }

  return VIEWS.find((v) => settings[`${v}_visible`]) || 'reading';
}

export function navigateToView(viewId) {
  if (!VIEWS.includes(viewId)) return;
  switchViewCallback?.(viewId);

  const hash = `#${viewId}`;
  if (window.location.hash !== hash) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  }
}

export function syncHash(viewId) {
  const hash = `#${viewId}`;
  if (window.location.hash !== hash) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  }
}

export function getInitialView() {
  return resolveView(state.currentSettings);
}
