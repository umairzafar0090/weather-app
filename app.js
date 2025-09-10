const API_KEY = "a96d0dd53828dfb35763792d6bc91500"; 

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const statusDiv = document.getElementById("status");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const localTime = document.getElementById("localTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

async function fetchWeatherByCity(city) {
  if (!city) return;
  statusDiv.textContent = "Loading...";
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      statusDiv.textContent = `Weather loaded for ${city}`;
    } else {
      statusDiv.textContent = `Error: ${data.message}`;
      weatherCard.style.display = "none";
    }
  } catch (error) {
    statusDiv.textContent = "Failed to fetch weather!";
  }
}

async function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    statusDiv.textContent = "Geolocation not supported!";
    return;
  }
  statusDiv.textContent = "Getting your location...";
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      statusDiv.textContent = `Weather loaded for your location`;
    } else {
      statusDiv.textContent = `Error: ${data.message}`;
      weatherCard.style.display = "none";
    }
  });
}

function displayWeather(data) {
  weatherCard.style.display = "block";

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  localTime.textContent = new Date().toLocaleString();
  temperature.textContent = `${Math.round(data.main.temp)} °C`;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  feelsLike.textContent = `${Math.round(data.main.feels_like)} °C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
}


searchBtn.addEventListener("click", () => fetchWeatherByCity(cityInput.value));
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchWeatherByCity(cityInput.value);
});
geoBtn.addEventListener("click", fetchWeatherByLocation);
