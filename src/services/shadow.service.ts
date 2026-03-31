import type { DeviceState, TelemetryPayload, CommandPayload } from '../domain/device.types.ts';

export class ShadowService {
  /* List of devices with their state */
  private registry = new Map<string, DeviceState>();

  /* Get device state */
  private getOrCreateDevice(deviceId: string): DeviceState {
    let state = this.registry.get(deviceId);

    if (!state) {
      state = {
        reported: {},
        desired: {},
        version: 0,
        lastSeen: new Date(),
      };

      this.registry.set(deviceId, state);
    }
    return state;
  }

  /** Updates reported state and returns the current 'desired' state.*/
  updateTelemetry(deviceId: string, data: TelemetryPayload): DeviceState {
    const state = this.getOrCreateDevice(deviceId);
    
    // Merge new telemetry into reported state
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        state.reported[key] = value;
      }
    }
    
    state.lastSeen = new Date();
    return state;
  }

  /** Updates desired state. */
  updateCommand(deviceId: string, command: CommandPayload): number {
    const state = this.getOrCreateDevice(deviceId);

    //Overwrite current desired state with the new command
    state.desired = { [command.type]: command.value };
    state.version++;

    return state.version;
  }
}

export const shadowService = new ShadowService();