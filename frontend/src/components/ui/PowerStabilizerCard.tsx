import ShopCard from "../game/ShopCard"
import { formatTime } from "../../utils/format"

type PowerStabilizerCardProps = {
  duration: number
  cost: number
  sp: number
  activeTimeRemaining?: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function PowerStabilizerCard({
  duration,
  cost,
  sp,
  activeTimeRemaining = 0,
  onPurchase,
  disabled = false,
  asset,
}: PowerStabilizerCardProps) {
  const isActive = activeTimeRemaining > 0

  const info = isActive
    ? `Active: ${formatTime(activeTimeRemaining)} remaining • Reduces energy damage by 50%`
    : `${duration}s duration • Reduces energy damage by 50%`

  return (
    <ShopCard
      name="Power Stabilizer"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled || isActive}
      asset={asset}
    />
  )
}

