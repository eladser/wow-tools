export interface CharRef {
  region: string;
  realm: string;
  name: string;
}

const RECENT_KEY = 'wow-tools.recent-chars';

export function recentChars(): CharRef[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function rememberChar(c: CharRef) {
  const list = [c, ...recentChars().filter(x => !(x.name === c.name && x.realm === c.realm && x.region === c.region))].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
