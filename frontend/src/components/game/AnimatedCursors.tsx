import { useEffect, useState, useRef } from "react"
import { calculateClickSP } from "../../systems/EconomySystem"

type AnimatedCursorsProps = {
  cursorCount: number
  clicksPerMinute: number
  clickPower: number
  economyMultiplier: number
  onSPGenerated: (amount: number) => void
}

export default function AnimatedCursors({ 
  cursorCount, 
  clicksPerMinute, 
  clickPower, 
  economyMultiplier, 
  onSPGenerated 
}: AnimatedCursorsProps) {
  const [clickingStates, setClickingStates] = useState<boolean[]>([])
  const onSPGeneratedRef = useRef(onSPGenerated)

  useEffect(() => {
    onSPGeneratedRef.current = onSPGenerated
  }, [onSPGenerated])

  useEffect(() => {
    if (cursorCount === 0) return

    setClickingStates(Array(cursorCount).fill(false))

    const CLICK_INTERVAL = 60000 / clicksPerMinute
    const intervals: ReturnType<typeof setInterval>[] = []
    const timeouts: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < cursorCount; i++) {
      const startDelay = (CLICK_INTERVAL / cursorCount) * i

      const timeout = setTimeout(() => {
        const spGained = calculateClickSP(clickPower, economyMultiplier)
        onSPGeneratedRef.current(spGained)

        setClickingStates(prev => {
          const newStates = [...prev]
          newStates[i] = true
          return newStates
        })

        setTimeout(() => {
          setClickingStates(prev => {
            const newStates = [...prev]
            newStates[i] = false
            return newStates
          })
        }, 200)

        // Then set up interval for subsequent clicks
        const interval = setInterval(() => {
          const spGained = calculateClickSP(clickPower, economyMultiplier)
          onSPGeneratedRef.current(spGained)

          setClickingStates(prev => {
            const newStates = [...prev]
            newStates[i] = true
            return newStates
          })

          setTimeout(() => {
            setClickingStates(prev => {
              const newStates = [...prev]
              newStates[i] = false
              return newStates
            })
          }, 200)
        }, CLICK_INTERVAL)

        intervals.push(interval)
      }, startDelay)

      timeouts.push(timeout)
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [cursorCount, clicksPerMinute, clickPower, economyMultiplier])

  if (cursorCount === 0) return null

  const getCursorPosition = (index: number) => {
    const offsetX = (index % 3) * 8 - 8
    const offsetY = Math.floor(index / 3) * 8 - 8
    return { x: offsetX, y: offsetY }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {Array.from({ length: cursorCount }).map((_, index) => {
        const position = getCursorPosition(index)
        const isClicking = clickingStates[index] || false

        return (
          <div
            key={index}
            className="absolute transition-transform duration-200 ease-out"
            style={{
              left: `calc(50% + ${position.x}px)`,
              top: `calc(50% + ${position.y}px)`,
              transform: `translate(-50%, -50%) ${isClicking ? 'translateY(8px) scale(0.85)' : ''}`,
            }}
          >
            <img
              src="/assets/cursor.png"
              alt="Cursor"
              className="w-8 h-8 opacity-90"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.4))',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

