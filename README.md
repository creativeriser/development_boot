# Aero Weather UI 🌤️

A beautifully designed, premium weather dashboard built with HTML, CSS, and Vanilla JavaScript. It features a modern **Glassmorphism** aesthetic, dynamic background themes that adapt to the weather, and smooth micro-animations.

**Hosted Live on GitHub Pages!** *(Check your repository's settings for the live link)*

## ✨ Features

- **📍 Auto-Geolocation:** Automatically detects your current location on startup to provide localized weather immediately (falls back to New Delhi if disabled).
- **🎨 Dynamic Weather Themes:** The animated ambient mesh background smoothly changes colors based on the current temperature and weather conditions (e.g., cool blues for rain, bright orange for hot/clear days).
- **🌧️ Realistic Weather Effects:** When the weather is rainy or stormy, a realistic CSS/JS rain overlay falls across the screen.
- **🔍 Smart Autocomplete Search:** A sleek dropdown suggests cities as you type, pulling live geographical data.
- **✨ Premium Micro-Animations:** Features hovering glass cards, popping numbers, bouncing location pins, and a continuously floating main weather icon.
- **📱 Fully Responsive:** The dashboard layout gracefully adapts from desktop to mobile screens.

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Design Style:** Glassmorphism, CSS Custom Properties (Variables), Keyframe Animations
- **APIs:** 
  - [OpenWeatherMap Current Weather Data](https://openweathermap.org/current)
  - [OpenWeatherMap Geocoding API](https://openweathermap.org/api/geocoding-api)

## 🚀 Running Locally

Since this project uses pure HTML, CSS, and JS with no build steps or frameworks, running it locally is incredibly simple.

1. Clone this repository to your local machine.
2. Navigate to the `Weather-API` folder.
3. Open `index.html` directly in your web browser, OR use an extension like VS Code's **Live Server** for a better development experience.
4. *(Optional)* If you wish to use your own API key, replace the `apiKey` variable at the top of `script.js` with your OpenWeatherMap API key.

## 🌐 Deployment (GitHub Pages)

This project is perfectly suited for **GitHub Pages** since it only contains static assets.
1. Push your code to a GitHub repository.
2. Go to your repository **Settings** > **Pages**.
3. Under "Build and deployment", set the Source to **Deploy from a branch**.
4. Select your `main` or `master` branch and select the correct folder (e.g., `/root` or `/Weather-API` if isolated).
5. Save, and your site will be live within minutes!

---
*Developed as part of a Full Stack + AI Integration Bootcamp.*
