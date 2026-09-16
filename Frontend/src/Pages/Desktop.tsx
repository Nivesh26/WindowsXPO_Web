import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import DesktopWallpaper from '../Components/DesktopWallpaper'
import DesktopIcons from '../Components/DesktopIcons'
import Taskbar, { type TaskbarWindowItem } from '../Components/Taskbar'
import StartMenu from '../Components/StartMenu'
import WindowFrame from '../Components/WindowFrame'
import { wallpapers, defaultWallpaper } from '../Wallpaper'

// Window Application Components
import MyComputerApp from '../Apps/MyComputerApp'
import MyDocumentsApp from '../Apps/MyDocumentsApp'
import NotepadApp from '../Apps/NotepadApp'
import InternetExplorerApp from '../Apps/InternetExplorerApp'
import GamesFolderApp from '../Apps/GamesFolderApp'
import ControlPanelApp from '../Apps/ControlPanelApp'
import MediaPlayerApp from '../Apps/MediaPlayerApp'
import SudokuApp from '../Apps/SudokuApp'

interface WindowState {
  id: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku'
  title: string
  icon: ReactNode
  component: ReactNode
  initialPos: { x: number; y: number }
  initialSize: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

export default function Desktop() {
  const navigate = useNavigate()
  const [isStartOpen, setIsStartOpen] = useState<boolean>(false)
  const [highestZ, setHighestZ] = useState<number>(20)
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  // Wallpaper state with localStorage persistence
  const [currentWallpaperUrl, setCurrentWallpaperUrl] = useState<string>(() => {
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('xp_current_wallpaper') : null
    const matched = savedId ? wallpapers.find((w) => w.id === savedId) : null
    return matched?.url || defaultWallpaper.url
  })

  const handleSetWallpaper = (url: string, id: string) => {
    setCurrentWallpaperUrl(url)
    if (typeof window !== 'undefined') {
      localStorage.setItem('xp_current_wallpaper', id)
    }
  }

  // Master Audio State
  const [masterVolume, setMasterVolume] = useState<number>(0.75)
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false)

  // Initial windows: Clean desktop with no windows open initially
  const [windows, setWindows] = useState<WindowState[]>([])

  // Bring a window to front
  const focusWindow = (id: string) => {
    setHighestZ((prev) => {
      const nextZ = prev + 1
      setWindows((wins) =>
        wins.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
      )
      return nextZ
    })
    setActiveWindowId(id)
  }

