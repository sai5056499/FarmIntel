# ==========================================
#          app.py - FarmIntel Backend
# ==========================================
import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import traceback # For printing detailed errors

# --- Scikit-learn Imports ---
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    roc_auc_score,
    confusion_matrix,
    mean_squared_error,
    r2_score
)

# --- VISUALIZATION IMPORTS ---
import matplotlib
matplotlib.use('Agg') # Use Agg backend for non-interactive saving (IMPORTANT for servers)
import matplotlib.pyplot as plt
import seaborn as sns

# ==========================================
#          Flask App Setup
# ==========================================
app = Flask(__name__)
CORS(app)

# ==========================================
#    Configuration & Model Paths
# ==========================================
PRICE_MODEL_DIR = "."
PRICE_MODEL_FILES = { # Example
    "Wheat": os.path.join(PRICE_MODEL_DIR, "wheat_price_model.joblib"),
    "Cotton": os.path.join(PRICE_MODEL_DIR, "cotton_price_model.joblib"),
    "Sugarcane": os.path.join(PRICE_MODEL_DIR, "sugarcane_price_model.joblib"),
    "Bajra": os.path.join(PRICE_MODEL_DIR, "bajra_price_model.joblib"),
    "Jowar": os.path.join(PRICE_MODEL_DIR, "jowar_price_model.joblib"),
    # Add paths for ALL other price models
}
loaded_price_models = {}

CROP_REC_CSV = 'Crop_recommendation.csv'
feature_names_rec = []

# --- Directory for saving plots ---
PLOTS_DIR = "evaluation_plots"
if not os.path.exists(PLOTS_DIR):
    try:
        os.makedirs(PLOTS_DIR)
        print(f"Created directory for evaluation plots: {PLOTS_DIR}")
    except OSError as e:
        print(f"Error creating directory {PLOTS_DIR}: {e}")
        PLOTS_DIR = "." # Fallback to current directory if creation fails

# ==========================================
#          Helper Model Class (Keep as before)
# ==========================================
class CropPredictionModel:
    # ... (keep the class definition) ...
    def __init__(self, model=None, training_features=None):
        self.model = model
        self.training_features = training_features
    def predict_price(self, input_data_dict):
        # ... (keep the predict_price method) ...
        if self.model is None: return None
        if self.training_features is None: return None
        try:
            input_df = pd.DataFrame([input_data_dict])
            input_df_aligned = input_df.reindex(columns=self.training_features, fill_value=0)
            predicted_price = self.model.predict(input_df_aligned)[0]
            return predicted_price
        except Exception as e:
            print(f"Error during price prediction: {e}"); traceback.print_exc(); return None

# ==========================================
#   Load Price Models at Startup (Keep as before)
# ==========================================
print("\n--- Loading Price Prediction Models ---")
# ... (keep the loading loop) ...
print(f"--- Price Model Loading Complete ---")

