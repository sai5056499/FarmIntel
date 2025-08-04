// src/components/Services/Services.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
    return (
        // Add padding/container if needed, but keep background transparent
        <div className="services-container container">
            {/* Make header text stand out against background */}
            <h1 className="page-title-on-bg">Actionable Insights for Smarter Farming</h1>
            <p className="services-intro page-subtitle-on-bg">
                Our suite of services is designed to integrate seamlessly into your farming operations, providing critical information when you need it most. We leverage data science and agricultural knowledge to deliver predictions you can trust, helping you plan better, reduce risks, and improve outcomes.
            </p>

            <div className="services-grid">
                {/* Service Block 1 */}
                 {/* Add glass-box class here */}
                <div className="service-card glass-box">
                    <i className="ri-plant-line service-icon"></i>
                    <h2>Crop Recommendation Service</h2>
                    <h3>Optimize Your Planting Strategy</h3>
                    <p>
                        Maximize your land's potential. Our service analyzes your specific soil composition (N, P, K levels), pH, along with local climate factors like temperature, humidity, and rainfall patterns to suggest the most suitable and potentially highest-yielding crops for your fields.
                    </p>
                    <h4>Key Benefits:</h4>
                    <ul>
                        <li>Increase potential yield.</li>
                        <li>Reduce risk of crop failure.</li>
                        <li>Make data-driven planting decisions.</li>
                        <li>Save time and resources.</li>
                    </ul>
                    <Link to="/crop-prediction" className="service-link-button cta-button">Use Crop Tool</Link> {/* Use generic cta class */}
                </div>

                {/* Service Block 2 */}
                 {/* Add glass-box class here */}
                <div className="service-card glass-box">
                    <i className="ri-line-chart-line service-icon"></i>
                    <h2>Crop Price Forecasting</h2>
                    <h3>Navigate Market Volatility</h3>
                    <p>
                        Anticipate market movements. Our forecasting service analyzes historical data, current trends, and relevant factors to provide estimated future price ranges for key crops, helping you make strategic decisions about selling or storing.
                    </p>
                     <h4>Key Benefits:</h4>
                    <ul>
                        <li>Identify profitable selling windows.</li>
                        <li>Inform planting decisions.</li>
                        <li>Improve negotiation power.</li>
                        <li>Reduce financial uncertainty.</li>
                    </ul>
                    <Link to="/price-prediction" className="service-link-button cta-button">Use Price Tool</Link>
                </div>

                {/* Service Block 3 */}
                 {/* Add glass-box class here */}
                <div className="service-card glass-box">
                     <i className="ri-showers-line service-icon"></i>
                    <h2>Localized Weather Insights</h2>
                    <h3>Plan and Protect Effectively</h3>
                    <p>
                        Stay prepared for changing conditions. Access detailed, localized weather forecasts and historical context crucial for planning planting, irrigation, harvesting, and protecting your crops from adverse conditions.
                    </p>
                     <h4>Key Benefits:</h4>
                    <ul>
                        <li>Optimize operational timing.</li>
                        <li>Mitigate weather-related risks.</li>
                        <li>Improve resource management.</li>
                        <li>Make timely protection decisions.</li>
                    </ul>
                    <Link to="/weather" className="service-link-button cta-button">Use Weather Tool</Link>
                </div>
            </div>
        </div>
    );
}

export default Services;