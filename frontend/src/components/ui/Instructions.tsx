import { useState } from "react"

type InstructionsProps = {
  fixCost: number
}

export default function Instructions({ fixCost }: InstructionsProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 border-2 border-black z-50"
      >
        ? Help
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white border-4 border-black rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">How to Play</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-black hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="border-b-2 border-gray-300 pb-3">
            <p className="font-bold text-black mb-1">🖱️ Clicking</p>
            <p className="text-gray-700">Click the big button to generate Stability Points (SP)</p>
          </div>

          <div className="border-b-2 border-gray-300 pb-3">
            <p className="font-bold text-black mb-1">🛒 Shop Upgrades</p>
            <p className="text-gray-700">Use SP to buy upgrades that increase generation and protect your city</p>
          </div>

          <div className="border-b-2 border-gray-300 pb-3">
            <p className="font-bold text-black mb-1">❤️ Health & ⚡ Energy</p>
            <p className="text-gray-700">Both decrease over time based on weather conditions. You lose if both reach 0</p>
          </div>

          <div className="border-b-2 border-gray-300 pb-3">
            <p className="font-bold text-black mb-1">🔧 Quick Fix</p>
            <p className="text-gray-700">Click "Fix Health" or "Fix Energy" to restore {fixCost} SP per fix (limited by current SP)</p>
          </div>

          <div className="border-b-2 border-gray-300 pb-3">
            <p className="font-bold text-black mb-1">🌍 Data Updates</p>
            <p className="text-gray-700">Every 30-60 seconds, new weather data arrives and all values update. Watch the timer at the top!</p>
          </div>

          <div className="bg-red-50 border-2 border-red-400 rounded p-3">
            <p className="font-bold text-red-700 mb-1">⚠️ Lose Condition</p>
            <p className="text-red-600">You lose when BOTH Health AND Energy reach 0 at the same time</p>
          </div>
        </div>
      </div>
    </div>
  )
}