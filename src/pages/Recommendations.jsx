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
        nitrogen: latestSoilData?.N || 25,
        phosphorus: latestSoilData?.P || 20,
        potassium: latestSoilData?.K || 30,
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-header text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
          <FontAwesomeIcon icon="flask" className="text-primary" />
          AI Fertilizer Recommendations
        </h1>
        <p className="font-body text-neutral-600">
          Smart nano-fertilizer suggestions based on real-time soil analysis
        </p>
      </div>

      {/* AI Recommendation Card */}
      {aiRecommendation && (
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border-l-4 border-primary">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-header text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FontAwesomeIcon icon="brain" className="text-primary" />
                AI Recommendation
              </h2>
              <div className="badge badge-primary badge-lg">
                {getConfidenceLevel(aiRecommendation.confidence)} Confidence
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon="seedling" className="text-primary text-lg" />
                <span className="font-header font-semibold text-lg text-neutral-900">
                  Recommended Fertilizer
                </span>
              </div>
              <p className="font-mono text-2xl font-bold text-primary mb-2">
                {aiRecommendation.predicted_fertilizer}
              </p>
              <p className="text-neutral-700 text-sm">
                Confidence: {(aiRecommendation.confidence * 100).toFixed(1)}% • 
                Generated: {new Date(aiRecommendation.timestamp).toLocaleString()}
              </p>
            </div>

            {/* AI Recommendations List */}
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-neutral-900 mb-2">AI Insights:</h3>
              {aiRecommendation.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-neutral-700 bg-white/50 rounded p-2">
                  <span className="text-primary">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={fetchAiRecommendation}
                disabled={loading}
                className="btn btn-primary flex-1 gap-2"
              >
                {loading ? (
                  <FontAwesomeIcon icon="spinner" className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon="refresh" />
                )}
                {loading ? 'Analyzing...' : 'Refresh Analysis'}
              </button>
              <button className="btn btn-outline gap-2">
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
          <div className="card-body p-6 text-center">
            <FontAwesomeIcon icon="spinner" className="text-primary text-2xl animate-spin mb-3" />
            <p className="text-neutral-600">Analyzing soil data with AI...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border border-red-200 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="font-header font-semibold text-red-800">
                AI Analysis Error
              </h3>
            </div>
            <p className="text-red-700 mb-3">{error}</p>
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
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="font-header font-semibold text-red-800">
              Nutrient Deficiency Alert
            </h3>
          </div>
          <p className="text-red-700 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon="exclamation-triangle" className="text-red-600" />
            Soil Electrical Conductivity dropping – nutrient deficiency likely in 7 days
          </p>
          <div className="flex gap-2">
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
        <div className="card-body">
          <h2 className="card-title font-header text-neutral-900 mb-4">
            📈 Recommendation History
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-neutral-900">Apply 12ml Nano-Nitrogen</div>
                  <div className="text-sm text-neutral-600">High confidence • Applied successfully</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Aug 17, 2025</div>
                <div className="badge badge-success badge-sm">Completed</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-neutral-900">Apply 8ml Nano-Phosphorus</div>
                  <div className="text-sm text-neutral-600">Medium confidence • Pending application</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Aug 15, 2025</div>
                <div className="badge badge-warning badge-sm">Pending</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-neutral-900">No action needed</div>
                  <div className="text-sm text-neutral-600">High confidence • Soil levels optimal</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Aug 14, 2025</div>
                <div className="badge badge-ghost badge-sm">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white shadow-md">
          <div className="card-body">
            <h3 className="card-title font-header text-neutral-900 mb-4">
              🔬 Analysis Factors
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Crop Stage</span>
                <span className="font-medium">Tillering (45 Days After Sowing)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Soil Moisture</span>
                <span className="font-medium">75% (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Weather Forecast</span>
                <span className="font-medium">Rain in 2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Last Application</span>
                <span className="font-medium">7 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-md">
          <div className="card-body">
            <h3 className="card-title font-header text-neutral-900 mb-4">
              🎯 Expected Outcomes
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Yield Improvement</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Cost Efficiency</span>
                <span className="font-medium text-green-600">+8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Soil Health</span>
                <span className="font-medium text-green-600">Improved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Environmental Impact</span>
                <span className="font-medium text-green-600">Reduced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
