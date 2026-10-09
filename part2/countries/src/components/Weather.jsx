import { useState, useEffect } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_SOME_KEY

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!apiKey) {
      return
    }
    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: { q: city, appid: apiKey, units: 'metric' },
      })
      .then((response) => setWeather(response.data))
      .catch(() => setWeather(null))
  }, [city])

  if (!weather) {
    return null
  }

  const icon = weather.weather[0].icon

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
