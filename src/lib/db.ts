import Dexie, { type EntityTable } from "dexie";
import { createSampleTrack } from "../data/sample";
import type { Discovery, LocationTrack, QuestAttempt, UserSettings } from "../types";
import { createId } from "./id";

export class YorimichiDatabase extends Dexie {
  attempts!: EntityTable<QuestAttempt, "id">;
  discoveries!: EntityTable<Discovery, "id">;
  locationTracks!: EntityTable<LocationTrack, "id">;
  settings!: EntityTable<UserSettings, "id">;

  constructor(name = "yorimichi-quest") {
    super(name);
    this.version(1).stores({
      attempts: "id,status,startedAt,endedAt,questId",
      discoveries: "id,createdAt,attemptId,questId,discoveryNumber",
      locationTracks: "++id,attemptId,recordedAt,[attemptId+sequence]",
      settings: "id",
    });
  }
}

export const db = new YorimichiDatabase();

export async function getActiveAttempt() {
  return db.attempts.where("status").equals("active").last();
}

export async function createAttempt(attempt: QuestAttempt) {
  await db.transaction("rw", db.attempts, async () => {
    const active = await db.attempts.where("status").equals("active").toArray();
    await Promise.all(
      active.map((item) => db.attempts.update(item.id, { status: "abandoned", endedAt: Date.now() })),
    );
    await db.attempts.add(attempt);
  });
  return attempt;
}

export async function appendTrackPoint(attemptId: string, point: Omit<LocationTrack, "id" | "attemptId">) {
  const previous = await db.locationTracks.where("attemptId").equals(attemptId).last();
  if (previous) {
    const latDelta = Math.abs(previous.latitude - point.latitude);
    const lngDelta = Math.abs(previous.longitude - point.longitude);
    if (latDelta < 0.000002 && lngDelta < 0.000002) return previous.id;
  }
  return db.locationTracks.add({ ...point, attemptId });
}

export async function abandonAttempt(attemptId: string) {
  await db.attempts.update(attemptId, { status: "abandoned", endedAt: Date.now() });
}

export async function saveDiscovery(
  attempt: QuestAttempt,
  values: Pick<Discovery, "note" | "category" | "photo">,
) {
  return db.transaction("rw", db.attempts, db.discoveries, async () => {
    const count = await db.discoveries.count();
    const endedAt = Date.now();
    const discovery: Discovery = {
      id: createId("discovery"),
      attemptId: attempt.id,
      questId: attempt.questId,
      questTitle: attempt.questTitle,
      createdAt: endedAt,
      note: values.note?.trim() || undefined,
      category: values.category,
      photo: values.photo,
      durationSeconds: Math.max(1, Math.round((endedAt - attempt.startedAt) / 1000)),
      discoveryNumber: count + 1,
    };
    await db.discoveries.add(discovery);
    await db.attempts.update(attempt.id, { status: "completed", endedAt });
    return discovery;
  });
}

export async function seedSampleData() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endedAt = Math.max(startOfToday.getTime(), now.getTime() - 45 * 60 * 1000);
  const startedAt = endedAt - 9 * 60 * 1000;
  const attemptId = "sample-attempt-first";
  const discovery: Discovery = {
    id: "sample-discovery-first",
    attemptId,
    questId: "unknown-color",
    questTitle: "知らない色を一枚",
    createdAt: endedAt,
    note: "木漏れ日の中に、青みがかった緑を見つけた。",
    category: "色",
    durationSeconds: 9 * 60,
    discoveryNumber: 1,
    sampleSeed: true,
  };
  const attempt: QuestAttempt = {
    id: attemptId,
    questId: discovery.questId,
    questTitle: discovery.questTitle,
    questInstruction: "今日の空気に似合う、名前をつけたくなる色を一つ見つけよう。",
    plannedMinutes: 10,
    mood: "photo",
    startedAt,
    endedAt,
    status: "completed",
    locationMode: "sample",
  };
  const track = createSampleTrack(startedAt).map((point, sequence) => ({
    attemptId,
    ...point,
    sequence,
  }));

  return db.transaction("rw", db.attempts, db.discoveries, db.locationTracks, async () => {
    const existing = await db.discoveries.get(discovery.id);
    if (existing) return existing;
    await db.attempts.put(attempt);
    await db.discoveries.put(discovery);
    await db.locationTracks.bulkAdd(track);
    return discovery;
  });
}
