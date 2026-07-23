import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLocationTracking } from "../src/hooks/useLocationTracking";
import { BrowserLocationService, GeolocationUnavailableError, SampleLocationService } from "../src/services/location";
import type { QuestAttempt } from "../src/types";

describe("location services", () => {
  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  });

  it("does not request geolocation before start is called", () => {
    const watchPosition = vi.fn().mockReturnValue(17);
    const clearWatch = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition, clearWatch },
    });
    const service = new BrowserLocationService();
    expect(watchPosition).not.toHaveBeenCalled();
    const stop = service.start({ onPoint: vi.fn(), onError: vi.fn() });
    expect(watchPosition).toHaveBeenCalledTimes(1);
    stop();
    expect(clearWatch).toHaveBeenCalledWith(17);
  });

  it("reports an actionable unsupported-browser error without throwing", () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });
    const onError = vi.fn();
    const service = new BrowserLocationService();
    expect(() => service.start({ onPoint: vi.fn(), onError })).not.toThrow();
    expect(onError).toHaveBeenCalledWith(expect.any(GeolocationUnavailableError));
  });

  it("can substitute a deterministic sample track", () => {
    vi.useFakeTimers();
    const onPoint = vi.fn();
    const service = new SampleLocationService(100);
    const stop = service.start({ onPoint, onError: vi.fn() });
    expect(onPoint).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(250);
    expect(onPoint).toHaveBeenCalledTimes(3);
    stop();
  });

  it("stops active location watching when the page goes to the background", () => {
    const watchPosition = vi.fn().mockReturnValue(23);
    const clearWatch = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition, clearWatch },
    });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    const attempt: QuestAttempt = {
      id: "visibility-attempt",
      questId: "look-up",
      questTitle: "上を向いて歩こう",
      questInstruction: "立ち止まって上を見よう。",
      plannedMinutes: 5,
      mood: "look",
      startedAt: Date.now(),
      status: "active",
      locationMode: "live",
    };
    const { unmount } = renderHook(() => useLocationTracking(attempt));
    expect(watchPosition).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(clearWatch).toHaveBeenCalledWith(23);
    unmount();
  });
});
