// src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll update this CSS file

function Home() {
    return (
        <div className="home-container container"> {/* Use standard container */}

            {/* Hero Section */}
            <section className="home-hero">
                {/* Apply glass effect to the content container */}
                <div className="hero-content glass-box"> {/* Apply glass class */}
                    <h1>Empowering Farmers with Data-Driven Decisions</h1>
                    <p className="subtitle">
                        Access reliable crop recommendations, price forecasts, and localized weather insights to optimize your yield and profitability.
                    </p>
                    <p>
                        Farming is complex. We provide precise, easy-to-understand predictions based on advanced data analysis and agricultural science, helping you navigate uncertainty and cultivate success. Explore our tools designed specifically for the modern farmer.
                    </p>
                    <Link to="/services" className="cta-button">Explore Our Services</Link>
                </div>
            </section>

            {/* Features/Quick Access Section */}
            <section className="home-features">
                {/* Optional heading outside the grid */}
                <h2 className="section-title">Get Started Quickly</h2>
                <div className="features-grid">
                    {/* Apply glass effect to each card */}
                    <div className="feature-card glass-box">
                        <i className="ri-plant-line feature-icon"></i>
                        <h3>Crop Recommendations</h3>
                        <p>Find the best crops for your specific soil and climate conditions.</p>
                        <Link to="/crop-prediction" className="feature-link">Get Recommendations</Link>
                    </div>
                    <div className="feature-card glass-box">
                        <i className="ri-line-chart-line feature-icon"></i>
                        <h3>Price Forecasts</h3>
                        <p>Anticipate market trends and make informed selling decisions.</p>
                        <Link to="/price-prediction" className="feature-link">View Forecasts</Link>
                    </div>
                    <div className="feature-card glass-box">
                        <i className="ri-showers-line feature-icon"></i>
                        <h3>Weather Insights</h3>
                        <p>Access localized forecasts crucial for planning and protection.</p>
                        <Link to="/weather" className="feature-link">Check Weather</Link>
                    </div>
                </div>
            </section>

            {/* How We Help Snippet */}
             {/* Apply glass effect to this section */}
            <section className="how-we-help glass-box">
                 <h2>Actionable Insights, Practical Results</h2>
                 <p>Our platform offers more than just data; we provide actionable insights. Discover how our services translate complex information into practical strategies for your farm.</p>
                 <Link to="/services" className="cta-button-secondary">Learn More About Services</Link>
            </section>
        </div>
    );
}

export default Home;