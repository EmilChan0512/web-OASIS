import type { Snapshot } from '../types/api';
import { getMockSnapshot, mockCommand, subscribeMock } from './mock';
const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8001';
export const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
export const getSnapshot = async (): Promise<Snapshot> => mockMode ? getMockSnapshot() : (await fetch(`${base}/api/simulation`)).json();
export const command = async (name: 'start'|'pause'|'resume'|'step') => {
  if (mockMode) return mockCommand(name);
  const response = await fetch(`${base}/api/simulation/${name}`, { method:'POST' });
  if (!response.ok) throw new Error((await response.json()).detail ?? 'Backend request failed');
  return response.json() as Promise<Snapshot>;
};
export const socketUrl = base.replace(/^http/, 'ws') + '/ws';
export { subscribeMock };
