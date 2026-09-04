import { useMemo, useState } from 'react';
import positions from '../../../data/presentation.json';
import type { Agent, Edge } from '../types/api';

type Position = { id:number; x:number; y:number };
export function SocialGraphView({ agents, graph, active }: {agents:Agent[]; graph:Edge[]; active:number[]}) {
  const [layout, setLayout] = useState<Position[]>(positions);
  const [dragged, setDragged] = useState<number | null>(null);
  const indexed = useMemo(() => new Map(layout.map(node => [node.id, node])), [layout]);
  const reposition = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragged === null) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((event.clientX - box.left) / box.width) * 100));
    const y = Math.max(5, Math.min(95, ((event.clientY - box.top) / box.height) * 100));
    setLayout(nodes => nodes.map(node => node.id === dragged ? {...node, x, y} : node));
  };
  return <section className="graph-panel"><div className="panel-label"><span>FOLLOW GRAPH</span><small>dragging alters presentation only</small></div>
    <svg className="graph" viewBox="0 0 100 100" onPointerMove={reposition} onPointerUp={() => setDragged(null)} onPointerLeave={() => setDragged(null)}>
      <defs><marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" className="arrow" /></marker></defs>
      {graph.map((edge, index) => { const from=indexed.get(edge.source); const to=indexed.get(edge.target); return from && to && <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge" markerEnd="url(#arrow)"/>; })}
      {agents.map(agent => { const node=indexed.get(agent.id); if (!node) return null; const isActive=active.includes(agent.id); return <g key={agent.id} transform={`translate(${node.x} ${node.y})`} className={`agent ${isActive ? 'active':''}`} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDragged(agent.id); }}>
        <circle r="3.25"/><text y=".7" textAnchor="middle">{agent.name[0]}</text><text y="5.5" textAnchor="middle" className="agent-name">{agent.name}</text></g>; })}
    </svg></section>;
}
