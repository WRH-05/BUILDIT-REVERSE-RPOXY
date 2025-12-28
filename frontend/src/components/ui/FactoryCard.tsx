import ShopCard from "../game/ShopCard"

type FactoryCardProps = {
  cost: number
  sp: number
  onPurchase: () => void
  disabled?: boolean
  asset?: React.ReactNode
}

export default function FactoryCard({
  cost,
  sp,
  onPurchase,
  disabled = false,
  asset,
}: FactoryCardProps) {
  const info = "Increases SP generation rate"

  const defaultAsset = (
    <img
      src="/assets/FreeAssets/Building_Appartment_Level2.png"
      alt="Factory"
      className="w-full h-full object-contain"
    />
  )

  return (
    <ShopCard
      name="Factory"
      info={info}
      cost={cost}
      sp={sp}
      onPurchase={onPurchase}
      disabled={disabled}
      asset={asset || defaultAsset}
    />
  )
}

