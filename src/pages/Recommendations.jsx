import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApp } from '../context/AppContext';

export default function Recommendations() {
  const { state } = useApp();
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch AI recommendation from ML backend
  const fetchAiRecommendation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the latest soil data from state
      const latestSoilData = state.soilData && state.soilData.length > 0 
        ? state.soilData[0] 
        : null;
      
      // Use current soil data for prediction or fallback to default values
      const soilData = {
        nitrogen: latestSoilData?.N || 15,
        phosphorus: latestSoilData?.P || 10,
        potassium: latestSoilData?.K || 20,
        temperature: latestSoilData?.temperature || 28,
        humidity: 65, // Default humidity as it's not in soil data
        moisture: latestSoilData?.moisture || 45,
        soil_type: "Loamy",
        crop_type: state.currentFarmer?.crop_type || "Rice"
      };

      console.log('Sending soil data to ML backend:', soilData);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(soilData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received AI recommendation:', data);
      setAiRecommendation(data);
    } catch (err) {
      const errorMessage = `Failed to get AI recommendation: ${err.message}`;
      setError(errorMessage);
      console.error('Error fetching AI recommendation:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        soilData: state.soilData,
        currentFarmer: state.currentFarmer
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI recommendation on component mount
  useEffect(() => {
    fetchAiRecommendation();
  }, []);
  
  const getConfidenceColor = (level) => {
    switch (level) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceWidth = (level) => {
    switch (level) {
      case 'High': return 'w-5/6';
      case 'Medium': return 'w-3/5';
      case 'Low': return 'w-2/5';
      default: return 'w-1/4';
    }
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Page Header */}
      <div>
        <h1 className="font-header text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-2 sm:gap-3">
          <FontAwesomeIcon icon="flask" className="text-primary text-xl sm:text-2xl" />
          <span className="break-words">AI Fertilizer Recommendations</span>
        </h1>
        <p className="font-body text-sm sm:text-base text-neutral-600">
          Smart nano-fertilizer suggestions based on real-time soil analysis
        </p>
      </div>

      {/* AI Recommendation Card */}
      {aiRecommendation && (
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border-l-4 border-primary">
          <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
              <h2 className="font-header text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FontAwesomeIcon icon="brain" className="text-primary" />
                AI Recommendation
              </h2>
              <div className="badge badge-primary badge-sm sm:badge-lg self-start sm:self-auto">
                <span className="text-[-10px] sm:text-sm">
                  {getConfidenceLevel(aiRecommendation.confidence)} Confidence
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <FontAwesomeIcon icon="seedling" className="text-primary text-base sm:text-lg" />
                <span className="font-header font-semibold text-base sm:text-lg text-neutral-900">
                  Recommended Fertilizer
                </span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-bold text-primary mb-2 break-words">
                {aiRecommendation.predicted_fertilizer}
              </p>
              <p className="text-neutral-700 text-xs sm:text-sm break-words">
                Confidence: {(aiRecommendation.confidence * 100).toFixed(1)}% • 
                Generated: {new Date(aiRecommendation.timestamp).toLocaleString()}
              </p>
            </div>

            {/* AI Recommendations List */}
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">AI Insights:</h3>
              {aiRecommendation.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 bg-white/50 rounded p-2">
                  <span className="text-primary">•</span>
                  <span className="break-words">{rec}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={fetchAiRecommendation}
                disabled={loading}
                className="btn btn-primary flex-1 gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <FontAwesomeIcon icon="spinner" className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon="refresh" />
                )}
                {loading ? 'Analyzing...' : 'Refresh Analysis'}
              </button>
              <button className="btn btn-outline gap-2 text-sm sm:text-base sm:flex-none">
                <FontAwesomeIcon icon="plus" />
                Log Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !aiRecommendation && (
        <div className="card bg-white shadow-lg">
          <div className="card-body p-4 sm:p-6 text-center">
            <FontAwesomeIcon icon="spinner" className="text-primary text-xl sm:text-2xl animate-spin mb-3" />
            <p className="text-neutral-600 text-sm sm:text-base">Analyzing soil data with AI...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border border-red-200 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
              <h3 className="font-header font-semibold text-red-800 text-sm sm:text-base">
                AI Analysis Error
              </h3>
            </div>
            <p className="text-red-700 mb-3 text-xs sm:text-sm break-words">{error}</p>
            <button 
              onClick={fetchAiRecommendation}
              className="btn btn-error btn-sm"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      )}

      {/* Deficiency Alert */}
      <div className="card bg-red-50 border border-red-200 shadow-md">
        <div className="card-body p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
            <h3 className="font-header font-semibold text-red-800 text-sm sm:text-base">
              Nutrient Deficiency Alert
            </h3>
          </div>
          <p className="text-red-700 mb-3 flex items-start gap-2 text-xs sm:text-sm">
            <FontAwesomeIcon icon="exclamation-triangle" className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="break-words">Soil Electrical Conductivity dropping – nutrient deficiency likely in 7 days</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="btn btn-error btn-sm">
              Take Action Now
            </button>
            <button className="btn btn-ghost btn-sm text-red-700">
              Set Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Recommendation History */}
      <div className="card bg-white shadow-md">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title font-header text-neutral-900 mb-4 text-lg sm:text-xl">
            📈 Recommendation History
          </h2>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm sm:text-base">Apply 12ml Nano-Nitrogen</div>
                  <div className="text-xs sm:text-sm text-neutral-600">High confidence • Applied successfully</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-neutral-600">Aug 17, 2025</div>
                <div className="badge badge-success badge-sm">Completed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200 gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm sm:text-base">Apply 8ml Nano-Phosphorus</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Medium confidence • Pending application</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-neutral-600">Aug 15, 2025</div>
                <div className="badge badge-warning badge-sm">Pending</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm sm:text-base">No action needed</div>
                  <div className="text-xs sm:text-sm text-neutral-600">High confidence • Soil levels optimal</div>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-neutral-600">Aug 14, 2025</div>
                <div className="badge badge-ghost badge-sm">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card bg-white shadow-md">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title font-header text-neutral-900 mb-4 text-lg sm:text-xl">
              🔬 Analysis Factors
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Crop Stage</span>
                <span className="font-medium text-sm sm:text-base break-words">Tillering (45 Days After Sowing)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Soil Moisture</span>
                <span className="font-medium text-sm sm:text-base">75% (Optimal)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Weather Forecast</span>
                <span className="font-medium text-sm sm:text-base">Rain in 2 days</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Last Application</span>
                <span className="font-medium text-sm sm:text-base">7 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-md">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title font-header text-neutral-900 mb-4 text-lg sm:text-xl">
              🎯 Expected Outcomes
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Yield Improvement</span>
                <span className="font-medium text-green-600 text-sm sm:text-base">+12%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Cost Efficiency</span>
                <span className="font-medium text-green-600 text-sm sm:text-base">+8%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Soil Health</span>
                <span className="font-medium text-green-600 text-sm sm:text-base">Improved</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-neutral-600 text-sm sm:text-base">Environmental Impact</span>
                <span className="font-medium text-green-600 text-sm sm:text-base">Reduced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
