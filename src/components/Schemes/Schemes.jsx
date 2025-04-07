// src/components/Schemes/Schemes.jsx
import React, { useState, useEffect } from 'react';
import { schemes, schemeCategories } from '../../data/schemesData'; // Adjust path if needed
import './Schemes.css'; // Import the CSS

// Optional: A reusable card component for cleaner code
function SchemeCard({ scheme }) {
    return (
        // ****** ADD 'glass-box' CLASS HERE ******
        <div className="scheme-card glass-box">
            <span className="scheme-category">{scheme.category}</span>
            <h3>{scheme.name} ({scheme.shortName})</h3>
            <p className="scheme-description">{scheme.description}</p>
            <h4>Key Benefits:</h4>
            <ul className="scheme-benefits">
                {scheme.keyBenefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                ))}
            </ul>
            <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-link-button cta-button" // Use global CTA button class
                aria-label={`Learn more about ${scheme.name}`}
            >
                Visit Official Site
            </a>
        </div>
    );
}


function Schemes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredSchemes, setFilteredSchemes] = useState(schemes);

    useEffect(() => {
        let currentSchemes = schemes;
        if (selectedCategory !== 'All') {
            currentSchemes = currentSchemes.filter(scheme => scheme.category === selectedCategory);
        }
        if (searchQuery.trim() !== '') {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentSchemes = currentSchemes.filter(
                scheme =>
                    scheme.name.toLowerCase().includes(lowerCaseQuery) ||
                    scheme.shortName.toLowerCase().includes(lowerCaseQuery) ||
                    scheme.description.toLowerCase().includes(lowerCaseQuery)
            );
        }
        setFilteredSchemes(currentSchemes);
    }, [searchQuery, selectedCategory]);

    const handleSearchChange = (event) => setSearchQuery(event.target.value);
    const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

    return (
        // Use global .container class for max-width and padding
        <div className="schemes-page-container container">
            <header className="schemes-header page-header-on-bg"> {/* Add class if text needs contrast */}
                <h1 className="page-title-on-bg">Government Schemes for Farmers</h1>
                <p className="page-subtitle-on-bg">Explore various central government initiatives designed to support the agricultural sector and empower farmers.</p>
            </header>

            <div className="schemes-controls">
                <div className="control-group">
                    <label htmlFor="category-filter">Filter by Category:</label>
                    <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
                        {schemeCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                     <label htmlFor="search-schemes">Search Schemes:</label>
                    <input type="text" id="search-schemes" placeholder="Search by name, keyword..." value={searchQuery} onChange={handleSearchChange} />
                </div>
            </div>

            <div className="schemes-grid">
                {filteredSchemes.length > 0 ? (
                    filteredSchemes.map(scheme => (
                        <SchemeCard key={scheme.id} scheme={scheme} />
                    ))
                ) : (
                    <p className="no-results-message">
                        No schemes found matching your criteria. Try adjusting your search or filter.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Schemes;