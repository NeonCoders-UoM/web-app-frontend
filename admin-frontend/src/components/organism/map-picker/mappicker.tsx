import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
};

// Set a more meaningful default center (e.g., Sri Lanka)
const defaultCenter = { lat: 7.8731, lng: 80.7718 };

interface MapPickerProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    selectedLocation?: { lat: number; lng: number };
}

export default function MapPicker({ onLocationSelect, selectedLocation }: MapPickerProps) {
    // Start with no marker until user clicks or location is provided
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
        selectedLocation || null
    );

    // Update position when selectedLocation changes (from address search)
    useEffect(() => {
        if (selectedLocation && (selectedLocation.lat !== 0 || selectedLocation.lng !== 0)) {
            setPosition(selectedLocation);
        }
    }, [selectedLocation]);

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat() || 0;
        const lng = e.latLng?.lng() || 0;
        setPosition({ lat, lng });
        onLocationSelect({ lat, lng });
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position || defaultCenter}
            zoom={position ? 15 : 7}
            onClick={onMapClick}
        >
            {position && <Marker position={position} />}
        </GoogleMap>
    );
}