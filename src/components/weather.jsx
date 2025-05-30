import React from "react";
import axios from "axios";
import cloudy from "../assets/cloudy.png";
import rainy from "../assets/rainy.png";
import sunny from "../assets/sunny.png";
import snowy from "../assets/snowy.png";
import gfg1 from "../assets/gfg1.gif";
import "./weather.css";
import { useState, useEffect } from "react";
import { use } from "react";
import {IconMapPinFilled, IconSearch} from "@tabler/icons-react";



// {
//     "latitude": 28.625,
//     "longitude": 77.25,
//     "generationtime_ms": 0.031828880310058594,
//     "utc_offset_seconds": 0,
//     "timezone": "GMT",
//     "timezone_abbreviation": "GMT",
//     "elevation": 214,
//     "current_weather_units": {
//         "time": "iso8601",
//         "interval": "seconds",
//         "temperature": "°C",
//         "windspeed": "km/h",
//         "winddirection": "°",
//         "is_day": "",
//         "weathercode": "wmo code"
//     },
//     "current_weather": {
//         "time": "2025-05-26T18:30",
//         "interval": 900,
//         "temperature": 28.9,
//         "windspeed": 4.3,
//         "winddirection": 114,
//         "is_day": 0,
//         "weathercode": 0
//     }
// }

const weatherImages = {
  Clear: sunny,
  Clouds: cloudy,
  Rain: rainy,
  Snow: snowy,
  Mist: cloudy,
  Haze: cloudy,
};

const backgroundColors = {
  Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
  Clouds: "linear-gradient(to right, #57d6d4, #f71eec)",
  Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
  Snow: "linear-gradient(to right, #aff2ff, #fff)",
  Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
  Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
}

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true`;

const WeatherApp = () => {
    const [city, setCity] = useState("New Delhi");
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);



const fetchResults = async () => {
  setLoading(true);
  try {
    // 1. Fetch coordinates from city name
    const geoRes = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: { name: city, count: 1 },
    });

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      alert("City not found.");
      setLoading(false);
      return;
    }

    const { latitude, longitude } = geoRes.data.results[0];

    // 2. Fetch weather data using coordinates
    const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current_weather: true,
      },
    });

    setData(weatherRes.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch weather.");
  }
  setLoading(false);
};


  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    fetchResults();
  }
};

  const WeatherCode = (code) => {
    if (code === 0) return "Clear";
    if ([1, 2, 3].includes(code)) return "Clouds";
    if ([45, 48].includes(code)) return "Mist";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return "Rain";
    if ([66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    return "Clear";
  };

  const weatherName = WeatherCode(data.current_weather?.weathercode);
  const backgroundImage = data.current_weather? backgroundColors[weatherName] : backgroundColors["Clear"];
  const temperature = data.current_weather?.temperature;
  const windSpeed = data.current_weather?.windspeed;
  const windDirection = data.current_weather?.winddirection;
  const isDay = data.current_weather?.is_day;

  
  
  return (
    <div className="container" style={{ background: backgroundColors[WeatherCode(data.current_weather?.weathercode)] || "linear-gradient(to right, #f3b07c, #fcd283)" }}>
      <div className="weatherApp-area" style={{backgroundImage: backgroundImage.replace("to right", "to top") }}>
          <div className="search">
            <div className="search-bar">
              <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter city"
              />
              <IconSearch className="search-icon"/>
            </div>
            <br/>
            <div className="search-top">
              <IconMapPinFilled size={20} /> {city}<br/>
              <p className="title">Weather : </p>  {WeatherCode(data.current_weather?.weathercode)}<br/>
              <p className="title">Temperature : </p> {temperature}°C
              <br/>
              <p className="title">Wind :</p> {windSpeed} km/h, {windDirection}°
              <br/> 
              {isDay ? "Day" : "Night"}
              
            </div>
          </div>

      {loading ? ( <img src={gfg1} alt="loading" className="loading" /> ) : data.notFound ? (<p>Not Found</p>) :(
        <img src={weatherImages[weatherName ?? "Clear"]} className="img"/>
      )}
          
           
      </div>
    </div>
  );
}


export default WeatherApp;