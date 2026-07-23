import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import { SAMPLE_CENTER } from "../../data/sample";
import type { LocationTrack } from "../../types";

interface QuestMapProps {
  track: LocationTrack[];
  compact?: boolean;
  label?: string;
}

function featureCollection(track: LocationTrack[]): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: track.length
      ? [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: track.map((point) => [point.longitude, point.latitude]),
            },
            properties: {},
          },
        ]
      : [],
  };
}

function pointFeature(track: LocationTrack[]): FeatureCollection {
  const latest = track.at(-1);
  return {
    type: "FeatureCollection",
    features: latest
      ? [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [latest.longitude, latest.latitude] },
            properties: {},
          },
        ]
      : [],
  };
}

export function QuestMap({ track, compact = false, label = "寄り道の地図" }: QuestMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const trackRef = useRef(track);
  const [failed, setFailed] = useState(false);
  trackRef.current = track;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const tileUrl = import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution = import.meta.env.VITE_MAP_ATTRIBUTION || "© OpenStreetMap contributors";
    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        center: SAMPLE_CENTER,
        zoom: 15.4,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            base: { type: "raster", tiles: [tileUrl], tileSize: 256, attribution },
          },
          layers: [
            { id: "paper", type: "background", paint: { "background-color": "#eadfc8" } },
            { id: "base", type: "raster", source: "base", paint: { "raster-opacity": 0.73, "raster-saturation": -0.45, "raster-contrast": -0.08 } },
          ],
        },
      });
      mapRef.current = map;
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      if (!compact) map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("error", () => setFailed(true));
      map.on("load", () => {
        map.addSource("track", { type: "geojson", data: featureCollection(trackRef.current), lineMetrics: true });
        map.addLayer({
          id: "track-glow",
          type: "line",
          source: "track",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#ffca0a", "line-width": 14, "line-blur": 7, "line-opacity": 0.82 },
        });
        map.addLayer({
          id: "track-core",
          type: "line",
          source: "track",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#fff4a6", "line-width": 5.5, "line-opacity": 1 },
        });
        map.addSource("current", { type: "geojson", data: pointFeature(trackRef.current) });
        map.addLayer({
          id: "current-halo",
          type: "circle",
          source: "current",
          paint: { "circle-radius": 13, "circle-color": "#fff", "circle-opacity": 0.72 },
        });
        map.addLayer({
          id: "current-dot",
          type: "circle",
          source: "current",
          paint: { "circle-radius": 7, "circle-color": "#0a8584", "circle-stroke-color": "#fff", "circle-stroke-width": 3 },
        });
      });
      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch {
      setFailed(true);
      return undefined;
    }
  }, [compact]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    (map.getSource("track") as GeoJSONSource | undefined)?.setData(featureCollection(track));
    (map.getSource("current") as GeoJSONSource | undefined)?.setData(pointFeature(track));
    const latest = track.at(-1);
    if (latest) map.easeTo({ center: [latest.longitude, latest.latitude], duration: 700 });
  }, [track]);

  return (
    <div className={`quest-map${compact ? " quest-map--compact" : ""}`} aria-label={label}>
      <div ref={containerRef} className="quest-map__canvas" />
      {failed ? (
        <div className="quest-map__fallback" role="status">
          <strong>地図を読み込めませんでした</strong>
          <span>クエストと記録はそのまま使えます。</span>
        </div>
      ) : null}
      {!track.length ? <div className="quest-map__waiting">歩きはじめると、光の道が描かれます</div> : null}
    </div>
  );
}
