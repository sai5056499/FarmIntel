import pandas as pd
import numpy as np
import joblib  # For loading models
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time # Keep for potential timing logs during loading

# Import necessary sklearn classes (even if only used by loaded objects)
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV # Needed if loaded models use them implicitly
from sklearn.metrics import mean_squared_error, r2_score # Needed if loaded models use them implicitly


app = Flask(__name__)
CORS(app)

# ------------------------------------------------------------------------------
# Configuration & Model Paths
# ------------------------------------------------------------------------------

# --- Price Prediction Model Config ---
# Define where the pre-trained price models are stored
PRICE_MODEL_DIR = "." # Current directory, adjust if models are elsewhere
PRICE_MODEL_FILES = {
    "Wheat": os.path.join(PRICE_MODEL_DIR, "wheat_price_model.joblib"),
    "Cotton": os.path.join(PRICE_MODEL_DIR, "cotton_price_model.joblib"),
    "Sugarcane": os.path.join(PRICE_MODEL_DIR, "sugarcane_price_model.joblib"),
    "Bajra": os.path.join(PRICE_MODEL_DIR, "bajra_price_model.joblib"),
    "Jowar": os.path.join(PRICE_MODEL_DIR, "jowar_price_model.joblib"),
    # Add paths for any other price models you have
}
# This dictionary will hold the loaded model instances
loaded_price_models = {}

# --- Crop Recommendation Model Config ---
CROP_REC_CSV = 'Crop_recommendation.csv'
# We'll load/train this model below

# ------------------------------------------------------------------------------
# Model Class Definition (Keep as is, but ensure training saves features)
# ------------------------------------------------------------------------------
class CropPredictionModel:
    # --- Keep the __init__ method ---
    def __init__(self, data_filepath, target_column, categorical_features=None, numeric_fillna_strategy='mean'):
        self.data_filepath = data_filepath # Needed mainly for context if re-training
        self.target_column = target_column
        self.categorical_features = categorical_features or []
        self.numeric_fillna_strategy = numeric_fillna_strategy
        self.data = None
        self.model = None
        self.training_features = None # CRUCIAL: Ensure this is saved with the model!

    # --- Methods for loading/preprocessing (primarily for training script) ---
    # We don't strictly need load_data, preprocess_data, prepare_data in the API
    # *unless* you needed to re-fit something, which is unlikely here.
    # Keep them if the loaded model object might internally reference them, but
    # it's better if the saved model is self-contained.

    # --- Keep train_model, evaluate_model (for training script) ---
    def train_model(self, X_train, y_train, n_estimators=100, random_state=42):
        """Trains the model AND stores training feature names."""
        start_time = time.time()
        self.model = RandomForestRegressor(n_estimators=n_estimators, random_state=random_state)
        self.model.fit(X_train, y_train)
        self.training_features = list(X_train.columns) # Store feature names AFTER fitting
        print(f"Model trained. Features: {self.training_features}")
        end_time = time.time()
        print(f"Model trained in: {end_time-start_time}")

    def evaluate_model(self, X_test, y_test):
        # ... (keep evaluation logic) ...
        pass

    # --- Updated predict_price Method ---
    def predict_price(self, input_data_dict):
        """
        Predicts price from a dictionary, aligning columns with training features.
        """
        if self.model is None:
            print("Error: Price prediction model not trained/loaded correctly.")
            return None
        if self.training_features is None:
            print("Error: Training features not defined for the loaded price model.")
            return None

        try:
            # Create a DataFrame with a single row from the input dictionary
            input_df = pd.DataFrame([input_data_dict])

            # Reindex the DataFrame to match the training features exactly.
            # - Adds missing columns (filling with 0, adjust if needed)
            # - Removes extra columns not present during training
            # - Ensures the correct column order
            input_df = input_df.reindex(columns=self.training_features, fill_value=0)

            # Make the prediction using the DataFrame
            predicted_price = self.model.predict(input_df)[0]
            return predicted_price

        except ValueError as ve:
             print(f"ValueError during price prediction (likely type mismatch): {ve}")
             return None
        except Exception as e:
            print(f"Error during price prediction: {e}")
            return None

