type WeatherData = {
  temperature: number
  wind_speed: number
  condition: string
  humidity: number
}

type AirQualityData = {
  aqi: number
  level: string
}

type WorldInfoCardProps = {
  weather: WeatherData
  economyMultiplier: number
  airQuality?: AirQualityData
}

export default function WorldInfoCard({
  weather,
  economyMultiplier,
  airQuality,
}: WorldInfoCardProps) {
  return (
    <div className="flex gap-2">
      {/* Weather - Small Square */}
      <div className="bg-blue-50 border-2 border-blue-400 rounded p-2 flex flex-col items-center justify-center min-w-[80px] aspect-square">
        <span className="text-xs font-bold text-black mb-1">🌤️ Weather</span>
        <span className="text-xs text-gray-700">{weather.condition}</span>
        <span className="text-sm font-bold text-blue-700">{weather.temperature.toFixed(1)}°C</span>
         {weather.wind_speed !== undefined && (
           <span className="text-xs text-blue-600">{weather.wind_speed.toFixed(1)} m/s</span>
         )}
      </div>

      {/* Economy Multiplier - Small Square */}
      <div className="bg-green-50 border-2 border-green-400 rounded p-2 flex flex-col items-center justify-center min-w-[80px] aspect-square">
        <span className="text-xs font-bold text-black mb-1">₿ Economy</span>
        <span className="text-sm font-bold text-green-700">{economyMultiplier.toFixed(2)}x</span>
      </div>

      {/* Air Quality (optional) - Small Square */}
      {airQuality && (
        <div className="bg-purple-50 border-2 border-purple-400 rounded p-2 flex flex-col items-center justify-center min-w-[80px] aspect-square">
          <span className="text-xs font-bold text-black mb-1">🌬️ Air</span>
          <span className="text-xs font-semibold text-purple-700">{airQuality.level}</span>
          <span className="text-xs text-gray-500">AQI: {airQuality.aqi}</span>
        </div>
      )}
    </div>
  )

}

