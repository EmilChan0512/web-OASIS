import { useEffect, useState } from 'react';
import { command, getSnapshot, mockMode, socketUrl, subscribeMock } from '../api/client';
import { advance } from '../api/mock';
import { AgentInspector } from '../components/AgentInspector';
import { EventStream } from '../components/EventStream';
import { SocialGraphView } from '../components/SocialGraphView';
import { useI18n } from '../i18n';
import type { Snapshot } from '../types/api';
import './ios26.css';

const empty: Snapshot = { state: { step: 0, running: false, oasisStatus: 'uninitialized', llmStatus: 'unknown', activeAgentIds: [], totalEvents: 0, llmRequestCount: 0, errorCount: 0 }, agents: [], graph: [], events: [] };

export function Version2App() {
  const { t, toggleLocale } = useI18n();
  const [snapshot, setSnapshot] = useState(empty);
  const [ws, setWs] = useState('CONNECTING');
  const [error, setError] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<number>();
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [lightTheme, setLightTheme] = useState(() => localStorage.getItem('ios26-theme') === 'light' || import.meta.env.VITE_IOS26_THEME === 'light');

  useEffect(() => { localStorage.setItem('ios26-theme', lightTheme ? 'light' : 'dark'); }, [lightTheme]);
  useEffect(() => {
    getSnapshot().then(setSnapshot).catch(reason => setError(reason.message));
    if (mockMode) {
      setWs('MOCK'); const unsubscribe = subscribeMock(setSnapshot); const timer = window.setInterval(advance, 4000);
      return () => { unsubscribe(); window.clearInterval(timer); };
    }
    const socket = new WebSocket(socketUrl);
    socket.onopen = () => setWs('CONNECTED'); socket.onclose = () => setWs('DISCONNECTED');
    socket.onmessage = message => { const packet = JSON.parse(message.data); if (packet.type === 'snapshot') setSnapshot(packet.data); if (packet.type === 'event') setSnapshot(previous => ({ ...previous, events: [...previous.events, packet.data] })); };
    return () => socket.close();
  }, []);
  const run = async (name: 'start' | 'pause' | 'resume' | 'step') => { try { setSnapshot(await command(name)); setError(''); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Command failed'); } };
  const status = snapshot.state.running ? t('running') : t('standby');

  return <main className={`ios26 ${lightTheme ? 'ios26-light' : ''}`}>
    <section className="ios26-hero"><div className="ios26-topline"><span>{t('experiment')}</span>{mockMode && <mark>{t('mockData')}</mark>}<button className="ios26-theme" onClick={() => setLightTheme(value => !value)} aria-label="Toggle light theme">{lightTheme ? '◐' : '○'}</button><button className="ios26-language" onClick={toggleLocale}>{t('language')}</button></div><h1>{t('title')}</h1><p>{t('subtitle')}</p><div className="ios26-status"><span className={snapshot.state.running ? 'ios26-live' : ''}/>{status}<b>{t('step')} {snapshot.state.step}</b></div></section>
    <section className="ios26-summary"><article><span>◎</span><div><small>{t('metricActive')}</small><b>{snapshot.state.activeAgentIds.length} / 20</b></div></article><article><span>◌</span><div><small>{t('metricEvents')}</small><b>{snapshot.state.totalEvents}</b></div></article><article><span>⌁</span><div><small>WebSocket</small><b>{t(ws.toLowerCase())}</b></div></article></section>
    <section className="ios26-surface"><SocialGraphView agents={snapshot.agents} graph={snapshot.graph} active={snapshot.state.activeAgentIds} selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId}/></section>
    <AgentInspector snapshot={snapshot} agentId={selectedAgentId} onClose={() => setSelectedAgentId(undefined)}/>
    <section className="ios26-feed"><EventStream events={snapshot.events} selectedEventId={selectedEventId} onSelectAgent={setSelectedAgentId} onSelectEvent={event => setSelectedEventId(event.id)}/></section>
    <nav className="ios26-dock"><button className="ios26-primary" onClick={() => run(snapshot.state.running ? 'pause' : 'start')}><span>{snapshot.state.running ? 'Ⅱ' : '▶'}</span>{snapshot.state.running ? t('pause') : t('start')}</button><button onClick={() => run('step')}><span>＋</span>{t('stepOnce')}</button><button onClick={() => run('resume')}><span>↻</span>{t('resume')}</button></nav>
    {error && <output className="ios26-error">{error}</output>}<footer>{t(mockMode ? 'footerMock' : 'footerReal')}</footer>
  </main>;
}
