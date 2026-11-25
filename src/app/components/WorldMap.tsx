"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { countryCoordinates } from "./countryCoordinates";
import type { MapContainer as MapContainerType, TileLayer as TileLayerType, Marker as MarkerType, Tooltip as TooltipType } from "react-leaflet";

interface AnalyticsDataItem {
  Country: string;
  AgentStatus: string;
}

interface AnalyticsDataResponse {
  data: AnalyticsDataItem[];
}

interface WorldMapProps {
  analyticsData: AnalyticsDataResponse;
}

// Dynamic imports with proper typing
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
) as typeof MapContainerType;
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
) as typeof TileLayerType;
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
) as typeof MarkerType;
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
) as typeof TooltipType;

// Import L dynamically
const createBubbleIcon = (status: string, L: typeof import("leaflet")) => {
  return L.divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-6 h-6 ${
          status === "Active" ? "bg-green-400" : "bg-yellow-400"
        } rounded-full opacity-75 animate-ping"></div>
        <div class="w-3 h-3 ${
          status === "Active" ? "bg-green-600" : "bg-yellow-600"
        } rounded-full border border-white"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  }) as import("leaflet").DivIcon;
};

const WorldMap: React.FC<WorldMapProps> = ({ analyticsData }) => {
  const [mapStyle, setMapStyle] = useState("standard");
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet);
      });
    }
  }, []);

  const activeCountries = analyticsData?.data?.filter(
    (item) => countryCoordinates[item.Country]
  );

  // Map style options
  const tileLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    carto: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    wikimedia: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    esri: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  } as const;

  if (!L) {
    return <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg relative">
      {/* Map style selector */}
      <div className="absolute top-3 right-3 z-[500] bg-white p-2 rounded-md shadow-md">
        <label htmlFor="mapStyle" className="mr-2 text-xs font-medium dark:text-gray-500">Map Style:</label>
        <select
          id="mapStyle"
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="p-1 text-xs border rounded dark:text-gray-500"
        >
          <option value="standard">Standard</option>
          <option value="carto">Light (Carto)</option>
          <option value="wikimedia">Multilingual</option>
          <option value="esri">ESRI Street</option>
        </select>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: "100%", height: "100%" , zIndex:1 }}
      >
        {/* Background map */}
        <TileLayer
          url={tileLayers[mapStyle as keyof typeof tileLayers]}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Marker with Tooltip */}
        {activeCountries?.map((location, idx) => {
          const coords = countryCoordinates[location.Country];
          if (!coords) return null;

          return (
            <Marker
              key={idx}
              position={[coords.lat, coords.lng]}
              icon={createBubbleIcon(location.AgentStatus, L)}
            >
              {/* Hover to see country name */}
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                {location.Country}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