# ==========================================
# Setup Crop Recommendation Model & Evaluation
# ==========================================
print("\n--- Setting up Crop Recommendation ---")
crop_rec_model = None
crop_rec_scaler = None
crop_rec_label_encoder = None
setup_start_time = time.time()
try:
    # 1. Load Data
    if not os.path.exists(CROP_REC_CSV):
        raise FileNotFoundError(f"Crop recommendation data file not found: {CROP_REC_CSV}")
    crop_data = pd.read_csv(CROP_REC_CSV)
    print(f"Loaded crop recommendation data: {crop_data.shape[0]} rows, {crop_data.shape[1]} columns")

    # 2. Preprocess
    crop_rec_label_encoder = LabelEncoder()
    if 'label' not in crop_data.columns: raise ValueError("Missing 'label' column")
    crop_data['label_encoded'] = crop_rec_label_encoder.fit_transform(crop_data['label'])
    feature_names_rec = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    missing_cols = [col for col in feature_names_rec if col not in crop_data.columns]
    if missing_cols: raise ValueError(f"Missing required feature columns: {', '.join(missing_cols)}")
    X = crop_data[feature_names_rec]
    y = crop_data['label_encoded']
    crop_rec_scaler = StandardScaler()
    X_scaled = crop_rec_scaler.fit_transform(X)
    print(f"Data Preprocessed. Features scaled: {feature_names_rec}")

    # 3. Train Model & Evaluate
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Data split: Train={len(X_train)}, Test={len(X_test)}")
    best_params = {'max_depth': None, 'min_samples_leaf': 1, 'min_samples_split': 2, 'n_estimators': 200}
    crop_rec_model = RandomForestClassifier(**best_params, random_state=42)
    train_start_time = time.time()
    crop_rec_model.fit(X_train, y_train)
    train_end_time = time.time()
    print(f"-> Crop Recommendation Model Trained in {train_end_time - train_start_time:.2f}s.")

    # --- DETAILED EVALUATION & VISUALIZATION ---
    print("\n--- Evaluating Crop Recommendation Model on Test Set ---")
    eval_start_time = time.time()
    y_pred_rec = crop_rec_model.predict(X_test)
    y_prob_rec = crop_rec_model.predict_proba(X_test)

    # --- Calculate Metrics ---
    accuracy_rec = accuracy_score(y_test, y_pred_rec)
    report_rec_dict = classification_report(y_test, y_pred_rec, target_names=crop_rec_label_encoder.classes_, output_dict=True, zero_division=0)
    report_rec_str = classification_report(y_test, y_pred_rec, target_names=crop_rec_label_encoder.classes_, zero_division=0)
    roc_auc_rec_weighted = "N/A"; roc_auc_rec_macro = "N/A"
    try:
        if len(np.unique(y_test)) > 1 and hasattr(crop_rec_model, 'predict_proba'):
             roc_auc_rec_weighted_val = roc_auc_score(y_test, y_prob_rec, multi_class='ovr', average='weighted')
             roc_auc_rec_macro_val = roc_auc_score(y_test, y_prob_rec, multi_class='ovr', average='macro')
             roc_auc_rec_weighted = f"{roc_auc_rec_weighted_val:.4f}"
             roc_auc_rec_macro = f"{roc_auc_rec_macro_val:.4f}"
        else: print("Warning: ROC AUC not calculated (single class or no predict_proba).")
    except ValueError as roc_error: print(f"Warning: ROC AUC calculation error: {roc_error}")
    cm_rec = confusion_matrix(y_test, y_pred_rec)
    eval_end_time = time.time()
    print(f"-> Metrics Calculated in {eval_end_time - eval_start_time:.2f}s.")

    # --- Print Metrics (Same as before) ---
    print("=" * 60)
    print(f"{'Metric':<25} | {'Score':<15}") # ... print table ...
    print("-" * 60)
    print(f"{'Accuracy':<25} | {accuracy_rec:<15.4f}")
    print(f"{'Weighted Avg F1-Score':<25} | {report_rec_dict['weighted avg']['f1-score']:<15.4f}")
    print(f"{'Macro Avg F1-Score':<25} | {report_rec_dict['macro avg']['f1-score']:<15.4f}")
    print(f"{'Weighted ROC AUC (OvR)':<25} | {roc_auc_rec_weighted:<15}")
    print(f"{'Macro ROC AUC (OvR)':<25} | {roc_auc_rec_macro:<15}")
    print("=" * 60)
    print("\nClassification Report:")
    print(report_rec_str)
    print("-" * 60)
    print("\nConfusion Matrix:")
    print(cm_rec)
    print("-" * 60)

    # --- Generate and Save Visualizations ---
    print("\n--- Generating Evaluation Plots ---")
    plot_start_time = time.time()
    try:
        # 1. Confusion Matrix Heatmap
        plt.figure(figsize=(12, 10)) # Adjust size as needed
        sns.heatmap(cm_rec, annot=True, fmt='d', cmap='Blues',
                    xticklabels=crop_rec_label_encoder.classes_,
                    yticklabels=crop_rec_label_encoder.classes_)
        plt.title('Crop Recommendation Confusion Matrix', fontsize=16)
        plt.ylabel('Actual Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        plt.xticks(rotation=45, ha='right', fontsize=10)
        plt.yticks(rotation=0, fontsize=10)
        plt.tight_layout() # Adjust layout to prevent overlap
        cm_filename = os.path.join(PLOTS_DIR, 'confusion_matrix.png')
        plt.savefig(cm_filename, dpi=300) # Save with higher resolution
        plt.close() # Close the figure to free memory
        print(f"-> Confusion Matrix plot saved to {cm_filename}")

        # 2. Classification Metrics Bar Chart (Precision, Recall, F1)
        metrics_to_plot = ['precision', 'recall', 'f1-score']
        # Extract per-class metrics, ignore averages/support
        class_metrics = {label: report_rec_dict[label] for label in crop_rec_label_encoder.classes_}
        plot_data = pd.DataFrame(class_metrics).T[metrics_to_plot] # Select columns and transpose

        plot_data.plot(kind='bar', figsize=(15, 7), width=0.8) # Adjust size
        plt.title('Classification Metrics per Crop', fontsize=16)
        plt.ylabel('Score', fontsize=12)
        plt.xlabel('Crop', fontsize=12)
        plt.xticks(rotation=45, ha='right', fontsize=10) # Rotate labels
        plt.yticks(fontsize=10)
        plt.ylim(0, 1.05) # Set y-axis limit slightly above 1.0
        plt.grid(axis='y', linestyle='--', alpha=0.7) # Add horizontal grid lines
        plt.legend(title='Metric', fontsize=10)
        plt.tight_layout()
        metrics_filename = os.path.join(PLOTS_DIR, 'classification_metrics.png')
        plt.savefig(metrics_filename, dpi=300)
        plt.close()
        print(f"-> Classification Metrics plot saved to {metrics_filename}")

        plot_end_time = time.time()
        print(f"--- Plot Generation Complete ({plot_end_time - plot_start_time:.2f}s) ---")

    except Exception as plot_err:
        print(f"ERROR generating plots: {plot_err}")
        traceback.print_exc()
    # --- END EVALUATION & VISUALIZATION ---

except FileNotFoundError as e:
    print(f"ERROR setting up Crop Recommendation: {e}")
    crop_rec_model = None
except ValueError as e:
    print(f"ERROR setting up Crop Recommendation (Data Issue?): {e}")
    traceback.print_exc(); crop_rec_model = None
except Exception as e:
    print(f"An UNEXPECTED ERROR occurred during Crop Recommendation setup: {e}")
    traceback.print_exc(); crop_rec_model = None
setup_end_time = time.time()
print(f"--- Crop Recommendation Setup Complete (Total Time: {setup_end_time - setup_start_time:.2f}s) ---")

# ==========================================
#          Flask API Endpoints
# ==========================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Render deployment"""
    return jsonify({
        'status': 'healthy',
        'crop_model_loaded': crop_rec_model is not None,
        'price_models_loaded': len(loaded_price_models) > 0
    })

@app.route('/')
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'FarmIntel API is running',
        'endpoints': {
            'health': '/health',
            'predict_crop': '/predict',
            'predict_price': '/predict_price'
        }
    })
