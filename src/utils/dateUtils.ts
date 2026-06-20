export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}年${m}月${d}日`;
}

export function daysSince(dateStr: string): number {
  if (!dateStr) return 0;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function relativeDate(dateStr: string): string {
  const days = daysSince(dateStr);
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}

export function getCurrentSeason(): '春' | '夏' | '秋' | '冬' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

export function getSeasonalTips(season: '春' | '夏' | '秋' | '冬'): string[] {
  switch (season) {
    case '春':
      return [
        '检查冬季温差造成的墙面裂缝',
        '雨季来临前检查窗边、阳台墙面是否有渗水迹象',
        '春季适合墙面翻新，检查腻子层是否牢固',
        '清理墙面灰尘，检查是否有霉菌萌芽',
      ];
    case '夏':
      return [
        '高温潮湿天气注意检查墙面霉斑',
        '空调下方墙面检查冷凝水造成的水渍',
        '卫生间、厨房背面墙检查是否渗水',
        '梅雨季保持通风，防止墙面发霉起皮',
      ];
    case '秋':
      return [
        '秋季干燥，检查墙面是否因干燥收缩开裂',
        '检查阳台、外墙内侧是否有渗水',
        '秋季适合墙面修补，湿度适宜',
        '清理暖气附近墙面的灰尘和烤痕',
      ];
    case '冬':
      return [
        '供暖期检查暖气上方墙面是否变黄',
        '室内外温差大，检查窗边是否结露导致墙面损坏',
        '检查踢脚线附近是否有冻融造成的起皮',
        '冬季干燥，注意保持室内湿度避免墙面开裂',
      ];
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
