import { Plus, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useApp } from '../context/AppContext';

export default function Tracker() {
  const { state } = useApp();
  
  // Mock yield data for comparison
  const yieldData = [
    { season: '2023 Wet', baseline: 4.2, withNano: 4.8 },
    { season: '2023 Dry', baseline: 3.8, withNano: 4.3 },
    { season: '2024 Wet', baseline: 4.1, withNano: 4.9 },
    { season: '2024 Dry', baseline: 3.9, withNano: 4.5 },
    { season: '2025 Current', baseline: 4.0, withNano: 4.7 },
  ];

  // Mock before/after comparison data
  const comparisonData = {
    before: { N: 35, P: 18, K: 145, pH: 5.8, EC: 0.9 },
    after: { N: 45, P: 25, K: 180, pH: 6.2, EC: 1.2 }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-header text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
            <FontAwesomeIcon icon="chart-bar" className="text-primary" />
            Fertilizer Application Tracker
          </h1>
          <p className="font-body text-neutral-600">
            Monitor nano-fertilizer applications and track soil improvements
          </p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Log New Application
        </button>
      </div>

      {/* Application Timeline */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-neutral-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application Timeline
          </h2>
          
          <div className="space-y-4">
            {state.fertilizerLogs.map((log, index) => (
              <div key={log.log_id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {log.fertilizer_type}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {log.amount} • {log.method} application
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-neutral-900">
                        {new Date(log.date_applied).toLocaleDateString()}
                      </div>
                      <div className="badge badge-success badge-sm">Applied</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Upcoming Application */}
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  !
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Nano-Nitrogen (Recommended)
                    </h3>
                    <p className="text-sm text-neutral-600">
                      12ml • top-up application
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-neutral-900">
                      Aug 20, 2025
                    </div>
                    <div className="badge badge-warning badge-sm">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before vs After Comparison */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-neutral-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Before vs After Comparison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Before Application</h3>
              <div className="space-y-2">
                {Object.entries(comparisonData.before).map(([nutrient, value]) => (
                  <div key={nutrient} className="flex justify-between">
                    <span className="text-neutral-600">{nutrient.toUpperCase()}</span>
                    <span className="font-mono font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-red-700">
                Status: Multiple deficiencies detected
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">After Application</h3>
              <div className="space-y-2">
                {Object.entries(comparisonData.after).map(([nutrient, value]) => (
                  <div key={nutrient} className="flex justify-between">
                    <span className="text-neutral-600">{nutrient.toUpperCase()}</span>
                    <span className="font-mono font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-green-700">
                Status: All levels within optimal range
              </div>
            </div>
          </div>

          {/* Improvement Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="font-mono text-2xl font-bold text-green-700">+28%</div>
              <div className="text-sm text-green-600">Nitrogen</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="font-mono text-2xl font-bold text-green-700">+39%</div>
              <div className="text-sm text-green-600">Phosphorus</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="font-mono text-2xl font-bold text-green-700">+24%</div>
              <div className="text-sm text-green-600">Potassium</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="font-mono text-2xl font-bold text-green-700">+33%</div>
              <div className="text-sm text-green-600">Electrical Conductivity Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Comparison Chart */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <h2 className="card-title font-header text-neutral-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yield Comparison (tons/hectare)
          </h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="season" stroke="#444444" fontSize={12} />
              <YAxis stroke="#444444" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="baseline" fill="#8d1536" name="Traditional Fertilizer" />
              <Bar dataKey="withNano" fill="#00563e" name="With Nano-Fertilizer" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-mono text-xl font-bold text-green-700">+17.5%</div>
              <div className="text-sm text-green-600">Average Yield Increase</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-mono text-xl font-bold text-blue-700">₱12,400</div>
              <div className="text-sm text-blue-600">Additional Income/Season</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-mono text-xl font-bold text-purple-700">-25%</div>
              <div className="text-sm text-purple-600">Fertilizer Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Report */}
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title font-header text-neutral-900">
              📄 Season-End Report
            </h2>
            <button className="btn btn-secondary btn-sm">
              Download Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Summary Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Applications</span>
                  <span className="font-medium">8 applications</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Nano-fertilizer Used</span>
                  <span className="font-medium">125ml total</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Cost Savings</span>
                  <span className="font-medium text-green-600">₱3,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Environmental Score</span>
                  <span className="font-medium text-green-600">A+ (Low Impact)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-neutral-900 mb-3">Recommendations</h3>
              <ul className="text-sm space-y-1 text-neutral-700">
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon="check-circle" className="text-green-600" />
                  Continue nano-fertilizer program
                </li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon="check-circle" className="text-green-600" />
                  Maintain current application timing
                </li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon="chart-line" className="text-blue-600" />
                  Consider 10% increase in Potassium applications
                </li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon="seedling" className="text-green-600" />
                  Excellent soil health improvement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
