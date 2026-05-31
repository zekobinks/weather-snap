# Weather Snap

A small weather page that runs in the browser. It shows current conditions for your location or for a city you search for. No build step or backend.

## Description

On load, the app asks for geolocation when the browser supports it, resolves your city with reverse geocoding, then fetches forecast data. You can also search by city name. The page shows the city, temperature, a short condition label, and wind speed. The background theme switches with the weather (clear, cloudy, rain, snow, thunder).

### Key Features

*   **Client-side only:** Open `index.html` in a browser; nothing to install or compile.
*   **Location on start:** Uses `navigator.geolocation` when available; falls back to manual search if permission is denied.
*   **City search:** Look up any place via the Open-Meteo geocoding API.
*   **Condition-based UI:** Maps WMO weather codes to labels and CSS theme classes on the page body.
*   **Glass-style layout:** Translucent card, Satoshi font, light entrance animations on updates.

## Getting Started

### Run locally

1.  Open the project folder.
2.  Open `index.html` in your web browser.

No Node.js or package manager is required. You need an internet connection: weather and geocoding data come from public APIs.

Allow location access if you want local weather on first load; otherwise use the search field.

## Technical Stack

*   **HTML5** - Search form, weather panel, loading and error states.
*   **CSS3** - Glassmorphism (backdrop blur), CSS variables, theme classes per condition, keyframe animations.
*   **JavaScript (ES6+)** - `fetch` for APIs, geolocation, DOM updates.

### External APIs

*   [Open-Meteo](https://open-meteo.com/) - Geocoding search and current weather forecast.
*   [BigDataCloud](https://www.bigdatacloud.com/) - Reverse geocoding from latitude/longitude (client-side endpoint, no API key in this project).
