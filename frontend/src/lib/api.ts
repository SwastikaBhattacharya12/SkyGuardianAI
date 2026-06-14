const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Flight {
  flight_id: string;
  flight_number: string;
  origin_airport: string;
  destination_airport: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  status: string;
  aircraft_tail: string;
  aircraft_type: string;
  health_status: string;
  composite_risk: number;
  alert_count: number;
}

export interface FlightDetail {
  flight_id: string;
  flight_number: string;
  origin_airport: string;
  destination_airport: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  status: string;
  aircraft: {
    tail_number: string;
    type: string;
    health_status: string;
  };
  composite_risk: number;
  sub_scores: {
    weather: number;
    health: number;
    traffic: number;
    human: number;
  };
  explanation: string;
  alerts: {
    category: string;
    severity: string;
    message: string;
  }[];
  telemetry_history: {
    timestamp: string;
    engine_egt: number;
    oil_pressure: number;
    hydraulic_pressure: number;
    battery_charge: number;
  }[];
  route_segments: {
    segment_index: number;
    name: string;
    distance_pct: number;
    weather_risk_score: number;
    dominant_hazard: string;
    conditions: {
      convective_activity: boolean;
      turbulence_level: string;
      icing_forecast: string;
      crosswind_component_kt: number;
    };
  }[];
}

export interface FleetMember {
  aircraft_id: string;
  tail_number: string;
  aircraft_type: string;
  current_health_status: string;
  health_score: number;
  failure_forecast_24h: number;
  failure_forecast_7d: number;
  anomalies: {
    subsystem: string;
    parameter: string;
    value: string;
    severity: string;
    message: string;
  }[];
  recommendations: string[];
  latest_telemetry: {
    engine_egt: number | null;
    oil_pressure: number | null;
    hydraulic_pressure: number | null;
    battery_charge: number | null;
  };
}

export interface AlertInfo {
  alert_id: string;
  flight_number: string;
  tail_number: string;
  severity: string;
  category: string;
  message: string;
  created_at: string;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API fetch failed on ${path}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getFlights: () => fetchApi<Flight[]>('/flights'),
  getFlightDetail: (id: string) => fetchApi<FlightDetail>(`/flights/${id}`),
  getFleetHealth: () => fetchApi<FleetMember[]>('/aircraft/health'),
  getAlerts: () => fetchApi<AlertInfo[]>('/alerts'),
  queryAssistant: async (question: string): Promise<string> => {
    const res = await fetchApi<{ response: string }>('/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return res.response;
  },
  triggerSimulatorTick: async (): Promise<void> => {
    await fetchApi('/simulator/tick', { method: 'POST' });
  },
};
