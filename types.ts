export interface EntryTime {
  main: string;
  reentries: string[];
}

export interface AnalysisResult {
  asset: string;
  timeframe: string;
  patterns: string[];
  summary: string;
  entryTime: EntryTime;
  recommendation: string;
}

export enum TTSPlaybackState {
  IDLE,
  LOADING,
  PLAYING,
  ERROR,
}

export interface User {
  id: number;
  email: string;
  subscription: {
    plan: string;
    status: 'active' | 'inactive';
    expiresAt: string | null;
  };
}