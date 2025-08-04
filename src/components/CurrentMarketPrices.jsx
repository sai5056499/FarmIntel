import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed

const CurrentMarketPrices = () => {
    const [marketPrices, setMarketPrices] = useState([]);
    const [loading, setLoading] = useState(false); // Start as false, set true only during fetch
    const [error, setError] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    // Example: Fetch these from an API or define statically
    const [availableCrops, setAvailableCrops] = useState(['Wheat', 'Rice', 'Corn', 'Soybeans']);
    const [availableLocations, setAvailableLocations] = useState(['Local Market A', 'Regional Exchange B', 'National Platform C']);

    useEffect(() => {
        // Only fetch if both crop and location are selected
        if (selectedCrop && selectedLocation) {
            const fetchMarketPrices = async () => {
                setLoading(true); // Set loading true before fetch
                setError(''); // Clear previous errors
                setMarketPrices([]); // Clear previous prices

                try {
                    // *** IMPORTANT: Ensure '/api/market-prices' endpoint exists on your backend ***
                    const response = await axios.get('/api/market-prices', {
                        params: {
                            crop: selectedCrop,
                            location: selectedLocation,
                        },
                    });
                    setMarketPrices(response.data || []); // Handle case where data might be null/undefined
                } catch (err) {
                    setError('Failed to fetch market prices. Is the API running?');
                    console.error('Error fetching market prices:', err);
                    setMarketPrices([]); // Ensure prices are empty on error
                } finally {
                    setLoading(false); // Set loading false after fetch attempt
                }
            };

            fetchMarketPrices();
        } else {
          // Reset if selections are cleared
          setMarketPrices([]);
          setError('');
          setLoading(false);
        }
    }, [selectedCrop, selectedLocation]); // Re-run effect when selectedCrop or selectedLocation changes

    const handleCropChange = (event) => {
        setSelectedCrop(event.target.value);
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    return (
        <div>
            <h2>Current Market Prices</h2>

            <div>
                <label htmlFor="crop">Crop: </label>
                <select id="crop" value={selectedCrop} onChange={handleCropChange}>
                    <option value="">Select Crop</option>
                    {availableCrops.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="location">Location: </label>
                <select id="location" value={selectedLocation} onChange={handleLocationChange}>
                    <option value="">Select Location</option>
                    {availableLocations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            {/* Only show loading/error/results if selections have been made */}
            {selectedCrop && selectedLocation && (
                 <>
                    {loading && <p>Loading market prices...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && !error && marketPrices.length > 0 && (
                        <div>
                            <h3>Current Prices for {selectedCrop} at {selectedLocation}:</h3>
                            <ul>
                                {marketPrices.map((item, index) => (
                                    <li key={index}>
                                        {/* Adjust these based on the actual structure of your API response */}
                                        Price: {item.price ?? 'N/A'} {item.currency ?? ''} per {item.unit ?? 'unit'}
                                        (Updated: {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!loading && !error && marketPrices.length === 0 && (
                        <p>No current market prices available for the selected crop and location.</p>
                    )}
                 </>
            )}
             {!selectedCrop || !selectedLocation && !loading && !error && (
                <p>Please select both a crop and a location to see prices.</p>
            )}
        </div>
    );
};

export default CurrentMarketPrices; // Single default export