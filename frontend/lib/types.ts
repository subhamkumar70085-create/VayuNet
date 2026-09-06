/**
 * VayuNet Pollution Event Data Model
 * Strictly follows the VayuNet Frontend Build Guide specification.
 * Zero invented fields.
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type OutcomeType = 'pending' | 'confirmed' | 'false_alarm' | 'resolved';

export type UncertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AuthorityAction = 'confirm' | 'investigate' | 'dismiss';

export interface EventLocation {
  lat: number;
  lng: number;
  city: string;
}

export interface CitizenGeminiOutput {
  event_type: string;
  severity: string;
  confidence: number;
  description: string;
}

export interface CitizenEvidence {
  gemini_output: CitizenGeminiOutput;
  photo_url: string | null;
  source: string;
  freshness: string;
}

export interface SensorEvidence {
  pm25: number;
  pm10: number;
  anomaly_score: number;
  source: string;
  station_id: string;
  quality?: string;
}

export interface SatelliteEvidence {
  no2_index: number;
  aerosol_index: number;
  source: string;
  freshness: string;
}

export interface WeatherEvidence {
  wind_speed_kmh: number;
  humidity_percent: number;
  source: string;
}

export interface EventEvidence {
  citizen?: CitizenEvidence | null;
  sensor?: SensorEvidence | null;
  satellite?: SatelliteEvidence | null;
  weather?: WeatherEvidence | null;
}

export interface EventCorrelation {
  duplicate_of: string | null;
  supporting_reports_count: number;
}

export interface EventDetection {
  confidence: number;
  method?: string;
  supporting_evidence: string[];
  contradicting_evidence: string[];
}

export interface EventForecast {
  pm25_6h: number;
  pm25_24h: number;
  pm25_72h: number;
  spike_probability: UncertaintyLevel;
  forecast_uncertainty: UncertaintyLevel;
}

export interface SourceHypothesis {
  category: string;
  confidence: number;
}

export interface EventResponse {
  alert_sent: boolean;
  authority_class: string | null;
  status: 'pending' | 'acknowledged';
}

export interface EventTimelineItem {
  time: string;
  event: string;
}

export interface PollutionEvent {
  event_id: string;
  location: EventLocation;
  timestamp: string;
  evidence: EventEvidence;
  correlation?: EventCorrelation;
  detection: EventDetection;
  forecast: EventForecast;
  risk: RiskLevel;
  source_hypothesis: SourceHypothesis;
  explanation: string;
  response: EventResponse;
  outcome: OutcomeType;
  timeline: EventTimelineItem[];
}

export interface CitizenReportSubmission {
  photo?: File | string | null;
  text: string;
  lat: number;
  lng: number;
}

export interface ForecastPoint {
  time: string;
  hour: number;
  pm25: number;
  who_limit: number;
  naaqs_limit: number;
}
