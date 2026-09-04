import type { Snapshot } from '../types/api';
const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8001';
export const getSnapshot = async (): Promise<Snapshot> => (await fetch(`${base}/api/simulation`)).json();
export const command = async (name: 'start'|'pause'|'resume'|'step') => {
  const response = await fetch(`${base}/api/simulation/${name}`, { method:'POST' });
  if (!response.ok) throw new Error((await response.json()).detail ?? 'Backend request failed');
  return response.json() as Promise<Snapshot>;
};
export const socketUrl = base.replace(/^http/, 'ws') + '/ws';
