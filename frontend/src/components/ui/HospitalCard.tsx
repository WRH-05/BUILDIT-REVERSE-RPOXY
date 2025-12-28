import ShopCard from "../game/ShopCard"

type HospitalCardProps = {
  cost: number
  sp: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function HospitalCard({
  cost,
  sp,
  onPurchase,
  disabled = false,
  asset,
}: HospitalCardProps) {
  const info = "Increases health regeneration rate"

  const defaultAsset = (
    <img
      src="/assets/FreeAssets/Building_Doctor.png"
      alt="Hospital"
      className="w-full h-full object-contain"
    />
  )

  return (
    <ShopCard
      name="Hospital"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled}
      asset={asset || defaultAsset}
    />
  )
}

