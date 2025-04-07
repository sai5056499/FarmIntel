import React, { useState, useEffect } from 'react';
import './WeatherReport.css'; // Import component-specific styles

// Optional: Define icons using React components if you prefer
// import { FaMapMarkerAlt, FaWind, FaTint, FaCloud } from 'react-icons/fa';

function WeatherReport() {
    // --- State Variables ---
    const [currentTab, setCurrentTab] = useState('user'); // 'user' or 'search'
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [grantAccessVisible, setGrantAccessVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userCoordinates, setUserCoordinates] = useState(null);

    const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; // Replace with your actual API key

    // --- Helper Functions ---

    // Function to show/hide elements based on state
    const showLoading = () => {
        setLoading(true);
        setWeatherData(null);
        setGrantAccessVisible(false);
        setError(null);
    };

    const showWeatherInfo = (data) => {
        setWeatherData(data);
        setLoading(false);
        setGrantAccessVisible(false);
        setError(null);
    };

    const showGrantAccess = () => {
        setGrantAccessVisible(true);
        setLoading(false);
        setWeatherData(null);
        setError(null);
    };

    const showError = (message = "An error occurred.") => {
        setError(message);
        setLoading(false);
        setWeatherData(null);
        setGrantAccessVisible(false);
    };


    // --- API Fetching Functions ---

    const fetchWeatherByCoords = async (lat, lon) => {
        showLoading();
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
             if (data.cod && data.cod !== 200) { // Check for OpenWeather specific error codes
                 throw new Error(data.message || 'City not found or API error.');
             }
            showWeatherInfo(data);
        } catch (err) {
            console.error("Error fetching weather by coords:", err);
            showError(`Could not fetch weather: ${err.message}`);
        }
    };

    const fetchWeatherByCity = async (city) => {
        showLoading();
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.cod && data.cod !== 200) { // Check for OpenWeather specific error codes
                 throw new Error(data.message || 'City not found or API error.');
             }
            showWeatherInfo(data);
        } catch (err) {
            console.error("Error fetching weather by city:", err);
            showError(`Could not fetch weather for ${city}: ${err.message}`);
        }
    };


    // --- Geolocation ---

    const handleGrantAccess = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => { // Success callback
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude // Corrected property name
                    };
                    sessionStorage.setItem('user-coordinates', JSON.stringify(coords));
                    setUserCoordinates(coords); // Update state
                    fetchWeatherByCoords(coords.lat, coords.lon);
                },
                (geoError) => { // Error callback
                     console.error("Geolocation error:", geoError);
                     let message = "Could not get location.";
                     if(geoError.code === 1) message = "Location permission denied.";
                     if(geoError.code === 2) message = "Location position unavailable.";
                     if(geoError.code === 3) message = "Location request timed out.";
                     showError(message);
                     // Show grant access again maybe, or keep error shown
                     // setGrantAccessVisible(true); // Option: show grant again
                }
            );
        } else {
            showError("Geolocation is not supported by this browser.");
        }
    };


    // --- Event Handlers ---

    const handleTabSwitch = (tabName) => {
        if (tabName !== currentTab) {
            setCurrentTab(tabName);
            setError(null); // Clear error on tab switch
            setWeatherData(null); // Clear weather data
            setSearchQuery(''); // Clear search input

            if (tabName === 'user') {
                // Try to get location from session storage or state
                checkSessionStorage();
            } else {
                // 'search' tab: just clear grant access and weather info
                setGrantAccessVisible(false);
            }
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() === "") return;
        fetchWeatherByCity(searchQuery.trim());
    };


    // --- useEffect for Initial Load ---
    const checkSessionStorage = () => {
        const localCoordsString = sessionStorage.getItem('user-coordinates');
        if (localCoordsString) {
            try {
                const coords = JSON.parse(localCoordsString);
                setUserCoordinates(coords);
                fetchWeatherByCoords(coords.lat, coords.lon); // Fetch weather if coords found
            } catch (e) {
                 console.error("Error parsing coordinates from session storage", e);
                 sessionStorage.removeItem('user-coordinates'); // Clear invalid data
                 showGrantAccess(); // Ask for permission again
            }
        } else {
            showGrantAccess(); // Show grant access prompt if no coords
        }
    };

    useEffect(() => {
        // Runs once on component mount
        checkSessionStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means run only once


    // --- Render Weather Info Sub-Component (Optional but good practice) ---
    const WeatherDisplay = ({ data }) => {
        if (!data || !data.name) return null; // Handle case where data might be incomplete initially

        const countryCode = data.sys?.country?.toLowerCase();
        const weatherIconCode = data.weather?.[0]?.icon;

        return (
             <div className="user-info-container active"> {/* Always add active when rendering */}
                <div className="name">
                    <p data-cityName>{data.name}</p>
                    {countryCode && (
                        <img data-countryIcon src={`https://flagcdn.com/144x108/${countryCode}.png`} alt={`${data.sys.country} Flag`} />
                    )}
                </div>
                <p data-weatherDesc>{data.weather?.[0]?.description}</p>
                {weatherIconCode && (
                   <img data-weatherIcon src={`https://openweathermap.org/img/w/${weatherIconCode}.png`} alt="Weather Icon"/>
                )}
                <p data-temp>{data.main?.temp?.toFixed(1)} °C</p> {/* Added toFixed for formatting */}

                <div className="parameter-container">
                    <div className="parameter">
                        {/* <FaWind /> Use icons if installed */}
                        <img src="./assets/images/wind.png" alt="Wind Icon"/>
                        <p>Windspeed</p>
                        <p data-windspeed>{data.wind?.speed} m/s</p>
                    </div>
                    <div className="parameter">
                         {/* <FaTint /> */}
                         <img src="./assets/images/humidity.png" alt="Humidity Icon" />
                        <p>Humidity</p>
                        <p data-humidity>{data.main?.humidity}%</p>
                    </div>
                    <div className="parameter">
                         {/* <FaCloud /> */}
                         <img src="./assets/images/cloud.png" alt="Cloud Icon" />
                        <p>Clouds</p>
                        <p data-cloudiness>{data.clouds?.all}%</p>
                    </div>
                </div>
            </div>
        );
    };


    // --- Main Component Return ---
    return (
        <div className="weather-container">
            <h1>Weather App</h1>

            <div className="tab-container">
                <p className={`tab ${currentTab === 'user' ? 'current-tab' : ''}`}
                   onClick={() => handleTabSwitch('user')}
                   data-userWeather>
                    Your Weather
                </p>
                <p className={`tab ${currentTab === 'search' ? 'current-tab' : ''}`}
                   onClick={() => handleTabSwitch('search')}
                   data-searchWeather>
                    Search Weather
                </p>
            </div>

            <div className="weather-content">

                {/* Grant Location Access Screen */}
                <div className={`sub-container grant-location-container ${grantAccessVisible ? 'active' : ''}`}>
                    <img src="./assets/images/location.png" width="80" height="80" loading="lazy" alt="Location Icon"/>
                    <p>Grant Location Access</p>
                    <p>Allow Access to get weather Information</p>
                    <button className="btn" data-grantAccess onClick={handleGrantAccess}>
                        Grant Access
                    </button>
                </div>

                {/* Search Form */}
                <form className={`form-container ${currentTab === 'search' ? 'active' : ''}`}
                      onSubmit={handleSearchSubmit}
                      data-searchForm>
                    <input
                        placeholder="Search for City..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        data-searchInput
                    />
                    <button type="submit" className="btn">
                        Search
                    </button>
                </form>

                {/* Loading Screen */}
                 <div className={`sub-container loading-container ${loading ? 'active' : ''}`}>
                    <img src="./assets/images/loading.gif" width="150" height="150" alt="Loading GIF"/>
                    <p>Loading</p>
                </div>

                 {/* Error Screen */}
                 <div className={`sub-container err ${error ? 'active' : ''}`}>
                    <img src="./assets/images/not-found.png" width="150" height="150" alt="Error - Not Found"/>
                    <p>{error || "Something went wrong."}</p> {/* Display error message */}
                 </div>

                {/* Display Weather Info */}
                {/* Conditionally render WeatherDisplay only when data is available and no error/loading */}
                {!loading && !error && !grantAccessVisible && weatherData && (
                    <WeatherDisplay data={weatherData} />
                )}

            </div>
        </div>
    );
}

export default WeatherReport;