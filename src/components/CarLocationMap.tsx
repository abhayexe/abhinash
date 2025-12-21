import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface CarLocationMapProps {
  location: string;
  carDetails?: {
    make: string;
    model: string;
    year: number;
    dailyRate: number;
  };
}

// Location coordinates mapping
const locationCoordinates: { [key: string]: [number, number] } = {
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  bangalore: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  nagpur: [21.1458, 79.0882],
  indore: [22.7196, 75.8577],
  thane: [19.2183, 72.9781],
  bhopal: [23.2599, 77.4126],
  visakhapatnam: [17.6868, 83.2185],
  patna: [25.5941, 85.1376],
  vadodara: [22.3072, 73.1812],
  ghaziabad: [28.6692, 77.4538],
  ludhiana: [30.901, 75.8573],
  agra: [27.1767, 78.0081],
  nashik: [19.9975, 73.7898],
  faridabad: [28.4089, 77.3178],
  meerut: [28.9845, 77.7064],
  rajkot: [22.3039, 70.8022],
  varanasi: [25.3176, 82.9739],
  srinagar: [34.0837, 74.7973],
  aurangabad: [19.8762, 75.3433],
  amritsar: [31.634, 74.8723],
  allahabad: [25.4358, 81.8463],
  ranchi: [23.3441, 85.3096],
  coimbatore: [11.0168, 76.9558],
  jabalpur: [23.1815, 79.9864],
  gwalior: [26.2183, 78.1828],
  vijayawada: [16.5062, 80.648],
  jodhpur: [26.2389, 73.0243],
  madurai: [9.9252, 78.1198],
  raipur: [21.2514, 81.6296],
  kota: [25.2138, 75.8648],
  chandigarh: [30.7333, 76.7794],
  guwahati: [26.1445, 91.7362],
  mysore: [12.2958, 76.6394],
  gurgaon: [28.4595, 77.0266],
  noida: [28.5355, 77.391],
  kochi: [9.9312, 76.2673],
  dehradun: [30.3165, 78.0322],
  agartha: [19.076, 72.8777], // Default to Mumbai for fictional locations
};

export function CarLocationMap({ location, carDetails }: CarLocationMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>([
    19.076, 72.8777,
  ]);

  useEffect(() => {
    const locationKey = location.toLowerCase().trim();
    const coords = locationCoordinates[locationKey];
    if (coords) {
      setCoordinates(coords);
    } else {
      // Try partial matches
      const partialMatch = Object.keys(locationCoordinates).find(
        (key) => key.includes(locationKey) || locationKey.includes(key)
      );
      if (partialMatch) {
        setCoordinates(locationCoordinates[partialMatch]);
      }
    }
  }, [location]);

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={coordinates}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-sm">
                {carDetails
                  ? `${carDetails.make} ${carDetails.model} (${carDetails.year})`
                  : "Car Location"}
              </h3>
              <p className="text-xs text-gray-600">{location}</p>
              {carDetails && (
                <p className="text-xs font-semibold text-green-600">
                  ₹{carDetails.dailyRate}/day
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
