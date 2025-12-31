const body = document.getElementById('body');
const cityInput = document.getElementById('city-input');
const searchForm = document.getElementById('search-form');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const windEl = document.getElementById('wind-speed');
const weatherInfo = document.getElementById('weather-info');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');

function getWeatherCondition(code) {
    if (code === 0) return { label: 'Clear sky', class: 'clear' };
    if ([1, 2, 3].includes(code)) return { label: 'Partly cloudy', class: 'cloudy' };
    if ([45, 48].includes(code)) return { label: 'Fog', class: 'cloudy' };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', class: 'rainy' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', class: 'rainy' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', class: 'snow' };
    if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', class: 'thunder' };
    return { label: 'Unknown', class: 'clear' };
}

async function fetchValues(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return response.json();
}

async function fetchCityCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const data = await fetchValues(url);
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found');
    }
    return data.results[0];
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const data = await fetchValues(url);
    return data.current_weather;
}

function getFlagEmoji(countryCode) {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function updateUI(city, weather, countryCode) {
    const { temperature, windspeed, weathercode } = weather;
    const condition = getWeatherCondition(weathercode);
    const flag = countryCode ? ` ${getFlagEmoji(countryCode)}` : '';

    cityNameEl.textContent = `${city}${flag}`;
    tempEl.textContent = `${Math.round(temperature)}°`;
    conditionEl.textContent = condition.label;
    windEl.textContent = `${windspeed} km/h`;

    body.className = '';
    body.classList.add(condition.class);

    weatherInfo.classList.remove('hidden');

    cityNameEl.classList.remove('animate-in');
    void cityNameEl.offsetWidth;

    const weatherMain = weatherInfo.querySelector('.weather-main');
    const weatherDetails = weatherInfo.querySelector('.weather-details');

    weatherMain?.classList.remove('animate-in');
    weatherDetails?.classList.remove('animate-in');

    void weatherMain?.offsetWidth;
    void weatherDetails?.offsetWidth;

    cityNameEl.classList.add('animate-in');
    weatherMain?.classList.add('animate-in');
    weatherDetails?.classList.add('animate-in');

    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');
}

async function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    loadingEl.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    errorEl.classList.add('hidden');

    try {
        const cityData = await fetchCityCoordinates(city);
        const weatherData = await fetchWeather(cityData.latitude, cityData.longitude);
        updateUI(cityData.name, weatherData, cityData.country_code);
    } catch (err) {
        loadingEl.classList.add('hidden');
        errorEl.textContent = err.message || 'An error occurred';
        errorEl.classList.remove('hidden');
    }
}

async function init() {
    searchForm.addEventListener('submit', handleSearch);

    if (navigator.geolocation) {
        loadingEl.classList.remove('hidden');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                    const geoData = await fetchValues(geoUrl);

                    const weatherData = await fetchWeather(latitude, longitude);
                    updateUI(geoData.city || "Current Location", weatherData, geoData.countryCode);
                } catch (err) {
                    loadingEl.classList.add('hidden');
                    errorEl.textContent = "Unable to get location.";
                    errorEl.classList.remove('hidden');
                }
            },
            () => {
                loadingEl.classList.add('hidden');
                errorEl.textContent = "Location access denied. Please search for a city.";
                errorEl.classList.remove('hidden');
            }
        );
    }
}

init();
