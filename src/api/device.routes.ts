import { Router } from 'express';
import { shadowService } from '../services/shadow.service.ts';

const router = Router();

// Telemetry Endpoint (Device Check-in)
router.post('/telemetry/:deviceId', (req, res) => {
  try{
    const { deviceId } = req.params;
    const state = shadowService.updateTelemetry(deviceId, req.body);
  
    res.json({
      msg: "Telemetry recorded",
      desired: state.desired,
      version: state.version
    });
  }catch(error){
    throw error;
  }
});

// Command Endpoint (User Action)
router.post('/command/:deviceId', (req, res) => {
  try{
    const { deviceId } = req.params;
    const version = shadowService.updateCommand(deviceId, req.body);
  
    res.status(202).json({
      msg: "Command accepted",
      targetVersion: version
    });
  }catch(error){
    throw error;
  }
});

export default router;