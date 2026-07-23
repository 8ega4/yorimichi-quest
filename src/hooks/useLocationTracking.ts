import { useEffect, useState } from "react";
import { db, appendTrackPoint } from "../lib/db";
import {
  createLocationService,
  GeolocationUnavailableError,
  LOCATION_PERMISSION_FALLBACK_MESSAGE,
} from "../services/location";
import type { QuestAttempt } from "../types";

export function useLocationTracking(attempt?: QuestAttempt) {
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    if (!attempt || attempt.status !== "active" || attempt.locationMode === "unavailable") {
      return undefined;
    }
    const mode = attempt.locationMode === "sample" ? "sample" : "live";
    const service = createLocationService(mode);
    let stop: (() => void) | undefined;
    const start = () => {
      if (document.visibilityState === "hidden" || stop) return;
      stop = service.start({
        onPoint: (point) => {
          void db.locationTracks
            .where("attemptId")
            .equals(attempt.id)
            .count()
            .then((sequence) =>
              appendTrackPoint(attempt.id, {
                ...point,
                sequence,
              }),
            );
        },
        onError: (error) => {
          if (mode === "live") {
            setNotice(
              error instanceof GeolocationUnavailableError
                ? "このブラウザでは位置情報の許可を表示できません。SafariやChromeで開くと、次の開始時に確認できます。"
                : LOCATION_PERMISSION_FALLBACK_MESSAGE,
            );
            void db.attempts.update(attempt.id, { locationMode: "sample" });
          }
        },
      });
    };
    const stopCurrent = () => {
      stop?.();
      stop = undefined;
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") stopCurrent();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopCurrent();
    };
  }, [attempt]);

  return notice;
}
