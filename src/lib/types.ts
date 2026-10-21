export type RecordingStatus = "uploading" | "transcribing" | "structuring" | "indexing" | "ready" | "failed";

export interface ActionLog {
  timestamp: number;
  type: "click" | "input" | "navigate" | "shortcut";
  app?: string;
  target?: string;
  url?: string;
  text?: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Recording {
  id: string;
  brainId: string;
  title: string;
  status: RecordingStatus;
  createdAt: string;
  durationSec: number;
  actionLogs: ActionLog[];
  transcript: TranscriptSegment[];
  sops: string[];
  sensitiveMasked: number;
}

export interface SopStep {
  id: string;
  order: number;
  title: string;
  instruction: string;
  tool?: string;
  rationale?: string;
  timestamps?: { start: number; end: number };
}

export interface Sop {
  id: string;
  brainId: string;
  recordingId?: string;
  title: string;
  frequency: "daily" | "weekly" | "monthly" | "adhoc";
  steps: SopStep[];
  tools: string[];
  contacts: string[];
  sourceExcerpt?: string;
  createdAt: string;
}

export interface DependencyEdge {
  type: "tool" | "contact";
  name: string;
  role?: string;
  linkedSops: string[];
}

export interface Brain {
  id: string;
  name: string;
  ownerId: string;
  owner: string;
  scope: "job" | "team" | "project";
  description: string;
  referenceDuties: string[];
  createdAt: string;
}

export interface Chunk {
  id: string;
  brainId: string;
  sopId?: string;
  recordingId?: string;
  kind: "transcript" | "sop" | "document";
  text: string;
  embedding: number[];
}

export interface ChatMessage {
  id: string;
  brainId: string;
  role: "user" | "assistant";
  content: string;
  citations: string[];
  createdAt: string;
}

export interface OnboardingProgress {
  inboarderName: string;
  brainId: string;
  completedSopIds: string[];
  askedQuestions: number;
  blockingTopics: Record<string, number>;
}


export interface Insight {
  id: string;
  brainId: string;
  kind: "project" | "difficulty" | "attention" | "preference" | "context";
  title: string;
  detail: string;
  updatedAt: string;
  createdAt: string;
}

export interface Db {
  brains: Brain[];
  recordings: Record<string, Recording>;
  sops: Record<string, Sop>;
  chunks: Chunk[];
  messages: ChatMessage[];
  insights: Insight[];
  progress: Record<string, OnboardingProgress>;
}
