export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals)
}

export const formatLargeNumber = (value: number): string => {
  return Math.floor(value).toLocaleString()
}

