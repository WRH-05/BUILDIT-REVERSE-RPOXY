type NotificationsProps = {
  wonGame: boolean
  lost: boolean
  levelIndex: number
  onNextLevel: () => void
  onRestart: () => void
  wonLevel: boolean
}

export default function Notifications({
  wonGame,
  lost,
  levelIndex,
  onNextLevel,
  onRestart,
  wonLevel,
}: NotificationsProps) {
  if (!wonGame && !lost && !wonLevel) return null

  return (
    <div>
      {wonGame && (
        <div className="text-center">
          <div className="text-2xl font-bold text-black mb-2">You Won the Game!</div>
          <div className="text-lg text-gray-700 mb-4">The city is complete!</div>
          <button
            onClick={onRestart}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 font-bold"
          >
            Play Again
          </button>
        </div>
      )}

      {wonLevel && !wonGame && (
        <div className="text-center">
          <div className="text-2xl font-bold text-black mb-3">Level {levelIndex + 1} Complete!</div>
          <button
            onClick={onNextLevel}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 font-bold"
          >
            Next Level
          </button>
        </div>
      )}

      {lost && (
        <div className="text-center">
          <div className="text-2xl font-bold text-black mb-4">Game Over!</div>
          <div className="text-lg text-gray-700 mb-4">Health and Energy depleted</div>
          <button
            onClick={onRestart}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 font-bold"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  )
}