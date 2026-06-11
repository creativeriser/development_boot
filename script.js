const apiKey = 'ca331037f5cf854e6a8d07568d881ef4';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey + '&q=';
const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=' + apiKey + '&q=';

// DOM Elements
const searchInput = document.getElementById('city-input');
const suggestionsDropdown = document.getElementById('suggestions-dropdown');
const searchLoader = document.getElementById('search-loader');
const statusMessage = document.getElementById('status-message');
const appBody = document.getElementById('app-body');
const staggerItems = document.querySelectorAll('.stagger-item, .weather-details');

// UI Data Elements
const cityNameEl = document.getElementById('city-name');
const mainIconEl = document.getElementById('main-icon');
const weatherDescEl = document.getElementById('weather-desc');
const dateTimeEl = document.getElementById('date-time');
const humidityBar = document.getElementById('humidity-bar');
const windDirectionEl = document.getElementById('wind-direction');
const visibilityStatusEl = document.getElementById('visibility-status');

// Icons Mapping
const weatherIcons = {
    '01d': `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    '01n': `<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    '02d': `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    '02n': `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    '03d': `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    '04d': `<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    '09d': `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
    '10d': `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
    '11d': `<svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`,
    '13d': `<svg viewBox="0 0 24 24" fill="none" stroke="#e0f2fe" stroke-width="2"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25M8 15l2 2-2 2M16 15l-2 2 2 2M12 18v4M12 18l-2 2M12 18l2 2"/></svg>`,
    '50d': `<svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
};

// Helpers
function getIcon(code) { return weatherIcons[code] || weatherIcons[code.replace('n', 'd')] || weatherIcons['03d']; }
function getWindDir(d) { return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(d/22.5)%16]; }
function getVisStatus(v) { return v > 10 ? "Excellent" : v > 5 ? "Good" : v > 2 ? "Moderate" : "Poor"; }

function formatDateTime() {
    return new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Animation: Number Counter
function animateCounter(elementId, targetValue, duration = 1000) {
    const el = document.getElementById(elementId);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = (targetValue * easeOut).toFixed(elementId === 'wind-speed' || elementId === 'visibility' ? 1 : 0);
        el.textContent = currentVal;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// Debounce for live search
let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Fetch Suggestions (Autocomplete)
async function fetchSuggestions(query) {
    if (!query) {
        suggestionsDropdown.classList.add('hidden');
        return;
    }
    
    searchLoader.classList.remove('hidden');
    try {
        const response = await fetch(geoUrl + encodeURIComponent(query));
        const data = await response.json();
        renderSuggestions(data);
    } catch (error) {
        console.error('Geocoding error:', error);
    } finally {
        searchLoader.classList.add('hidden');
    }
}

function renderSuggestions(cities) {
    suggestionsDropdown.innerHTML = '';
    if (cities.length === 0) {
        suggestionsDropdown.classList.add('hidden');
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        const state = city.state ? `, ${city.state}` : '';
        li.innerHTML = `
            <svg class="suggestion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="suggestion-city">${city.name}</span>
            <span class="suggestion-country">${state}, ${city.country}</span>
        `;
        li.addEventListener('click', () => {
            searchInput.value = city.name;
            suggestionsDropdown.classList.add('hidden');
            fetchWeather(city.name);
        });
        suggestionsDropdown.appendChild(li);
    });
    suggestionsDropdown.classList.remove('hidden');
}

// Fetch Full Weather
async function fetchWeather(city) {
    if (!city) return;
    
    appBody.classList.add('hidden');
    statusMessage.classList.remove('hidden');
    statusMessage.innerHTML = `<div class="search-loader" style="position:relative; transform:none; left:0; width:30px; height:30px;"></div>`;
    
    // Reset animations
    staggerItems.forEach(el => el.classList.remove('animate'));
    humidityBar.style.width = '0%';

    try {
        const response = await fetch(weatherUrl + encodeURIComponent(city));
        if (response.status === 404) throw new Error('City not found');
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        statusMessage.innerHTML = `<span class="error-text"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${error.message}</span>`;
    }
}

async function fetchWeatherByCoords(lat, lon) {
    appBody.classList.add('hidden');
    statusMessage.classList.remove('hidden');
    statusMessage.innerHTML = `<div class="search-loader" style="position:relative; transform:none; left:0; width:30px; height:30px;"></div>`;
    
    staggerItems.forEach(el => el.classList.remove('animate'));
    humidityBar.style.width = '0%';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response.ok) throw new Error('Location not found');
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        statusMessage.innerHTML = `<span class="error-text">Location weather failed. Defaulting to New Delhi...</span>`;
        setTimeout(() => fetchWeather('New Delhi'), 1500);
    }
}

function updateTheme(weatherMain, temp) {
    document.body.className = ''; // reset classes
    
    let themeClass = 'weather-default';
    const mainLower = weatherMain.toLowerCase();
    
    if (temp >= 35) {
        themeClass = 'weather-hot';
    } else if (temp <= 0) {
        themeClass = 'weather-snow';
    } else if (mainLower.includes('clear')) {
        themeClass = 'weather-clear';
    } else if (mainLower.includes('cloud')) {
        themeClass = 'weather-clouds';
    } else if (mainLower.includes('rain') || mainLower.includes('drizzle')) {
        themeClass = 'weather-rain';
    } else if (mainLower.includes('snow')) {
        themeClass = 'weather-snow';
    } else if (mainLower.includes('thunderstorm')) {
        themeClass = 'weather-thunderstorm';
    } else if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado'].includes(mainLower)) {
        themeClass = 'weather-atmosphere';
    }
    
    document.body.classList.add(themeClass);
}

function updateUI(data) {
    // Populate Data
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    mainIconEl.innerHTML = getIcon(data.weather[0].icon);
    weatherDescEl.textContent = data.weather[0].description;
    dateTimeEl.textContent = formatDateTime();
    
    windDirectionEl.textContent = getWindDir(data.wind.deg);
    const visKm = data.visibility / 1000;
    visibilityStatusEl.textContent = getVisStatus(visKm);

    updateTheme(data.weather[0].main, data.main.temp);

    statusMessage.classList.add('hidden');
    appBody.classList.remove('hidden');

    // Trigger Animations
    setTimeout(() => {
        staggerItems.forEach(el => el.classList.add('animate'));
        humidityBar.style.width = `${data.main.humidity}%`;
        
        // Counter animations
        animateCounter('current-temp', data.main.temp, 1200);
        animateCounter('humidity', data.main.humidity, 1200);
        animateCounter('wind-speed', data.wind.speed, 1200);
        animateCounter('feels-like', data.main.feels_like, 1200);
        animateCounter('visibility', visKm, 1200);
    }, 50);
}

// Event Listeners
searchInput.addEventListener('input', debounce((e) => {
    fetchSuggestions(e.target.value.trim());
}, 400));

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
        suggestionsDropdown.classList.add('hidden');
    }
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        suggestionsDropdown.classList.add('hidden');
        fetchWeather(searchInput.value.trim());
    }
});

// Init
function initWeather() {
    fetchWeather('New Delhi');
}

// Rain Effect Generation
function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    
    // Create 100 raindrops
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        
        // Random properties for realistic rain
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDuration = `${0.4 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.opacity = `${0.3 + Math.random() * 0.5}`;
        
        rainContainer.appendChild(drop);
    }
    
    document.body.appendChild(rainContainer);
}

createRain();
initWeather();
