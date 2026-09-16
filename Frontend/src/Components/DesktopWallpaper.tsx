import { wallpapers, defaultWallpaper } from '../Wallpaper'

interface DesktopWallpaperProps {
  wallpaperUrl?: string
}

export default function DesktopWallpaper({ wallpaperUrl }: DesktopWallpaperProps) {
  const savedWallpaperId = typeof window !== 'undefined' ? localStorage.getItem('xp_current_wallpaper') : null
  const matched = savedWallpaperId ? wallpapers.find((w) => w.id === savedWallpaperId) : null
  const activeUrl = wallpaperUrl || matched?.url || defaultWallpaper.url

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0055ea]">
      <img
        src={activeUrl}
        alt="Windows XP Wallpaper"
        className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
        draggable={false}
      />
    </div>
  )
}
