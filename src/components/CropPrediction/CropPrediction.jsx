// src/components/CropPrediction/CropPrediction.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './CropPrediction.css'; // Import the CSS

const CropPrediction = () => {
    const [inputs, setInputs] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    const [prediction, setPrediction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'http://127.0.0.1:5000/predict'; // Ensure this is correct

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
    };

    const handlePredict = async () => {
        // Basic validation
        for (const key in inputs) {
            if (inputs[key] === '') {
                setError(`Please fill in the '${key}' field.`);
                setPrediction(''); return;
            }
            if (isNaN(parseFloat(inputs[key]))) {
                setError(`Please enter a valid number for '${key}'.`);
                setPrediction(''); return;
            }
        }
        setLoading(true); setError(''); setPrediction('');

        try {
            const numericInputs = Object.keys(inputs).reduce((acc, key) => {
                acc[key] = parseFloat(inputs[key]);
                return acc;
            }, {});

            console.log("Sending data:", numericInputs);
            const response = await axios.post(API_URL, numericInputs, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Received response:", response.data);

            if (response.data && response.data.predicted_crop) {
                setPrediction(response.data.predicted_crop);
            } else {
                setError('Prediction received but in unexpected format.');
            }
        } catch (err) {
            console.error("API Error:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(`API Error: ${err.response.data.error}`);
            } else if (err.request) {
                setError('Network error: Could not reach the prediction API.');
            } else {
                setError('Failed to get prediction. Check inputs/API status.');
            }
            setPrediction('');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Container for the whole component section
        <div className="crop-prediction-container">

            {/* The container that gets the glass effect */}
            <div className="prediction-form-glass">
                <h2>Crop Recommendation</h2>
                <p className="description">
                    Enter the soil and weather conditions to predict the best crop for your land.
                </p>

                {/* Grid container for inputs */}
                <div className="input-grid">
                    {Object.keys(inputs).map((key) => (
                        <div className="input-group" key={key}>
                            <label htmlFor={key}>
                                {key}
                                {key === 'temperature' ? ' (°C/°F)' : key === 'rainfall' ? ' (mm)' : ['N', 'P', 'K'].includes(key) ? ' (kg/ha)' : ''}
                            </label>
                            <input
                                type="number"
                                id={key}
                                name={key}
                                value={inputs[key]}
                                onChange={handleInputChange}
                                placeholder={`Enter ${key}`}
                            />
                        </div>
                    ))}
                </div>

                <button className="predict-button" onClick={handlePredict} disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict Crop'}
                </button>

                {/* Display loading, error, or prediction result */}
                 <div className="status-messages"> {/* Wrapper for messages */}
                    {loading && <p className="loading-message">Loading...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {prediction && !error && (
                        <p className="prediction-result">
                            <span>Predicted Suitable Crop:</span> {prediction}
                        </p>
                    )}
                 </div>

            </div> {/* End of prediction-form-glass */}
        </div> // End of crop-prediction-container
    );
};

export default CropPrediction;