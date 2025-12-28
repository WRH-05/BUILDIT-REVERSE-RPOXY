import HealthBar from "../game/HealthBar"
import WorldInfoCard from "../game/WorldInfoCard"

type WorldDataProps = {
  health: number // 0-100
  energy: number // 0-100
  weather: {
    temperature: number
    wind_speed: number
    condition: string
    humidity: number
  }
  economyMultiplier: number
  airQuality?: {
    aqi: number
    level: string
  }
  sp: number
  onFixHealth: () => void
  onFixEnergy: () => void
  fixCost: number
  restoreAmount?: number // Amount to restore per fix (default: 5)
  disabled?: boolean
}

export default function WorldData({
  health,
  energy,
  weather,
  economyMultiplier,
  airQuality,
  sp,
  onFixHealth,
  onFixEnergy,
  fixCost,
  restoreAmount = 5,
  disabled = false,
}: WorldDataProps) {
  return (
    <div className="bg-gray-50 border-2 border-black rounded-lg p-3 space-y-3">
      <h2 className="text-base font-bold text-black text-center border-b-2 border-black pb-1">
        World Status
      </h2>

      {/* Health Bar */}
      <HealthBar
        label="Health"
        value={health}
        color="red"
        sp={sp}
        fixCost={fixCost}
        restoreAmount={restoreAmount}
        onFix={onFixHealth}
        disabled={disabled}
      />

      {/* Energy Bar */}
      <HealthBar
        label="Energy"
        value={energy}
        color="yellow"
        sp={sp}
        fixCost={fixCost}
        restoreAmount={restoreAmount}
        onFix={onFixEnergy}
        disabled={disabled}
      />

      {/* World Info Card */}
      <WorldInfoCard
        weather={weather}
        economyMultiplier={economyMultiplier}
        airQuality={airQuality}
      />
    </div>
  )
}
