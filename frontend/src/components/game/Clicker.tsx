import { useState, useRef } from "react"
import { calculateClickSP } from "../../systems/EconomySystem"
import AnimatedCursors from "./AnimatedCursors"

type ClickerProps = {
  clickPower: number
  economyMultiplier: number
  onSPGenerated: (amount: number) => void
  disabled?: boolean
  cursorCount?: number
  clicksPerMinute?: number
}

export default function Clicker({
  clickPower,
  economyMultiplier,
  onSPGenerated,
  disabled = false,
  cursorCount = 0,
  clicksPerMinute = 10,
}: ClickerProps) {
  const [lastSPAmount, setLastSPAmount] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (disabled) return

    const spGained = calculateClickSP(clickPower, economyMultiplier)
    setLastSPAmount(spGained)
    onSPGenerated(spGained)

    setTimeout(() => setLastSPAmount(0), 1000)
  }

  const totalSPPerClick = calculateClickSP(clickPower, economyMultiplier)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <button
          ref={buttonRef}
          onClick={handleClick}
          disabled={disabled}
          className="w-24 h-24 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed border-4 border-black rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all transform active:scale-95 shadow-lg relative z-10"
        >
          CLICK
        </button>
        {lastSPAmount > 0 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce text-green-600 font-bold text-sm z-20">
            +{lastSPAmount.toFixed(1)} SP
          </div>
        )}
        {cursorCount > 0 && (
          <AnimatedCursors 
            cursorCount={cursorCount} 
            clicksPerMinute={clicksPerMinute}
            clickPower={clickPower}
            economyMultiplier={economyMultiplier}
            onSPGenerated={onSPGenerated}
          />
        )}
      </div>
      
      <div className="text-center space-y-0.5">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Power:</span> {clickPower.toFixed(1)}
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Per Click:</span> {totalSPPerClick.toFixed(1)} SP
        </div>
      </div>
    </div>
  )
}

