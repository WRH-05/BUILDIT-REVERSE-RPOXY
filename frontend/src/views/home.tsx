import { useState, useEffect, useRef } from "react"
import GameUI from "../components/game/Layout"
import Notifications from "../components/ui/Notifications"
import Instructions from "../components/ui/Instructions"
import { getPlaceholderWorldData } from "../data/gameState"
import { useGameLoop } from "../hooks/useGameLoop"
import { useCursorAutoClick } from "../hooks/useCursorAutoClick"
import { Shop } from "../game/Shop"
import { HealthSystem } from "../systems/HealthSystem"
import { EnergySystem } from "../systems/EnergySystem"
import { FIX_COST, RESTORE_AMOUNT, HEALTH_STABILIZER_DURATION, POWER_STABILIZER_DURATION, FACTORY_BONUS, HOSPITAL_BONUS, HOUSE_BONUS, MAX_MAP_CAPACITY, CURSOR_CLICKS_PER_MINUTE, CURSOR_CLICKS_INCREASE } from "../constants/game"
import type { WorldData } from "../types/game"
import { fetchWorldData } from "../api/fetchData"
export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [sp, setSP] = useState(0)
  const [health, setHealth] = useState(100)
  const [energy, setEnergy] = useState(100)
  const [clickPower, setClickPower] = useState(1)
  const [worldData, setWorldData] = useState<WorldData | null>(null)
  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  
  const [cursorCount, setCursorCount] = useState(0)
  const [cursorClicksPerMinute, setCursorClicksPerMinute] = useState(CURSOR_CLICKS_PER_MINUTE)
  
  const [factoryCount, setFactoryCount] = useState(0)
  const [hospitalCount, setHospitalCount] = useState(0)
  const [houseCount, setHouseCount] = useState(0)
  
  const [healthStabilizerActiveTime, setHealthStabilizerActiveTime] = useState(0)
  const [powerStabilizerActiveTime, setPowerStabilizerActiveTime] = useState(0)
  
  const cursorCostRef = useRef(Shop.getInitialCost('cursor'))
  const healthStabilizerCostRef = useRef(Shop.getInitialCost('healthStabilizer'))
  const powerStabilizerCostRef = useRef(Shop.getInitialCost('powerStabilizer'))
  const factoryCostRef = useRef(Shop.getInitialCost('factory'))
  const hospitalCostRef = useRef(Shop.getInitialCost('hospital'))
  const houseCostRef = useRef(Shop.getInitialCost('house'))
  const [nextDataFetchTime, setNextDataFetchTime] = useState<number>(0)
  const [displayTimer, setDisplayTimer] = useState("00:00")

  useEffect(() => {
  if (gameStarted && !worldData) {
    const data = getPlaceholderWorldData()
    setWorldData(data)

    const nextFetch = Date.now() + (30000 + Math.random() * 30000)
    setNextDataFetchTime(nextFetch)
  }
}, [gameStarted, worldData])
  useEffect(() => {
  if (!gameStarted || lost || !nextDataFetchTime) return

  const timerInterval = setInterval(() => {
    const remaining = Math.max(0, nextDataFetchTime - Date.now())

    const seconds = Math.floor(remaining / 1000)
    const minutes = Math.floor(seconds / 60)
    const displaySeconds = seconds % 60

    setDisplayTimer(
      `${String(minutes).padStart(2, "0")}:${String(displaySeconds).padStart(2, "0")}`
    )

    if (remaining === 0) {
       fetchAndUpdateWorldData()
    }
  }, 1000)

  return () => clearInterval(timerInterval)
}, [gameStarted, lost, nextDataFetchTime])
const fetchAndUpdateWorldData = async () => {
  try {
    const newData = await fetchWorldData()
    setWorldData(newData)

    const nextFetch = Date.now() + (30000 + Math.random() * 30000)
    setNextDataFetchTime(nextFetch)
  } catch (e) {
    console.error(e)
  }
}
// const handleWorldRefresh = async () => {
//   try {
//     const newData = await fetchWorldData()
//     setWorldData(newData)

