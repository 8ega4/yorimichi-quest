import type { LocationPoint } from "../types";

export const SAMPLE_CENTER: [number, number] = [139.6948, 35.6717];

const sampleCoordinates: Array<[number, number]> = [
  [139.6939, 35.6713],
  [139.6941, 35.67145],
  [139.69435, 35.6716],
  [139.69455, 35.67182],
  [139.69482, 35.67193],
  [139.69508, 35.67182],
  [139.69522, 35.67158],
  [139.69548, 35.67143],
  [139.69572, 35.67162],
  [139.69588, 35.67183],
];

export function createSampleTrack(startAt = Date.now() - 7 * 60 * 1000): LocationPoint[] {
  return sampleCoordinates.map(([longitude, latitude], index) => ({
    latitude,
    longitude,
    accuracy: 8,
    recordedAt: startAt + index * 38_000,
  }));
}
