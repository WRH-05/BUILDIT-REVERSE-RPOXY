import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"
import { generateLand, generateStructures, renderLand, renderStructures } from "../../rendering/CityRenderer"
import { loadTextures } from "../../rendering/utils/assetLoader"
import { calculateCityBounds, centerCity, constrainCamera } from "../../rendering/Camera"

type CityViewProps = {
  levelIndex: number
  maxedCount: number
  totalClickers: number
  factoryCount: number
  hospitalCount: number
  houseCount: number
}

export default function CityView({ levelIndex, maxedCount, totalClickers, factoryCount, hospitalCount, houseCount }: CityViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const cityContainerRef = useRef<PIXI.Container | null>(null)
  const texturesRef = useRef<Map<string, PIXI.Texture>>(new Map())
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const progressIndicatorRef = useRef<PIXI.Container | null>(null)
  const scaleRef = useRef(1)
  const cityBoundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 })
  const layoutSeedRef = useRef<number | null>(null)
  
  if (layoutSeedRef.current === null) {
    layoutSeedRef.current = Math.random()
  }
  
  const progress = totalClickers > 0 ? maxedCount / totalClickers : 0
  const land = generateLand(levelIndex)
  const structures = generateStructures(land, factoryCount, hospitalCount, houseCount, layoutSeedRef.current)
  const landWidth = land[0]?.length || 0
  const landHeight = land.length || 0
  
  useEffect(() => {
    const loadAllTextures = async () => {
      const textures = await loadTextures()
      texturesRef.current = textures
    }
    
    loadAllTextures()
  }, [])
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const app = new PIXI.Application()
    
    const initPixi = async () => {
      await app.init({
        width: containerRef.current!.clientWidth,
        height: containerRef.current!.clientHeight,
        backgroundColor: 0x333333,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })
      
      containerRef.current!.appendChild(app.canvas)
      appRef.current = app
      
      const cityContainer = new PIXI.Container()
      app.stage.addChild(cityContainer)
      cityContainerRef.current = cityContainer
      
      const progressContainer = new PIXI.Container()
      app.stage.addChild(progressContainer)
      progressIndicatorRef.current = progressContainer
      
      const handleResize = () => {
        if (!containerRef.current || !app) return
        app.renderer.resize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        )
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    
    const cleanup = initPixi()
    
    return () => {
      cleanup.then((cleanupFn) => {
        cleanupFn?.()
        app.destroy(true, { children: true, texture: true })
      })
    }
  }, [])
  
  useEffect(() => {
    if (!appRef.current || !cityContainerRef.current || texturesRef.current.size === 0) return
    
    const cityContainer = cityContainerRef.current
    cityContainer.removeChildren()
    
    renderLand(cityContainer, land, texturesRef.current)
    renderStructures(cityContainer, structures, texturesRef.current)
    
    cityContainer.sortChildren()
    
    const bounds = calculateCityBounds(landWidth, landHeight)
    cityBoundsRef.current = bounds
    
    if (appRef.current) {
      const { scale } = centerCity(
        cityContainer,
        bounds,
        appRef.current.renderer.width,
        appRef.current.renderer.height
      )
      scaleRef.current = scale
    }
  }, [land, structures, landWidth, landHeight, factoryCount, hospitalCount, houseCount])
  
  useEffect(() => {
    if (!appRef.current || !cityContainerRef.current) return
    
    const app = appRef.current
    const cityContainer = cityContainerRef.current
    
    const onMouseDown = (event: PIXI.FederatedPointerEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: event.globalX - cityContainer.x,
        y: event.globalY - cityContainer.y,
      }
      app.canvas.style.cursor = 'grabbing'
    }
    
    const onMouseMove = (event: PIXI.FederatedPointerEvent) => {
      if (!isDraggingRef.current) return
      
      const newX = event.globalX - dragStartRef.current.x
      const newY = event.globalY - dragStartRef.current.y
      
      constrainCamera(
        cityContainer,
        cityBoundsRef.current,
        scaleRef.current,
        app.renderer.width,
        app.renderer.height
      )
      
      cityContainer.x = newX
      cityContainer.y = newY
      constrainCamera(
        cityContainer,
        cityBoundsRef.current,
        scaleRef.current,
        app.renderer.width,
        app.renderer.height
      )
    }
    
    const onMouseUp = () => {
      isDraggingRef.current = false
      app.canvas.style.cursor = 'grab'
    }
    
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      let newX = cityContainer.x + event.deltaX
      let newY = cityContainer.y + event.deltaY
      
      cityContainer.x = newX
      cityContainer.y = newY
      constrainCamera(
        cityContainer,
        cityBoundsRef.current,
        scaleRef.current,
        app.renderer.width,
        app.renderer.height
      )
    }
    
    app.stage.eventMode = 'static'
    app.stage.hitArea = new PIXI.Rectangle(0, 0, app.renderer.width, app.renderer.height)
    app.stage.on('pointerdown', onMouseDown)
    app.stage.on('pointermove', onMouseMove)
    app.stage.on('pointerup', onMouseUp)
    app.stage.on('pointerupoutside', onMouseUp)
    app.canvas.style.cursor = 'grab'
    app.canvas.addEventListener('wheel', onWheel, { passive: false })
    
    return () => {
      app.stage.off('pointerdown', onMouseDown)
      app.stage.off('pointermove', onMouseMove)
      app.stage.off('pointerup', onMouseUp)
      app.stage.off('pointerupoutside', onMouseUp)
      app.canvas.removeEventListener('wheel', onWheel)
    }
  }, [])
  
  useEffect(() => {
    if (!appRef.current || !progressIndicatorRef.current) return
    
    const progressContainer = progressIndicatorRef.current
    progressContainer.removeChildren()
    
    const containerWidth = appRef.current.renderer.width
    const containerHeight = appRef.current.renderer.height
    
    const bg = new PIXI.Graphics()
    bg.rect(0, 0, 100, 30).fill(0x000000)
    bg.alpha = 0.5
    bg.x = containerWidth - 110
    bg.y = containerHeight - 40
    
    const text = new PIXI.Text({
      text: `${Math.floor(progress * 100)}% Built`,
      style: {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: 0xffffff,
      },
    })
    text.x = containerWidth - 105
    text.y = containerHeight - 35
    
    progressContainer.addChild(bg)
    progressContainer.addChild(text)
  }, [progress])
  
  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
    />
  )
}
