// src/components/AboutUs/AboutUs.jsx
import React from 'react';
import './AboutUs.css'; // Create this CSS file

function AboutUs() {
    return (
        <div className="about-us-container container"> {/* Use container class */}
            <header className="about-us-header">
                <h1>Bridging Agriculture and Technology</h1>
                <p className="subtitle">Our commitment to empowering farmers through data and innovation.</p>
            </header>

            <section className="about-section mission-section">
                <h2>Our Mission</h2>
                <p>
                    Our mission is to empower farmers with accessible, reliable data insights that enhance productivity, sustainability, and profitability in an ever-changing agricultural world. We strive to be a trusted partner in your farming journey.
                </p>
            </section>

            <section className="about-section approach-section">
                <h2>Our Approach</h2>
                <p>
                    We believe in the power of data to transform farming practices. By combining expertise in data science, machine learning, and practical agronomy, we develop user-friendly tools that address the real-world challenges you face daily. We focus on translating complex data into actionable recommendations.
                </p>
                 {/* Optional Image */}
                 {/* <img src="/path/to/approach-image.jpg" alt="Data analysis for farming" className="about-image"/> */}
            </section>

            <section className="about-section data-section">
                <h2>Data & Accuracy</h2>
                <p>
                    We are committed to providing the most accurate predictions possible within the limits of available data and modeling techniques. We utilize data from reputable meteorological services, government agricultural bodies, market reports, and established agricultural research. Our models are continuously evaluated and refined, but we always recommend considering predictions alongside your invaluable local knowledge and experience.
                </p>
            </section>

            {/* Optional: Add sections for Team, Values, etc. */}
            {/* <section className="about-section team-section">
                <h2>Our Team</h2>
                <p>
                    Our team includes dedicated data scientists, agricultural experts, and software engineers passionate about supporting the farming community through technology.
                </p>
            </section> */}
        </div>
    );
}

export default AboutUs;