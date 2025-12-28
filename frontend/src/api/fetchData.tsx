import type { WorldData } from "../types/game"

// Example random options
const countries = ["Algeria", "France", "USA", "Germany", "Japan"]
const assets = ["btc", "eth", "ltc"]
const mapAirQuality = (air: any) => {
  if (!air) return { aqi: 50, level: "Unknown" }

  // Use pm10 to derive AQI level
  const aqi = air.pm10 ?? 50
  let level = "Unknown"

  if (aqi <= 50) level = "Good"
  else if (aqi <= 100) level = "Moderate"
  else if (aqi <= 150) level = "Unhealthy for sensitive groups"
  else if (aqi <= 200) level = "Unhealthy"
  else if (aqi <= 300) level = "Very Unhealthy"
  else level = "Hazardous"

  return { aqi, level }
}
export const fetchWorldData = async (): Promise<WorldData> => {
  try {
    // Pick random country and asset for this call
    const randomWeatherCountry = countries[Math.floor(Math.random() * countries.length)]
    const randomAirCountry = countries[Math.floor(Math.random() * countries.length)]
    const randomAsset = assets[Math.floor(Math.random() * assets.length)]

    const response = await fetch("http://72.146.216.162/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        economy: { asset: randomAsset },
        weather: { country: randomWeatherCountry },
        air: { country: randomAirCountry }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Backend response:", data)

    return {
      economyMultiplier: data.economy?.[randomAsset + "_usd"] ? data.economy[randomAsset + "_usd"] / 10000 : 1.0,
      weather: data.weather ?? { temperature: 20, wind_speed: 0, condition: "Unknown", humidity: 50},
      airQuality: mapAirQuality(data.air)
    }
  } catch (err) {
    console.error("Fetch error:", err)


    // Return safe defaults with random countries/assets
    return {
      economyMultiplier: 1.0,
      weather: { temperature: 20, wind_speed: 0, condition: "Unknown", humidity: 50},
      airQuality: { aqi: 50, level: "Good"}
    }
  }
}
