// src/components/CropPricePrediction/CropPricePrediction.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './CropPricePrediction.css';

// Define sample plant types - should match keys/names used for saving models
const plantTypes = [
    "Wheat", "Cotton", "Sugarcane", "Bajra", "Jowar" // Add others as needed
];

// Define months
const months = [
    { value: 1, name: "January" }, { value: 2, name: "February" }, { value: 3, name: "March" },
    { value: 4, name: "April" }, { value: 5, name: "May" }, { value: 6, name: "June" },
    { value: 7, name: "July" }, { value: 8, name: "August" }, { value: 9, name: "September" },
    { value: 10, name: "October" }, { value: 11, name: "November" }, { value: 12, name: "December" }
];

// API Endpoint URL (match your Flask server address/port)
const PRICE_API_URL = 'http://127.0.0.1:5000/predict_price';

function CropPricePrediction() {
    // State for each input
    const [plantType, setPlantType] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [rainfall, setRainfall] = useState('');

    // State for prediction, loading, error
    const [pricePrediction, setPricePrediction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePredictPrice = async () => { // Make the function async
        setError('');
        setPricePrediction('');

        // --- Input Validation ---
        if (!plantType) { setError("Please select a plant type."); return; }
        if (!year || isNaN(parseInt(year)) || parseInt(year) < 1900 || parseInt(year) > 2100) {
            setError("Please enter a valid year (e.g., 1900-2100)."); return;
        }
        if (!month) { setError("Please select a month."); return; }
        if (!rainfall || isNaN(parseFloat(rainfall)) || parseFloat(rainfall) < 0) {
            setError("Please enter a valid rainfall amount (mm)."); return;
        }
        // --- End Validation ---

        setLoading(true);

        // --- Prepare Data Payload ---
        // Keys MUST match what app.py expects in request.get_json()
        const payload = {
            plantType: plantType,
            year: parseInt(year), // Send as number
            month: parseInt(month), // Send as number
            rainfall: parseFloat(rainfall) // Send as number
            // **Important**: Add any other features here if your specific
            // price model requires them (e.g., MSP, Area), fetching them
            // from state or other sources if necessary.
        };

        console.log("Sending price prediction request:", payload);

        // --- API Call ---
        try {
            const response = await axios.post(PRICE_API_URL, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Received price prediction response:", response.data);

            // --- Handle Response ---
            if (response.data && response.data.predicted_price !== undefined) {
                // Format the prediction nicely
                const formattedPrice = parseFloat(response.data.predicted_price).toFixed(2); // Example formatting
                const currency = response.data.currency || ''; // Get currency if provided
                setPricePrediction(`Estimated Price (${currency}): ${formattedPrice}`);
            } else if (response.data && response.data.error) {
                 // Handle specific errors returned by the API
                 setError(`Prediction Error: ${response.data.error}`);
            }
            else {
                // Handle unexpected success response format
                setError('Received an unexpected response format from the server.');
                console.warn("Unexpected success response:", response.data);
            }

        } catch (err) {
            // --- Handle Network/Server Errors ---
            console.error("API Call Error:", err);
            if (err.response && err.response.data && err.response.data.error) {
                // Error message sent back from Flask jsonify({'error': ...})
                setError(`API Error: ${err.response.data.error}`);
            } else if (err.request) {
                // Request was made but no response received (server down, network issue)
                setError('Network Error: Could not reach the prediction server. Is it running?');
            } else {
                // Something else happened in setting up the request
                setError(`Request Failed: ${err.message}`);
            }
            setPricePrediction(''); // Clear any previous prediction on error
        } finally {
            // --- Reset Loading State ---
            setLoading(false);
        }
    };

    return (
        <div className="price-prediction-container">
            <div className="prediction-form-glass">
                <h2>Crop Price Forecast</h2>
                <p className="description">
                    Enter the details below to get an estimated price forecast based on historical data and model predictions.
                </p>

                <div className="input-grid-price">
                    {/* Plant Type Select */}
                    <div className="input-group">
                        <label htmlFor="plantType">Type of Plant</label>
                        <select id="plantType" value={plantType} onChange={(e) => setPlantType(e.target.value)} required>
                            <option value="" disabled>Select Plant Type...</option>
                            {plantTypes.map(plant => (
                                <option key={plant} value={plant}>{plant}</option>
                            ))}
                        </select>
                    </div>
                    {/* Year Input */}
                    <div className="input-group">
                        <label htmlFor="year">Year</label>
                        <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2024" min="1900" max="2100" required />
                    </div>
                    {/* Month Select */}
                    <div className="input-group">
                        <label htmlFor="month">Month</label>
                        <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} required>
                            <option value="" disabled>Select Month...</option>
                            {months.map(m => ( <option key={m.value} value={m.value}>{m.name}</option> ))}
                        </select>
                    </div>
                    {/* Rainfall Input */}
                    <div className="input-group">
                        <label htmlFor="rainfall">Average Rainfall (mm)</label>
                        <input type="number" id="rainfall" value={rainfall} onChange={(e) => setRainfall(e.target.value)} placeholder="e.g., 150" min="0" required />
                    </div>
                </div>

                <button className="predict-button" onClick={handlePredictPrice} disabled={loading}>
                    {loading ? 'Forecasting...' : 'Forecast Price'}
                </button>

                {/* Display loading, error, or prediction result */}
                <div className="status-messages">
                    {loading && <p className="loading-message">Loading forecast...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {pricePrediction && !error && ( <p className="prediction-result">{pricePrediction}</p> )}
                </div>

            </div> {/* End of prediction-form-glass */}
        </div> // End of price-prediction-container
    );
}

export default CropPricePrediction;