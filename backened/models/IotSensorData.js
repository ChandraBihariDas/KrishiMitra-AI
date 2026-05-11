import mongoose from 'mongoose';

const iotSensorDataSchema = new mongoose.Schema({
  temp: { type: Number, required: true },  // Temperature (°C)
  humidity: { type: Number, required: true },  // Humidity (%)
  light: { type: Number, required: true },  // Light intensity (e.g., lux)
  gas: { type: Number, required: true },  // Gas level (e.g., ppm)
  soil_temp: { type: Number, required: true },  // Soil temperature (°C)
  soil_moisture: { type: Number, required: true },  // Soil moisture (%)
  soil_ph: { type: Number, required: true },  // Soil pH (0-14)
  soil_npk: { type: Number, required: true },  // NPK value (e.g., combined index)
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });  // Adds createdAt/updatedAt

export default mongoose.model('IotSensorData', iotSensorDataSchema);