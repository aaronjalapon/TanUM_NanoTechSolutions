from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from typing import List
from datetime import datetime

app = FastAPI(title="TanUM AgriSense ML API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174", 
        "http://127.0.0.1:5174",
        "http://localhost:5175", 
        "http://127.0.0.1:5175"
    ],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class SoilData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    moisture: float
    soil_type: str = "Loamy"
    crop_type: str = "Maize"

class FertilizerResponse(BaseModel):
    predicted_fertilizer: str
    confidence: float
    fertilizer_code: int
    recommendations: List[str]
    timestamp: str

# Global variables for model and encoders
model = None
soil_encoder = None
crop_encoder = None
fertilizer_encoder = None
feature_cols = ['Nitrogen', 'Phosphorous', 'Potassium', 'Temparature', 'Humidity', 'Moisture', 'Soil Type Enc', 'Crop Type Enc']

def load_or_train_model():
    """Load existing model or train a new one"""
    global model, soil_encoder, crop_encoder, fertilizer_encoder
    
    try:
        # Try to load existing model
        import os
        model_dir = os.path.dirname(__file__)
        model_path = os.path.join(model_dir, "fertilizer_rf_model.pkl")
        
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            soil_encoder = joblib.load(os.path.join(model_dir, "soil_encoder.pkl"))
            crop_encoder = joblib.load(os.path.join(model_dir, "crop_encoder.pkl"))
            fertilizer_encoder = joblib.load(os.path.join(model_dir, "fertilizer_encoder.pkl"))
            print("Loaded existing model and encoders")
        else:
            # Train new model if files don't exist
            train_new_model()
    except Exception as e:
        print(f"Error loading model: {e}")
        # Fallback to training new model
        train_new_model()

def train_new_model():
    """Train a new model from the CSV data"""
    global model, soil_encoder, crop_encoder, fertilizer_encoder
    
    try:
        # Load dataset
        import os
        csv_path = os.path.join(os.path.dirname(__file__), "data_core.csv")
        df = pd.read_csv(csv_path)
        print(f"Loaded dataset with {len(df)} samples")
        
        # Initialize encoders
        soil_encoder = LabelEncoder()
        crop_encoder = LabelEncoder()
        fertilizer_encoder = LabelEncoder()
        
        # Encode categorical features
        df['Soil Type Enc'] = soil_encoder.fit_transform(df['Soil Type'])
        df['Crop Type Enc'] = crop_encoder.fit_transform(df['Crop Type'])
        df['Fertilizer Enc'] = fertilizer_encoder.fit_transform(df['Fertilizer Name'])
        
        # Prepare features and target
        X = df[feature_cols]
        y = df['Fertilizer Enc']
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        model.fit(X, y)
        
        # Save model and encoders
        model_dir = os.path.dirname(__file__)
        joblib.dump(model, os.path.join(model_dir, "fertilizer_rf_model.pkl"))
        joblib.dump(soil_encoder, os.path.join(model_dir, "soil_encoder.pkl"))
        joblib.dump(crop_encoder, os.path.join(model_dir, "crop_encoder.pkl"))
        joblib.dump(fertilizer_encoder, os.path.join(model_dir, "fertilizer_encoder.pkl"))
        
        print("New model trained and saved successfully")
        
    except Exception as e:
        print(f"Error training model: {e}")
        raise e

