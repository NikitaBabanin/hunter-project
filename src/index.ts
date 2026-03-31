import express from 'express';
import deviceRoutes from './api/device.routes.ts'; 
import { globalErrorHandler } from './middleware/error.handler.ts';

const app = express();
app.use(express.json());

app.use(globalErrorHandler);
app.use('/api/devices', deviceRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Hunter IoT Service running on http://localhost:${PORT}`);
});