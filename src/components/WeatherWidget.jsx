import { Cloud, Sun, CloudRain } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mockWeatherData } from '../data/mockData';

export default function WeatherWidget() {
  const weather = mockWeatherData;

  const getWeatherIcon = (forecast) => {
    if (forecast.includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (forecast.includes('cloudy')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    } else {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4">
        <h3 className="font-header font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon="sun" className="text-yellow-500" />
          Weather Forecast
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.forecast)}
            <div>
              <div className="font-mono text-2xl font-bold text-gray-900">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-gray-600">
                {weather.forecast}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="font-mono font-semibold text-gray-900">
              {weather.humidity}%
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-800 font-medium flex items-center gap-2">
            <FontAwesomeIcon icon="cloud-rain" className="text-blue-600" />
            {weather.rainfall_prediction}
          </div>
        </div>
      </div>
    </div>
  );
}
