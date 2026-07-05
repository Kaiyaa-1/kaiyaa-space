import { state } from '../state.js';
import { isVideoUrl } from '../lib/media-utils.js';

export function initPreview() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.media-preview-trigger');
    if (!trigger) return;
    e.preventDefault();
    openMediaPreview(trigger.dataset.urls);
  });

  document.getElementById('media-preview-modal')?.addEventListener('click', closeMediaPreview);
  document.getElementById('preview-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMediaPreview();
  });
  document.getElementById('media-prev-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigatePreview(-1);
  });
  document.getElementById('media-next-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigatePreview(1);
  });

  window.addEventListener('keydown', (e) => {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

    const previewModal = document.getElementById('media-preview-modal');
    const isPreviewOpen = previewModal && !previewModal.classList.contains('hidden');

    if (isPreviewOpen) {
      if (e.key === 'Escape') closeMediaPreview();
      if (e.key === 'ArrowLeft') navigatePreview(-1);
      if (e.key === 'ArrowRight') navigatePreview(1);
    }
  });
}

function openMediaPreview(urlsJsonStr) {
  if (!urlsJsonStr) return;
  state.previewUrls = JSON.parse(decodeURIComponent(urlsJsonStr));
  if (state.previewUrls.length === 0) return;

  state.previewIndex = 0;
  updatePreviewContent();

  const modal = document.getElementById('media-preview-modal');
  const prevBtn = document.getElementById('media-prev-btn');
  const nextBtn = document.getElementById('media-next-btn');
  const counter = document.getElementById('media-preview-counter');
  const multi = state.previewUrls.length > 1;

  prevBtn?.classList.toggle('hidden', !multi);
  nextBtn?.classList.toggle('hidden', !multi);
  counter?.classList.toggle('hidden', !multi);

  modal?.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function updatePreviewContent() {
  const url = state.previewUrls[state.previewIndex];
  const isVideo = isVideoUrl(url);
  const img = document.getElementById('media-preview-img');
  const video = document.getElementById('media-preview-video');
  const counter = document.getElementById('media-preview-counter');

  img?.classList.add('hidden');
  img?.removeAttribute('src');
  video?.classList.add('hidden');
  video?.pause();
  video?.removeAttribute('src');

  if (isVideo) {
    if (video) {
      video.src = url;
      video.classList.remove('hidden');
    }
  } else if (img) {
    img.src = url;
    img.classList.remove('hidden');
  }

  if (counter && state.previewUrls.length > 1) {
    counter.innerText = `${state.previewIndex + 1} / ${state.previewUrls.length}`;
  }
}

function navigatePreview(dir) {
  state.previewIndex += dir;
  if (state.previewIndex < 0) state.previewIndex = state.previewUrls.length - 1;
  if (state.previewIndex >= state.previewUrls.length) state.previewIndex = 0;
  updatePreviewContent();
}

function closeMediaPreview() {
  const modal = document.getElementById('media-preview-modal');
  const video = document.getElementById('media-preview-video');
  modal?.classList.add('hidden');
  video?.pause();
  video?.removeAttribute('src');
  document.body.classList.remove('overflow-hidden');
  state.previewUrls = [];
}