def generate_recommendations(soil_data: SoilData, predicted_fertilizer: str) -> List[str]:
    """Generate recommendations based on soil conditions"""
    recommendations = []
    
    # Nutrient-based recommendations
    if soil_data.nitrogen < 20:
        recommendations.append("🌱 Nitrogen levels are low - apply nitrogen-rich fertilizer")
    elif soil_data.nitrogen > 40:
        recommendations.append("⚠️ Nitrogen levels are high - reduce nitrogen application")
    
    if soil_data.phosphorus < 15:
        recommendations.append("🌱 Phosphorus levels are low - consider phosphorus supplement")
    elif soil_data.phosphorus > 35:
        recommendations.append("⚠️ Phosphorus levels are high - reduce phosphorus application")
    
    if soil_data.potassium < 20:
        recommendations.append("🌱 Potassium levels are low - apply potassium fertilizer")
    elif soil_data.potassium > 45:
        recommendations.append("⚠️ Potassium levels are high - reduce potassium application")
    
    # Environmental recommendations
    if soil_data.moisture < 30:
        recommendations.append("💧 Soil moisture is low - increase irrigation")
    elif soil_data.moisture > 70:
        recommendations.append("💧 Soil moisture is high - ensure proper drainage")
    
    if soil_data.temperature > 35:
        recommendations.append("🌡️ Temperature is high - consider shade or cooling")
    elif soil_data.temperature < 20:
        recommendations.append("🌡️ Temperature is low - ensure adequate warmth")
    
    # Add general recommendation
    recommendations.append(f"✅ Apply {predicted_fertilizer} as recommended for {soil_data.crop_type}")
    
    return recommendations[:5]  # Limit to 5 recommendations

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    load_or_train_model()

@app.get("/")
async def root():
    return {"message": "TanUM AgriSense ML API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/predict", response_model=FertilizerResponse)
async def predict_fertilizer(soil_data: SoilData):
    print(f"Received prediction request: {soil_data}")
    try:
        if model is None:
            print("ERROR: Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        print(f"Available soil types: {list(soil_encoder.classes_) if soil_encoder else 'None'}")
        print(f"Available crop types: {list(crop_encoder.classes_) if crop_encoder else 'None'}")
        
        # Encode categorical features
        try:
            soil_type_enc = soil_encoder.transform([soil_data.soil_type])[0]
            print(f"Encoded soil type '{soil_data.soil_type}' to {soil_type_enc}")
        except ValueError as e:
            print(f"Error encoding soil type '{soil_data.soil_type}': {e}")
            # Use default encoding if soil type not found
            soil_type_enc = 0
            
        try:
            crop_type_enc = crop_encoder.transform([soil_data.crop_type])[0]
            print(f"Encoded crop type '{soil_data.crop_type}' to {crop_type_enc}")
        except ValueError as e:
            print(f"Error encoding crop type '{soil_data.crop_type}': {e}")
            # Use default encoding if crop type not found
            crop_type_enc = 0
        
        # Prepare features for prediction
        features = np.array([[
            soil_data.nitrogen,
            soil_data.phosphorus,
            soil_data.potassium,
            soil_data.temperature,
            soil_data.humidity,
            soil_data.moisture,
            soil_type_enc,
            crop_type_enc
        ]])
        
        print(f"Features for prediction: {features}")
        
        # Make prediction
        print("Making prediction...")
        prediction = model.predict(features)[0]
        prediction_proba = model.predict_proba(features)[0]
        confidence = float(max(prediction_proba))
        
        print(f"Prediction: {prediction}, Confidence: {confidence}")
        
        # Get fertilizer name
        predicted_fertilizer = fertilizer_encoder.inverse_transform([prediction])[0]
        print(f"Predicted fertilizer: {predicted_fertilizer}")
        
        # Generate recommendations
        recommendations = generate_recommendations(soil_data, predicted_fertilizer)
        
        response = FertilizerResponse(
            predicted_fertilizer=predicted_fertilizer,
            confidence=round(confidence, 3),
            fertilizer_code=int(prediction),
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
        
        print(f"Sending response: {response}")
        return response
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    return {
        "model_type": "Random Forest Classifier",
        "version": "1.0.0",
        "features": feature_cols,
        "target": "fertilizer_recommendation",
        "soil_types": list(soil_encoder.classes_) if soil_encoder else [],
        "crop_types": list(crop_encoder.classes_) if crop_encoder else [],
        "fertilizer_types": list(fertilizer_encoder.classes_) if fertilizer_encoder else []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)