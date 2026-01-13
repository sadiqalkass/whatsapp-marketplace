'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface DeliveryMapProps {
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  riderLat?: number;
  riderLng?: number;
}

export default function DeliveryMap({
  pickupLat,
  pickupLng,
  deliveryLat,
  deliveryLng,
  riderLat,
  riderLng,
}: DeliveryMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Center map between pickup and delivery
  const centerLat = (pickupLat + deliveryLat) / 2;
  const centerLng = (pickupLng + deliveryLng) / 2;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <Map
          defaultCenter={{ lat: centerLat, lng: centerLng }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {/* Pickup Location - Blue */}
          <Marker
            position={{ lat: pickupLat, lng: pickupLng }}
            title="Pickup Location"
          />

          {/* Delivery Location - Red */}
          <Marker
            position={{ lat: deliveryLat, lng: deliveryLng }}
            title="Delivery Location"
          />

          {/* Rider Location - Green (if available) */}
          {riderLat && riderLng && (
            <Marker
              position={{ lat: riderLat, lng: riderLng }}
              title="Your Location"
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
}