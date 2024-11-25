import { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [weather, setWeather] = useState(null); // To store weather data
  const [loading, setLoading] = useState(true); // Loading state
  const [emoji, setEmoji] = useState('☀️'); // Default emoji
  const location = 'Lugano'; // Example location
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;



  // Function to map weather conditions to emojis
  const getWeatherEmoji = (condition) => {
    if (!condition) return '🌍'; // Default if condition is undefined
  
    const lowerCondition = condition.toLowerCase();
  
    // Match common weather conditions
    if (lowerCondition.includes('sunny')) return '☀️'; // Sunny weather
    if (lowerCondition.includes('clear')) return '🌙'; // Clear skies (Night emoji)
    if (lowerCondition.includes('cloud')) return '☁️'; // Cloudy weather
    if (lowerCondition.includes('partly sunny')) return '⛅'; // Partly sunny
    if (lowerCondition.includes('rain')) return '🌧️'; // Rainy weather
    if (lowerCondition.includes('drizzle')) return '🌦️'; // Light rain/drizzle
    if (lowerCondition.includes('snow')) return '❄️'; // Snowy weather
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return '⛈️'; // Stormy weather
    if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return '🌫️'; // Foggy or misty weather
    if (lowerCondition.includes('wind') || lowerCondition.includes('breeze')) return '🌬️'; // Windy weather
    if (lowerCondition.includes('hail')) return '🌨️'; // Hail

    return '🌍'; // Default if no match
  };

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
        );
        console.log('Weather data:', response.data);
        const weatherData = response.data;
        setWeather(weatherData);
        setEmoji(getWeatherEmoji(weatherData.current.condition.text));
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return (
    <header className="header">
      <div className="header-left">
        <div className="location">
          <span className="sun-icon">
            {loading ? '⌛' : emoji} {/* Show loading indicator or emoji */}
          </span>
          <div className="location-text">
            <div className="city">{location}</div>
            <div className="temperature">
              {loading
                ? 'Loading...'
                : weather
                ? `${parseInt(weather.current.temp_c, 10)}°C`
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
