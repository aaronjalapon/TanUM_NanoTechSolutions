import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateTrendData } from '../data/mockData';

export default function TrendChart() {
  const data = generateTrendData(7);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-100 rounded-lg shadow-lg">
          <p className="font-medium text-neutral-900">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toFixed(1)} ${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (nutrient) => {
    const units = {
      Nitrogen: 'mg/kg',
      Phosphorus: 'mg/kg', 
      Potassium: 'mg/kg',
      'pH Level': '',
      Moisture: '%',
      'Electrical Conductivity': 'dS/m',
      Temperature: '°C'
    };
    return units[nutrient] || '';
  };

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body">
        <h2 className="card-title font-header text-neutral-900 mb-4">
          📊 Nutrient Trends (7 Days)
        </h2>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#444444"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#444444" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line 
              type="monotone" 
              dataKey="Nitrogen" 
              stroke="#00563e" 
              strokeWidth={2} 
              dot={{ fill: '#00563e', strokeWidth: 2, r: 4 }}
              name="Nitrogen"
            />
            <Line 
              type="monotone" 
              dataKey="Phosphorus" 
              stroke="#8d1536" 
              strokeWidth={2} 
              dot={{ fill: '#8d1536', strokeWidth: 2, r: 4 }}
              name="Phosphorus"
            />
            <Line 
              type="monotone" 
              dataKey="Potassium" 
              stroke="#059669" 
              strokeWidth={2} 
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              name="Potassium"
            />
            <Line 
              type="monotone" 
              dataKey="pH Level" 
              stroke="#7c3aed" 
              strokeWidth={2} 
              dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
              name="pH Level"
            />
          </LineChart>
        </ResponsiveContainer>
        
      </div>
    </div>
  );
}
