// Mock data for TanUM AgriSense MVP
export const mockFarmers = [
  {
    farmer_id: 1,
    name: "Juan Dela Cruz",
    contact_info: "+63 912 345 6789",
    location: "Laguna, Philippines",
    crop_type: "Rice"
  },
  {
    farmer_id: 2,
    name: "Maria Santos",
    contact_info: "+63 917 234 5678",
    location: "Nueva Ecija, Philippines", 
    crop_type: "Corn"
  }
];

export const mockSoilData = [
  {
    data_id: 1,
    farmer_id: 1,
    timestamp: "2025-08-17T08:00:00Z",
    N: 45, // Nitrogen in mg/kg
    P: 25, // Phosphorus in mg/kg
    K: 180, // Potassium in mg/kg
    pH: 6.2, // pH Level
    moisture: 75, // Moisture percentage
    EC: 1.2, // Electrical Conductivity in dS/m
    temperature: 28 // Temperature in Celsius
  },
  {
    data_id: 2,
    farmer_id: 1,
    timestamp: "2025-08-16T08:00:00Z",
    N: 42,
    P: 23,
    K: 175,
    pH: 6.1,
    moisture: 72,
    EC: 1.1,
    temperature: 27
  },
  {
    data_id: 3,
    farmer_id: 1,
    timestamp: "2025-08-15T08:00:00Z",
    N: 40,
    P: 22,
    K: 170,
    pH: 6.0,
    moisture: 70,
    EC: 1.0,
    temperature: 26
  }
];

export const mockRecommendations = [
  {
    recommendation_id: 1,
    farmer_id: 1,
    timestamp: "2025-08-17T09:00:00Z",
    recommended_dosage: "Apply 12ml Nano-Nitrogen in 3 days",
    confidence_level: "High",
    notes: "Soil nitrogen levels are optimal. Continue current schedule."
  }
];

export const mockFertilizerLogs = [
  {
    log_id: 1,
    farmer_id: 1,
    date_applied: "2025-08-10",
    fertilizer_type: "Nano-Nitrogen",
    amount: "15ml",
    method: "Basal Application"
  },
  {
    log_id: 2,
    farmer_id: 1,
    date_applied: "2025-08-01",
    fertilizer_type: "Nano-Phosphorus",
    amount: "10ml",
    method: "Top-up Application"
  }
];

export const mockWeatherData = {
  temperature: 32,
  humidity: 78,
  forecast: "Partly cloudy",
  rainfall_prediction: "Light rain expected in 2 days"
};

// Helper function to get soil status based on values
export const getSoilStatus = (value, nutrient) => {
  const thresholds = {
    Nitrogen: { healthy: [40, 60], warning: [30, 70] },
    Phosphorus: { healthy: [20, 35], warning: [15, 40] },
    Potassium: { healthy: [150, 200], warning: [120, 220] },
    'pH Level': { healthy: [6.0, 7.0], warning: [5.5, 7.5] },
    Moisture: { healthy: [60, 80], warning: [50, 85] },
    'Electrical Conductivity': { healthy: [1.0, 2.0], warning: [0.8, 2.5] },
    Temperature: { healthy: [25, 30], warning: [20, 35] }
  };

  const threshold = thresholds[nutrient];
  if (!threshold) return 'warning';

  if (value >= threshold.healthy[0] && value <= threshold.healthy[1]) {
    return 'healthy';
  } else if (value >= threshold.warning[0] && value <= threshold.warning[1]) {
    return 'warning';
  } else {
    return 'deficient';
  }
};

// Generate trend data for charts
export const generateTrendData = (days = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      Nitrogen: 40 + Math.random() * 10,
      Phosphorus: 20 + Math.random() * 8,
      Potassium: 170 + Math.random() * 20,
      'pH Level': 6.0 + Math.random() * 0.5,
      Moisture: 70 + Math.random() * 10,
      'Electrical Conductivity': 1.0 + Math.random() * 0.3,
      Temperature: 26 + Math.random() * 4
    });
  }
  
  return data;
};
