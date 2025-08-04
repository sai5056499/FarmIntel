// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Create this CSS file

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container container"> {/* Use general container class */}
                <div className="footer-section footer-about">
                    <h4 className="footer-title">FarmIntel {/* Or Your App Name */}</h4>
                    <p>Empowering farmers with data-driven insights for a more productive and sustainable future.</p>
                    {/* Optional: Add Logo */}
                </div>

                <div className="footer-section footer-quicklinks">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/calculator">Calculators</Link></li>
                        <li><Link to="/schemes">Schemes</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-legal">
                     <h4 className="footer-title">Resources</h4>
                     <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li> {/* Create this page later */}
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li> {/* Create this page later */}
                        <li><Link to="/terms-of-service">Terms of Service</Link></li> {/* Create this page later */}
                    </ul>
                </div>

                 {/* Optional: Social Media Links */}
                 {/* <div className="footer-section footer-social">
                     <h4 className="footer-title">Connect</h4>
                     <a href="#" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
                     <a href="#" aria-label="Twitter"><i className="ri-twitter-fill"></i></a>
                     <a href="#" aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
                 </div> */}

            </div>
             <div className="footer-bottom">
                <p>© {currentYear} FarmIntel. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;