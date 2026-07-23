import { describe, expect, it } from "vitest";
import { buildShareCardContent } from "../src/lib/share";
import type { Discovery } from "../src/types";

describe("share card privacy", () => {
  it("contains no address, coordinates, map, or capture location", () => {
    const discovery: Discovery = {
      id: "discovery-1",
      attemptId: "attempt-1",
      questId: "look-up",
      questTitle: "上を向いて歩こう",
      createdAt: Date.now(),
      note: "屋根の上に風見鶏。",
      category: "風景",
      durationSeconds: 420,
      discoveryNumber: 12,
    };
    const content = buildShareCardContent(discovery);
    expect(content).toEqual({
      brand: "寄り道クエスト",
      questTitle: "上を向いて歩こう",
      message: "今日、いつもの道を少し外れた。",
      discoveryLabel: "発見 #012",
      photo: undefined,
    });
    expect(JSON.stringify(content)).not.toMatch(/latitude|longitude|address|map|location|座標|住所/i);
  });
});
