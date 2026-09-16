import { useState, type ReactNode } from 'react'

export interface DesktopIconItem {
  id: string
  title: string
  appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player'
  icon: ReactNode
}

interface DesktopIconsProps {
  onOpenApp: (appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player') => void
}

export default function DesktopIcons({ onOpenApp }: DesktopIconsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const icons: DesktopIconItem[] = [
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      appId: 'recycle-bin',
      icon: (
        <img
          src="/icons/recycle-bin.png"
          alt="Recycle Bin"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'games',
      title: 'Games',
      appId: 'games',
      icon: (
        <img
          src="/icons/games.png"
          alt="Games"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'my-computer',
      title: 'My Computer',
      appId: 'my-computer',
      icon: (
        <img
          src="/icons/my-computer.png"
          alt="My Computer"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'notepad',
      title: 'Notepad',
      appId: 'notepad',
      icon: (
        <img
          src="/icons/notepad.png"
          alt="Notepad"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'internet',
      title: 'Internet Explorer',
      appId: 'internet',
      icon: (
        <img
          src="/icons/internet-explorer.png"
          alt="Internet Explorer"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'control-panel',
      title: 'Control Panel',
      appId: 'control-panel',
      icon: (
        <img
          src="/icons/control-panel.png"
          alt="Control Panel"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
    {
      id: 'media-player',
      title: 'Windows Media Player',
      appId: 'media-player',
      icon: (
        <img
          src="/icons/wmp.png"
          alt="Windows Media Player"
          className="w-12 h-12 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      ),
    },
  ]

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-4 z-10 select-none">
      {icons.map((item) => {
        const isSelected = selectedId === item.id

        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedId(item.id)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              onOpenApp(item.appId)
            }}
            className={`w-[78px] flex flex-col items-center p-1.5 rounded-xs cursor-pointer group transition-colors ${
              isSelected
                ? 'bg-[#0b61ff]/40 border border-[#0b61ff]/80 shadow-[inset_0_0_4px_rgba(255,255,255,0.4)]'
                : 'hover:bg-white/10 hover:border hover:border-white/20 border border-transparent'
            }`}
          >
            <div className="transition-transform group-hover:scale-105">{item.icon}</div>
            <span
              className={`mt-1.5 text-[11px] font-sans text-center text-white leading-tight px-1 rounded-xs tracking-tight ${
                isSelected
                  ? 'bg-[#0b61ff] shadow-sm'
                  : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]'
              }`}
            >
              {item.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
