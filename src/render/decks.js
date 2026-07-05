import { state, CLASS_COLORS } from '../state.js';
import { escapeHtml, escapeAttr } from '../lib/escape.js';
import { refreshIcons } from '../lib/icons.js';
import { parseMediaUrls, isVideoUrl } from '../lib/media-utils.js';

export function showDecksLoading() {
  const container = document.getElementById('list-hearthstone');
  if (container) {
    container.innerHTML = `
      <p class="flex items-center gap-2 text-stone-400 text-xs">
        <span class="inline-block w-4 h-4 border-2 border-stone-300 border-t-hearthstone rounded-full animate-spin"></span>
        拼命从云端酒馆拉取卡组中...
      </p>`;
  }
}

function buildDeckMediaHtml(urls, deckName) {
  if (!urls.length) return '';
  const firstUrl = urls[0];
  const isVid = isVideoUrl(firstUrl);
  const encodedUrls = encodeURIComponent(JSON.stringify(urls));
  const multiPicBadge =
    urls.length > 1
      ? `<div class="absolute top-1 right-1 bg-stone-900/70 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10 font-bold flex items-center gap-1"><i data-lucide="images" class="w-2.5 h-2.5"></i> ${urls.length}</div>`
      : '';

  const media = isVid
    ? `<video src="${escapeAttr(firstUrl)}" class="w-full h-full object-cover rounded-md shadow-sm border border-stone-200 pointer-events-none deck-video" muted preload="metadata" playsinline></video>`
    : `<img src="${escapeAttr(firstUrl)}" loading="lazy" alt="${escapeAttr(deckName)}" class="w-full h-full object-cover rounded-md shadow-sm border border-stone-200 pointer-events-none group-hover/preview:ring-2 group-hover/preview:ring-hearthstone/50 transition">`;

  return `
    <div class="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 cursor-zoom-in group/preview">
      ${multiPicBadge}
      <button type="button" class="media-preview-trigger w-full h-full block" data-urls="${encodedUrls}" title="点击放大查看">
        ${media}
      </button>
    </div>`;
}

function buildDeckHtml(deck) {
  const badgeStyle = CLASS_COLORS[deck.class_name] || 'bg-stone-200 text-stone-800';
  const privateBadge =
    deck.is_public === false
      ? `<span class="text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap bg-red-50 text-red-500 border border-red-200 ml-1 flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3"></i> 私有</span>`
      : '';
  const urls = parseMediaUrls(deck.image_url);
  const mediaHtml = buildDeckMediaHtml(urls, deck.deck_name);
  const emptyHint = state.isOwnerMode ? '酒馆空空如也，点击「编辑」添加' : '暂无卡组';

  const ownerActions = state.isOwnerMode
    ? `
    <div class="flex gap-3 justify-end mt-3 pt-3 border-t border-stone-200/60">
      <button data-action="edit-deck" data-id="${deck.id}" class="flex items-center gap-1 text-xs text-stone-500 hover:text-blue-500 transition px-2 py-1 bg-white rounded border border-stone-200 shadow-sm"><i data-lucide="edit-2" class="w-3 h-3"></i>编辑</button>
      <button data-action="delete-deck" data-id="${deck.id}" class="flex items-center gap-1 text-xs text-stone-500 hover:text-red-500 transition px-2 py-1 bg-white rounded border border-stone-200 shadow-sm"><i data-lucide="trash-2" class="w-3 h-3"></i>删除</button>
    </div>`
    : '';

  return `
    <div class="flex flex-col sm:flex-row gap-4 p-4 border border-stone-200 rounded-lg bg-stone-50/50 hover:shadow-md transition gpu-accelerate">
      ${mediaHtml}
      <div class="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2 mb-2">
            <h4 class="font-bold text-stone-900 break-words text-base leading-tight">${escapeHtml(deck.deck_name)}</h4>
            <div class="flex gap-1 flex-wrap justify-end">
              <span class="text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap bg-stone-100 text-stone-600 border border-stone-200">${escapeHtml(deck.mode || '标准')}</span>
              <span class="text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap ${badgeStyle}">${escapeHtml(deck.class_name)}</span>
              ${privateBadge}
            </div>
          </div>
          <p class="text-xs text-stone-500 mt-1 whitespace-pre-wrap break-words">${escapeHtml(deck.description || '这套卡组没有留下简介...')}</p>
        </div>
        <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <input type="text" value="${escapeAttr(deck.deck_code)}" readonly class="text-xs border border-stone-300 p-1.5 rounded w-full bg-white text-stone-600 focus:outline-none focus:border-hearthstone">
          <button data-action="copy-code" data-code="${escapeAttr(deck.deck_code)}" class="flex items-center justify-center gap-1 whitespace-nowrap text-xs bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-700 transition active:scale-95 text-center"><i data-lucide="copy" class="w-3 h-3"></i>复制代码</button>
        </div>
        ${ownerActions}
      </div>
    </div>`;
}

export function renderDecks(decksData) {
  const container = document.getElementById('list-hearthstone');
  if (!container) return;

  const emptyHint = state.isOwnerMode ? '酒馆空空如也，点击「编辑」添加' : '暂无卡组';

  if (decksData.length === 0) {
    container.innerHTML = `<p class="text-stone-400 text-xs italic">${emptyHint}</p>`;
  } else {
    container.innerHTML = decksData.map(buildDeckHtml).join('');
  }
  refreshIcons();
  initDeckVideoHover();
}

function initDeckVideoHover() {
  document.querySelectorAll('.deck-video').forEach((video) => {
    const parent = video.closest('.group\\/preview');
    if (!parent || parent.dataset.videoBound) return;
    parent.dataset.videoBound = '1';
    parent.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    parent.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

export function copyDeckCode(btnElement, code) {
  navigator.clipboard.writeText(code).then(() => {
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i>已复制`;
    refreshIcons();
    btnElement.classList.replace('bg-stone-800', 'bg-hearthstone');
    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      refreshIcons();
      btnElement.classList.replace('bg-hearthstone', 'bg-stone-800');
    }, 2000);
  });
}
