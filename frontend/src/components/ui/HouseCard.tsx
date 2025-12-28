import ShopCard from "../game/ShopCard"

type HouseCardProps = {
  cost: number
  sp: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function HouseCard({
  cost,
  sp,
  onPurchase,
  disabled = false,
  asset,
}: HouseCardProps) {
  const info = "Increases health and economy by 10%"

  const defaultAsset = (
    <img
      src="/assets/FreeAssets/Building_House1.png"
      alt="House"
      className="w-full h-full object-contain"
    />
  )

  return (
    <ShopCard
      name="House"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled}
      asset={asset || defaultAsset}
    />
  )
}

