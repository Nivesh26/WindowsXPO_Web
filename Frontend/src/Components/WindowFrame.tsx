import { useState, useRef, useEffect, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'

export interface WindowProps {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
  initialPos?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
}

export default function WindowFrame({
  title,
  icon,
  children,
  initialPos = { x: 120, y: 60 },
  initialSize = { width: 640, height: 440 },
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: WindowProps) {
  const [pos, setPos] = useState(initialPos)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: ReactMouseEvent) => {
    onFocus()
    if (isMaximized) return
    isDraggingRef.current = true
    dragOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffsetRef.current.x))
      const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y))
      setPos({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 30px)' }
          : { top: pos.y, left: pos.x, width: initialSize.width, height: initialSize.height }),
        ...(isMinimized ? { display: 'none' } : {}),
      }}
      className={`absolute ${isMinimized ? 'hidden' : 'flex'} flex-col bg-[#ece9d8] border-[3px] border-[#0055ea] rounded-t-lg shadow-[0_10px_25px_rgba(0,0,0,0.5)] select-none overflow-hidden ${
        isMaximized ? 'rounded-none border-none' : ''
      }`}
    >
      {/* Authentic Luna Blue Titlebar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
        className="h-[30px] bg-gradient-to-r from-[#0055ea] via-[#0055ea] to-[#3a93ff] text-white flex items-center justify-between px-2 cursor-move border-b border-[#002f82] relative shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
      >
        {/* Specular curved gloss line */}
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

        {/* Title & Icon */}
        <div className="flex items-center gap-1.5 overflow-hidden z-10">
          <div className="w-4 h-4 flex items-center justify-center shrink-0">{icon}</div>
          <span className="text-[12px] font-bold tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {title}
          </span>
        </div>

        {/* Titlebar Buttons: Min, Max, Close */}
        <div className="flex items-center gap-1 z-10">
          {/* Minimize Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
            className="w-[21px] h-[21px] bg-gradient-to-b from-[#2573e8] to-[#1453b8] hover:from-[#3a88fc] hover:to-[#2267d4] active:from-[#0d3f96] active:to-[#174eac] border border-white/60 rounded-xs flex items-center justify-center shadow-xs cursor-pointer"
            title="Minimize"
          >
            <span className="w-2 h-[2px] bg-white translate-y-1 block" />
          </button>

          {/* Maximize / Restore Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMaximize()
            }}
            className="w-[21px] h-[21px] bg-gradient-to-b from-[#2573e8] to-[#1453b8] hover:from-[#3a88fc] hover:to-[#2267d4] active:from-[#0d3f96] active:to-[#174eac] border border-white/60 rounded-xs flex items-center justify-center shadow-xs cursor-pointer"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? (
              <span className="text-[10px] text-white font-bold leading-none">❐</span>
            ) : (
              <span className="w-2.5 h-2.5 border-[1.5px] border-white block" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="w-[21px] h-[21px] bg-gradient-to-b from-[#e35234] to-[#ba2108] hover:from-[#f5664a] hover:to-[#d42c11] active:from-[#9c1803] active:to-[#b5220a] border border-white/60 rounded-xs flex items-center justify-center shadow-xs cursor-pointer"
            title="Close"
          >
            <span className="text-[11px] text-white font-black leading-none -translate-y-px">✕</span>
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 bg-[#ece9d8] overflow-auto flex flex-col font-sans text-neutral-800">
        {children}
      </div>
    </div>
  )
}
