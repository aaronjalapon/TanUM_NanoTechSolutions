import { Download, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useApp } from '../context/AppContext';

export default function ResearcherDashboard() {
  const { state } = useApp();
  
  // Mock data for multiple farms
  const farmData = [
    { id: 1, farmer: 'Juan Dela Cruz', location: 'Laguna', crop: 'Rice', soilHealth: 85, yield: 4.7, adoption: 95 },
    { id: 2, farmer: 'Maria Santos', location: 'Nueva Ecija', crop: 'Corn', soilHealth: 78, yield: 6.2, adoption: 88 },
    { id: 3, farmer: 'Pedro Garcia', location: 'Iloilo', crop: 'Rice', soilHealth: 92, yield: 5.1, adoption: 100 },
    { id: 4, farmer: 'Ana Reyes', location: 'Pangasinan', crop: 'Rice', soilHealth: 73, yield: 4.3, adoption: 76 },
    { id: 5, farmer: 'Luis Torres', location: 'Tarlac', crop: 'Corn', soilHealth: 81, yield: 5.8, adoption: 92 },
  ];

  // Mock trend data for adoption analysis
  const adoptionTrend = [
    { month: 'Jan', adoption: 45, yield: 4.1 },
    { month: 'Feb', adoption: 52, yield: 4.2 },
    { month: 'Mar', adoption: 58, yield: 4.4 },
    { month: 'Apr', adoption: 65, yield: 4.6 },
    { month: 'May', adoption: 72, yield: 4.8 },
    { month: 'Jun', adoption: 78, yield: 5.0 },
    { month: 'Jul', adoption: 83, yield: 5.1 },
    { month: 'Aug', adoption: 90, yield: 5.3 },
  ];

  // Mock correlation data
  const correlationData = farmData.map(farm => ({
    soilHealth: farm.soilHealth,
    yield: farm.yield,
    adoption: farm.adoption,
    farmer: farm.farmer
  }));

  const getHealthColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-header text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FontAwesomeIcon icon="microscope" className="text-teal-800" />
            Research Dashboard
          </h1>
          <p className="font-body text-gray-600">
            Multi-farm analysis and nano-fertilizer adoption insights
          </p>
        </div>
        <button className="btn bg-gray-600 hover:bg-gray-700 text-white border-0 gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-white shadow-md">
          <div className="card-body p-4 text-center">
            <Users className="h-8 w-8 text-teal-800 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-gray-900">
              {farmData.length}
            </div>
            <div className="text-sm text-gray-600">Active Farms</div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-gray-900">
              {(farmData.reduce((acc, farm) => acc + farm.adoption, 0) / farmData.length).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Avg Adoption Rate</div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-gray-900">
              {(farmData.reduce((acc, farm) => acc + farm.yield, 0) / farmData.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Yield (t/ha)</div>
          </div>
        </div>
        
        <div className="card bg-white shadow-md">
          <div className="card-body p-4 text-center">
            <div className="text-2xl mb-2">🌱</div>
            <div className="font-mono text-2xl font-bold text-gray-900">
              {(farmData.reduce((acc, farm) => acc + farm.soilHealth, 0) / farmData.length).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Avg Soil Health</div>
          </div>
        </div>
      </div>

      {/* Multi-Farm Comparison Table */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
                    <h2 className="font-header text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon="chart-bar" className="text-teal-800" />
            Multi-Farm Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="font-header font-semibold">Farmer</th>
                  <th className="font-header font-semibold">Location</th>
                  <th className="font-header font-semibold">Crop</th>
                  <th className="font-header font-semibold">Soil Health</th>
                  <th className="font-header font-semibold">Yield (t/ha)</th>
                  <th className="font-header font-semibold">Adoption Rate</th>
                  <th className="font-header font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {farmData.map((farm) => (
                  <tr key={farm.id}>
                    <td className="font-medium">{farm.farmer}</td>
                    <td>{farm.location}</td>
                    <td>{farm.crop}</td>
                    <td>
                      <div className={`badge ${getHealthColor(farm.soilHealth)}`}>
                        {farm.soilHealth}
                      </div>
                    </td>
                    <td className="font-mono">{farm.yield}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <progress 
                          className="progress progress-primary w-16" 
                          value={farm.adoption} 
                          max="100"
                        ></progress>
                        <span className="text-sm font-mono">{farm.adoption}%</span>
                      </div>
                    </td>
                    <td>
                      {farm.adoption >= 90 ? (
                        <div className="badge badge-success">Excellent</div>
                      ) : farm.adoption >= 70 ? (
                        <div className="badge badge-warning">Good</div>
                      ) : (
                        <div className="badge badge-error">Needs Attention</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adoption vs Yield Trend */}
        <div className="card bg-white shadow-md">
          <div className="card-body">
            <h3 className="card-title font-header text-gray-900 mb-4">
              📈 Adoption vs Yield Trend
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adoptionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#444444" fontSize={12} />
                <YAxis yAxisId="left" stroke="#444444" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#444444" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px' 
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="adoption" 
                  stroke="#115e59" 
                  strokeWidth={3}
                  name="Adoption Rate (%)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#dc2626" 
                  strokeWidth={3}
                  name="Avg Yield (t/ha)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil Health vs Yield Correlation */}
        <div className="card bg-white shadow-md">
          <div className="card-body">
            <h3 className="card-title font-header text-gray-900 mb-4">
              🔬 Soil Health vs Yield Correlation
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  type="number" 
                  dataKey="soilHealth" 
                  name="Soil Health" 
                  stroke="#444444" 
                  fontSize={12}
                  domain={[60, 100]}
                />
                <YAxis 
                  type="number" 
                  dataKey="yield" 
                  name="Yield" 
                  stroke="#444444" 
                  fontSize={12}
                  domain={[3, 7]}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg">
                          <p className="font-medium">{data.farmer}</p>
                          <p className="text-sm">Soil Health: {data.soilHealth}</p>
                          <p className="text-sm">Yield: {data.yield} t/ha</p>
                          <p className="text-sm">Adoption: {data.adoption}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter dataKey="yield" fill="#115e59" />
              </ScatterChart>
            </ResponsiveContainer>
            
            <div className="mt-2 text-xs text-gray-600">
              <p>🔍 Strong positive correlation (R² = 0.85) between soil health and yield</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-gray-900 mb-4">
            📊 Impact Analysis Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="font-mono text-3xl font-bold text-green-700 mb-2">+18.5%</div>
              <div className="font-medium text-gray-900">Average Yield Increase</div>
              <div className="text-sm text-gray-600 mt-1">
                Compared to traditional fertilizer methods
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-mono text-3xl font-bold text-blue-700 mb-2">₱45,200</div>
              <div className="font-medium text-gray-900">Total Additional Income</div>
              <div className="text-sm text-gray-600 mt-1">
                Across all participating farms this season
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="font-mono text-3xl font-bold text-purple-700 mb-2">-28%</div>
              <div className="font-medium text-gray-900">Environmental Impact</div>
              <div className="text-sm text-gray-600 mt-1">
                Reduction in chemical fertilizer usage
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Key Findings</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ 90% of farmers report improved soil structure</li>
              <li>✅ 85% reduction in nutrient deficiency alerts</li>
              <li>✅ Optimal adoption rate achieved in 80% of participating farms</li>
              <li>✅ Consistent yield improvements across different crop types</li>
              <li>📈 Strong correlation between adoption rate and economic benefits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-gray-900 mb-4">
            📄 Export & Reports
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 gap-2">
              <Download className="h-4 w-4" />
              Soil Data (CSV)
            </button>
            <button className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 gap-2">
              <Download className="h-4 w-4" />
              Fertilizer Logs (Excel)
            </button>
            <button className="btn bg-gray-600 hover:bg-gray-700 text-white border-0 gap-2">
              <Download className="h-4 w-4" />
              Full Season Report (PDF)
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Reports include: farm comparison, yield analysis, cost-benefit calculations, and environmental impact assessment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
