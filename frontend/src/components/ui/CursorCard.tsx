import ShopCard from "../game/ShopCard"
import { calculateClickSP } from "../../systems/EconomySystem"

type CursorCardProps = {
  clicksPerMinute: number
  clickPower: number
  economyMultiplier: number
  cost: number
  sp: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function CursorCard({
  clicksPerMinute,
  clickPower,
  economyMultiplier,
  cost,
  sp,
  onPurchase,
  disabled = false,
  asset,
}: CursorCardProps) {
  const spPerClick = calculateClickSP(clickPower, economyMultiplier)
  const spPerMinute = clicksPerMinute * spPerClick
  const info = `${clicksPerMinute} clicks/min • ${spPerMinute.toFixed(1)} SP/min`

  const defaultAsset = (
    <img
      src="/assets/cursor.png"
      alt="Cursor"
      className="w-full h-full object-contain"
    />
  )

  return (
    <ShopCard
      name="Cursor"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled}
      asset={asset || defaultAsset}
    />
  )
}

