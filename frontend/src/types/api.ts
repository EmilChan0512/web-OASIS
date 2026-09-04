export type Agent = { id:number; name:string; handle:string; description:string };
export type Edge = { source:number; target:number };
export type Event = { id:string; step:number; timestamp:string; actorId:number; actorName:string; actionType:string; targetAgentName?:string; content?:string };
export type State = { step:number; running:boolean; oasisStatus:string; llmStatus:string; llmModel?:string; lastTickDurationMs?:number; activeAgentIds:number[]; totalEvents:number; llmRequestCount:number; errorCount:number; error?:string };
export type Snapshot = { state:State; agents:Agent[]; graph:Edge[]; events:Event[] };
