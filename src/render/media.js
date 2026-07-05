import { state, STATUS_TAGS } from '../state.js';
import { escapeHtml, escapeAttr } from '../lib/escape.js';
import { refreshIcons } from '../lib/icons.js';
import { parseMediaUrls, isVideoUrl } from '../lib/media-utils.js';

const LOADING_HTML = `
  <li class="flex items-center gap-2 text-stone-400 text-xs py-4">
    <span class="inline-block w-4 h-4 border-2 border-stone-300 border-t-douban rounded-full animate-spin"></span>
    正在加载...
  </li>`;

export function showMediaLoading() {
  ['reading', 'watching', 'listening'].forEach((type) => {
    const ul = document.getElementById(`list-${type}`);
    if (ul) ul.innerHTML = LOADING_HTML;
  });
}

function buildFileHtml(urls) {
  if (!urls.length) return '';
  const firstUrl = urls[0];
  const isVid = isVideoUrl(firstUrl);
  const encodedUrls = encodeURIComponent(JSON.stringify(urls));
  const multiPicBadge =
    urls.length > 1
      ? `<div class="absolute top-2 right-2 bg-stone-900/70 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10 font-bold flex items-center gap-1"><i data-lucide="images" class="w-3 h-3"></i> ${urls.length}</div>`
      : '';

  const media = isVid
    ? `<video src="${escapeAttr(firstUrl)}" class="w-full rounded-md border border-stone-200 shadow-sm pointer-events-none" muted preload="metadata"></video>`
    : `<img src="${escapeAttr(firstUrl)}" loading="lazy" alt="" class="w-full rounded-md border border-stone-200 shadow-sm object-cover pointer-events-none group-hover/preview:opacity-90 transition">`;

  return `
    <div class="relative max-w-sm mt-3 group/preview cursor-zoom-in">
      ${multiPicBadge}
      <button type="button" class="media-preview-trigger w-full block text-left" data-urls="${encodedUrls}" title="点击放大查看">
        ${media}
      </button>
    </div>`;
}

function buildMediaItemHtml(item) {
  const stars = '★'.repeat(Number(item.rating || 5)) + '☆'.repeat(5 - Number(item.rating || 5));
  const currentTag = STATUS_TAGS[item.status] || STATUS_TAGS.collect;
  const privateBadge =
    item.is_public === false
      ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 ml-2 whitespace-nowrap flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3"></i> 仅自己可见</span>`
      : '';
  const urls = parseMediaUrls(item.file_url);
  const fileHtml = buildFileHtml(urls);
  const emptyHint = state.isOwnerMode ? '暂无记录，按 i 键添加' : '暂无记录';

  const ownerActions = state.isOwnerMode
    ? `
    <div class="flex gap-3 justify-end mt-1">
      <button data-action="edit-media" data-id="${item.id}" class="flex items-center gap-1 text-xs text-stone-400 hover:text-blue-500 transition px-2 py-1 bg-white rounded border border-stone-200 shadow-sm"><i data-lucide="edit-2" class="w-3 h-3"></i>编辑</button>
      <button data-action="delete-media" data-id="${item.id}" class="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition px-2 py-1 bg-white rounded border border-stone-200 shadow-sm"><i data-lucide="trash-2" class="w-3 h-3"></i>删除</button>
    </div>`
    : '';

  return `
    <li class="border-b border-stone-100 pb-4 hover:bg-stone-50/50 p-3 rounded group transition flex flex-col gap-2">
      <div class="flex justify-between items-start gap-4">
        <div class="flex items-center gap-2 flex-wrap flex-1">
          <span class="text-stone-900 font-medium break-words">${escapeHtml(item.title)}</span>
          <span class="text-xs text-stone-400 break-words">/ ${escapeHtml(item.author)}</span>
          <span class="text-[10px] px-1.5 py-0.5 border rounded whitespace-nowrap ${currentTag.css}">${currentTag.text}</span>
          <span class="text-xs text-amber-500 font-mono whitespace-nowrap">${stars}</span>
          ${privateBadge}
        </div>
      </div>
      ${item.comment ? `<p class="text-xs text-stone-500 pl-2 bg-stone-50 p-2 rounded border-l-2 border-stone-300 italic whitespace-pre-wrap break-words">"${escapeHtml(item.comment)}"</p>` : ''}
      ${fileHtml}
      ${ownerActions}
    </li>`;
}

export function renderLists(mediaData) {
  const types = ['reading', 'watching', 'listening'];
  const emptyHint = state.isOwnerMode ? '暂无记录，按 i 键添加' : '暂无记录';

  types.forEach((type) => {
    const ul = document.getElementById(`list-${type}`);
    if (!ul) return;
    const currentTypeData = mediaData.filter((item) => item.type === type);

    if (currentTypeData.length === 0) {
      ul.innerHTML = `<li class="text-stone-400 text-xs italic">${emptyHint}</li>`;
    } else {
      ul.innerHTML = currentTypeData.map(buildMediaItemHtml).join('');
    }
  });
  refreshIcons();
}
