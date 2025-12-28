import CityView from "../../components/game/CityView"
import Clicker from "../../components/game/Clicker"
import WorldData from "../../components/ui/WorldData"
import CursorCard from "../../components/ui/CursorCard"
import HealthStabilizerCard from "../../components/ui/HealthStabilizerCard"
import PowerStabilizerCard from "../../components/ui/PowerStabilizerCard"
import FactoryCard from "../../components/ui/FactoryCard"
import HospitalCard from "../../components/ui/HospitalCard"
import HouseCard from "../../components/ui/HouseCard"
import { calculateMultipliers } from "../../systems/EconomySystem"
import type { WorldData as WorldDataType } from "../../types/game"

type Props = {
  levelIndex: number
  sp: number
  health: number
  energy: number
  clickPower: number
  onSPGenerated: (amount: number) => void
  onFixHealth: () => void
  onFixEnergy: () => void
  cursorCount: number
  cursorClicksPerMinute: number
  cursorCost: number
  onCursorPurchase: () => void
  healthStabilizerDuration: number
  healthStabilizerCost: number
  healthStabilizerActiveTime?: number
  onHealthStabilizerPurchase: () => void
  powerStabilizerDuration: number
  powerStabilizerCost: number
  powerStabilizerActiveTime?: number
  onPowerStabilizerPurchase: () => void
  factoryCost: number
  onFactoryPurchase: () => void
  hospitalCost: number
  onHospitalPurchase: () => void
  houseCost: number
  onHousePurchase: () => void
  factoryCount: number
  hospitalCount: number
  houseCount: number
  worldData: WorldDataType
  lost?: boolean
}

export default function GameUI({
  levelIndex,
  sp,
  health,
  energy,
  clickPower,
  onSPGenerated,
  onFixHealth,
  onFixEnergy,
  cursorCount,
  cursorClicksPerMinute,
  cursorCost,
  onCursorPurchase,
  healthStabilizerDuration,
  healthStabilizerCost,
  healthStabilizerActiveTime = 0,
  onHealthStabilizerPurchase,
  powerStabilizerDuration,
  powerStabilizerCost,
  powerStabilizerActiveTime = 0,
  onPowerStabilizerPurchase,
  factoryCost,
  onFactoryPurchase,
  hospitalCost,
  onHospitalPurchase,
  houseCost,
  onHousePurchase,
  factoryCount,
  hospitalCount,
  houseCount,
  worldData,
  lost = false,
}: Props) {
  const multipliers = calculateMultipliers(worldData)
  const fixCost = 10 // Fixed cost for quick fixes (from constants)

  return (
    <div className="flex gap-2 w-full h-full">
      {/* Left Column: Click Button and World Data */}
      <div className="w-72 flex flex-col gap-2">
        {/* Main Clicker Button */}
        <div className="bg-white border-4 border-black rounded-lg p-3 flex items-center justify-center flex-shrink-0">
          <Clicker
            clickPower={clickPower}
            economyMultiplier={multipliers.economyMultiplier}
            onSPGenerated={onSPGenerated}
            disabled={lost}
            cursorCount={cursorCount}
            clicksPerMinute={cursorClicksPerMinute}
          />
        </div>

        {/* World Data Panel */}
        <WorldData
          health={health}
          energy={energy}
          weather={worldData.weather}
          economyMultiplier={multipliers.economyMultiplier}
          airQuality={worldData.airQuality}
          sp={sp}
          onFixHealth={onFixHealth}
          onFixEnergy={onFixEnergy}
          fixCost={fixCost}
          disabled={lost}
        />

        {/* SP Display */}
        <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-2 text-center flex-shrink-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">Stability Points</div>
          <div className="text-2xl font-bold text-black">{Math.floor(sp).toLocaleString()}</div>
        </div>
      </div>

      {/* Middle Column: City View */}
      <div className="flex-1 rounded-lg border-4 border-black overflow-hidden bg-gray-200 min-w-0">
        <CityView 
          levelIndex={levelIndex}
          maxedCount={Math.floor(sp / 100)}
          totalClickers={10}
          factoryCount={factoryCount}
          hospitalCount={hospitalCount}
          houseCount={houseCount}
        />
      </div>

      {/* Right Column: Upgrades */}
      <div className="w-72 flex flex-col gap-2 min-h-0">
        <div className="bg-white border-4 border-black rounded-lg p-2 flex flex-col h-full min-h-0">
          <h2 className="text-sm font-bold text-black text-center border-b-2 border-black pb-1 flex-shrink-0">
            Shop
          </h2>
          
          {/* Scrollable Shop Items */}
          <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
            {/* Cursor Card */}
            <CursorCard
              clicksPerMinute={cursorClicksPerMinute}
              clickPower={clickPower}
              economyMultiplier={multipliers.economyMultiplier}
              cost={cursorCost}
              sp={sp}
              onPurchase={onCursorPurchase}
              disabled={lost}
            />

            {/* Health Stabilizer Card */}
            <HealthStabilizerCard
              duration={healthStabilizerDuration}
              cost={healthStabilizerCost}
              sp={sp}
              activeTimeRemaining={healthStabilizerActiveTime}
              onPurchase={onHealthStabilizerPurchase}
              disabled={lost}
            />

            {/* Power Stabilizer Card */}
            <PowerStabilizerCard
              duration={powerStabilizerDuration}
              cost={powerStabilizerCost}
              sp={sp}
              activeTimeRemaining={powerStabilizerActiveTime}
              onPurchase={onPowerStabilizerPurchase}
              disabled={lost}
            />

            {/* Factory Card */}
            <FactoryCard
              cost={factoryCost}
              sp={sp}
              onPurchase={onFactoryPurchase}
              disabled={lost}
            />

            {/* Hospital Card */}
            <HospitalCard
              cost={hospitalCost}
              sp={sp}
              onPurchase={onHospitalPurchase}
              disabled={lost}
            />

            {/* House Card */}
            <HouseCard
              cost={houseCost}
              sp={sp}
              onPurchase={onHousePurchase}
              disabled={lost}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

