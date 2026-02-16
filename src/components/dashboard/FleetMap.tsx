import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from '@/data/vehicles';

const getMarkerIcon = (status: string) => {
  const colors: Record<string, string> = {
    online: '#22c55e',
    moving: '#3b82f6',
    stopped: '#f59e0b',
    offline: '#ef4444',
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${colors[status] || colors.offline};display:flex;align-items:center;justify-content:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface FleetMapProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

const FleetMap = ({ vehicles, onVehicleClick, selectedVehicle }: FleetMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView([32.5, -6.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    vehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.position.lat, vehicle.position.lng], {
        icon: getMarkerIcon(vehicle.status),
      })
        .addTo(mapRef.current!)
        .bindPopup(`<div class="text-sm"><p class="font-bold">${vehicle.matricule}</p><p>${vehicle.brand} ${vehicle.model}</p><p style="text-transform:capitalize">${vehicle.status}</p></div>`)
        .on('click', () => onVehicleClick(vehicle));
      
      markersRef.current.push(marker);
    });
  }, [vehicles, onVehicleClick]);

  useEffect(() => {
    if (mapRef.current && selectedVehicle) {
      mapRef.current.setView([selectedVehicle.position.lat, selectedVehicle.position.lng], 12);
    }
  }, [selectedVehicle]);

  return <div ref={containerRef} className="h-full w-full rounded-lg" />;
};

export default FleetMap;
