type ShopCardProps = {
  name: string
  info: string
  cost: number
  sp: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode // Optional asset/image component
}

export default function ShopCard({
  name,
  info,
  cost,
  sp,
  onPurchase,
  disabled = false,
  asset,
}: ShopCardProps) {
  const canAfford = sp >= cost && !disabled

  return (
    <div className="bg-white border-2 border-black rounded-lg overflow-hidden flex">
      {/* Asset Section - Left */}
      <div className="w-20 bg-gray-100 border-r-2 border-black flex items-center justify-center flex-shrink-0">
        {asset || <div className="text-2xl">📦</div>}
      </div>

      {/* Info Section - Right */}
      <div className="flex-1 p-2 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-black mb-1">{name}</h3>
          <p className="text-xs text-gray-700">{info}</p>
        </div>
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`mt-2 w-full py-1 px-2 rounded font-bold text-xs border-2 ${
            canAfford
              ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-700 active:scale-95"
              : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
          } transition-all`}
        >
          Buy ({cost.toLocaleString()} SP)
        </button>
      </div>
    </div>
  )
}

