const cityName = "Genova";
const latitude = 44.4056;
const longitude = 8.9463;

const weatherCodeMap = {
  0: { text: "Sereno", icon: "☀️" },
  1: { text: "Prevalentemente sereno", icon: "🌤️" },
  2: { text: "Parzialmente nuvoloso", icon: "⛅" },
  3: { text: "Coperto", icon: "☁️" },
  45: { text: "Nebbia", icon: "🌫️" },
  48: { text: "Brina con nebbia", icon: "🌫️" },
  51: { text: "Pioviggine debole", icon: "🌦️" },
  53: { text: "Pioviggine", icon: "🌦️" },
  55: { text: "Pioviggine intensa", icon: "🌧️" },
  61: { text: "Pioggia debole", icon: "🌦️" },
  63: { text: "Pioggia", icon: "🌧️" },
  65: { text: "Pioggia intensa", icon: "🌧️" },
  71: { text: "Neve debole", icon: "🌨️" },
  73: { text: "Neve", icon: "🌨️" },
  75: { text: "Neve intensa", icon: "❄️" },
  80: { text: "Rovesci deboli", icon: "🌦️" },
  81: { text: "Rovesci", icon: "🌧️" },
  82: { text: "Rovesci forti", icon: "⛈️" },
  95: { text: "Temporale", icon: "⛈️" },
  96: { text: "Temporale con grandine", icon: "⛈️" },
  99: { text: "Temporale forte", icon: "⛈️" }
};

function getWeatherInfo(code) {
  return weatherCodeMap[code] || { text: "Meteo variabile", icon: "🌤️" };
}

function getDayName(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("it-IT", { weekday: "long" }).format(date);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function loadWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=4`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const currentCode = data.current.weather_code;
    const currentInfo = getWeatherInfo(currentCode);

    document.getElementById("cityName").textContent = cityName;
    document.getElementById("currentIcon").textContent = currentInfo.icon;
    document.getElementById("currentCondition").textContent = currentInfo.text;
    document.getElementById("currentDetails").textContent =
      `Vento ${Math.round(data.current.wind_speed_10m)} km/h`;
    document.getElementById("currentTemp").textContent =
      Math.round(data.current.temperature_2m);

    const now = new Date();
    document.getElementById("updatedAt").textContent =
      "Aggiornato " +
      now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

    const grid = document.getElementById("forecastGrid");
    grid.innerHTML = "";

    data.daily.time.forEach((day, index) => {
      const info = getWeatherInfo(data.daily.weather_code[index]);

      const card = document.createElement("article");
      card.className = "day-card";

      card.innerHTML = `
        <div class="day-name">${capitalize(getDayName(day))}</div>
        <div class="day-icon">${info.icon}</div>
        <div class="day-desc">${info.text}</div>
        <div class="day-temps">
          <span class="max-temp">${Math.round(data.daily.temperature_2m_max[index])}°</span>
          <span class="min-temp">${Math.round(data.daily.temperature_2m_min[index])}°</span>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    document.getElementById("currentCondition").textContent = "Errore caricamento meteo";
    document.getElementById("currentDetails").textContent = "Controlla connessione o API";
    console.error(error);
  }
}

loadWeather();
setInterval(loadWeather, 30 * 60 * 1000);