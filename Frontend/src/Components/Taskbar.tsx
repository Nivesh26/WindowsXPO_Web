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
}

export default function Taskbar({
  isStartOpen,
  onToggleStart,
  openWindows,
  activeWindowId,
  onWindowClick,
}: TaskbarProps) {
  const [timeStr, setTimeStr] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')

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
        className="h-full bg-gradient-to-b from-[#0c3894] via-[#092e8a] to-[#0c3894] border-l border-[#1b4cb3] px-2.5 flex items-center gap-2.5 text-white text-[11px] font-sans shadow-[inset_1px_0_2px_rgba(0,0,0,0.4)] shrink-0"
        title={dateStr}
      >
        {/* Network Icon */}
        <span className="text-xs text-emerald-300" title="Local Area Connection (100 Mbps)">
          🖧
        </span>

        {/* Volume Icon */}
        <span className="text-xs text-neutral-200" title="Volume">
          🔊
        </span>

        {/* Digital Real-Time Clock */}
        <span className="font-semibold text-[11px] tracking-tight ml-1 drop-shadow-xs">
          {timeStr}
        </span>
      </div>
    </div>
  )
}
