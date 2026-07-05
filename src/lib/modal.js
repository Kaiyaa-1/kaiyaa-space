let scrollY = 0;
let lockCount = 0;

export function lockBodyScroll() {
  if (lockCount === 0) {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (lockCount <= 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
}

export function showModal(el) {
  if (!el) return;
  lockBodyScroll();
  el.classList.remove('hidden');
}

export function hideModal(el) {
  if (!el) return;
  el.classList.add('hidden');
  unlockBodyScroll();
}
