import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson";
import { REGION_BY_FIPS } from "../mock/regions";

const NY_COUNTY_GEOJSON_URL = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

type CountyProperties = {
  STATE?: string;
  COUNTY?: string;
  NAME?: string;
  GEO_ID?: string;
};

const COLORS = ["#0f4c81", "#3c6e8f", "#6f8f9f", "#8da9b9", "#537f95", "#35657e"];

const styleForRegion = (regionId: string | undefined) => {
  if (!regionId) {
    return { fillColor: "#d9d9d9", fillOpacity: 0.6, color: "#6b7280", weight: 1 };
  }

  const index = Array.from(regionId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length;
  return { fillColor: COLORS[index], fillOpacity: 0.65, color: "#1f2937", weight: 1 };
};

type NyRegionalMapProps = {
  onRegionSelect: (regionId: string) => void;
};

export function NyRegionalMap({ onRegionSelect }: NyRegionalMapProps) {
  const [nyGeoJson, setNyGeoJson] = useState<FeatureCollection<Geometry, CountyProperties> | null>(null);

  useEffect(() => {
    const loadGeo = async () => {
      const response = await fetch(NY_COUNTY_GEOJSON_URL);
      const full = (await response.json()) as FeatureCollection<Geometry, CountyProperties>;
      const filteredFeatures = full.features.filter(
        (feature) => (feature.properties?.STATE ?? feature.id?.toString().slice(0, 2)) === "36",
      );

      setNyGeoJson({
        type: "FeatureCollection",
        features: filteredFeatures,
      });
    };

    loadGeo().catch(() => setNyGeoJson(null));
  }, []);

  const mapCenter = useMemo<[number, number]>(() => [42.9, -75.2], []);
  const nyBounds = useMemo<[number, number][]>(() => [
    [40.3, -79.9],
    [45.2, -71.5],
  ], []);

  const regionLabelPoints = useMemo(() => {
    if (!nyGeoJson) {
      return [] as { regionId: string; regionName: string; lat: number; lng: number }[];
    }

    const pointsByRegion = new Map<string, { regionName: string; points: [number, number][] }>();

    const walkCoords = (coords: unknown, bucket: [number, number][]) => {
      if (!Array.isArray(coords)) {
        return;
      }
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        bucket.push([coords[1], coords[0]]);
        return;
      }
      coords.forEach((child) => walkCoords(child, bucket));
    };

    const collectCoords = (geometry: Geometry | undefined, bucket: [number, number][]) => {
      if (!geometry) {
        return;
      }
      if (geometry.type === "GeometryCollection") {
        geometry.geometries.forEach((child) => collectCoords(child, bucket));
        return;
      }
      walkCoords(geometry.coordinates, bucket);
    };

    nyGeoJson.features.forEach((feature) => {
      const props = feature.properties;
      const fips = `36${props?.COUNTY ?? ""}`;
      const region = REGION_BY_FIPS[fips];
      if (!region) {
        return;
      }

      const bucket: [number, number][] = [];
      collectCoords(feature.geometry, bucket);
      if (!bucket.length) {
        return;
      }

      const existing = pointsByRegion.get(region.id) ?? { regionName: region.name, points: [] };
      existing.points.push(...bucket);
      pointsByRegion.set(region.id, existing);
    });

    return Array.from(pointsByRegion.entries()).map(([regionId, details]) => {
      const lat = details.points.reduce((sum, point) => sum + point[0], 0) / details.points.length;
      const lng = details.points.reduce((sum, point) => sum + point[1], 0) / details.points.length;
      return { regionId, regionName: details.regionName, lat, lng };
    });
  }, [nyGeoJson]);

  if (!nyGeoJson) {
    return <p className="empty-message">Loading New York county boundaries...</p>;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      className="map"
      maxBounds={nyBounds}
      maxBoundsViscosity={1}
      minZoom={6}
      maxZoom={8}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap
      />
      <GeoJSON
        data={nyGeoJson as GeoJsonObject}
        style={(feature) => {
          const props = feature?.properties as CountyProperties;
          const fips = `36${props.COUNTY ?? ""}`;
          const region = REGION_BY_FIPS[fips];
          return styleForRegion(region?.id);
        }}
        onEachFeature={(feature: Feature<Geometry, CountyProperties>, layer) => {
          const props = feature.properties;
          const fips = `36${props?.COUNTY ?? ""}`;
          const region = REGION_BY_FIPS[fips];
          const tooltip = `${props?.NAME ?? "County"} - ${region?.name ?? "Unmapped Region"}`;
          layer.bindTooltip(tooltip);

          layer.on("click", () => {
            if (region) {
              onRegionSelect(region.id);
            }
          });
        }}
      />
      {regionLabelPoints.map((point) => (
        <Marker
          key={point.regionId}
          position={[point.lat, point.lng]}
          icon={L.divIcon({
            className: "region-label",
            html: `<span>${point.regionName}</span>`,
          })}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}
