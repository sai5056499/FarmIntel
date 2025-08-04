import React from 'react';
import SeedRateCalculator from '../Calculators/SeedRateCalculator';
import FertilizerCalculator from '../Calculators/FertilizerCalculator';
import AdditionalCalculators from '../Calculators/AdditionalCalculators';
// Import other calculators when you build them
// import PlantPopulationCalculator from '../Calculators/PlantPopulationCalculator';
// import PesticideMixCalculator from '../Calculators/PesticideMixCalculator';
// import YieldEstimateCalculator from '../Calculators/YieldEstimateCalculator';
// import BreakEvenYieldCalculator from '../Calculators/BreakEvenYieldCalculator';
// import BreakEvenPriceCalculator from '../Calculators/BreakEvenPriceCalculator';

import './CalculatorPage.css'; // Styles for the overall page layout

function CalculatorPage() {
    return (
        <div className="calculator-page-container">
            <header className="calculator-page-header">
                <h1>Farming Calculators</h1>
                <p>Essential tools to help you plan and manage your farming operations effectively.</p>
            </header>

            <div className="calculators-grid">
                {/* Add each calculator component here */}
                <SeedRateCalculator />
                <FertilizerCalculator />

                {/* Placeholders for other calculators */}
                <AdditionalCalculators />

            </div>
        </div>
    );
}

export default CalculatorPage;