# ------------------------------------------------------------------------------
# Load Models and Preprocessors at Startup
# ------------------------------------------------------------------------------

# --- Load Price Prediction Models ---
print("\n--- Loading Price Prediction Models ---")
for crop, model_path in PRICE_MODEL_FILES.items():
    load_start_time = time.time()
    try:
        if os.path.exists(model_path):
            model_instance = joblib.load(model_path)
            # Basic check if loading worked and it has the necessary attribute
            if hasattr(model_instance, 'model') and hasattr(model_instance, 'training_features'):
                 loaded_price_models[crop] = model_instance
                 load_end_time = time.time()
                 print(f"-> Successfully loaded model for '{crop}' in {load_end_time - load_start_time:.4f}s. Features required: {model_instance.training_features}")
            else:
                 print(f"Error: Loaded object for '{crop}' from '{model_path}' is not a valid CropPredictionModel instance or lacks required attributes.")
        else:
            print(f"Warning: Model file not found for '{crop}' at '{model_path}'. Price prediction for this crop will not be available.")
    except Exception as e:
        print(f"Error loading model for '{crop}' from '{model_path}': {e}")
print("--- Price Model Loading Complete ---")

# --- Setup Crop Recommendation ---
print("\n--- Setting up Crop Recommendation ---")
crop_rec_model = None
crop_rec_scaler = None
crop_rec_label_encoder = None
try:
    # 1. Load Data
    if not os.path.exists(CROP_REC_CSV):
        raise FileNotFoundError(f"Crop recommendation data file not found: {CROP_REC_CSV}")
    crop_data = pd.read_csv(CROP_REC_CSV)

    # 2. Preprocess (Fit LabelEncoder and Scaler)
    crop_rec_label_encoder = LabelEncoder()
    crop_data['label_encoded'] = crop_rec_label_encoder.fit_transform(crop_data['label'])
    X = crop_data.drop(['label', 'label_encoded'], axis=1)
    y = crop_data['label_encoded']
    crop_rec_scaler = StandardScaler()
    X_scaled = crop_rec_scaler.fit_transform(X) # Fit and transform the *entire* dataset's features

    # 3. Train Model (Or Load Pre-trained if available)
    # For simplicity here, we re-train it. Ideally, load a saved one.
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    temp_model = RandomForestClassifier(random_state=42)
    # Using best params found previously (adjust if needed)
    best_params = {'max_depth': None, 'min_samples_leaf': 1, 'min_samples_split': 2, 'n_estimators': 200} # Example
    crop_rec_model = RandomForestClassifier(**best_params, random_state=42)
    crop_rec_model.fit(X_train, y_train) # Train on the split data
    print("-> Crop Recommendation Model Trained/Ready.")
    # Optional: Evaluate
    # y_pred_rec = crop_rec_model.predict(X_test)
    # accuracy_rec = accuracy_score(y_test, y_pred_rec)
    # print(f"-> Crop Recommendation Model Accuracy (on test split): {accuracy_rec:.4f}")

except FileNotFoundError as e:
    print(f"Error setting up Crop Recommendation: {e}")
except Exception as e:
    print(f"An unexpected error occurred during Crop Recommendation setup: {e}")
print("--- Crop Recommendation Setup Complete ---")


# ------------------------------------------------------------------------------
# Flask API Endpoints
# ------------------------------------------------------------------------------

