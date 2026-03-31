export type JsonValue = string | number | boolean | null;

export interface DeviceState {
  reported: Record<string, JsonValue>;
  desired: Record<string, JsonValue>;
  version: number;
  lastSeen: Date;
}

export interface TelemetryPayload {
  temperature?: number;
  battery?: number;
  status?: string;
  [key: string]: JsonValue | undefined;
}

export interface CommandPayload {
  type: string;
  value: JsonValue;
}