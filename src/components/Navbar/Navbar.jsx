import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
// Icons...

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // --- Handlers ---
    // ... (Keep handlers as before) ...
    const handleMenuClose = () => setIsMenuOpen(false);

    return (
        <>
            {/* Navigation Bar */}
            <header className="header">
                <nav className="nav container">
                    {/* LOGO */}
                    <Link to="/" className="nav__logo" onClick={handleMenuClose}>
                        FarmIntel {/* Or your actual Logo/Brand Name */}
                    </Link>

                    {/* --- Nav Menu (Links) --- */}
                    <div className={`nav__menu ${isMenuOpen ? 'show-menu' : ''}`} id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <NavLink to="/" className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"} onClick={handleMenuClose}>Home</NavLink>
                            </li>
                            <li className="nav__item">
                                <NavLink to="/services" className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"} onClick={handleMenuClose}>Services</NavLink>
                            </li>
                            <li className="nav__item">
                                <NavLink to="/calculator" className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"} onClick={handleMenuClose}>Calculator</NavLink>
                            </li>
                             <li className="nav__item">
                                <NavLink to="/schemes" className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"} onClick={handleMenuClose}>Schemes</NavLink>
                            </li>
                            {/* ****** ADD THIS LINK ****** */}
                            <li className="nav__item">
                                <NavLink to="/about" className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"} onClick={handleMenuClose}>About Us</NavLink>
                            </li>
                        </ul>
                        {/* Close button (Mobile Menu) */}
                        <div className="nav__close" id="nav-close" onClick={handleMenuClose}>
                            <i className="ri-close-line"></i>
                        </div>
                    </div>

                     {/* --- Nav Actions (Keep as before) --- */}
                    {/* ... */}
                </nav>
            </header>

             {/* --- Modals (Keep as before) --- */}
            {/* ... */}
        </>
    );
}

export default Navbar;