function createWeatherWidget(data) {
  const container = document.createElement("div");
  container.className = "weather-container";

  const shadow = container.attachShadow({ mode: "open" });

  const content = document.createElement("div");
  content.className = "weather-widget";

  content.innerHTML = `
      <style>
        :host {
          display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .weather-widget {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(to bottom right, #4B79A1, #283E51);
          color: white;
          border-radius: 10px;
          padding: 20px;
          width: 250px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);          
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .city {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .temperature {
          font-size: 36px;
          font-weight: 300;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }
        
        .weather-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .icon {
          animation: float 3s ease-in-out infinite;
        }
      </style>
      
      <div class="city">${data.city}</div>
      <div class="weather-info">
        <img class="icon" src="${data.icon}" alt="Météo">
        <div class="temperature">${data.temp}°C</div>
      </div>
      
      
    `;

  shadow.appendChild(content);

  return container;
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchRealWeather = async () => {
    try {
      const apiKey = "ab3e05fdf10742f991c95605251604";
      const city = "Lille";

      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      const realWeatherData = {
        city: data.location.name,
        temp: Math.round(data.current.temp_c),
        icon: `https://cdn-icons-png.flaticon.com/512/1779/1779940.png`,
      };

      const weatherWidget = createWeatherWidget(realWeatherData);
      document.body.appendChild(weatherWidget);
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error);

      const fallbackData = {
        city: "Paris",
        temp: 18,
        icon: "https://cdn-icons-png.flaticon.com/512/1779/1779940.png",
      };

      const weatherWidget = createWeatherWidget(fallbackData);
      document.body.appendChild(weatherWidget);
    }
  };

  fetchRealWeather();
//   const weatherData = {
//     city: 'Paris',
//     temp: 18,
//     icon: 'https://cdn-icons-png.flaticon.com/512/1779/1779940.png' // Icône de soleil par défaut
//   };
  
//   const weatherWidget = createWeatherWidget(weatherData);
//   document.body.appendChild(weatherWidget);
});
