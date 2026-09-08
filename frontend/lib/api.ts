/**
 * VayuNet Frontend API Abstraction Layer
 * Exclusive data-access layer for all UI components.
 * Components must NEVER import events.json directly.
 * 
 * Supports instant transition between mock data and real FastAPI endpoints.
 * Provides resilient offline/demo fallback insurance if the backend is offline or fails.
 */

import mockEventsData from '../mock_data/events.json';
import {
  PollutionEvent,
  AuthorityAction,
  CitizenReportSubmission,
  ForecastPoint
} from './types';

// In-memory working copy to support client-side optimistic updates (confirm, investigate, dismiss)
let eventsCache: PollutionEvent[] = JSON.parse(JSON.stringify(mockEventsData));

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_REAL_BACKEND = process.env.NEXT_PUBLIC_USE_REAL_BACKEND === 'true';
const REQUEST_TIMEOUT_MS = 3500; // Fast timeout so UI doesn't hang if backend is offline

export interface ApiStatus {
  isSimulation: boolean;
  isConnected: boolean;
  backendConfigured: boolean;
  backendUrl: string;
  lastError: string | null;
}

// Track runtime connection status
let isBackendReachable = false;
let lastApiError: string | null = null;

type StatusListener = (status: ApiStatus) => void;
const listeners = new Set<StatusListener>();

export function getApiStatus(): ApiStatus {
  return {
    isSimulation: !isBackendReachable,
    isConnected: isBackendReachable,
    backendConfigured: USE_REAL_BACKEND && Boolean(API_BASE_URL),
    backendUrl: API_BASE_URL,
    lastError: lastApiError,
  };
}

export function subscribeApiStatus(listener: StatusListener): () => void {
  listeners.add(listener);
  listener(getApiStatus());
  return () => {
    listeners.delete(listener);
  };
}

function notifyStatusChange(reachable: boolean, error: string | null = null) {
  if (isBackendReachable !== reachable || lastApiError !== error) {
    isBackendReachable = reachable;
    lastApiError = error;
    const current = getApiStatus();
    listeners.forEach((fn) => fn(current));
  }
}

/**
 * Helper to fetch with an abort timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch all pollution events
 * Backend: GET /api/events
 * Fallback: mock_data/events.json in-memory cache
 */
