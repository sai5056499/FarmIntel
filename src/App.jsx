// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import ALL necessary components
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import CalculatorPage from './components/CalculatorPage/CalculatorPage'; // <-- IMPORT THIS
import Schemes from './components/Schemes/Schemes';
import CropPrediction from './components/CropPrediction/CropPrediction'; // Ensure correct path if nested
import CropPricePrediction from './components/CropPricePrediction/CropPricePrediction'; // Ensure correct path if nested
import WeatherReport from './components/WeatherReport/WeatherReport'; // Ensure correct path if nested
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';
// Import global styles if needed
import './index.css';

function App() {
    return (
        <Router>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    {/* CORRECTED ROUTE: Use CalculatorPage */}
                    <Route path="/calculator" element={<CalculatorPage />} />
                    <Route path="/schemes" element={<Schemes />} />
                    // Change this line in App.jsx:
<Route path="/about" element={<AboutUs />} />
                    <Route path="/crop-prediction" element={<CropPrediction />} />
                    <Route path="/price-prediction" element={<CropPricePrediction />} />
                    <Route path="/weather" element={<WeatherReport />} />
                    {/* Add other routes as needed */}
                </Routes>
            </main>
            <Footer/>
        </Router>
    );
}

export default App;