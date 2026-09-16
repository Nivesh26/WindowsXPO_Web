import { useState, useEffect, type ReactNode } from 'react'

export interface TaskbarWindowItem {
  id: string
  title: string
  icon: ReactNode
  isMinimized: boolean
}

interface TaskbarProps {
  isStartOpen: boolean
  onToggleStart: () => void
  openWindows: TaskbarWindowItem[]
  activeWindowId: string | null
  onWindowClick: (id: string) => void
  volume?: number
  onVolumeChange?: (vol: number) => void
  isMuted?: boolean
  onToggleMute?: () => void
  isMusicPlaying?: boolean
}

// Calculate static lit bars based on volume level (0 to 7)
function getVolumeBars(level: number, isMuted: boolean): number {
  if (isMuted || level <= 0) return 0
  if (level >= 0.92) return 7 // Top / Max volume -> FULL 7 bars
  if (level >= 0.78) return 6
  if (level >= 0.63) return 5
  if (level >= 0.48) return 4
  if (level >= 0.33) return 3
  if (level >= 0.18) return 2
  return 1 // Low volume -> 1 bar
}

// 7-Bar Green Volume & Audio Level Indicator (Matching user screenshot)
function AudioMeterBars({
  level,
  isMuted,
  isPlaying,
  onClick,
}: {
  level: number
  isMuted: boolean
  isPlaying: boolean
  onClick?: (e: React.MouseEvent) => void
}) {
  const [activeBars, setActiveBars] = useState<number>(() => getVolumeBars(level, isMuted))

  useEffect(() => {
    if (isMuted || level <= 0) {
      setActiveBars(0)
      return
    }

    const maxBars = getVolumeBars(level, isMuted)

    if (!isPlaying) {
      // When music is not playing, display steady volume level (full at top, low at low)
      setActiveBars(maxBars)
      return
    }

    // When music is actively playing, animate dynamic audio beat & VU meter bounce
    let animFrame: number
    const renderMeter = () => {
      const now = performance.now()
      // Authentic rhythmic beat wave (~128 BPM pulse with syncopated sub-beats)
      const beat = (now % 468) / 468
      const kick = Math.pow(Math.max(0, 1 - beat * 2.2), 2)
      const snareBeat = ((now + 234) % 468) / 468
      const snare = Math.pow(Math.max(0, 1 - snareBeat * 3), 2) * 0.5
      const wave = Math.sin(now / 110) * 0.15 + Math.cos(now / 230) * 0.1

      const energy = Math.max(0.15, Math.min(1, kick * 0.8 + snare + wave + 0.25))

      // Scale energy by current volume setting
      // When sound is in top (beat peak at max volume) -> full bars (7)!
      // When sound is in low (between beats or low volume) -> low bars (1 or 2)!
      const dynamicBars = Math.max(1, Math.min(maxBars, Math.round(energy * maxBars)))
      setActiveBars(dynamicBars)

      animFrame = requestAnimationFrame(renderMeter)
    }

    animFrame = requestAnimationFrame(renderMeter)
    return () => cancelAnimationFrame(animFrame)
  }, [isPlaying, isMuted, level])

  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between h-[20px] w-[14px] p-0.5 rounded-xs hover:bg-white/20 cursor-pointer transition-colors shrink-0"
      title={`Audio Level: ${isMuted ? 'Muted' : `${Math.round(level * 100)}%`}${isPlaying ? ' (Music Playing)' : ''}`}
    >
      {[7, 6, 5, 4, 3, 2, 1].map((barNum) => {
        const isLit = barNum <= activeBars
        return (
          <div
            key={barNum}
            className={`w-full h-[1.5px] rounded-[0.5px] transition-all duration-75 ${
              isLit
                ? 'bg-[#4ade80] shadow-[0_0_3px_#22c55e]'
                : 'bg-[#0a2048]/60 opacity-40'
            }`}
          />
        )
      })}
    </div>
  )
}

