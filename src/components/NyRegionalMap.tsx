import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson";
import { REGION_ID_BY_PBT_NAME } from "../mock/regions";

const COLORS = ["#0f4c81", "#3c6e8f", "#6f8f9f", "#8da9b9", "#537f95", "#35657e"];
const SELANGOR_PBT_GEOJSON_URL =
  "https://raw.githubusercontent.com/TindakMalaysia/Selangor-Maps/master/Selangor_PBT_2015/Selangor_PBT_2015.geojson";

type SelangorPbtProperties = {
  name?: string;
  statename?: string;
  subname?: string | null;
  id?: string;
};

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
  const [selangorGeoJson, setSelangorGeoJson] = useState<FeatureCollection<Geometry, SelangorPbtProperties> | null>(
    null,
  );

  useEffect(() => {
    const loadGeo = async () => {
      const response = await fetch(SELANGOR_PBT_GEOJSON_URL);
      const data = (await response.json()) as FeatureCollection<Geometry, SelangorPbtProperties>;
      const filtered = data.features.filter((feature) => feature.properties?.statename === "Selangor");
      setSelangorGeoJson({
        type: "FeatureCollection",
        features: filtered,
      });
    };

    loadGeo().catch(() => setSelangorGeoJson(null));
  }, []);

  const mapCenter: [number, number] = [3.2, 101.45];
  const selangorBounds: [number, number][] = [
    [2.65, 100.85],
    [3.95, 101.92],
  ];

  if (!selangorGeoJson) {
    return <p className="empty-message">Loading Selangor council boundaries...</p>;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={9}
      className="map"
      maxBounds={selangorBounds}
      maxBoundsViscosity={1}
      minZoom={8}
      maxZoom={11}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap
      />
      <GeoJSON
        data={selangorGeoJson as GeoJsonObject}
        style={{
          fillColor: "#bfdbfe",
          fillOpacity: 0.4,
          color: "#1d4ed8",
          weight: 2,
        }}
      />
      <GeoJSON
        data={selangorGeoJson as GeoJsonObject}
        style={(feature) => {
          const props = feature?.properties as SelangorPbtProperties;
          const regionName = (props?.name ?? "").toLowerCase();
          const regionId = REGION_ID_BY_PBT_NAME[regionName];
          return {
            ...styleForRegion(regionId),
            fillOpacity: 0.35,
            weight: 1.8,
          };
        }}
        onEachFeature={(feature: Feature<Geometry, SelangorPbtProperties>, layer) => {
          const props = feature.properties;
          const regionName = props?.name ?? "Council";
          const regionId = REGION_ID_BY_PBT_NAME[regionName.toLowerCase()];

          layer.bindTooltip(regionName, {
            permanent: true,
            direction: "center",
            className: "region-label-inline",
          });

          layer.on("click", () => {
            if (regionId) {
              onRegionSelect(regionId);
            }
          });
        }}
      />
    </MapContainer>
  );
}
