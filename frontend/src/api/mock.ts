import agents from '../../../data/agents.json';
import type { Event, Snapshot } from '../types/api';
import { translate } from '../i18n';

const graph = agents.flatMap(agent => agent.follows.map(target => ({ source: agent.id, target })));
const script = [
  [0, 'CREATE_POST', 'mock.1'], [1, 'CREATE_COMMENT', 'mock.2'], [6, 'REPOST', 'mock.3'], [4, 'LIKE_POST', ''], [10, 'CREATE_POST', 'mock.5'], [14, 'FOLLOW', ''], [18, 'CREATE_COMMENT', 'mock.7'],
] as const;

let cursor = 0;
let snapshot: Snapshot = {
  state: { step: 0, running: false, oasisStatus: 'uninitialized', llmStatus: 'unknown', llmModel: 'Mock data only', activeAgentIds: [], totalEvents: 0, llmRequestCount: 0, errorCount: 0 },
  agents: agents.map(({ id, name, handle, description }) => ({ id, name, handle, description })), graph, events: [],
};

const listeners = new Set<(value: Snapshot) => void>();
const clone = () => structuredClone(snapshot);
const notify = () => listeners.forEach(listener => listener(clone()));

export const getMockSnapshot = () => clone();
export const subscribeMock = (listener: (value: Snapshot) => void) => { listeners.add(listener); return () => listeners.delete(listener); };

export const mockCommand = (name: 'start' | 'pause' | 'resume' | 'step') => {
  if (name === 'pause') snapshot.state.running = false;
  else if (name === 'start' || name === 'resume') snapshot.state.running = true;
  if (name === 'step') advance(true);
  else if (name === 'start' || name === 'resume') advance();
  notify();
  return clone();
};

export const advance = (force = false) => {
  if (!snapshot.state.running && !force) return;
  const [actorId, actionType, content] = script[cursor++ % script.length];
  const actor = snapshot.agents[actorId];
  const target = actionType === 'FOLLOW' ? snapshot.agents[(actorId + 3) % snapshot.agents.length] : undefined;
  const event: Event = { id: `mock-${snapshot.state.step + 1}-${cursor}`, step: snapshot.state.step + 1, timestamp: new Date().toISOString(), actorId, actorName: actor.name, actionType, targetAgentName: target?.name, content: content ? translate(content) : undefined };
  snapshot = { ...snapshot, state: { ...snapshot.state, step: snapshot.state.step + 1, oasisStatus: 'uninitialized', llmStatus: 'unknown', activeAgentIds: [actorId], totalEvents: snapshot.events.length + 1, llmRequestCount: 0 }, events: [...snapshot.events, event] };
  notify();
};
