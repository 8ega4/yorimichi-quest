import { describe, expect, it } from "vitest";
import { selectQuest } from "../src/data/quests";

describe("selectQuest", () => {
  it("is deterministic for the same date, duration, and mood", () => {
    const date = new Date(2026, 6, 23, 12);
    expect(selectQuest(date, 10, "walk")).toEqual(selectQuest(date, 10, "walk"));
  });

  it("does not repeat on consecutive days for the same choice", () => {
    for (let day = 2; day <= 28; day += 1) {
      const current = new Date(2026, 6, day, 12);
      const previous = new Date(2026, 6, day - 1, 12);
      expect(selectQuest(current, 10, "walk").id).not.toBe(selectQuest(previous, 10, "walk").id);
    }
  });

  it("uses both duration and mood to choose from eligible quests", () => {
    const date = new Date(2026, 6, 23, 12);
    const photoQuest = selectQuest(date, 5, "photo");
    expect(photoQuest.durations).toContain(5);
    expect(photoQuest.moods).toContain("photo");
  });
});
