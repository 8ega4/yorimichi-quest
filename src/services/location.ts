import { createSampleTrack } from "../data/sample";
import type { LocationPoint } from "../types";

export type StopLocationTracking = () => void;

export interface LocationCallbacks {
  onPoint: (point: LocationPoint) => void;
  onError: (error: GeolocationPositionError | Error) => void;
}

export interface LocationService {
  start(callbacks: LocationCallbacks): StopLocationTracking;
}

export const LOCATION_PERMISSION_FALLBACK_MESSAGE =
  "位置情報を利用できませんでした。許可画面が出ない場合は、SafariやChromeで開くか、ブラウザ設定で位置情報を許可してください。いまはサンプル軌跡で続けています。";

export class GeolocationUnavailableError extends Error {
  constructor() {
    super("このブラウザは位置情報に対応していません");
    this.name = "GeolocationUnavailableError";
  }
}

export function isGeolocationAvailable(
  browserNavigator: Navigator | undefined = typeof navigator === "undefined" ? undefined : navigator,
) {
  return Boolean(browserNavigator?.geolocation);
}

export class BrowserLocationService implements LocationService {
  start({ onPoint, onError }: LocationCallbacks) {
    if (!isGeolocationAvailable()) {
      onError(new GeolocationUnavailableError());
      return () => undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        onPoint({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          recordedAt: position.timestamp || Date.now(),
        });
      },
      onError,
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 12_000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }
}

export class SampleLocationService implements LocationService {
  constructor(private readonly intervalMs = 450) {}

  start({ onPoint }: LocationCallbacks) {
    const track = createSampleTrack(Date.now());
    let index = 0;
    onPoint(track[index]);
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= track.length) {
        window.clearInterval(timer);
        return;
      }
      onPoint(track[index]);
    }, this.intervalMs);
    return () => window.clearInterval(timer);
  }
}

export function createLocationService(mode: "live" | "sample"): LocationService {
  return mode === "sample" ? new SampleLocationService() : new BrowserLocationService();
}
