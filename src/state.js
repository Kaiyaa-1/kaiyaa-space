export const state = {
  isOwnerMode: localStorage.getItem('kaiyaa_admin') === 'true',
  currentSettings: null,
  currentActiveView: 'reading',
  globalMediaData: [],
  globalDecksData: [],
  editingMediaId: null,
  editingDeckId: null,
  previewUrls: [],
  previewIndex: 0,
};

export const VIEWS = ['reading', 'watching', 'listening', 'hearthstone'];

export const STATUS_TAGS = {
  wish: { text: '想看', css: 'bg-blue-50 text-blue-600 border-blue-100' },
  doing: { text: '在看', css: 'bg-green-50 text-green-600 border-green-100' },
  collect: { text: '看过', css: 'bg-stone-100 text-stone-600 border-stone-200' },
};

export const CLASS_COLORS = {
  死亡骑士: 'bg-cyan-900 text-cyan-100',
  恶魔猎手: 'bg-green-800 text-green-100',
  德鲁伊: 'bg-amber-700 text-amber-100',
  猎人: 'bg-emerald-700 text-emerald-100',
  法师: 'bg-blue-600 text-blue-100',
  圣骑士: 'bg-yellow-500 text-yellow-900',
  牧师: 'bg-stone-100 text-stone-800 border-stone-300 border',
  潜行者: 'bg-stone-800 text-stone-100',
  萨满祭司: 'bg-indigo-700 text-indigo-100',
  术士: 'bg-purple-800 text-purple-100',
  战士: 'bg-red-800 text-red-100',
};

export function setOwnerMode(value) {
  state.isOwnerMode = value;
  if (value) {
    localStorage.setItem('kaiyaa_admin', 'true');
  } else {
    localStorage.removeItem('kaiyaa_admin');
  }
}
