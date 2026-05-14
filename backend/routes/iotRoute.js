import express from 'express';
import IotSensorData from '../models/IotSensorData.js';  // Adjust path if needed

const router = express.Router();

// POST /api/iot/data - Receive data from hardware
router.post('/data', async (req, res) => {
  try {
    const { temp, humidity, light, gas, soil_temp, soil_moisture, soil_ph, soil_npk } = req.body;

    // Basic validation
    if (!temp || !humidity || !light || !gas || !soil_temp || !soil_moisture || !soil_ph || !soil_npk) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create and save new document
    const newData = new IotSensorData({
      temp,
      humidity,
      light,
      gas,
      soil_temp,
      soil_moisture,
      soil_ph,
      soil_npk,
      nitrogen,
      phosphorus,
      potassium
    });
    await newData.save();

    res.status(201).json({ 
      success: true, 
      message: 'Data saved successfully',
      data: newData 
    });
  } catch (error) {
    console.error('Error saving IoT data:', error);
    res.status(500).json({ success: false, message: 'Failed to save data' });
  }
});

// GET /api/iot/latest - Latest reading for frontend
router.get('/latest', async (req, res) => {
  try {
    const latest = await IotSensorData.findOne().sort({ timestamp: -1 });
    if (!latest) {
      return res.json({ success: true, data: null, message: 'No data yet' });
    }
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch latest' });
  }
});

// GET /api/iot/data - Historical data (with optional limit)
router.get('/data', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const data = await IotSensorData.find().sort({ timestamp: -1 }).limit(limit);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
});

export default router;