//     const nextFetch = Date.now() + (30000 + Math.random() * 30000)
//     setNextDataFetchTime(nextFetch)
//   } catch (e) {
//     console.error("Failed to refresh world")
//   }
// }

  const handleSPGenerated = (amount: number) => {
    setSP(prev => prev + amount)
  }

  const handleCursorPurchase = () => {
    const cost = cursorCostRef.current
    const result = Shop.purchase(sp, cost)
    if (result.success) {
      setSP(result.newSP)
      setCursorCount(prev => prev + 1)
      setCursorClicksPerMinute(prev => prev + CURSOR_CLICKS_INCREASE)
      cursorCostRef.current = Shop.getNextCost(cost)
    }
  }

  const handleHealthStabilizerPurchase = () => {
    const cost = healthStabilizerCostRef.current
    if (sp >= cost && healthStabilizerActiveTime <= 0) {
      const result = Shop.purchase(sp, cost)
      if (result.success) {
        setSP(result.newSP)
        setHealthStabilizerActiveTime(HEALTH_STABILIZER_DURATION)
        healthStabilizerCostRef.current = Shop.getNextCost(cost)
      }
    }
  }

  const handlePowerStabilizerPurchase = () => {
    const cost = powerStabilizerCostRef.current
    if (sp >= cost && powerStabilizerActiveTime <= 0) {
      const result = Shop.purchase(sp, cost)
      if (result.success) {
        setSP(result.newSP)
        setPowerStabilizerActiveTime(POWER_STABILIZER_DURATION)
        powerStabilizerCostRef.current = Shop.getNextCost(cost)
      }
    }
  }

  const handleFactoryPurchase = () => {
    const cost = factoryCostRef.current
    const result = Shop.purchase(sp, cost)
    if (result.success) {
      setSP(result.newSP)
      setFactoryCount(prev => prev + 1)
      setEnergy(prev => Math.min(100, prev + FACTORY_BONUS))
      factoryCostRef.current = Shop.getNextCost(cost)
    }
  }

  const handleHospitalPurchase = () => {
    const cost = hospitalCostRef.current
    const result = Shop.purchase(sp, cost)
    if (result.success) {
      setSP(result.newSP)
      setHospitalCount(prev => prev + 1)
      setHealth(prev => Math.min(100, prev + HOSPITAL_BONUS))
      hospitalCostRef.current = Shop.getNextCost(cost)
    }
  }

  const handleHousePurchase = () => {
    const cost = houseCostRef.current
    const result = Shop.purchase(sp, cost)
    if (result.success) {
      setSP(result.newSP)
      setHouseCount(prev => prev + 1)
      setHealth(prev => Math.min(100, prev + HOUSE_BONUS))
      setEnergy(prev => Math.min(100, prev + HOUSE_BONUS))
      houseCostRef.current = Shop.getNextCost(cost)
    }
  }

  const handleFixHealth = () => {
    if (sp >= FIX_COST && health < 100) {
      setSP(prev => prev - FIX_COST)
      setHealth(prev => HealthSystem.restore(prev, RESTORE_AMOUNT))
    }
  }

  const handleFixEnergy = () => {
    if (sp >= FIX_COST && energy < 100) {
      setSP(prev => prev - FIX_COST)
      setEnergy(prev => EnergySystem.restore(prev, RESTORE_AMOUNT))
    }
  }

  useGameLoop({
    gameStarted,
    lost,
    worldData,
    healthStabilizerActiveTime,
    powerStabilizerActiveTime,
    onTick: (updates) => {
      setHealth(prev => HealthSystem.applyDamage(prev, updates.health))
      setEnergy(prev => EnergySystem.applyDamage(prev, updates.energy))
      setSP(prev => prev + updates.sp)
      setHealthStabilizerActiveTime(updates.healthStabilizerActiveTime)
      setPowerStabilizerActiveTime(updates.powerStabilizerActiveTime)
    },
  })

  useCursorAutoClick({
    gameStarted,
    lost,
    worldData,
    cursorCount,
    clicksPerMinute: cursorClicksPerMinute,
    clickPower,
    onSPGenerated: handleSPGenerated,
  })

  useEffect(() => {
    if (!gameStarted) return
    
    if (health <= 0 && energy <= 0) {
      setLost(true)
    }
  }, [health, energy, gameStarted])

  useEffect(() => {
    if (!gameStarted || lost || won) return
    
    const totalBuildings = factoryCount + hospitalCount + houseCount
    if (totalBuildings >= MAX_MAP_CAPACITY) {
      setWon(true)
    }
  }, [factoryCount, hospitalCount, houseCount, gameStarted, lost, won])

  const restart = () => {
    setSP(0)
    setHealth(100)
    setEnergy(100)
    setClickPower(1)
    setLost(false)
    setWon(false)
    setGameStarted(false)
    setWorldData(null)
    setCursorCount(0)
    setCursorClicksPerMinute(CURSOR_CLICKS_PER_MINUTE)
    setFactoryCount(0)
    setHospitalCount(0)
    setHouseCount(0)
    setHealthStabilizerActiveTime(0)
    setPowerStabilizerActiveTime(0)
    setNextDataFetchTime(0)
    setDisplayTimer("00:00")
    cursorCostRef.current = Shop.getInitialCost('cursor')
    healthStabilizerCostRef.current = Shop.getInitialCost('healthStabilizer')
    powerStabilizerCostRef.current = Shop.getInitialCost('powerStabilizer')
    factoryCostRef.current = Shop.getInitialCost('factory')
    hospitalCostRef.current = Shop.getInitialCost('hospital')
    houseCostRef.current = Shop.getInitialCost('house')
  }

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <button
          onClick={() => setGameStarted(true)}
          className="bg-black text-white text-2xl px-12 py-6 hover:bg-gray-800 font-bold"
        >
          START GAME
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden">
      <Instructions fixCost={FIX_COST} />
      
      {/* Timer Bar */}
      <div className="flex-shrink-0 bg-black text-white px-4 py-2 flex items-center justify-between border-b-4 border-black">
        <span className="font-bold text-sm">Next Data Fetch:</span>
        <span className="font-mono text-lg font-bold">{displayTimer}</span>
      </div>

      <div className="flex-1 flex gap-2 p-2 overflow-hidden min-h-0">
        {worldData && (
          <GameUI 
            levelIndex={0}
            sp={sp}
            health={health}
            energy={energy}
            clickPower={clickPower}
            onSPGenerated={handleSPGenerated}
            onFixHealth={handleFixHealth}
            onFixEnergy={handleFixEnergy}
            cursorCount={cursorCount}
            cursorClicksPerMinute={cursorClicksPerMinute}
            cursorCost={cursorCostRef.current}
            onCursorPurchase={handleCursorPurchase}
            healthStabilizerDuration={HEALTH_STABILIZER_DURATION}
            healthStabilizerCost={healthStabilizerCostRef.current}
            healthStabilizerActiveTime={healthStabilizerActiveTime}
            onHealthStabilizerPurchase={handleHealthStabilizerPurchase}
            powerStabilizerDuration={POWER_STABILIZER_DURATION}
            powerStabilizerCost={powerStabilizerCostRef.current}
            powerStabilizerActiveTime={powerStabilizerActiveTime}
            onPowerStabilizerPurchase={handlePowerStabilizerPurchase}
            factoryCost={factoryCostRef.current}
            onFactoryPurchase={handleFactoryPurchase}
            hospitalCost={hospitalCostRef.current}
            onHospitalPurchase={handleHospitalPurchase}
            houseCost={houseCostRef.current}
            onHousePurchase={handleHousePurchase}
            // onWorldRefresh={handleWorldRefresh}
            factoryCount={factoryCount}
            hospitalCount={hospitalCount}
            houseCount={houseCount}
            worldData={worldData}
            lost={lost}
          />
        )}
      </div>

      {(lost || won) && (
        <div className="h-32 flex-shrink-0 p-3 border-t-2 border-black bg-gray-50 overflow-hidden">
          <Notifications
            wonGame={won}
            lost={lost}
            levelIndex={0}
            onNextLevel={() => {}}
            onRestart={restart}
            wonLevel={false}
          />
        </div>
      )}
    </div>
  )
}