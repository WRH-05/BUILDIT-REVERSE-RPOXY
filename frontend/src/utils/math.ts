export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