@app.route('/predict_price', methods=['POST'])
def predict_price_endpoint():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON payload received.'}), 400

        # --- Input Validation ---
        crop_type = data.get('plantType') # Match frontend key
        year = data.get('year')
        month = data.get('month')
        rainfall = data.get('rainfall')

        required_params = {'plantType': crop_type, 'year': year, 'month': month, 'rainfall': rainfall}
        missing_params = [k for k, v in required_params.items() if v is None]
        if missing_params:
            return jsonify({'error': f'Missing required parameters: {", ".join(missing_params)}'}), 400

        # Validate data types (attempt conversion)
        try:
            input_features = {
                'year': float(year),
                'month': int(month), # Assuming month is needed as int by model
                'rainfall': float(rainfall)
                # Add other features required by the specific model here if they
                # are sent from the frontend or can be derived.
            }
        except (ValueError, TypeError) as e:
            return jsonify({'error': f'Invalid data type for input parameters: {e}'}), 400

        # --- Find and Use Model ---
        # Find the model based on crop_type (case-insensitive check)
        target_crop_key = None
        for key in loaded_price_models.keys():
            if key.lower() == crop_type.lower():
                target_crop_key = key
                break

        if not target_crop_key:
             return jsonify({'error': f'No price prediction model available for crop: {crop_type}'}), 404

        model_instance = loaded_price_models[target_crop_key]

        print(f"Predicting price for: {crop_type} using features: {input_features}")
        print(f"Model expects features: {model_instance.training_features}")

        # --- Prepare input dictionary EXACTLY as the model expects ---
        # The predict_price method now handles column alignment
        final_input_dict = input_features.copy()
        # **IMPORTANT**: If your price models were trained on MORE features than just
        # year, month, rainfall (e.g., MSP, Area_Sq_Km from the CSVs), you MUST
        # either:
        #    a) Get those values from the frontend request OR
        #    b) Decide on a default value (like 0 or mean) and add them here:
        # Example: final_input_dict['MSP'] = 0 # If MSP was a training feature

        # --- Make Prediction ---
        predicted_price = model_instance.predict_price(final_input_dict)

        if predicted_price is None:
            # The predict_price method already printed an error
            return jsonify({'error': 'Price prediction failed internally. Check server logs.'}), 500

        print(f"Predicted price: {predicted_price}")
        # Return prediction (adjust currency/units as needed)
        return jsonify({'predicted_price': float(predicted_price), 'currency': 'WPI'}) # Assuming WPI was target

    except Exception as e:
        # Catch-all for unexpected errors
        print(f"Unexpected error in /predict_price: {e}")
        import traceback
        traceback.print_exc() # Print detailed traceback to server logs
        return jsonify({'error': 'An internal server error occurred.'}), 500

# --- Existing Crop Recommendation Endpoint ---
@app.route('/predict', methods=['POST'])
def predict_crop_endpoint():
    # Check if the recommendation model setup was successful
    if not crop_rec_model or not crop_rec_scaler or not crop_rec_label_encoder:
        return jsonify({'error': 'Crop recommendation service is not available due to setup error.'}), 503 # Service Unavailable

    try:
        data = request.get_json()
        if not data:
             return jsonify({'error': 'Invalid JSON payload received.'}), 400

        print("[Crop Predict] Received data:", data)
        # Create a DataFrame from the input data *in the correct order*
        # It's safer to explicitly define the order based on how the scaler was fitted
        feature_order = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'] # Order from training
        try:
            input_values = [data[feature] for feature in feature_order]
            input_df = pd.DataFrame([input_values], columns=feature_order)
        except KeyError as e:
             return jsonify({'error': f'Missing required feature for crop prediction: {e}'}), 400
        except Exception as e:
             return jsonify({'error': f'Error preparing crop prediction input: {e}'}), 400


        # Scale the input data
        input_scaled = crop_rec_scaler.transform(input_df)

        # Make prediction
        prediction_encoded = crop_rec_model.predict(input_scaled)[0]

        # Decode the prediction
        predicted_crop = crop_rec_label_encoder.inverse_transform([prediction_encoded])[0]

        print("[Crop Predict] Predicted crop:", predicted_crop)
        return jsonify({'predicted_crop': predicted_crop})

    except Exception as e:
        print(f"Error in /predict: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'An error occurred during crop prediction.'}), 500

# ------------------------------------------------------------------------------
# Main Execution Block
# ------------------------------------------------------------------------------

if __name__ == '__main__':
    print("\n--- Starting Flask Development Server ---")
    # Check if models loaded properly before starting
    if not loaded_price_models:
        print("Warning: No price prediction models were loaded successfully.")
    if not crop_rec_model:
        print("Warning: Crop recommendation model setup failed.")

    # Port 5000 by default, debug=True enables auto-reloading
    app.run(debug=True)