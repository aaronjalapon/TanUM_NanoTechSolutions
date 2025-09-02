# Fertilizer Recommendation System using Random Forest

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# -----------------------------
# 1. Load Dataset
# -----------------------------
# Replace this with your dataset path
df = pd.read_csv("data_core.csv")

print("Dataset Shape:", df.shape)
print(df.head())

# Check class distribution
print("\nClass distribution in Fertilizer Name:")
print(df['Fertilizer Name'].value_counts())

# -----------------------------
# 2. Encode Categorical Features
# -----------------------------

# Use separate encoders for each categorical column
soil_encoder = LabelEncoder()
crop_encoder = LabelEncoder()
fertilizer_encoder = LabelEncoder()

df['Soil Type Enc'] = soil_encoder.fit_transform(df['Soil Type'])
df['Crop Type Enc'] = crop_encoder.fit_transform(df['Crop Type'])
df['Fertilizer Enc'] = fertilizer_encoder.fit_transform(df['Fertilizer Name'])

# -----------------------------
# 3. Split into Train/Test
# -----------------------------

y = df['Fertilizer Enc']
# Select only the relevant features (adjusted to match CSV columns)
feature_cols = ['Nitrogen', 'Phosphorous', 'Potassium', 'Temparature', 'Humidity', 'Moisture', 'Soil Type Enc', 'Crop Type Enc']
X = df[feature_cols]
y = df['Fertilizer Enc']

# Stratified split for balanced classes
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# 4. Train Random Forest Model
# -----------------------------

# Improved RandomForest hyperparameters
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=4,
    min_samples_leaf=2,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train, y_train)

# -----------------------------
# 5. Evaluate Model
# -----------------------------
y_pred = model.predict(X_test)

print("\nModel Performance:")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Feature importance
importances = model.feature_importances_
print("\nFeature Importances:")
for col, imp in zip(feature_cols, importances):
    print(f"{col}: {imp:.4f}")

# -----------------------------
# 6. Save Model and Encoders
# -----------------------------
joblib.dump(model, "fertilizer_rf_model.pkl")
joblib.dump(soil_encoder, "soil_encoder.pkl") 
joblib.dump(crop_encoder, "crop_encoder.pkl")
joblib.dump(fertilizer_encoder, "fertilizer_encoder.pkl")

print("\nModel and encoders saved successfully!")

# -----------------------------
# 7. Make a Prediction Example
# -----------------------------
# Example input: [N, P, K, temperature, humidity, moisture, soil_type, crop_type]
sample = [[2, 10, 19, 200, 80, 60, 50, 1]]
pred = model.predict(sample)
recommended_fertilizer = fertilizer_encoder.inverse_transform([pred[0]])[0]
print(f"\nRecommended Fertilizer: {recommended_fertilizer}")

if __name__ == "__main__":
    print("Training completed successfully!")