import ShopCard from "../game/ShopCard"
import { formatTime } from "../../utils/format"

type HealthStabilizerCardProps = {
  duration: number
  cost: number
  sp: number
  activeTimeRemaining?: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function HealthStabilizerCard({
  duration,
  cost,
  sp,
  activeTimeRemaining = 0,
  onPurchase,
  disabled = false,
  asset,
}: HealthStabilizerCardProps) {
  const isActive = activeTimeRemaining > 0

  const info = isActive
    ? `Active: ${formatTime(activeTimeRemaining)} remaining • Reduces health damage by 50%`
    : `${duration}s duration • Reduces health damage by 50%`

  return (
    <ShopCard
      name="Health Stabilizer"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled || isActive}
      asset={asset}
    />
  )
}

