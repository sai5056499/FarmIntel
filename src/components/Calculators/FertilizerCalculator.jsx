import React, { useState, useEffect } from 'react';
import { cropNutrientDefaults } from '../../data/cropNutrients'; // Corrected path
import './CalculatorStyles.css'; // Shared styles

function FertilizerCalculator() {
    const [selectedCrop, setSelectedCrop] = useState('');
    const [recN, setRecN] = useState(''); // Recommended N kg/hectare
    const [recP, setRecP] = useState(''); // Recommended P2O5 kg/hectare
    const [recK, setRecK] = useState(''); // Recommended K2O kg/hectare
    const [fieldArea, setFieldArea] = useState('');
    const [areaUnit, setAreaUnit] = useState('hectare');
    const [totalN, setTotalN] = useState(null);
    const [totalP, setTotalP] = useState(null);
    const [totalK, setTotalK] = useState(null);
    const [error, setError] = useState('');

    // Define conversion factor
    const HECTARES_PER_ACRE = 0.404686;

    // Update recommendations when crop changes
    useEffect(() => {
        if (selectedCrop && cropNutrientDefaults[selectedCrop]) {
            const defaults = cropNutrientDefaults[selectedCrop];
            setRecN(defaults.recN);
            setRecP(defaults.recP);
            setRecK(defaults.recK);
        } else if (selectedCrop === 'Other' || selectedCrop === '') {
             // Clear if 'Other' or no selection
            setRecN('');
            setRecP('');
            setRecK('');
        }
        // Don't clear error here, calculation useEffect will handle it
    }, [selectedCrop]);

    // Calculate totals when inputs change
    useEffect(() => {
        // Debounce calculation slightly
        const timer = setTimeout(() => {
            calculateTotalFertilizer();
        }, 300); // Calculate after 300ms of inactivity

        return () => clearTimeout(timer); // Cleanup timer
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recN, recP, recK, fieldArea, areaUnit]);


    const calculateTotalFertilizer = () => {
        setError('');
        setTotalN(null); setTotalP(null); setTotalK(null);

        const nRate = parseFloat(recN);
        const pRate = parseFloat(recP);
        const kRate = parseFloat(recK);
        const area = parseFloat(fieldArea);

        // Validation
        const isValidRate = (rate) => !isNaN(rate) && rate >= 0; // Allow 0 rate
        const isValidArea = (a) => !isNaN(a) && a > 0;

        if (!isValidRate(nRate) || !isValidRate(pRate) || !isValidRate(kRate) || !isValidArea(area)) {
             if (recN || recP || recK || fieldArea) {
                 // Optionally show error only if inputs were touched
                 // setError("Please enter valid nutrient rates (>=0) and area (>0).");
             }
            return;
        }

        try {
            // Convert area to hectares (assuming rates are per hectare)
            const areaInHectares = areaUnit === 'acre' ? area * HECTARES_PER_ACRE : area;

            setTotalN((nRate * areaInHectares).toFixed(1));
            setTotalP((pRate * areaInHectares).toFixed(1));
            setTotalK((kRate * areaInHectares).toFixed(1));

        } catch (e) {
             console.error("Calculation error:", e);
             setError("Could not calculate totals. Check inputs.");
        }
    };


    return (
        <div className="calculator-card glass-box">
            <h3>Fertilizer Requirement</h3>
            <p>Calculate total N, P₂O₅, & K₂O based on recommendations.</p>

            <div className="calc-input-group">
                <label htmlFor="cropSelect">Select Crop (Loads Defaults)</label>
                <select id="cropSelect" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                    <option value="">-- Select --</option>
                    {Object.keys(cropNutrientDefaults).map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                    ))}
                    <option value="Other">Other (Manual Entry)</option>
                </select>
            </div>

            <p style={{fontSize: '0.75rem', color: '#666', margin: '-0.5rem 0 1rem 0', textAlign: 'center'}}>
                Enter recommended rates (kg/ha) or adjust defaults:
            </p>

            <div className="nutrient-inputs">
                 <div className="calc-input-group">
                    <label htmlFor="recN">N (kg/ha)</label>
                    <input type="number" id="recN" value={recN} onChange={(e) => setRecN(e.target.value)} placeholder="N Rate" min="0" step="any"/>
                </div>
                 <div className="calc-input-group">
                    <label htmlFor="recP">P₂O₅ (kg/ha)</label>
                    <input type="number" id="recP" value={recP} onChange={(e) => setRecP(e.target.value)} placeholder="P Rate" min="0" step="any"/>
                </div>
                 <div className="calc-input-group">
                    <label htmlFor="recK">K₂O (kg/ha)</label>
                    <input type="number" id="recK" value={recK} onChange={(e) => setRecK(e.target.value)} placeholder="K Rate" min="0" step="any"/>
                </div>
            </div>


             <div className="calc-input-group">
                <label htmlFor="fieldAreaFert">Field Area</label>
                 <div className="input-with-unit">
                    <input
                        type="number"
                        id="fieldAreaFert"
                        value={fieldArea}
                        min="0"
                        step="any"
                        onChange={(e) => setFieldArea(e.target.value)}
                        placeholder="e.g., 5"
                    />
                    <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                        <option value="hectare">Hectares</option>
                        <option value="acre">Acres</option>
                    </select>
                 </div>
            </div>

            {error && <p className="calc-error">{error}</p>}
            {(totalN !== null || totalP !== null || totalK !== null) && !error && (
                <div className="calc-result">
                    <h4>Total Nutrients Needed:</h4>
                    <p>Nitrogen (N): <span>{totalN ?? '0.0'}</span> kg</p>
                    <p>Phosphate (P₂O₅): <span>{totalP ?? '0.0'}</span> kg</p>
                    <p>Potash (K₂O): <span>{totalK ?? '0.0'}</span> kg</p>
                </div>
            )}
        </div>
    );
}

export default FertilizerCalculator;