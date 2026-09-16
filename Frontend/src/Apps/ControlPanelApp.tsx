import { useState } from 'react'
import { wallpapers, type WallpaperItem, defaultWallpaper } from '../Wallpaper'

interface CategoryItem {
  id: string
  title: string
  desc: string
  icon: string
  tasks: string[]
}

interface ControlPanelAppProps {
  currentWallpaperUrl?: string
  onSelectWallpaper?: (url: string, id: string) => void
  volume?: number
  isMuted?: boolean
  onVolumeChange?: (vol: number) => void
  onMuteChange?: (muted: boolean) => void
}

export default function ControlPanelApp({ currentWallpaperUrl, onSelectWallpaper, volume = 0.75, isMuted = false, onVolumeChange, onMuteChange }: ControlPanelAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [activeTask, setActiveTask] = useState<'wallpaper' | 'adjust-volume' | null>(null)
  // Local volume state mirrors prop (slider needs local state for smooth drag)
  const [localVolume, setLocalVolume] = useState<number>(volume)
  const [localMuted, setLocalMuted] = useState<boolean>(isMuted)

  // Find initial active wallpaper
  const initialWallpaper =
    wallpapers.find((w) => w.url === currentWallpaperUrl) ||
    (() => {
      const savedId = typeof window !== 'undefined' ? localStorage.getItem('xp_current_wallpaper') : null
      return (savedId && wallpapers.find((w) => w.id === savedId)) || defaultWallpaper
    })()

  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperItem>(initialWallpaper)
  const [appliedWallpaperId, setAppliedWallpaperId] = useState<string>(initialWallpaper.id)
  const [position, setPosition] = useState<'stretch' | 'center' | 'tile'>('stretch')

  const handleApplyWallpaper = (item: WallpaperItem) => {
    setAppliedWallpaperId(item.id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('xp_current_wallpaper', item.id)
    }
    if (onSelectWallpaper) {
      onSelectWallpaper(item.url, item.id)
    }
  }

  const categories: CategoryItem[] = [
    {
      id: 'appearance',
      title: 'Appearance and Themes',
      desc: 'Change the computer’s theme or background, or configure screen saver and display resolution.',
      icon: '🎨',
      tasks: ['Change the desktop background', 'Choose a screen saver', 'Change the screen resolution'],
    },
    {
      id: 'network',
      title: 'Network and Internet Connections',
      desc: 'Connect to the Internet, configure home networks, and adjust firewall settings.',
      icon: '🌐',
      tasks: ['Set up a home network', 'Network Connections', 'Internet Options'],
    },
    {
      id: 'programs',
      title: 'Add or Remove Programs',
      desc: 'Install or remove programs and Windows components.',
      icon: '💿',
      tasks: ['Change or Remove Programs', 'Add New Programs', 'Add/Remove Windows Components'],
    },
    {
      id: 'sounds',
      title: 'Sounds, Speech, and Audio Devices',
      desc: 'Change the sound scheme for your computer, or configure your speakers and audio settings.',
      icon: '🔊',
      tasks: ['Adjust the system volume', 'Change the sound scheme', 'Speaker settings'],
    },
    {
      id: 'performance',
      title: 'Performance and Maintenance',
      desc: 'See basic information about your computer, clean up your hard disk, and arrange disk space.',
      icon: '⚡',
      tasks: ['Free up disk space', 'Rearrange items on your hard disk', 'System diagnostics'],
    },
    {
      id: 'hardware',
      title: 'Printers and Other Hardware',
      desc: 'Change settings for your printer, keyboard, mouse, and game controllers.',
      icon: '🖨️',
      tasks: ['View installed printers and fax', 'Keyboard properties', 'Mouse pointers and speed'],
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      desc: 'Change user account settings and passwords for people who share this computer.',
      icon: '👤',
      tasks: ['Change Nivesh account', 'Create a new account', 'Change how users log on or off'],
    },
    {
      id: 'datetime',
      title: 'Date, Time, Language, and Regional Options',
      desc: 'Change the date, time, time zone, numbers, currency, and language settings.',
      icon: '📅',
      tasks: ['Change the date and time', 'Add other languages', 'Regional formats'],
    },
    {
      id: 'security',
      title: 'Security Center',
      desc: 'Configure settings to help protect your computer, including Windows Firewall and Automatic Updates.',
      icon: '🛡️',
      tasks: ['Windows Firewall', 'Automatic Updates', 'Internet Security Options'],
    },
  ]

  const handleBack = () => {
    if (activeTask) {
      setActiveTask(null)
    } else if (selectedCategory) {
      setSelectedCategory(null)
    }
  }

  const getAddressText = () => {
    if (activeTask === 'wallpaper') {
      return 'Control Panel > Appearance and Themes > Display Properties'
    }
    if (activeTask === 'adjust-volume') {
      return 'Control Panel > Sounds, Speech, and Audio Devices > Volume Control'
    }
    if (selectedCategory) {
      return `Control Panel > ${selectedCategory.title}`
    }
    return 'Control Panel'
  }

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans h-full">
      {/* Explorer Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] select-none text-neutral-700">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Explorer Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] select-none">
        <button
          type="button"
          onClick={handleBack}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            selectedCategory || activeTask
              ? 'hover:bg-white/60 text-neutral-800 cursor-pointer'
              : 'text-neutral-400 cursor-not-allowed'
          }`}
        >
          <span className="text-emerald-600 font-bold">🠈</span> Back
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded text-neutral-400 cursor-not-allowed">
          <span className="text-emerald-600 font-bold">🠊</span>
        </button>
        <div className="h-4 w-px bg-neutral-300 mx-1" />
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-700 cursor-pointer">
          <span>🔍</span> Search
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-700 cursor-pointer">
          <span>📂</span> Folders
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <img src="/icons/control-panel.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-neutral-800 font-medium">{getAddressText()}</span>
        </div>
        <button type="button" className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer">
          Go
        </button>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows XP Tasks Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px]">
          {/* Control Panel Tasks */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Control Panel</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span
                onClick={() => {
                  setSelectedCategory(null)
                  setActiveTask(null)
                }}
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <span>🔄</span> Switch to Category View
              </span>
            </div>
          </div>

          {/* See Also */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>See Also</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span
                onClick={() => {
                  const app = categories.find((c) => c.id === 'appearance')
                  if (app) {
                    setSelectedCategory(app)
                    setActiveTask('wallpaper')
                  }
                }}
                className="hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <span>🎨</span> Display Properties
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🌐</span> Windows Update
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>❓</span> Help and Support
              </span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white p-5 overflow-y-auto">
          {activeTask === 'adjust-volume' ? (
            /* Authentic XP Volume Control Dialog */
            <div className="max-w-md mx-auto">
              <div className="bg-[#ece9d8] border border-[#919b9c] shadow-md rounded-sm overflow-hidden">
                {/* Dialog title bar */}
                <div className="bg-gradient-to-r from-[#003399] via-[#0055ea] to-[#1166ff] text-white px-3 py-1.5 flex items-center gap-2 select-none">
                  <span className="text-[13px]">🔊</span>
                  <span className="font-bold text-[12px] tracking-wide">Volume Control</span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#919b9c] px-3 pt-2 gap-1 text-[11px] bg-[#ece9d8]">
                  <button type="button" className="px-3 py-1 bg-white border-t border-l border-r border-[#919b9c] -mb-px rounded-t font-bold text-neutral-900 shadow-xs">Volume</button>
                  <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-500 cursor-pointer">Sounds</button>
                  <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-500 cursor-pointer">Audio</button>
                  <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-500 cursor-pointer">Voice</button>
                </div>

                <div className="p-5 bg-white">
                  {/* Main volume slider — vertical */}
                  <div className="flex items-end gap-6">
                    {/* Master Volume Column */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-bold text-neutral-800">Master Volume</span>
                      <div className="flex items-center gap-3">
                        {/* Vertical slider */}
                        <div className="relative flex flex-col items-center" style={{ height: 160 }}>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={localMuted ? 0 : Math.round(localVolume * 100)}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) / 100
                              setLocalVolume(val)
                              if (localMuted && val > 0) {
                                setLocalMuted(false)
                                onMuteChange?.(false)
                              }
                              onVolumeChange?.(val)
                            }}
                            className="cursor-pointer"
                            style={{
                              writingMode: 'vertical-lr' as const,
                              direction: 'rtl',
                              width: 32,
                              height: 150,
                              accentColor: '#316ac5',
                            }}
                          />
                        </div>
                        {/* Tick labels */}
                        <div className="flex flex-col justify-between text-[10px] text-neutral-500 font-mono" style={{ height: 150 }}>
                          <span>High</span>
                          <span>75</span>
                          <span>50</span>
                          <span>25</span>
                          <span>Low</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#316ac5]">
                        {localMuted ? 'Muted' : `${Math.round(localVolume * 100)}%`}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-neutral-300 self-stretch mx-2" />

                    {/* Right panel: speakers + visual feedback */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Visual VU meter */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-neutral-700 mb-1">Level</span>
                        <div className="flex items-end gap-1 h-20">
                          {Array.from({ length: 12 }).map((_, i) => {
                            const threshold = (i + 1) / 12
                            const lit = !localMuted && localVolume >= threshold
                            const isHigh = i >= 10
                            const isMid = i >= 7 && i < 10
                            return (
                              <div
                                key={i}
                                style={{ height: `${((i + 1) / 12) * 80}px` }}
                                className={`w-4 rounded-sm transition-colors duration-150 ${
                                  lit
                                    ? isHigh
                                      ? 'bg-red-500'
                                      : isMid
                                      ? 'bg-yellow-400'
                                      : 'bg-emerald-500'
                                    : 'bg-neutral-200'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>

                      {/* Speaker icon */}
                      <div className="flex items-center gap-2 text-neutral-600">
                        <span className="text-3xl">{localMuted || localVolume === 0 ? '🔇' : localVolume < 0.4 ? '🔉' : '🔊'}</span>
                        <span className="text-[11px] text-neutral-500">System Audio Output</span>
                      </div>

                      {/* Mute checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
                        <input
                          type="checkbox"
                          checked={localMuted}
                          onChange={(e) => {
                            const m = e.target.checked
                            setLocalMuted(m)
                            onMuteChange?.(m)
                            if (!m) onVolumeChange?.(localVolume)
                          }}
                          className="w-3.5 h-3.5 cursor-pointer accent-[#316ac5]"
                        />
                        <span className="text-[11px] font-semibold text-neutral-800">Mute</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dialog action buttons */}
                <div className="flex justify-end gap-2 px-4 pb-4 pt-2 bg-[#ece9d8] border-t border-[#d0ccc0] text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      onVolumeChange?.(localVolume)
                      onMuteChange?.(localMuted)
                      setActiveTask(null)
                    }}
                    className="px-5 py-1 bg-[#ece9d8] hover:bg-white border border-[#003c74] rounded-xs font-semibold shadow-xs cursor-pointer"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLocalVolume(volume); setLocalMuted(isMuted); setActiveTask(null) }}
                    className="px-4 py-1 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs shadow-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => { onVolumeChange?.(localVolume); onMuteChange?.(localMuted) }}
                    className="px-4 py-1 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs shadow-xs cursor-pointer font-bold text-blue-950"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTask(null)}
                className="mt-4 text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
              >
                🠈 Back to Sounds, Speech, and Audio Devices
              </button>
            </div>
          ) : activeTask === 'wallpaper' ? (
            /* Authentic Display Properties Dialog View */
            <div className="max-w-xl mx-auto bg-[#ece9d8] p-3 rounded border border-[#919b9c] shadow-sm select-none">
              {/* Tab Bar */}
              <div className="flex border-b border-[#919b9c] gap-1 text-[11px] mb-3">
                <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-600 cursor-pointer">
                  Themes
                </button>
                <button type="button" className="px-3 py-1 bg-white border-t-2 border-t-[#2277ff] border-l border-r border-[#919b9c] -mb-px rounded-t font-bold text-neutral-900 shadow-xs cursor-pointer">
                  Desktop
                </button>
                <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-600 cursor-pointer">
                  Screen Saver
                </button>
                <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-600 cursor-pointer">
                  Appearance
                </button>
                <button type="button" className="px-3 py-1 bg-[#ece9d8] border-t border-l border-r border-[#919b9c] rounded-t text-neutral-600 cursor-pointer">
                  Settings
                </button>
              </div>

              {/* CRT Monitor Preview */}
              <div className="flex justify-center my-3">
                <div className="relative w-[210px] h-[160px] bg-[#dfdbd1] p-3 rounded-t-xl border-2 border-[#9e9a90] shadow-md flex flex-col items-center">
                  {/* Inner Monitor Screen Bezel */}
                  <div className="w-full h-[115px] bg-[#1a1a1a] rounded-sm p-1.5 shadow-inner border border-[#6b675e] flex items-center justify-center overflow-hidden">
                    <img
                      src={previewWallpaper.url}
                      alt="Wallpaper Preview"
                      className={`w-full h-full rounded-xs transition-all duration-200 ${
                        position === 'center'
                          ? 'object-none'
                          : position === 'tile'
                          ? 'object-contain'
                          : 'object-cover'
                      }`}
                    />
                  </div>
                  {/* Monitor Controls & Power Light */}
                  <div className="w-full mt-2 flex items-center justify-between px-2 text-[9px] text-neutral-600">
                    <span className="font-mono tracking-wider text-[8px] text-neutral-500 font-bold">XP DISPLAY</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#22c55e]" />
                      <div className="w-3 h-1 bg-neutral-400 rounded-xs" />
                    </div>
                  </div>
                  {/* Stand Base */}
                  <div className="absolute -bottom-3 w-20 h-3 bg-[#cfcac0] border-t border-neutral-400 rounded-b shadow-sm" />
                </div>
              </div>

              {/* Background Selection Section */}
              <div className="mt-6">
                <div className="text-[11px] font-bold text-neutral-800 mb-1">
                  Background:
                </div>

                <div className="flex gap-3">
                  {/* Wallpaper Listbox */}
                  <div className="flex-1 h-36 bg-white border border-[#7f9db9] rounded-xs shadow-inner overflow-y-auto p-1">
                    {wallpapers.map((wp) => {
                      const isSelected = previewWallpaper.id === wp.id
                      const isCurrent = appliedWallpaperId === wp.id

                      return (
                        <div
                          key={wp.id}
                          onClick={() => setPreviewWallpaper(wp)}
                          onDoubleClick={() => {
                            setPreviewWallpaper(wp)
                            handleApplyWallpaper(wp)
                          }}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-xs cursor-pointer text-[11px] select-none transition-colors ${
                            isSelected
                              ? 'bg-[#316ac5] text-white font-medium'
                              : 'hover:bg-blue-50 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={wp.url}
                              alt=""
                              className="w-5 h-4 object-cover rounded-xs border border-neutral-400 shadow-xs"
                            />
                            <span>{wp.name}</span>
                          </div>
                          {isCurrent && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                              Active
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Position Dropdown */}
                  <div className="w-32 flex flex-col gap-2">
                    <div>
                      <div className="text-[11px] text-neutral-700 mb-0.5">Position:</div>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as 'stretch' | 'center' | 'tile')}
                        className="w-full bg-white border border-[#7f9db9] rounded-xs px-2 py-1 text-[11px] cursor-pointer"
                      >
                        <option value="stretch">Stretch</option>
                        <option value="center">Center</option>
                        <option value="tile">Tile</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyWallpaper(previewWallpaper)}
                      className="mt-2 w-full py-1 px-2 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs text-[11px] font-bold text-blue-900 cursor-pointer shadow-xs active:shadow-inner"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Dialog Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#d0ccc0] flex justify-end gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    handleApplyWallpaper(previewWallpaper)
                    setActiveTask(null)
                  }}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-white border border-[#003c74] rounded-xs font-semibold shadow-xs cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyWallpaper(previewWallpaper)}
                  className="px-4 py-1 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs shadow-xs cursor-pointer font-bold text-blue-950"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : selectedCategory ? (
            /* Detailed Category View */
            <div>
              <div className="flex items-center gap-3 border-b-2 border-blue-900 pb-3 mb-4">
                <span className="text-4xl">{selectedCategory.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-blue-900">{selectedCategory.title}</h2>
                  <p className="text-xs text-neutral-600 mt-0.5">{selectedCategory.desc}</p>
                </div>
              </div>

              {/* Category Tasks */}
              <div className="text-xs font-bold text-blue-950 mb-2">Pick a task...</div>
              <div className="space-y-2 mb-6">
                {selectedCategory.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (task.includes('desktop background') || selectedCategory.id === 'appearance') {
                        setActiveTask('wallpaper')
                      } else if (task.includes('system volume') || task.includes('Adjust')) {
                        setLocalVolume(volume)
                        setLocalMuted(isMuted)
                        setActiveTask('adjust-volume')
                      }
                    }}
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline cursor-pointer p-1.5 rounded hover:bg-blue-50 group"
                  >
                    <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">➔</span>
                    <span className="font-medium">{task}</span>
                  </div>
                ))}
              </div>

              {/* If Appearance & Themes: Show Quick Wallpapers Grid */}
              {selectedCategory.id === 'appearance' && (
                <div className="mt-4 border-t border-blue-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold text-blue-950">
                      Available Wallpapers in <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">src/Wallpaper</code>:
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTask('wallpaper')}
                      className="text-xs text-blue-800 hover:underline font-semibold cursor-pointer"
                    >
                      Open Display Properties 🠊
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wallpapers.map((wp) => {
                      const isCurrent = appliedWallpaperId === wp.id

                      return (
                        <div
                          key={wp.id}
                          onClick={() => {
                            setPreviewWallpaper(wp)
                            handleApplyWallpaper(wp)
                          }}
                          className={`flex flex-col rounded border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                            isCurrent
                              ? 'border-2 border-[#316ac5] shadow-sm bg-blue-50/50'
                              : 'border-neutral-300 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div className="h-24 w-full overflow-hidden relative bg-neutral-900">
                            <img
                              src={wp.url}
                              alt={wp.name}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            {isCurrent && (
                              <span className="absolute top-1.5 right-1.5 bg-[#316ac5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="p-2 flex items-center justify-between">
                            <span className="font-bold text-[11px] text-neutral-800">{wp.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewWallpaper(wp)
                                handleApplyWallpaper(wp)
                              }}
                              className="text-[10px] px-2 py-0.5 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs font-medium cursor-pointer"
                            >
                              {isCurrent ? 'Active' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                >
                  🠈 Back to All Categories
                </button>
              </div>
            </div>
          ) : (
            /* Main Categories Grid */
            <div>
              <div className="mb-4">
                <h1 className="text-base font-bold text-blue-950">Pick a category</h1>
                <p className="text-xs text-neutral-500">Configure your Windows XP computer settings and hardware.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat)
                      if (cat.id === 'appearance') {
                        // Keep on category view, allow user to click task or wallpaper
                      }
                    }}
                    className="flex items-start gap-3 p-2.5 rounded border border-transparent hover:border-blue-300 hover:bg-blue-50/60 cursor-pointer transition-colors group"
                  >
                    <span className="text-3xl shrink-0 transition-transform group-hover:scale-110">{cat.icon}</span>
                    <div>
                      <div className="font-bold text-[12px] text-blue-900 group-hover:underline">
                        {cat.title}
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <span>Control Panel</span>
        <span>My Computer</span>
      </div>
    </div>
  )
}
