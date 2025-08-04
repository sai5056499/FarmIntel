import React, { useState, useEffect } from 'react';
import './CalculatorStyles.css'; // Shared styles for calculator cards

// --- Conversion Factors ---
const HECTARES_PER_ACRE = 0.404686;
const SQMETERS_PER_HECTARE = 10000;
const INCHES_TO_CM = 2.54;
const CM_PER_METER = 100;
const LITERS_PER_GALLON = 3.78541;
const METER_PER_FOOT = 0.3048;
const KG_PER_LB = 0.453592;
const MM_PER_INCH = 25.4;

// --- Helper Function for Validation ---
const isValidPositive = (numStr) => {
    const num = parseFloat(numStr);
    return !isNaN(num) && num > 0;
};
const isValidNonNegative = (numStr) => {
    const num = parseFloat(numStr);
    return !isNaN(num) && num >= 0;
};

// ========================================
// 1. Plant Population Calculator
// ========================================
function PlantPopulationCalculator() {
    const [rowSpacing, setRowSpacing] = useState('');
    const [plantSpacing, setPlantSpacing] = useState('');
    const [unit, setUnit] = useState('cm'); // 'cm' or 'inch'
    const [plantsPerHectare, setPlantsPerHectare] = useState(null);
    const [plantsPerAcre, setPlantsPerAcre] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(calculatePopulation, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSpacing, plantSpacing, unit]);

    function calculatePopulation() {
        setError('');
        setPlantsPerHectare(null);
        setPlantsPerAcre(null);

        if (!isValidPositive(rowSpacing) || !isValidPositive(plantSpacing)) {
            return;
        }

        try {
            let rowMeters = parseFloat(rowSpacing);
            let plantMeters = parseFloat(plantSpacing);

            if (unit === 'cm') {
                rowMeters /= CM_PER_METER;
                plantMeters /= CM_PER_METER;
            } else if (unit === 'inch') {
                rowMeters *= INCHES_TO_CM / CM_PER_METER;
                plantMeters *= INCHES_TO_CM / CM_PER_METER;
            }

            const areaPerPlantSqMeters = rowMeters * plantMeters;
            if (areaPerPlantSqMeters <= 0) {
                setError("Spacing must result in positive area.");
                return;
            }

            const plantsPerSqMeter = 1 / areaPerPlantSqMeters;
            const pph = plantsPerSqMeter * SQMETERS_PER_HECTARE;
            const ppa = pph * HECTARES_PER_ACRE; // Convert plants/hectare to plants/acre

            setPlantsPerHectare(Math.round(pph));
            setPlantsPerAcre(Math.round(ppa));

        } catch (e) {
            setError("Calculation error.");
            console.error(e);
        }
    }

    return (
        <div className="calculator-card glass-box">
            <h3>Plant Population</h3>
            <p>Calculate estimated plants per Hectare or Acre.</p>
            <div className="calc-input-group area-group"> {/* Reusing class for layout */}
                <label htmlFor="pop-unit">Spacing Unit</label>
                <select id="pop-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="inch">Inches</option>
                </select>
            </div>
            <div className="calc-input-group">
                <label htmlFor="rowSpacing">Row Spacing ({unit})</label>
                <input type="number" id="rowSpacing" value={rowSpacing} onChange={(e) => setRowSpacing(e.target.value)} min="0" step="any" placeholder={`e.g., ${unit === 'cm' ? 75 : 30}`} />
            </div>
            <div className="calc-input-group">
                <label htmlFor="plantSpacing">Plant Spacing in Row ({unit})</label>
                <input type="number" id="plantSpacing" value={plantSpacing} onChange={(e) => setPlantSpacing(e.target.value)} min="0" step="any" placeholder={`e.g., ${unit === 'cm' ? 20 : 8}`} />
            </div>

            {error && <p className="calc-error">{error}</p>}
            {plantsPerHectare !== null && !error && (
                <div className="calc-result">
                    <h4>Estimated Population:</h4>
                    <p><span>{plantsPerHectare.toLocaleString()}</span> Plants / Hectare</p>
                    <p><span>{plantsPerAcre.toLocaleString()}</span> Plants / Acre</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// 2. Pesticide Mixing Calculator
// ========================================
function PesticideMixCalculator() {
    const [tankSize, setTankSize] = useState('');
    const [tankUnit, setTankUnit] = useState('liter'); // liter or gallon
    const [productRate, setProductRate] = useState('');
    const [rateUnit, setRateUnit] = useState('ml_per_liter'); // ml_per_liter, oz_per_gallon
    // Add states for per-area calculations if needed later
    // const [applicationRate, setApplicationRate] = useState('');
    // const [appRateUnit, setAppRateUnit] = useState('l_per_ha');
    const [productNeeded, setProductNeeded] = useState(null);
    const [productUnitLabel, setProductUnitLabel] = useState('ml');
    const [error, setError] = useState('');

     useEffect(() => {
        const timer = setTimeout(calculateMix, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tankSize, tankUnit, productRate, rateUnit]);

    function calculateMix() {
        setError('');
        setProductNeeded(null);

         if (!isValidPositive(tankSize) || !isValidPositive(productRate)) {
            return;
        }

        try {
            const tank = parseFloat(tankSize);
            const rate = parseFloat(productRate);
            let totalProduct = 0;

            if (rateUnit === 'ml_per_liter') {
                const tankLiters = tankUnit === 'gallon' ? tank * LITERS_PER_GALLON : tank;
                totalProduct = tankLiters * rate;
                setProductUnitLabel('ml');
            } else if (rateUnit === 'oz_per_gallon') {
                 const tankGallons = tankUnit === 'liter' ? tank / LITERS_PER_GALLON : tank;
                 totalProduct = tankGallons * rate;
                 setProductUnitLabel('fl oz');
            }
            // Add logic here for per-area rate calculations if you implement those inputs

            setProductNeeded(totalProduct.toFixed(2));

        } catch(e) {
             setError("Calculation error.");
             console.error(e);
        }
    }

    return (
        <div className="calculator-card glass-box">
            <h3>Pesticide Mixing</h3>
            <p>Calculate product needed per tank (Rate per Volume).</p>
             <div className="calc-input-group area-group">
                <label htmlFor="tankSize">Sprayer Tank Size</label>
                 <div className="input-with-unit">
                    <input type="number" id="tankSize" value={tankSize} onChange={(e) => setTankSize(e.target.value)} min="0" step="any" placeholder="e.g., 100" />
                    <select value={tankUnit} onChange={(e) => setTankUnit(e.target.value)}>
                        <option value="liter">Liters</option>
                        <option value="gallon">Gallons (US)</option>
                    </select>
                 </div>
            </div>
             <div className="calc-input-group area-group">
                <label htmlFor="productRate">Product Label Rate</label>
                 <div className="input-with-unit">
                    <input type="number" id="productRate" value={productRate} onChange={(e) => setProductRate(e.target.value)} min="0" step="any" placeholder="e.g., 5" />
                    <select value={rateUnit} onChange={(e) => setRateUnit(e.target.value)}>
                        <option value="ml_per_liter">ml / Liter</option>
                        <option value="oz_per_gallon">fl oz / Gallon</option>
                         {/* Add options for per-area rates later */}
                         {/* <option value="ml_per_ha">ml / Hectare</option> */}
                         {/* <option value="oz_per_acre">fl oz / Acre</option> */}
                    </select>
                 </div>
            </div>
             {/* Add inputs for Application Rate if using per-area calculations */}

            {error && <p className="calc-error">{error}</p>}
            {productNeeded !== null && !error && (
                <div className="calc-result">
                    <h4>Product Needed Per Tank:</h4>
                    <p><span>{productNeeded}</span> {productUnitLabel}</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// 3. Yield Estimation Calculator
// ========================================
function YieldEstimationCalculator() {
    const [areaPlanted, setAreaPlanted] = useState('');
    const [areaUnit, setAreaUnit] = useState('hectare');
    const [yieldPerUnit, setYieldPerUnit] = useState('');
    const [yieldUnit, setYieldUnit] = useState('kg_per_hectare'); // e.g., kg_per_hectare, qtl_per_acre, lbs_per_acre
    const [totalYield, setTotalYield] = useState(null);
    const [totalYieldUnitLabel, setTotalYieldUnitLabel] = useState('kg');
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(calculateEstimate, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaPlanted, areaUnit, yieldPerUnit, yieldUnit]);

    function calculateEstimate() {
        setError('');
        setTotalYield(null);

        if (!isValidPositive(areaPlanted) || !isValidPositive(yieldPerUnit)) {
            return;
        }
        try {
            const area = parseFloat(areaPlanted);
            const yieldRate = parseFloat(yieldPerUnit);
            let total = 0;
            let label = '';

            // Normalize area to hectares for calculation if yield unit is per hectare
            const areaInHectares = areaUnit === 'acre' ? area * HECTARES_PER_ACRE : area;
            // Normalize area to acres for calculation if yield unit is per acre
            const areaInAcres = areaUnit === 'hectare' ? area / HECTARES_PER_ACRE : area;

            if (yieldUnit === 'kg_per_hectare') {
                total = areaInHectares * yieldRate;
                label = 'kg';
            } else if (yieldUnit === 'qtl_per_hectare') {
                total = areaInHectares * yieldRate;
                label = 'Quintals';
            } else if (yieldUnit === 'lbs_per_acre') {
                total = areaInAcres * yieldRate;
                label = 'lbs';
            } else if (yieldUnit === 'bushels_per_acre') { // Note: Bushel weight varies by crop
                 total = areaInAcres * yieldRate;
                 label = 'Bushels (approx)';
            } else {
                setError("Selected yield unit not fully supported yet.");
                return;
            }

            setTotalYield(total.toLocaleString(undefined, { maximumFractionDigits: 1 })); // Format with commas
            setTotalYieldUnitLabel(label);

        } catch(e) {
             setError("Calculation error.");
             console.error(e);
        }
    }

    return (
        <div className="calculator-card glass-box">
            <h3>Yield Estimation</h3>
            <p>Estimate total production based on area and rate.</p>
             <div className="calc-input-group area-group">
                <label htmlFor="yieldArea">Area Planted</label>
                 <div className="input-with-unit">
                    <input type="number" id="yieldArea" value={areaPlanted} onChange={(e) => setAreaPlanted(e.target.value)} min="0" step="any" placeholder="e.g., 10"/>
                    <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}>
                        <option value="hectare">Hectares</option>
                        <option value="acre">Acres</option>
                    </select>
                 </div>
            </div>
             <div className="calc-input-group area-group">
                <label htmlFor="yieldRate">Estimated Yield Rate</label>
                 <div className="input-with-unit">
                    <input type="number" id="yieldRate" value={yieldPerUnit} onChange={(e) => setYieldPerUnit(e.target.value)} min="0" step="any" placeholder="e.g., 4000"/>
                    <select value={yieldUnit} onChange={(e) => setYieldUnit(e.target.value)}>
                        <option value="kg_per_hectare">kg / Hectare</option>
                        <option value="qtl_per_hectare">Quintals / Hectare</option>
                        <option value="lbs_per_acre">lbs / Acre</option>
                        <option value="bushels_per_acre">Bushels / Acre</option>
                    </select>
                 </div>
            </div>

            {error && <p className="calc-error">{error}</p>}
            {totalYield !== null && !error && (
                <div className="calc-result">
                    <h4>Total Estimated Yield:</h4>
                    <p><span>{totalYield}</span> {totalYieldUnitLabel}</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// 4. Break-Even Yield Calculator
// ========================================
function BreakEvenYieldCalculator() {
    const [totalCost, setTotalCost] = useState('');
    const [costUnit, setCostUnit] = useState('per_hectare'); // per_hectare, per_acre
    const [sellingPrice, setSellingPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('per_kg'); // per_kg, per_qtl, per_lb, per_bushel
    const [breakEvenYield, setBreakEvenYield] = useState(null);
    const [yieldUnitLabel, setYieldUnitLabel] = useState('kg');
    const [areaUnitLabel, setAreaUnitLabel] = useState('Hectare');
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(calculateBreakEvenYield, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalCost, costUnit, sellingPrice, priceUnit]);

    function calculateBreakEvenYield() {
        setError('');
        setBreakEvenYield(null);

        if (!isValidPositive(totalCost) || !isValidPositive(sellingPrice)) {
            return;
        }
        try {
            const cost = parseFloat(totalCost);
            const price = parseFloat(sellingPrice);
            let yieldResult = 0;
            let yLabel = '';
            let aLabel = '';

            // Simple direct calculation: BE Yield = Cost / Price
            // Units must match: (Cost/Area) / (Price/YieldUnit) = YieldUnit/Area
            yieldResult = cost / price;

            // Determine labels based on selected units
             if (costUnit === 'per_hectare') aLabel = 'Hectare';
             else if (costUnit === 'per_acre') aLabel = 'Acre';

             if (priceUnit === 'per_kg') yLabel = 'kg';
             else if (priceUnit === 'per_qtl') yLabel = 'Quintals';
             else if (priceUnit === 'per_lb') yLabel = 'lbs';
             else if (priceUnit === 'per_bushel') yLabel = 'Bushels';

             setYieldUnitLabel(yLabel);
             setAreaUnitLabel(aLabel);
             setBreakEvenYield(yieldResult.toFixed(2));

        } catch(e) {
            setError("Calculation error. Ensure units correspond.");
            console.error(e);
        }
    }

    return (
        <div className="calculator-card glass-box">
            <h3>Break-Even Yield</h3>
            <p>Calculate the yield needed to cover production costs.</p>
             <div className="calc-input-group area-group">
                <label htmlFor="totalCostBEYield">Total Cost of Production</label>
                 <div className="input-with-unit">
                    <input type="number" id="totalCostBEYield" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} min="0" step="any" placeholder="e.g., 50000"/>
                    <select value={costUnit} onChange={(e) => setCostUnit(e.target.value)}>
                        <option value="per_hectare">per Hectare (₹, $..)</option>
                        <option value="per_acre">per Acre (₹, $..)</option>
                    </select>
                 </div>
            </div>
             <div className="calc-input-group area-group">
                <label htmlFor="sellingPriceBEYield">Expected Selling Price</label>
                 <div className="input-with-unit">
                    <input type="number" id="sellingPriceBEYield" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} min="0" step="any" placeholder="e.g., 20"/>
                    <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)}>
                        <option value="per_kg">per kg (₹, $..)</option>
                        <option value="per_qtl">per Quintal (₹, $..)</option>
                        <option value="per_lb">per lb (₹, $..)</option>
                        <option value="per_bushel">per Bushel (₹, $..)</option>
                    </select>
                 </div>
            </div>
            {error && <p className="calc-error">{error}</p>}
            {breakEvenYield !== null && !error && (
                <div className="calc-result">
                    <h4>Break-Even Yield Needed:</h4>
                    <p><span>{breakEvenYield}</span> {yieldUnitLabel} / {areaUnitLabel}</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// 5. Break-Even Price Calculator
// ========================================
function BreakEvenPriceCalculator() {
    const [totalCostBEPrice, setTotalCostBEPrice] = useState('');
    const [costUnitBEPrice, setCostUnitBEPrice] = useState('per_hectare');
    const [expectedYield, setExpectedYield] = useState('');
    const [yieldUnitBEPrice, setYieldUnitBEPrice] = useState('kg_per_hectare');
    const [breakEvenPrice, setBreakEvenPrice] = useState(null);
    const [priceUnitLabel, setPriceUnitLabel] = useState('per_kg');
    const [error, setError] = useState('');

     useEffect(() => {
        const timer = setTimeout(calculateBreakEvenPrice, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalCostBEPrice, costUnitBEPrice, expectedYield, yieldUnitBEPrice]);


     function calculateBreakEvenPrice() {
        setError('');
        setBreakEvenPrice(null);

        if (!isValidPositive(totalCostBEPrice) || !isValidPositive(expectedYield)) {
            return;
        }
        try {
            const cost = parseFloat(totalCostBEPrice);
            const yieldVal = parseFloat(expectedYield);
            let priceResult = 0;
            let pLabel = '';

             // Formula: BE Price = Cost / Yield
             // Units: (Cost/Area) / (YieldUnit/Area) = Cost/YieldUnit
             priceResult = cost / yieldVal;

            // Determine price unit label based on yield unit
            if (yieldUnitBEPrice.includes('kg')) pLabel = 'per kg';
            else if (yieldUnitBEPrice.includes('qtl')) pLabel = 'per Quintal';
            else if (yieldUnitBEPrice.includes('lb')) pLabel = 'per lb';
            else if (yieldUnitBEPrice.includes('bushel')) pLabel = 'per Bushel';

            // Check if units correspond (Cost per HECTARE needs Yield per HECTARE, etc.)
            if ((costUnitBEPrice === 'per_hectare' && !yieldUnitBEPrice.includes('hectare')) ||
                (costUnitBEPrice === 'per_acre' && !yieldUnitBEPrice.includes('acre'))) {
                setError("Cost area unit (Hectare/Acre) must match Yield area unit.");
                return;
            }

            setPriceUnitLabel(pLabel);
            setBreakEvenPrice(priceResult.toFixed(2));

        } catch(e) {
            setError("Calculation error. Ensure units correspond.");
            console.error(e);
        }
     }

    return (
        <div className="calculator-card glass-box">
            <h3>Break-Even Price</h3>
            <p>Calculate the selling price needed to cover costs.</p>
            <div className="calc-input-group area-group">
                <label htmlFor="totalCostBEPrice">Total Cost of Production</label>
                 <div className="input-with-unit">
                    <input type="number" id="totalCostBEPrice" value={totalCostBEPrice} onChange={(e) => setTotalCostBEPrice(e.target.value)} min="0" step="any" placeholder="e.g., 50000"/>
                    <select value={costUnitBEPrice} onChange={(e) => setCostUnitBEPrice(e.target.value)}>
                        <option value="per_hectare">per Hectare (₹, $..)</option>
                        <option value="per_acre">per Acre (₹, $..)</option>
                    </select>
                 </div>
            </div>
             <div className="calc-input-group area-group glass-box">
                <label htmlFor="expectedYieldBEPrice">Expected Yield</label>
                 <div className="input-with-unit">
                    <input type="number" id="expectedYieldBEPrice" value={expectedYield} onChange={(e) => setExpectedYield(e.target.value)} min="0" step="any" placeholder="e.g., 4000"/>
                    <select value={yieldUnitBEPrice} onChange={(e) => setYieldUnitBEPrice(e.target.value)}>
                         {/* Ensure these match the Cost Unit Area */}
                        <option value="kg_per_hectare">kg / Hectare</option>
                        <option value="qtl_per_hectare">Quintals / Hectare</option>
                        <option value="kg_per_acre">kg / Acre</option> {/* Added */}
                        <option value="lbs_per_acre">lbs / Acre</option>
                        <option value="bushels_per_acre">Bushels / Acre</option>
                    </select>
                 </div>
            </div>

            {error && <p className="calc-error">{error}</p>}
            {breakEvenPrice !== null && !error && (
                <div className="calc-result">
                    <h4>Break-Even Price Needed:</h4>
                     {/* Make currency dynamic if needed */}
                    <p><span>{breakEvenPrice}</span> (₹, $..) {priceUnitLabel}</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// 6. Irrigation Needs Calculator (Simplified)
// ========================================
function IrrigationNeedsCalculator() {
    const [waterReq, setWaterReq] = useState(''); // mm per day
    const [appAmount, setAppAmount] = useState(''); // mm per application
    const [frequency, setFrequency] = useState(null);
    const [error, setError] = useState('');

     useEffect(() => {
        const timer = setTimeout(calculateFrequency, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waterReq, appAmount]);

    function calculateFrequency() {
        setError('');
        setFrequency(null);
         if (!isValidPositive(waterReq) || !isValidPositive(appAmount)) {
            return;
         }
         try {
            const req = parseFloat(waterReq);
            const app = parseFloat(appAmount);

            if (req <= 0) { setError("Daily requirement must be > 0."); return; }

            const freq = app / req;
            setFrequency(freq.toFixed(1));

         } catch(e) {
             setError("Calculation error.");
             console.error(e);
         }
    }

    return (
        <div className="calculator-card glass-box">
            <h3>Irrigation Frequency (Est.)</h3>
            <p>Estimate how often to irrigate (Simplified).</p>
            <div className="calc-input-group">
                <label htmlFor="waterReq">Avg. Daily Crop Water Req. (mm/day)</label>
                <input type="number" id="waterReq" value={waterReq} onChange={(e) => setWaterReq(e.target.value)} min="0" step="any" placeholder="e.g., 5 (ET)"/>
            </div>
            <div className="calc-input-group">
                <label htmlFor="appAmount">Water Applied per Irrigation (mm)</label>
                <input type="number" id="appAmount" value={appAmount} onChange={(e) => setAppAmount(e.target.value)} min="0" step="any" placeholder="e.g., 25"/>
            </div>
             <p style={{fontSize: '0.75rem', color: '#666', margin: '-0.5rem 0 1rem 0', textAlign: 'center'}}>
                Note: Does not account for rainfall, soil type, or efficiency.
            </p>
             {error && <p className="calc-error">{error}</p>}
            {frequency !== null && !error && (
                <div className="calc-result">
                    <h4>Estimated Irrigation Frequency:</h4>
                    <p>Approx. every <span>{frequency}</span> Days</p>
                </div>
            )}
        </div>
    );
}


// ========================================
// Main Exported Component
// ========================================
function AdditionalCalculators() {
    return (
        <>
            <PlantPopulationCalculator />
            <PesticideMixCalculator />
            <YieldEstimationCalculator />
            <BreakEvenYieldCalculator />
            <BreakEvenPriceCalculator />
            <IrrigationNeedsCalculator />
        </>
    );
}

export default AdditionalCalculators; // Export the wrapper component