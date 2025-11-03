import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
};

// Set a more meaningful default center (e.g., Sri Lanka)
const defaultCenter = { lat: 7.8731, lng: 80.7718 };

interface MapPickerProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    // Start with no marker until user clicks
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat() || 0;
        const lng = e.latLng?.lng() || 0;
        setPosition({ lat, lng });
        onLocationSelect({ lat, lng });
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position || defaultCenter}
                zoom={position ? 15 : 7}
                onClick={onMapClick}
            >
                {position && <Marker position={position} />}
            </GoogleMap>
        </LoadScript>
    );
}