export default function Taskbar({
  isStartOpen,
  onToggleStart,
  openWindows,
  activeWindowId,
  onWindowClick,
  volume: volumeProp,
  onVolumeChange,
  isMuted: isMutedProp,
  onToggleMute,
  isMusicPlaying = false,
}: TaskbarProps) {
  const [timeStr, setTimeStr] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false)
  const [localVolume, setLocalVolume] = useState<number>(0.75)
  const [localMuted, setLocalMuted] = useState<boolean>(false)

  const currentVolume = volumeProp !== undefined ? volumeProp : localVolume
  const currentMuted = isMutedProp !== undefined ? isMutedProp : localMuted

  // Play authentic Windows XP Ding sound
  const playXpDing = (overrideVol?: number) => {
    const effective = overrideVol !== undefined ? overrideVol : (currentMuted ? 0 : currentVolume)
    if (effective <= 0 || (currentMuted && overrideVol === undefined)) return
    try {
      const audio = new Audio('/sounds/ding.wav')
      audio.volume = Math.max(0, Math.min(1, effective))
      audio.play().catch((e) => console.warn('Sound play error:', e))
    } catch (err) {
      console.warn('Audio init error:', err)
    }
  }

  const handleToggleVolume = () => {
    const next = !isVolumeOpen
    setIsVolumeOpen(next)
    if (next) {
      playXpDing()
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (onVolumeChange) {
      onVolumeChange(val)
    } else {
      setLocalVolume(val)
    }
    if (val > 0 && currentMuted) {
      if (onToggleMute) onToggleMute()
      else setLocalMuted(false)
    }
  }

  const handleToggleMute = () => {
    if (onToggleMute) {
      onToggleMute()
    } else {
      setLocalMuted(!localMuted)
    }
    if (currentMuted) {
      playXpDing(currentVolume)
    }
  }

  // Close volume popup on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setIsVolumeOpen(false)
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      )
      setDateStr(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-0 left-0 right-0 h-[30px] bg-gradient-to-b from-[#245edc] via-[#3f8cf3] to-[#245edc] border-t border-[#498bf6] flex items-center justify-between z-40 select-none shadow-[0_-2px_6px_rgba(0,0,0,0.35)]"
    >
      {/* Left side: Start button & Running task items */}
      <div className="flex items-center h-full gap-1 overflow-hidden flex-1 mr-2">
        {/* Iconic Green Windows XP Start Button */}
        <button
          type="button"
          onClick={onToggleStart}
          className={`h-full px-3.5 rounded-r-[15px] flex items-center gap-1.5 shadow-[2px_0_4px_rgba(0,0,0,0.4)] cursor-pointer transition-all shrink-0 ${
            isStartOpen
              ? 'bg-gradient-to-b from-[#1b5e20] to-[#2e7d32] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.5)]'
              : 'bg-gradient-to-b from-[#4caf50] via-[#388e3c] to-[#2e7d32] hover:brightness-110 active:brightness-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
          }`}
        >
          {/* Windows 4-color Flag */}
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4 -rotate-10 skew-x-[-8deg] shrink-0">
            <div className="bg-[#ea3f24] rounded-tl-xs rounded-tr-xs" />
            <div className="bg-[#7ab800] rounded-tr-xs rounded-br-xs" />
            <div className="bg-[#00a1f1] rounded-bl-xs" />
            <div className="bg-[#ffba08] rounded-br-xs" />
          </div>

          <span className="text-white font-['Franklin_Gothic_Medium',Arial,sans-serif] italic font-black text-sm tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pr-1">
            start
          </span>
        </button>

        {/* Running Windows Task Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto h-full py-0.5 px-1 flex-1">
          {openWindows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized

            return (
              <button
                key={win.id}
                type="button"
                onClick={() => onWindowClick(win.id)}
                className={`h-[24px] max-w-[150px] min-w-[110px] px-2 rounded-xs flex items-center gap-1.5 text-xs text-white cursor-pointer transition-all truncate border ${
                  isActive
                    ? 'bg-gradient-to-b from-[#143a91] to-[#1c4fb8] border-[#0d2766] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
                    : 'bg-gradient-to-b from-[#3a80f0] to-[#245edc] border-[#1d4db8] hover:from-[#4d8ff7] hover:to-[#2e6ae3] shadow-xs'
                }`}
                title={win.title}
              >
                <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">{win.icon}</div>
                <span className="truncate text-[11px] font-medium leading-none drop-shadow-xs">
                  {win.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right side: System Tray (Indented dark blue area) */}
      <div
        className="h-full bg-gradient-to-b from-[#0c3894] via-[#092e8a] to-[#0c3894] border-l border-[#1b4cb3] px-2 flex items-center gap-1.5 text-white text-[11px] font-sans shadow-[inset_1px_0_2px_rgba(0,0,0,0.4)] shrink-0 relative"
      >
        {/* 7-Bar Green Volume / Audio VU Meter (Matching user screenshot, reactive & animated) */}
        <AudioMeterBars
          level={currentVolume}
          isMuted={currentMuted}
          isPlaying={isMusicPlaying}
          onClick={handleToggleVolume}
        />

        {/* Volume Speaker Icon (Interactive) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleVolume()
          }}
          className={`px-1 py-0.5 rounded cursor-pointer transition-colors flex items-center justify-center ${
            isVolumeOpen ? 'bg-white/30 shadow-inner' : 'hover:bg-white/20'
          }`}
          title={currentMuted ? 'Volume: Muted' : `Volume: ${Math.round(currentVolume * 100)}% (Click to adjust & hear sound)`}
        >
          {currentMuted || currentVolume === 0 ? (
            <span className="text-xs text-red-300">🔇</span>
          ) : currentVolume < 0.4 ? (
            <span className="text-xs text-neutral-200">🔉</span>
          ) : (
            <span className="text-xs text-neutral-100">🔊</span>
          )}
        </button>

        {/* Digital Real-Time Clock */}
        <span className="font-semibold text-[11px] tracking-tight ml-1 drop-shadow-xs cursor-default" title={dateStr}>
          {timeStr}
        </span>
      </div>

      {/* Authentic Windows XP Vertical Volume Slider Popup */}
      {isVolumeOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-[34px] right-[40px] w-[84px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-sm shadow-[0_8px_25px_rgba(0,0,0,0.65)] z-50 flex flex-col items-center p-2 select-none text-[11px] text-neutral-800 font-sans"
        >
          {/* Header Bar */}
          <div className="w-full text-center font-bold text-[11px] text-neutral-800 pb-1 border-b border-[#d0ccc0]">
            Volume
          </div>

          {/* Volume readout */}
          <div className="text-[10px] font-mono font-bold text-blue-900 mt-1 mb-0.5">
            {currentMuted ? 'Muted' : `${Math.round(currentVolume * 100)}%`}
          </div>

          {/* Vertical Slider Track Container */}
          <div className="relative h-[110px] flex items-center justify-center gap-2.5 my-1 w-full px-1">
            {/* Visual Tick Marks */}
            <div className="flex flex-col justify-between h-[90px] text-[8px] text-neutral-500 select-none pointer-events-none font-mono">
              <span>- Max</span>
              <span>-</span>
              <span>- Mid</span>
              <span>-</span>
              <span>- Min</span>
            </div>

            {/* Vertical Range Slider */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={currentMuted ? 0 : currentVolume}
              onChange={handleVolumeChange}
              onMouseUp={() => playXpDing()}
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
                width: '20px',
                height: '96px',
              }}
              className="cursor-pointer accent-[#0055ea] hover:accent-[#2672f7]"
            />
          </div>

          {/* Test Sound Button */}
          <button
            type="button"
            onClick={() => playXpDing()}
            className="w-full py-0.5 px-1 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-400 rounded-xs text-[10px] font-medium text-neutral-700 shadow-xs mb-1 cursor-pointer flex items-center justify-center gap-1"
          >
            <span>🔔</span> Test Ding
          </button>

          {/* Mute Checkbox */}
          <label className="pt-1 border-t border-[#d0ccc0] w-full flex items-center justify-center gap-1.5 cursor-pointer hover:text-neutral-950">
            <input
              type="checkbox"
              checked={currentMuted}
              onChange={handleToggleMute}
              className="rounded-xs accent-[#0055ea] cursor-pointer"
            />
            <span className="text-[10px] font-medium">Mute</span>
          </label>
        </div>
      )}
    </div>
  )
}
