import React, { useState, useEffect } from 'react';
import './CalculatorStyles.css'; // Shared styles for calculators

function SeedRateCalculator() {
    const [desiredPopulation, setDesiredPopulation] = useState('');
    const [germination, setGermination] = useState(90); // Default germination %
    const [seedWeight, setSeedWeight] = useState(''); // 1000-seed weight in grams
    const [fieldArea, setFieldArea] = useState(''); // e.g., in Hectares
    const [areaUnit, setAreaUnit] = useState('hectare'); // 'hectare' or 'acre'
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Recalculate whenever relevant inputs change
        calculateSeedRate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredPopulation, germination, seedWeight, fieldArea, areaUnit]);

    const calculateSeedRate = () => {
        setError('');
        setResult(null);

        const pop = parseFloat(desiredPopulation);
        const germ = parseFloat(germination);
        const wt = parseFloat(seedWeight);
        const area = parseFloat(fieldArea);

        // Basic Validation
        if (isNaN(pop) || pop <= 0 || isNaN(germ) || germ <= 0 || germ > 100 || isNaN(wt) || wt <= 0 || isNaN(area) || area <= 0) {
            if (desiredPopulation || germination || seedWeight || fieldArea) { // Only show error if inputs are touched
               // setError("Please enter valid positive numbers for all fields.");
            }
            return; // Exit calculation if inputs are invalid or missing
        }

        try {
            // Formula: Total Seed (kg) = (Desired Population/Area * Field Area / (Germination / 100)) * (Thousand Seed Weight (g) / 1_000_000)
            // Note: Population needs to be per SAME area unit as Field Area

            // Let's assume desiredPopulation is PLANTS PER selected areaUnit (e.g., plants/hectare)
            const seedsNeededPerAreaUnit = pop / (germ / 100);
            const totalSeedsNeeded = seedsNeededPerAreaUnit * area;
            const totalWeightKg = totalSeedsNeeded * (wt / 1000000); // seeds * (g / 1000 seeds) * (kg / 1000 g)

            setResult(totalWeightKg.toFixed(2)); // Result in kg

        } catch (e) {
            console.error("Calculation error:", e);
            setError("Could not calculate. Please check inputs.");
        }
    };

    return (
        <div className="calculator-card glass-box">
            <h3>Seed Rate Calculator</h3>
            <p>Calculate the total seed needed for your field.</p>
            <div className="calc-input-group">
                <label htmlFor="desiredPopulation">Desired Plants / {areaUnit}</label>
                <input
                    type="number"
                    id="desiredPopulation"
                    value={desiredPopulation}
                    onChange={(e) => setDesiredPopulation(e.target.value)}
                    placeholder="e.g., 300000"
                />
            </div>
            <div className="calc-input-group">
                <label htmlFor="germination">Germination Rate (%)</label>
                <input
                    type="number"
                    id="germination"
                    value={germination}
                    min="1" max="100"
                    onChange={(e) => setGermination(e.target.value)}
                />
            </div>
            <div className="calc-input-group">
                <label htmlFor="seedWeight">1000-Seed Weight (grams)</label>
                <input
                    type="number"
                    id="seedWeight"
                    value={seedWeight}
                    onChange={(e) => setSeedWeight(e.target.value)}
                    placeholder="e.g., 40"
                />
            </div>
             <div className="calc-input-group area-group">
                <label htmlFor="fieldArea">Field Area</label>
                 <div className="input-with-unit">
                    <input
                        type="number"
                        id="fieldArea"
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
            {result !== null && !error && (
                <div className="calc-result">
                    <h4>Total Seed Needed:</h4>
                    <p><span>{result}</span> kg</p>
                </div>
            )}
        </div>
    );
}

export default SeedRateCalculator;