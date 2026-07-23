export type QuestDuration = 5 | 10 | 15;
export type QuestMood = "look" | "walk" | "photo";

export interface Quest {
  id: string;
  title: string;
  description: string;
  instruction: string;
  durations: QuestDuration[];
  moods: QuestMood[];
  category: DiscoveryCategory;
}

export type AttemptStatus = "active" | "completed" | "abandoned";
export type LocationMode = "live" | "sample" | "unavailable";

export interface QuestAttempt {
  id: string;
  questId: string;
  questTitle: string;
  questInstruction: string;
  plannedMinutes: QuestDuration;
  mood: QuestMood;
  startedAt: number;
  endedAt?: number;
  status: AttemptStatus;
  locationMode: LocationMode;
}

export type DiscoveryCategory = "風景" | "かたち" | "色" | "音" | "道" | "そのほか";

export interface Discovery {
  id: string;
  attemptId: string;
  questId: string;
  questTitle: string;
  createdAt: number;
  note?: string;
  category?: DiscoveryCategory;
  photo?: Blob;
  durationSeconds: number;
  discoveryNumber: number;
  sampleSeed?: boolean;
}

export interface LocationTrack {
  id?: number;
  attemptId: string;
  recordedAt: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  sequence: number;
}

export interface UserSettings {
  id: "local";
  preferredDuration: QuestDuration;
  preferredMood: QuestMood;
  hasSeenWelcome: boolean;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  recordedAt: number;
}
