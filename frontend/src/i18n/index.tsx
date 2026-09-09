import { createContext, useContext, useEffect, useState } from 'react';

export type Locale = 'zh-CN' | 'en-US';
const messages: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    experiment: '实验 001', mockData: '模拟数据', title: 'OASIS / 活态社交网络', subtitle: '自主社交平台动态观测器，而非物理世界。',
    running: '运行中', standby: '待命', step: '步数', start: '开始', pause: '暂停', resume: '继续', stepOnce: '执行一步', language: 'EN',
    followGraph: '关注关系图', presentationOnly: '拖拽仅改变展示布局', debug: '调试 / 运行时', eventStream: '实时事件流', retained: '条已保留',
    noEvents: '暂无真实 OASIS 行为。请在 OASIS 与 vLLM 连接后启动运行时。', footerReal: '20 个固定展示节点 · 关注边持久化 · 实时推送 OASIS trace 事件', footerMock: '模拟数据 · 确定性的纯前端事件序列 · 不调用 OASIS 或 vLLM',
    metricStep: '步数', metricRuntime: '运行状态', metricOasis: 'OASIS', metricVllm: 'vLLM', metricWebSocket: 'WebSocket', metricActive: '活跃 Agent', metricLlmRequests: 'LLM 请求', metricEvents: '事件数', metricLastTick: '上次 Tick', metricErrors: '错误数',
    paused: '已暂停', connected: '已连接', connecting: '连接中', disconnected: '未连接', uninitialized: '未初始化', mock: '模拟', unknown: '未知',
    'action.CREATE_POST': '发布动态', 'action.CREATE_COMMENT': '发表评论', 'action.REPOST': '转发动态', 'action.LIKE_POST': '点赞动态', 'action.FOLLOW': '关注', 'action.LLM_ACTION': 'LLM 行为',
    'mock.1': '听说社区花园下个月可能关闭。有人知道发生了什么吗？', 'mock.2': '有人看过公开征询的日程吗？', 'mock.3': '这件事值得分享给邻里群。', 'mock.5': '花园不仅是聚会空间，也影响雨水排放。', 'mock.7': '拿到原始文件后，我可以整理一份摘要。',
  },
  'en-US': {
    experiment: 'EXPERIMENT 001', mockData: 'MOCK DATA', title: 'OASIS / LIVING SOCIAL NETWORK', subtitle: 'An observer for autonomous social-platform dynamics — not a physical world.',
    running: 'RUNNING', standby: 'STANDBY', step: 'STEP', start: 'Start', pause: 'Pause', resume: 'Resume', stepOnce: 'Step once', language: '中文',
    followGraph: 'FOLLOW GRAPH', presentationOnly: 'dragging alters presentation only', debug: 'DEBUG / RUNTIME', eventStream: 'LIVE EVENT STREAM', retained: 'retained',
    noEvents: 'No real OASIS actions yet. Start the runtime after OASIS and vLLM are connected.', footerReal: '20 fixed presentation nodes · Follow edges persist · OASIS trace events stream live', footerMock: 'MOCK DATA · deterministic frontend-only event sequence · no OASIS or vLLM calls',
    metricStep: 'Step', metricRuntime: 'Runtime', metricOasis: 'OASIS', metricVllm: 'vLLM', metricWebSocket: 'WebSocket', metricActive: 'Active', metricLlmRequests: 'LLM requests', metricEvents: 'Events', metricLastTick: 'Last tick', metricErrors: 'Errors',
    paused: 'PAUSED', connected: 'CONNECTED', connecting: 'CONNECTING', disconnected: 'DISCONNECTED', uninitialized: 'UNINITIALIZED', mock: 'MOCK', unknown: 'UNKNOWN',
    'action.CREATE_POST': 'CREATE POST', 'action.CREATE_COMMENT': 'CREATE COMMENT', 'action.REPOST': 'REPOST', 'action.LIKE_POST': 'LIKE POST', 'action.FOLLOW': 'FOLLOW', 'action.LLM_ACTION': 'LLM ACTION',
    'mock.1': 'I heard the community garden may close next month. Does anyone know what happened?', 'mock.2': 'Has anyone seen the public consultation schedule?', 'mock.3': 'This is worth sharing with the neighborhood group.', 'mock.5': 'The garden affects storm-water drainage as well as gathering space.', 'mock.7': 'I can summarize the proposal once we have the source document.',
  },
};

let activeLocale: Locale = 'zh-CN';
export const translate = (key: string) => messages[activeLocale][key] ?? key;
const I18nContext = createContext<{ locale: Locale; t: (key: string) => string; toggleLocale: () => void }>({ locale: activeLocale, t: translate, toggleLocale: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('oasis-locale') as Locale) || 'zh-CN');
  useEffect(() => { activeLocale = locale; localStorage.setItem('oasis-locale', locale); document.documentElement.lang = locale; }, [locale]);
  const toggleLocale = () => setLocale(current => current === 'zh-CN' ? 'en-US' : 'zh-CN');
  return <I18nContext.Provider value={{ locale, t: (key: string) => messages[locale][key] ?? key, toggleLocale }}>{children}</I18nContext.Provider>;
}
export const useI18n = () => useContext(I18nContext);