export async function getEvents(): Promise<PollutionEvent[]> {
  if (USE_REAL_BACKEND && API_BASE_URL) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/events`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          notifyStatusChange(true, null);
          return data;
        }
      }
      throw new Error(`Backend returned status ${res.status}: ${res.statusText}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuNet API] Real backend unreachable (${msg}). Falling back to simulation mode.`);
      notifyStatusChange(false, msg);
    }
  } else {
    notifyStatusChange(false, null);
  }

  // Fallback to simulation mock dataset
  return Promise.resolve([...eventsCache]);
}

/**
 * Fetch a single pollution event by ID
 * Backend: GET /api/events/{event_id}
 * Fallback: mock_data/events.json in-memory cache
 */
export async function getEventById(id: string): Promise<PollutionEvent | null> {
  if (USE_REAL_BACKEND && API_BASE_URL) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        notifyStatusChange(true, null);
        return data;
      }
      if (res.status === 404) {
        notifyStatusChange(true, null);
        return null;
      }
      throw new Error(`Backend returned status ${res.status}: ${res.statusText}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuNet API] Real backend error fetching event ${id} (${msg}). Falling back to simulation mode.`);
      notifyStatusChange(false, msg);
    }
  } else {
    notifyStatusChange(false, null);
  }

  const found = eventsCache.find((e) => e.event_id === id);
  return Promise.resolve(found ? { ...found } : null);
}

/**
 * Submit an authority response action for an event
 * Backend: POST /api/events/{event_id}/action
 * Contract: { action: "confirm" | "investigate" | "dismiss" }
 * Fallback: In-memory optimistic update clearly marked as simulation
 */
export async function updateEventAction(
  id: string,
  action: AuthorityAction
): Promise<{ success: boolean; event: PollutionEvent; isSimulation?: boolean }> {
  if (USE_REAL_BACKEND && API_BASE_URL) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/events/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        notifyStatusChange(true, null);
        return { ...data, isSimulation: false };
      }
      throw new Error(`Backend returned status ${res.status}: ${res.statusText}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuNet API] Real backend action failed (${msg}). Updating simulated session state.`);
      notifyStatusChange(false, msg);
    }
  } else {
    notifyStatusChange(false, null);
  }

  const eventIndex = eventsCache.findIndex((e) => e.event_id === id);
  if (eventIndex === -1) {
    throw new Error(`Event with id ${id} not found`);
  }

  const current = eventsCache[eventIndex];
  const updated: PollutionEvent = {
    ...current,
    response: {
      ...current.response,
      status: 'acknowledged',
      alert_sent: action !== 'dismiss',
    },
    outcome:
      action === 'confirm'
        ? 'confirmed'
        : action === 'dismiss'
        ? 'false_alarm'
        : current.outcome,
    timeline: [
      ...current.timeline,
      {
        time: new Date().toISOString().substring(11, 16),
        event: `authority_action_${action}`,
      },
    ],
  };

  eventsCache[eventIndex] = updated;
  return Promise.resolve({ success: true, event: updated, isSimulation: true });
}

/**
 * Submit citizen pollution observation
 * Backend: POST /api/report
 * Body: { photo?: File, text: string, lat: number, lng: number }
 * Fallback: Simulated report ingestion marked as simulation mode
 */
export async function submitReport(
  report: CitizenReportSubmission
): Promise<{ success: boolean; event_id: string; message: string; isSimulation?: boolean }> {
  if (USE_REAL_BACKEND && API_BASE_URL) {
    try {
      const formData = new FormData();
      if (report.photo instanceof File) {
        formData.append('photo', report.photo);
      }
      formData.append('text', report.text);
      formData.append('lat', String(report.lat));
      formData.append('lng', String(report.lng));

      const res = await fetchWithTimeout(`${API_BASE_URL}/api/report`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        notifyStatusChange(true, null);
        return { ...data, isSimulation: false };
      }
      throw new Error(`Backend returned status ${res.status}: ${res.statusText}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuNet API] Report submission to backend failed (${msg}). Falling back to simulation receipt.`);
      notifyStatusChange(false, msg);
    }
  } else {
    notifyStatusChange(false, null);
  }

  // Mock report ingestion fallback
  const newId = `evt_citizen_${Date.now()}`;
  return Promise.resolve({
    success: true,
    event_id: newId,
    message: 'Report received and queued for evidence synthesis (Simulation Mode)',
    isSimulation: true,
  });
}

/**
 * Fetch forecast series points for a given city and horizon
 * Backend: GET /api/forecast?city={city}&hours={hours}
 * Fallback: Local mathematical progression based on mock event forecast
 */
export async function getForecast(
  city: string,
  hours: 6 | 24 | 72 = 24
): Promise<ForecastPoint[]> {
  if (USE_REAL_BACKEND && API_BASE_URL) {
    try {
      const res = await fetchWithTimeout(
        `${API_BASE_URL}/api/forecast?city=${encodeURIComponent(city)}&hours=${hours}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          notifyStatusChange(true, null);
          return data;
        }
      }
      throw new Error(`Backend returned status ${res.status}: ${res.statusText}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[VayuNet API] Real backend forecast error (${msg}). Falling back to simulation curve.`);
      notifyStatusChange(false, msg);
    }
  } else {
    notifyStatusChange(false, null);
  }

  // Generate realistic progression for chosen city and horizon
  const cityEvent = eventsCache.find(
    (e) => e.location.city.toLowerCase() === city.toLowerCase()
  );
  const basePm25 = cityEvent?.evidence?.sensor?.pm25 || 120;
  const targetPm25 =
    hours === 6
      ? cityEvent?.forecast?.pm25_6h || basePm25 + 15
      : hours === 24
      ? cityEvent?.forecast?.pm25_24h || basePm25 + 30
      : cityEvent?.forecast?.pm25_72h || basePm25 - 10;

  const steps = hours === 6 ? 6 : hours === 24 ? 8 : 12;
  const interval = hours / steps;

  const points: ForecastPoint[] = [];
  const now = new Date();

  for (let i = 0; i <= steps; i++) {
    const future = new Date(now.getTime() + i * interval * 3600 * 1000);
    const progress = i / steps;
    // Curved projection between current and forecasted level with slight diurnal variance
    const interpolated =
      basePm25 +
      (targetPm25 - basePm25) * Math.sin((progress * Math.PI) / 2) +
      Math.sin(i) * 5;

    points.push({
      time: future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hour: Math.round(i * interval),
      pm25: Math.round(Math.max(15, interpolated)),
      who_limit: 15, // WHO Guideline: 15 µg/m³ 24h mean
      naaqs_limit: 60, // Indian NAAQS Guideline: 60 µg/m³ 24h mean
    });
  }

  return Promise.resolve(points);
}
