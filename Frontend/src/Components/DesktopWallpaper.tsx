import blissWallpaper from '../assets/wp9324707-4k-windows-xp-wallpapers.jpg'

export default function DesktopWallpaper() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0055ea]">
      <img
        src={blissWallpaper}
        alt="Windows XP Bliss Wallpaper"
        className="w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
    </div>
  )
}
