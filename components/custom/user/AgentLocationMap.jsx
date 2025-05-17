// AgentLocationMap.jsx
import React, { useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export default function AgentLocationMap({ position, onChange, editable = false }) {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker != null && onChange) {
                const { lat, lng } = marker.getLatLng();
                onChange({ lat, lng });
            }
        },
    }), [onChange]);

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '350px', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={position}
                icon={markerIcon}
                draggable={editable}
                eventHandlers={editable ? eventHandlers : undefined}
                ref={markerRef}
            >
                <Popup>
                    {editable
                        ? 'نشانگر را جابه‌جا کنید و موقعیت جدید را ذخیره نمایید.'
                        : 'موقعیت فعلی کاربر'}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
