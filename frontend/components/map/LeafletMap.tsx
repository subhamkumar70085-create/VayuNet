'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PollutionEvent, RiskLevel } from '@/lib/types';
import RiskBadge from '@/components/ui/RiskBadge';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

interface LeafletMapProps {
  events: PollutionEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (id: string) => void;
  className?: string;
}

const RISK_HEX: Record<RiskLevel, string> = {
  LOW: '#22c55e',
  MODERATE: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

// Custom SVG geometric markers matching Stitch design spec (zero broken PNG image paths)
function createRiskIcon(risk: RiskLevel, isSelected: boolean = false) {
  const color = RISK_HEX[risk] || RISK_HEX.LOW;
  const isUrgent = risk === 'CRITICAL' || risk === 'HIGH';

  const html = `
    <div style="
      position: relative;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${
        isUrgent
          ? `<div style="
              position: absolute;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.28;
              border: 1.5px solid ${color};
            "></div>`
          : ''
      }
      <div style="
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid #ffffff;
        box-shadow: 0 2px 5px rgba(10, 37, 64, 0.4);
        ${isSelected ? 'transform: scale(1.35); outline: 2px solid #0a2540;' : ''}
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-vayu-pin',
    html,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

// Auto-bounds updater ensuring Delhi, Mumbai, Bhubaneswar and all sites fit comfortably
const MapBoundsUpdater: React.FC<{ events: PollutionEvent[] }> = ({ events }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size in case container rendered with dynamic dimension
    map.invalidateSize();

    if (!events || events.length === 0) return;

    if (events.length === 1) {
      map.setView([events[0].location.lat, events[0].location.lng], 9);
    } else {
      const bounds = L.latLngBounds(
        events.map((e) => [e.location.lat, e.location.lng])
      );
      // Generous padding so pins on edge (Delhi north, Mumbai west, Bhubaneswar east) are never clipped
      map.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 8,
      });
    }
  }, [events, map]);

  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  className = '',
}) => {
  // Center over India
  const defaultCenter: [number, number] = [22.9734, 78.6569];
  const defaultZoom = 5;

  return (
    <div className={`relative w-full h-full min-h-[550px] overflow-hidden ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '550px' }}
      >
        {/* OpenStreetMap Standard Basemap - 100% Free, No API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapBoundsUpdater events={events} />

        {events.map((event) => {
          const isSelected = selectedEventId === event.event_id;
          const icon = createRiskIcon(event.risk, isSelected);

          return (
            <Marker
              key={event.event_id}
              position={[event.location.lat, event.location.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectEvent) {
                    onSelectEvent(event.event_id);
                  }
                },
              }}
            >
              <Popup className="vayu-leaflet-popup" minWidth={260} maxWidth={320}>
                <div className="p-1 select-none font-sans text-slate-800">
                  {/* Popup Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-[#0f172a]">
                        <MapPin className="w-3.5 h-3.5 text-[#0a2540]" />
                        <span>{event.location.city}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {event.event_id}
                      </span>
                    </div>
                    <RiskBadge level={event.risk} size="sm" />
                  </div>

                  {/* Telemetry snippet */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Source Hypothesis:</span>
                      <strong className="text-slate-800 capitalize font-medium">
                        {event.source_hypothesis.category.replace('_', ' ')}
                      </strong>
                    </div>

                    {event.evidence?.sensor && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">PM2.5 Real-Time:</span>
                        <span className="font-mono font-bold text-slate-900 tabular-telemetry">
                          {event.evidence.sensor.pm25} µg/m³
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="capitalize font-mono text-slate-500">
                        {event.outcome}
                      </span>
                    </div>
                  </div>

                  {/* Link to Event Detail Screen */}
                  <Link
                    href={`/dashboard/event/${event.event_id}`}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-[#0a2540] hover:bg-[#0f2a3f] text-white text-xs font-semibold rounded transition-colors"
                  >
                    <span>View Full Evidence Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
