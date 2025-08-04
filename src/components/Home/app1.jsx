import React, { useState } from 'react'; // Import useState
import CurrentMarketPrices from './components/CurrentMarketPrices';
import WeatherReport from './components/WeatherReport';
import CropPrediction from './components/CropPrediction';
import CropPricePrediction from './components/CropPricePrediction/CropPricePrediction';
import './App.css';
// Assuming you have an icon library like Remix Icon linked in your public/index.html or imported via CSS
// Example: <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">



function App() {
    // State variable for controlling menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle function for menu
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Function to close menu (useful for links)
    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    return (
        // Add class to body if needed when menu is open
        <div className={`App ${isMenuOpen ? 'menu-is-open' : ''}`}>

            {/* --- Navigation Bar --- */}
            <header className="header">
                <nav className="nav container">
                    {/* Logo - closes menu on click */}
                    <a href="/" className="nav__logo" onClick={closeMenu}>AgriPredict 🌱</a>

                    {/* --- Navigation Menu (Links) --- */}
                     {/* Apply 'show-menu' class conditionally */}
                    <div className={`nav__menu ${isMenuOpen ? 'show-menu' : ''}`} id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item">
                                {/* Use onClick to close menu on navigation */}
                                <a href="#home" className="nav__link" onClick={closeMenu}>Home</a>
                            </li>
                             <li className="nav__item">
                                <a href="#crop-prediction" className="nav__link" onClick={closeMenu}>Crop Prediction</a>
                            </li>
                             <li className="nav__item">
                                <a href="#crop-price-prediction" className="nav__link" onClick={closeMenu}>Crop Price Prediction</a>
                            </li>
                            <li className="nav__item">
                                <a href="#market-prices" className="nav__link" onClick={closeMenu}>Market Prices</a>
                            </li>
                            <li className="nav__item">
                                <a href="#weather" className="nav__link" onClick={closeMenu}>Weather</a>
                            </li>
                             {/* Add other links like Resources, About if needed */}
                        </ul>

                        {/* Close button for mobile view */}
                        <div className="nav__close" id="nav-close" onClick={toggleMenu}>
                            <i className="ri-close-line"></i>
                        </div>
                    </div>

                    {/* --- Action Buttons (Right Side - Only Menu Toggle) --- */}
                    <div className="nav__actions">
                        {/* Menu Toggle (Hamburger) */}
                        <div
                            className="nav__toggle"
                            id="nav-toggle"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            role="button"
                            tabIndex="0" // Make it focusable
                         >
                            <i className="ri-menu-3-line"></i>
                         </div>
                    </div>
                </nav>
            </header>

            {/* --- Main Content --- */}
            <main className="main" id="home">

                {/* --- Section: Crop Price Prediction --- */}
                 <section id="crop-price-prediction" className="section">
                   <h2>Crop Price Prediction</h2>
                   <CropPricePrediction/>
                </section>

                {/* --- Section: Crop Prediction --- */}
                <section id="crop-prediction" className="section">
                     <h2>Crop Yield Prediction</h2>
                    <CropPrediction />
                </section>

                {/* --- Section: Current Market Prices --- */}
                <section id="market-prices" className="section">
                    <h2>Current Market Prices</h2>
                    <CurrentMarketPrices />
                </section>

                {/* --- Section: Weather Report --- */}
                <section id="weather" className="section">
                    <h2>Weather Report</h2>
                    <WeatherReport />
                </section>
            </main>

            {/* --- Optional Footer --- */}
            <footer className="footer container section">
                 <p>© {new Date().getFullYear()} AgriPredict. All rights reserved.</p>
                 {/* Add more footer content if needed */}
            </footer>
        </div>
    );
}

export default App;