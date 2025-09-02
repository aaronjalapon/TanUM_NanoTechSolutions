import SoilHealthCard from '../components/SoilHealthCard';
import TrendChart from '../components/TrendChart';
import WeatherWidget from '../components/WeatherWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { state } = useApp();
  
  // Get latest soil data
  const latestSoilData = state.soilData[0] || {};
  
  const soilMetrics = [
    { nutrient: 'Nitrogen', value: latestSoilData.N, unit: 'mg/kg', icon: <FontAwesomeIcon icon="seedling" className="text-green-600" /> },
    { nutrient: 'Phosphorus', value: latestSoilData.P, unit: 'mg/kg', icon: <FontAwesomeIcon icon="leaf" className="text-green-600" /> },
    { nutrient: 'Potassium', value: latestSoilData.K, unit: 'mg/kg', icon: <FontAwesomeIcon icon="seedling" className="text-green-600" /> },
    { nutrient: 'Moisture', value: latestSoilData.moisture, unit: '%', icon: <FontAwesomeIcon icon="droplet" className="text-blue-600" /> },
    { nutrient: 'pH Level', value: latestSoilData.pH, unit: '', icon: <FontAwesomeIcon icon="balance-scale" className="text-purple-600" /> },
    { nutrient: 'Temperature', value: latestSoilData.temperature, unit: '°C', icon: <FontAwesomeIcon icon="temperature-high" className="text-red-600" /> },
    { nutrient: 'Electrical Conductivity', value: latestSoilData.EC, unit: 'dS/m', icon: <FontAwesomeIcon icon="bolt" className="text-yellow-600" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white rounded-lg p-6">
        <h1 className="font-header text-3xl font-bold mb-2 flex items-center gap-3">
          Welcome back, {state.currentFarmer?.name}! 
          <FontAwesomeIcon icon="seedling" className="text-green-300" />
        </h1>
        <p className="font-body text-lg opacity-90">
          {state.currentFarmer?.crop_type} Farm • {state.currentFarmer?.location}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
            <FontAwesomeIcon icon="wifi" />
            Device Connected
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
            <FontAwesomeIcon icon="sync" />
            Last sync: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Soil Health Cards Grid */}
      <div>
        <h2 className="font-header text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <FontAwesomeIcon icon="seedling" className="text-green-600" />
          Soil Health Monitoring
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {soilMetrics.map((metric) => (
            <SoilHealthCard
              key={metric.nutrient}
              nutrient={metric.nutrient}
              value={metric.value}
              unit={metric.unit}
              icon={metric.icon}
            />
          ))}
        </div>
      </div>

      {/* Charts and Weather Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div>
          <WeatherWidget />
          
          {/* Quick Actions Card */}
          <div className="card bg-white shadow-md mt-4">
            <div className="card-body p-4">
              <h3 className="font-header font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon="bolt" className="text-teal-800" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <a 
                  href="/recommendations" 
                  className="btn bg-teal-800 hover:bg-teal-700 text-white btn-sm w-full justify-start gap-2 border-0"
                >
                  <FontAwesomeIcon icon="flask" />
                  View Recommendations
                </a>
                <a 
                  href="/tracker" 
                  className="btn btn-outline border-teal-800 text-teal-800 hover:bg-teal-800 hover:text-white btn-sm w-full justify-start gap-2"
                >
                  <FontAwesomeIcon icon="chart-bar" />
                  Log Fertilizer Application
                </a>
                <button className="btn btn-ghost text-gray-700 hover:bg-gray-100 btn-sm w-full justify-start gap-2">
                  <FontAwesomeIcon icon="sync" />
                  Sync Device Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon="chart-line" className="text-teal-800" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Soil data updated</span>
              </div>
              <span className="text-sm text-gray-600">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">New recommendation available</span>
              </div>
              <span className="text-sm text-gray-600">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Fertilizer application logged</span>
              </div>
              <span className="text-sm text-gray-600">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
