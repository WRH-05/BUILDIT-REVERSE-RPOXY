type HealthBarProps = {
  label: string
  value: number // 0-100
  color: "red" | "yellow" | "green" | "blue" // Color theme
  sp: number
  fixCost: number
  restoreAmount: number // Amount to restore (e.g., 5 for 5%)
  onFix: () => void
  disabled?: boolean
}

export default function HealthBar({
  label,
  value,
  color,
  sp,
  fixCost,
  restoreAmount,
  onFix,
  disabled = false,
}: HealthBarProps) {
  const canAffordFix = sp >= fixCost && !disabled
  const isFull = value >= 100

  const colorClasses = {
    red: {
      button: "bg-red-500 hover:bg-red-600 border-red-700",
      bar: "bg-red-500",
    },
    yellow: {
      button: "bg-yellow-500 hover:bg-yellow-600 border-yellow-700",
      bar: "bg-yellow-500",
    },
    green: {
      button: "bg-green-500 hover:bg-green-600 border-green-700",
      bar: "bg-green-500",
    },
    blue: {
      button: "bg-blue-500 hover:bg-blue-600 border-blue-700",
      bar: "bg-blue-500",
    },
  }

  const theme = colorClasses[color]

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center gap-2">
        <span className="text-xs font-semibold text-black">{label}</span>
        <span className="text-xs text-gray-600">{Math.round(value)}%</span>
        <button
          onClick={onFix}
          disabled={!canAffordFix || isFull}
          className={`text-xs px-2 py-1 rounded font-bold border transition-all ${
            canAffordFix && !isFull
              ? `${theme.button} text-white active:scale-95`
              : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
          }`}
          title={`Fix (+${restoreAmount}% ${label}) - ${fixCost} SP`}
        >
          Fix
        </button>
      </div>
      <div className="w-full h-5 bg-gray-300 border-2 border-black overflow-hidden">
        <div
          className={`h-full ${theme.bar} transition-all duration-300`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}