  // Open an app from Desktop Icon or Start Menu
  const handleOpenApp = (appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku') => {
    // Check if already open
    const existing = windows.find((w) => w.id === appId)
    if (existing) {
      focusWindow(appId)
      return
    }

    const nextZ = highestZ + 1
    setHighestZ(nextZ)
    setActiveWindowId(appId)

    let newWin: WindowState

    switch (appId) {
      case 'my-computer':
        newWin = {
          id: 'my-computer',
          title: 'My Computer',
          icon: <img src="/icons/my-computer.png" alt="" className="w-4 h-4 object-contain" />,
          component: <MyComputerApp onOpenApp={handleOpenApp} />,
          initialPos: { x: 140, y: 60 },
          initialSize: { width: 680, height: 460 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'my-documents':
        newWin = {
          id: 'my-documents',
          title: 'My Documents',
          icon: <img src="/icons/my-documents.png" alt="" className="w-4 h-4 object-contain" />,
          component: <MyDocumentsApp />,
          initialPos: { x: 200, y: 90 },
          initialSize: { width: 680, height: 450 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'notepad':
        newWin = {
          id: 'notepad',
          title: 'Untitled - Notepad',
          icon: <img src="/icons/notepad.png" alt="" className="w-4 h-4 object-contain" />,
          component: <NotepadApp />,
          initialPos: { x: 220, y: 80 },
          initialSize: { width: 600, height: 420 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'internet':
        newWin = {
          id: 'internet',
          title: 'Microsoft Internet Explorer',
          icon: <img src="/icons/internet-explorer.png" alt="" className="w-4 h-4 object-contain" />,
          component: <InternetExplorerApp />,
          initialPos: { x: 140, y: 40 },
          initialSize: { width: 800, height: 530 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'recycle-bin':
        newWin = {
          id: 'recycle-bin',
          title: 'Recycle Bin',
          icon: <img src="/icons/recycle-bin.png" alt="" className="w-4 h-4 object-contain" />,
          component: (
            <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-neutral-500 select-none">
              <img src="/icons/recycle-bin.png" alt="Recycle Bin" className="w-16 h-16 object-contain mb-3 drop-shadow-sm opacity-90" />
              <span className="text-sm font-semibold text-neutral-700">The Recycle Bin is empty.</span>
              <span className="text-xs text-neutral-400 mt-1">0 items</span>
            </div>
          ),
          initialPos: { x: 260, y: 110 },
          initialSize: { width: 500, height: 350 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'games':
        newWin = {
          id: 'games',
          title: 'Games',
          icon: <img src="/icons/games.png" alt="" className="w-4 h-4 object-contain" />,
          component: <GamesFolderApp onOpenApp={handleOpenApp} />,
          initialPos: { x: 220, y: 90 },
          initialSize: { width: 680, height: 460 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'control-panel':
        newWin = {
          id: 'control-panel',
          title: 'Control Panel',
          icon: <img src="/icons/control-panel.png" alt="" className="w-4 h-4 object-contain" />,
          component: (
            <ControlPanelApp
              currentWallpaperUrl={currentWallpaperUrl}
              onSelectWallpaper={handleSetWallpaper}
              volume={masterVolume}
              isMuted={isMasterMuted}
              onVolumeChange={setMasterVolume}
              onMuteChange={setIsMasterMuted}
            />
          ),
          initialPos: { x: 180, y: 70 },
          initialSize: { width: 720, height: 490 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'media-player':
        newWin = {
          id: 'media-player',
          title: 'Windows Media Player',
          icon: <img src="/icons/wmp.png" alt="" className="w-4 h-4 object-contain" />,
          component: <MediaPlayerApp />,
          initialPos: { x: 160, y: 50 },
          initialSize: { width: 780, height: 520 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break

      case 'sudoku':
        newWin = {
          id: 'sudoku',
          title: 'Sudoku - Windows XP Game',
          icon: <img src="/icons/sudoku.png" alt="" className="w-4 h-4 object-contain" />,
          component: <SudokuApp />,
          initialPos: { x: 260, y: 40 },
          initialSize: { width: 560, height: 620 },
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
        }
        break
    }

    setWindows((prev) => [...prev, newWin])
  }

  // Close window
  const handleClose = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  // Minimize window
  const handleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    )
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  // Toggle Maximize window
  const handleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    )
  }

  // Taskbar tab button click
  const handleTaskbarClick = (id: string) => {
    const target = windows.find((w) => w.id === id)
    if (!target) return

    if (target.isMinimized) {
      focusWindow(id)
    } else if (activeWindowId === id) {
      handleMinimize(id)
    } else {
      focusWindow(id)
    }
  }

  // Log off sends user to loading page choosing user (welcome screen)
  const handleLogOff = () => {
    navigate('/loading', { state: { phase: 'welcome' } })
  }

  // Turn off computer — goes directly to power off (welcome screen)
  const handleTurnOff = () => {
    navigate('/')
  }

  const taskbarWindowItems: TaskbarWindowItem[] = windows.map((w) => ({
    id: w.id,
    title: w.title,
    icon: w.icon,
    isMinimized: w.isMinimized,
  }))

  return (
    <div
      onClick={() => {
        if (isStartOpen) setIsStartOpen(false)
      }}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
    >
      {/* Desktop Wallpaper */}
      <DesktopWallpaper wallpaperUrl={currentWallpaperUrl} />

      {/* Desktop Icons */}
      <DesktopIcons onOpenApp={handleOpenApp} />

      {/* Render Open Windows */}
      {windows.map((win) => (
        <WindowFrame
          key={win.id}
          id={win.id}
          title={win.title}
          icon={win.icon}
          initialPos={win.initialPos}
          initialSize={win.initialSize}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          zIndex={win.zIndex}
          onClose={() => handleClose(win.id)}
          onMinimize={() => handleMinimize(win.id)}
          onMaximize={() => handleMaximize(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {win.id === 'control-panel' ? (
            <ControlPanelApp
              currentWallpaperUrl={currentWallpaperUrl}
              onSelectWallpaper={handleSetWallpaper}
              volume={masterVolume}
              isMuted={isMasterMuted}
              onVolumeChange={setMasterVolume}
              onMuteChange={setIsMasterMuted}
            />
          ) : win.id === 'media-player' ? (
            <MediaPlayerApp
              masterVolume={masterVolume}
              isMasterMuted={isMasterMuted}
              onPlayerVolumeChange={setMasterVolume}
              onIsPlayingChange={setIsMusicPlaying}
            />
          ) : (
            win.component
          )}
        </WindowFrame>
      ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenApp={handleOpenApp}
        onLogOff={handleLogOff}
        onRestart={() => navigate('/loading')}
        onTurnOff={handleTurnOff}
      />

      {/* Bottom Luna Taskbar */}
      <Taskbar
        isStartOpen={isStartOpen}
        onToggleStart={() => setIsStartOpen((prev) => !prev)}
        openWindows={taskbarWindowItems}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarClick}
        volume={masterVolume}
        onVolumeChange={setMasterVolume}
        isMuted={isMasterMuted}
        onToggleMute={() => setIsMasterMuted((m) => !m)}
        isMusicPlaying={isMusicPlaying}
      />
    </div>
  )
}