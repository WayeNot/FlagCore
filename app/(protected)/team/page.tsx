"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useState } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MarkerType = {
  lat: number;
  lng: number;
};

let count = 0

function ClickHandler({
  onAddMarker,
}: {
  onAddMarker: (marker: MarkerType) => void;
}) {
  useMapEvents({
    click(e) {
      onAddMarker({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

export default function GameMap() {
  const [markers, setMarkers] = useState<MarkerType[]>([
    { lat: 47.2057585, lng: -1.5390026 },
  ]);

const addMarker = (marker: MarkerType) => {
    setMarkers((prev) => [...prev, marker]);
    count += 1
};

  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={5}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onAddMarker={addMarker} />

      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
        >
          <Popup>
            Marker {index + 1}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}