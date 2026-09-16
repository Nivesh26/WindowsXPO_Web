import bliss from './wp9324707-4k-windows-xp-wallpapers.jpg'
import autumn from './Autumn.jpg'
import redDesert from './Red_Desert.jpg'
import stonehenge from './Stonehenge.jpg'
import winXpRetro from './Windows_XP_Retro.jpg'

export interface WallpaperItem {
  id: string
  name: string
  url: string
}

export const wallpapers: WallpaperItem[] = [
  { id: 'bliss', name: 'Bliss (Default)', url: bliss },
  { id: 'autumn', name: 'Autumn', url: autumn },
  { id: 'red-desert', name: 'Red Desert', url: redDesert },
  { id: 'stonehenge', name: 'Stonehenge', url: stonehenge },
  { id: 'windows-xp-retro', name: 'Windows XP Retro', url: winXpRetro },
]

export const defaultWallpaper = wallpapers[0]
