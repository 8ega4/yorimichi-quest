import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createAttempt, db, getActiveAttempt, saveDiscovery, seedSampleData } from "../src/lib/db";
import type { QuestAttempt } from "../src/types";

const attempt: QuestAttempt = {
  id: "attempt-test",
  questId: "round-things",
  questTitle: "街の丸を探せ",
  questInstruction: "丸い形を三つ探そう。",
  plannedMinutes: 5,
  mood: "look",
  startedAt: Date.now() - 60_000,
  status: "active",
  locationMode: "sample",
};

describe("local persistence", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterEach(async () => {
    db.close();
  });

  it("restores an active attempt after reopening IndexedDB", async () => {
    await createAttempt(attempt);
    db.close();
    await db.open();
    expect(await getActiveAttempt()).toMatchObject({ id: attempt.id, status: "active" });
  });

  it("completes without a photo and persists a discovery", async () => {
    await createAttempt(attempt);
    const discovery = await saveDiscovery(attempt, { note: "小さな丸を見つけた。", category: "かたち" });
    expect(discovery.photo).toBeUndefined();
    expect(await db.discoveries.get(discovery.id)).toEqual(discovery);
    expect((await db.attempts.get(attempt.id))?.status).toBe("completed");
  });

  it("seeds sample data only once", async () => {
    await seedSampleData();
    await seedSampleData();
    expect(await db.discoveries.count()).toBe(1);
    expect(await db.locationTracks.count()).toBe(10);
  });
});