@app.route('/predict_price', methods=['POST'])
def predict_price_endpoint():
    # ... existing logic ...
    if not loaded_price_models: return jsonify({'error': 'Price models not loaded.'}), 503
    try:
        data = request.get_json(); # ... validation ...
        crop_type = data.get('plantType'); # ... get year, month, rainfall ...
        if not crop_type: return jsonify({'error': 'Missing plantType'}), 400 # Example validation
        target_crop_key = next((key for key in loaded_price_models if key.lower() == str(crop_type).lower()), None)
        if not target_crop_key: return jsonify({'error': f'No model for crop: {crop_type}'}), 404
        # ... prepare features, predict ...
        model_instance = loaded_price_models[target_crop_key]
        input_features = {'year': float(data['year']), 'month': int(data['month']), 'rainfall': float(data['rainfall'])} # Example
        final_input_dict = input_features.copy() # Adjust if model needs more features
        predicted_price = model_instance.predict_price(final_input_dict)
        if predicted_price is None: return jsonify({'error': 'Prediction failed.'}), 500
        return jsonify({'predicted_price': float(predicted_price), 'currency': 'WPI'})
    except Exception as e: # ... error handling ...
        print(f"Error /predict_price: {e}"); traceback.print_exc(); return jsonify({'error': 'Server error.'}), 500

@app.route('/predict', methods=['POST'])
def predict_crop_endpoint():
    # ... existing logic ...
    if not crop_rec_model: return jsonify({'error': 'Crop model not available.'}), 503
    try:
        data = request.get_json(); # ... validation ...
        feature_order = feature_names_rec
        input_values = [float(data.get(f)) for f in feature_order if data.get(f) is not None] # Example validation/conversion
        if len(input_values) != len(feature_order): return jsonify({'error': 'Missing/invalid features.'}), 400
        input_df = pd.DataFrame([input_values], columns=feature_order)
        input_scaled = crop_rec_scaler.transform(input_df)
        prediction_encoded = crop_rec_model.predict(input_scaled)[0]
        predicted_crop = crop_rec_label_encoder.inverse_transform([prediction_encoded])[0]
        return jsonify({'predicted_crop': predicted_crop})
    except Exception as e: # ... error handling ...
        print(f"Error /predict: {e}"); traceback.print_exc(); return jsonify({'error': 'Server error.'}), 500

# ==========================================
#          Main Execution Block
# ==========================================
if __name__ == '__main__':
    print("\n--- Starting FarmIntel Flask Server ---")
    if not loaded_price_models: print("WARNING: No price prediction models loaded.")
    if not crop_rec_model: print("WARNING: Crop recommendation model setup failed.")
    
    # Get port from environment variable (for Render deployment)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)