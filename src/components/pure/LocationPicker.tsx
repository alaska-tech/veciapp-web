"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SANTA_MARTA_LOCATION_TUPLE: [number, number] = [11.225966, -74.190294];
const SANTA_MARTA_LOCATION_OBJECT = {
  lat: 11.225966,
  lng: -74.190294,
};
const DEFAULT_CONTAINER_WIDTH = 300;
const DEFAULT_CONTAINER_HEIGHT = 300;

function DraggableMarker() {
  const [position, setPosition] = useState(SANTA_MARTA_LOCATION_OBJECT);
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span>Esta es la ubicación de tu negocio</span>
      </Popup>
    </Marker>
  );
}

const LocationPicker = (props: {
  onStart?: (map: L.Map) => void;
  width?: number | string;
  height?: number | string;
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
      iconRetinaUrl: "/images/marker-icon-2x.png",
    });
  }, []);

  useEffect(() => {
    if (map && props.onStart) {
      props.onStart(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapContainer
      ref={setMap}
      center={SANTA_MARTA_LOCATION_TUPLE}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: DEFAULT_CONTAINER_HEIGHT || props.height,
        width: DEFAULT_CONTAINER_WIDTH || props.width,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker />
    </MapContainer>
  );
};

export default LocationPicker;
