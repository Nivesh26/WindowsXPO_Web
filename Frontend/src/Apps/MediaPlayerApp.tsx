import { useState, useRef, useEffect } from 'react'

export interface SongTrack {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  src: string
  fallbackSrc: string
}

const TRACKS: SongTrack[] = [
  {
    id: 'wish-you-were-here',
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    album: 'Wish You Were Here (1975)',
    duration: '5:34',
    src: '/music/wish-you-were-here.mp3',
    fallbackSrc: 'https://archive.org/download/PinkFloydHighHopesOfficialMusicVideo_201711/Pink%20Floyd%20-%20Wish%20You%20Were%20Here.mp3',
  },
  {
    id: 'knockin-on-heavens-door',
    title: "Knockin' on Heaven's Door",
    artist: "Guns N' Roses",
    album: 'Use Your Illusion II (1991)',
    duration: '5:36',
    src: '/music/knockin-on-heavens-door.mp3',
    fallbackSrc: 'https://archive.org/download/gnr-knockin-on-heaven-s-door/GNR%20-%20Knockin_%27%20On%20Heaven_%27s%20Door.mp3',
  },
  {
    id: 'sweet-child-o-mine',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: 'Appetite for Destruction (1987)',
    duration: '5:56',
    src: '/music/sweet-child-o-mine.mp3',
    fallbackSrc: 'https://archive.org/download/chisdealhd_audio_dump_01/Guns%20N%27%20Roses%20-%20Sweet%20Child%20O%27%20Mine.mp3',
  },
  {
    id: 'snow-hey-oh',
    title: 'Snow (Hey Oh)',
    artist: 'Red Hot Chili Peppers',
    album: 'Stadium Arcadium (2006)',
    duration: '5:34',
    src: '/music/snow-hey-oh.mp3',
    fallbackSrc: 'https://archive.org/download/red-hot-chili-peppers-snow-hey-oh/Red%20Hot%20Chili%20Peppers%20-%20Snow%20%28Hey%20Oh%29.mp3',
  },
  {
    id: 'mind-of-a-stoner',
    title: 'Mind of a Stoner',
    artist: 'Machine Gun Kelly ft. Wiz Khalifa',
    album: 'Black Flag (2013)',
    duration: '3:10',
    src: '/music/mind-of-a-stoner.mp3',
    fallbackSrc: 'https://archive.org/download/Machine_Gun_Kelly_-_Black_Flag-2013/05%20Machine%20Gun%20Kelly%20-%20Mind%20Of%20A%20Stoner%20%28Feat.%20Wiz%20Khalifa%29%20%5BProd.%20By%20Dre%24ki%20%26%20Brian%20Empire%5D.mp3',
  },
]

type VisualizerPreset = 'bars' | 'fire' | 'neon'

export default function MediaPlayerApp() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'now-playing' | 'media-guide' | 'library'>('now-playing')
  const [visPreset, setVisPreset] = useState<VisualizerPreset>('bars')
  const [useFallback, setUseFallback] = useState<Record<string, boolean>>({})

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const peakHeightsRef = useRef<number[]>([])

  const currentTrack = TRACKS[currentTrackIndex]

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error, trying fallback:', err)
          setUseFallback((prev) => ({ ...prev, [currentTrack.id]: true }))
        })
    }
  }

  // Play specific track
  const playTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setCurrentTime(0)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.warn('Play error:', e))
      }
    }, 50)
  }

  // Stop playback
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // Next Track
  const nextTrack = () => {
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * TRACKS.length)
      playTrack(nextIdx)
    } else {
      const nextIdx = (currentTrackIndex + 1) % TRACKS.length
      playTrack(nextIdx)
    }
  }

  // Previous Track
  const prevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
      setCurrentTime(0)
    } else {
      const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length
      playTrack(prevIdx)
    }
  }

  // Handle track finished
  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    } else {
      nextTrack()
    }
  }

  // Handle Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
    }
    if (val > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle Mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  // Cycle Visualizer Preset
  const cycleVisPreset = (direction: 'prev' | 'next') => {
    const presets: VisualizerPreset[] = ['bars', 'fire', 'neon']
    const curIdx = presets.indexOf(visPreset)
    if (direction === 'next') {
      setVisPreset(presets[(curIdx + 1) % presets.length])
    } else {
      setVisPreset(presets[(curIdx - 1 + presets.length) % presets.length])
    }
  }

  // Time Formatter
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Canvas Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let phase = 0
    const numBars = 36
    if (peakHeightsRef.current.length !== numBars) {
      peakHeightsRef.current = new Array(numBars).fill(0)
    }

    const render = () => {
      phase += 0.05
      const width = canvas.width
      const height = canvas.height

      // Dark background with subtle blue vignette
      ctx.fillStyle = '#050a14'
      ctx.fillRect(0, 0, width, height)

      // Background grid lines (XP Media Player CRT style)
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.12)'
      ctx.lineWidth = 1
      for (let y = 15; y < height; y += 15) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      if (visPreset === 'bars') {
        // Authentic WMP Bars & Waves: Ocean Spectrum
        const barWidth = Math.floor((width - 40) / numBars) - 2
        const startX = 20

        for (let i = 0; i < numBars; i++) {
          let targetH = 0
          if (isPlaying) {
            const freq = Math.sin(phase * 2 + i * 0.35) * Math.cos(phase * 1.2 + i * 0.15)
            const pulse = Math.abs(freq)
            const midBoost = Math.sin((i / numBars) * Math.PI)
            targetH = Math.max(6, pulse * (height - 35) * (0.4 + midBoost * 0.75))
          } else {
            targetH = 4
          }

          // Peak fall-off logic
          if (targetH > peakHeightsRef.current[i]) {
            peakHeightsRef.current[i] = targetH
          } else {
            peakHeightsRef.current[i] = Math.max(0, peakHeightsRef.current[i] - 1.2)
          }

          const x = startX + i * (barWidth + 2)
          const barH = targetH
          const y = height - 15 - barH

          // Bar Gradient: Green to Yellow to Cyan/Blue
          const grad = ctx.createLinearGradient(0, height - 15, 0, height - 15 - (height - 35))
          grad.addColorStop(0, '#00d2ff')
          grad.addColorStop(0.35, '#00ff87')
          grad.addColorStop(0.7, '#f7df1e')
          grad.addColorStop(1, '#ff0055')

          ctx.fillStyle = grad
          ctx.fillRect(x, y, barWidth, barH)

          // Peak cap (floating yellow/cyan line like WMP 9)
          const peakY = height - 15 - peakHeightsRef.current[i]
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x, peakY, barWidth, 2)
        }
      } else if (visPreset === 'fire') {
        // Ambience: Fire / Solar Flare
        const barWidth = Math.floor((width - 30) / numBars) - 1
        const startX = 15

        for (let i = 0; i < numBars; i++) {
          const intensity = isPlaying
            ? Math.abs(Math.sin(phase * 3 + i * 0.4) * Math.cos(phase * 1.5 + i * 0.2)) * (height - 40)
            : 6

          const x = startX + i * (barWidth + 1)
          const y = height - 15 - intensity

          const grad = ctx.createLinearGradient(0, height - 15, 0, y)
          grad.addColorStop(0, '#7f1d1d')
          grad.addColorStop(0.4, '#ea580c')
          grad.addColorStop(0.8, '#facc15')
          grad.addColorStop(1, '#ffffff')

          ctx.fillStyle = grad
          ctx.fillRect(x, y, barWidth, intensity)
        }
      } else {
        // Neon Oscilloscope / Waveform
        ctx.beginPath()
        ctx.lineWidth = 2.5
        ctx.strokeStyle = '#38bdf8'
        ctx.shadowColor = '#0284c7'
        ctx.shadowBlur = 10

        const sliceWidth = width / 60
        let x = 0

        for (let i = 0; i < 60; i++) {
          const v = isPlaying ? Math.sin(phase * 4 + i * 0.3) * Math.cos(phase * 2 + i * 0.1) : 0
          const y = height / 2 + v * 40

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, visPreset])

  // Current audio source URL (with local or fallback)
  const currentSrc = useFallback[currentTrack.id] ? currentTrack.fallbackSrc : currentTrack.src

  return (
    <div className="flex flex-col h-full w-full bg-[#0a1120] text-slate-200 select-none font-sans overflow-hidden">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentSrc}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0)
          }
        }}
        onEnded={handleEnded}
        onError={() => {
          console.warn('Audio failed to load, switching to fallback URL:', currentTrack.title)
          setUseFallback((prev) => ({ ...prev, [currentTrack.id]: true }))
        }}
      />

      {/* Top XP Classic Menu Bar */}
      <div className="h-6 bg-[#233554] border-b border-[#0f1d33] flex items-center justify-between px-2 text-[11px] text-slate-300 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <span className="hover:bg-[#3b82f6]/30 px-1.5 py-0.5 rounded cursor-pointer">File</span>
          <span className="hover:bg-[#3b82f6]/30 px-1.5 py-0.5 rounded cursor-pointer">View</span>
          <span className="hover:bg-[#3b82f6]/30 px-1.5 py-0.5 rounded cursor-pointer">Play</span>
          <span className="hover:bg-[#3b82f6]/30 px-1.5 py-0.5 rounded cursor-pointer">Tools</span>
          <span className="hover:bg-[#3b82f6]/30 px-1.5 py-0.5 rounded cursor-pointer">Help</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-400">
          <img src="/icons/wmp.png" alt="WMP" className="w-3.5 h-3.5 object-contain" />
          <span>Windows Media Player 10</span>
        </div>
      </div>

      {/* Middle Body: Left Tabs + Center/Right Work Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Authentic Left Navigation Bar */}
        <div className="w-[105px] sm:w-[115px] bg-gradient-to-b from-[#1b2b46] via-[#15233a] to-[#0c1524] border-r border-[#0d1b30] flex flex-col p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('now-playing')}
            className={`w-full text-left px-2 py-2 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'now-playing'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-md border-l-2 border-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            Now Playing
          </button>

          <button
            onClick={() => setActiveTab('media-guide')}
            className={`w-full text-left px-2 py-2 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'media-guide'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-md border-l-2 border-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Media Guide
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full text-left px-2 py-2 rounded text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white shadow-md border-l-2 border-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Media Library
          </button>

          <div className="my-1 border-t border-slate-700/50" />

          {/* Preset Buttons for CD/Radio */}
          <div className="px-2 py-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Features</div>
          <div className="px-2 py-1 text-[11px] text-slate-500 cursor-not-allowed flex items-center gap-1">
            <span>💿</span> Rip Audio CD
          </div>
          <div className="px-2 py-1 text-[11px] text-slate-500 cursor-not-allowed flex items-center gap-1">
            <span>🔥</span> Burn Disc
          </div>
          <div className="px-2 py-1 text-[11px] text-slate-500 cursor-not-allowed flex items-center gap-1">
            <span>📻</span> Radio Tuner
          </div>

          <div className="mt-auto p-2 bg-[#09111c]/80 rounded border border-slate-800/80 text-[10px] text-slate-400">
            <div className="font-bold text-sky-400">Audio Info</div>
            <div>Bitrate: 192 Kbps</div>
            <div>Format: MP3 Audio</div>
            <div className="text-[9px] text-slate-500 truncate">Channels: Stereo</div>
          </div>
        </div>

        {/* Center/Right Content Area */}
        {activeTab === 'now-playing' && (
          <div className="flex-1 flex flex-col md:flex-row min-w-0 bg-[#080d19]">
            {/* Visualizer & Now Playing Display */}
            <div className="flex-1 flex flex-col min-w-0 p-3 border-r border-slate-800/60">
              {/* Song Header Info */}
              <div className="flex items-center justify-between mb-2 bg-[#121c2e] p-2.5 rounded border border-slate-700/40 shadow-inner">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-lg shadow shrink-0">
                    🎵
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate drop-shadow">
                      {currentTrack.title}
                    </div>
                    <div className="text-xs text-sky-300 truncate">
                      {currentTrack.artist} — <span className="text-slate-400">{currentTrack.album}</span>
                    </div>
                  </div>
                </div>

                {/* Visualizer Switcher Controls */}
                <div className="flex items-center gap-1 shrink-0 bg-[#0c1422] px-2 py-1 rounded border border-slate-800">
                  <button
                    onClick={() => cycleVisPreset('prev')}
                    title="Previous Visualization"
                    className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >
                    ◀
                  </button>
                  <span className="text-[10px] text-slate-300 font-mono px-1">
                    {visPreset === 'bars' ? 'Ocean Spectrum' : visPreset === 'fire' ? 'Solar Ambience' : 'Oscilloscope'}
                  </span>
                  <button
                    onClick={() => cycleVisPreset('next')}
                    title="Next Visualization"
                    className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Canvas Visualizer Screen */}
              <div className="flex-1 relative bg-black rounded-lg overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center min-h-[160px]">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={240}
                  className="w-full h-full object-cover block"
                />

                {/* Overlaid Player Watermark & Visualizer Overlay */}
                <div className="absolute top-2 left-3 pointer-events-none flex items-center gap-1.5 opacity-60">
                  <span className="text-[11px] font-bold text-sky-400 font-mono tracking-wide">
                    {visPreset === 'bars' ? 'BARS & WAVES' : visPreset === 'fire' ? 'AMBIENCE' : 'OSCILLOSCOPE'}
                  </span>
                </div>

                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                    <button
                      onClick={togglePlay}
                      className="pointer-events-auto w-14 h-14 rounded-full bg-sky-600/80 hover:bg-sky-500 flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-transform hover:scale-105"
                    >
                      ▶
                    </button>
                    <span className="text-xs mt-2 text-slate-300 font-medium">Click to Play</span>
                  </div>
                )}
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="w-full md:w-[240px] lg:w-[260px] bg-[#0c1524] flex flex-col border-t md:border-t-0 md:border-l border-slate-800 shrink-0">
              {/* Playlist Header */}
              <div className="p-2.5 bg-[#142136] border-b border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Now Playing List</span>
                  <span className="text-[10px] text-slate-400">5 items • 25:50 Total Time</span>
                </div>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                  Windows XP
                </span>
              </div>

              {/* Tracks List */}
              <div className="flex-1 overflow-y-auto p-1 divide-y divide-slate-800/40">
                {TRACKS.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex
                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(idx)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs transition-colors group ${
                        isCurrent
                          ? 'bg-[#1b3a6b] text-white font-semibold shadow-sm border border-sky-600/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Play state indicator */}
                        <div className="w-5 text-center shrink-0">
                          {isCurrent ? (
                            isPlaying ? (
                              <span className="text-emerald-400 text-xs animate-pulse">🔊</span>
                            ) : (
                              <span className="text-sky-400 text-xs">❚❚</span>
                            )
                          ) : (
                            <span className="text-slate-500 group-hover:text-slate-300 text-[11px]">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className={`truncate ${isCurrent ? 'text-white' : 'group-hover:text-white'}`}>
                            {track.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {track.artist}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 ml-2 font-mono shrink-0">
                        {track.duration}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Media Guide View */}
        {activeTab === 'media-guide' && (
          <div className="flex-1 p-6 bg-[#080d19] overflow-y-auto">
            <div className="max-w-xl mx-auto bg-[#121c2e] p-6 rounded-lg border border-slate-800 text-center">
              <img src="/icons/wmp.png" alt="WMP" className="w-16 h-16 mx-auto mb-3 object-contain" />
              <h2 className="text-lg font-bold text-white mb-1">Windows Media Guide</h2>
              <p className="text-xs text-slate-400 mb-4">
                Discover the best digital music, radio broadcasts, and artist showcases for Windows XP.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-slate-800/60 rounded border border-slate-700/50">
                  <div className="text-xs font-bold text-sky-400">Classic Rock Legends</div>
                  <div className="text-[11px] text-slate-300 mt-1">Pink Floyd, Guns N' Roses, Red Hot Chili Peppers</div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded border border-slate-700/50">
                  <div className="text-xs font-bold text-sky-400">Hip Hop & Modern</div>
                  <div className="text-[11px] text-slate-300 mt-1">Machine Gun Kelly, Wiz Khalifa</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Library View */}
        {activeTab === 'library' && (
          <div className="flex-1 p-4 bg-[#080d19] overflow-y-auto">
            <div className="mb-3 text-xs text-slate-400">All Music (5 Songs Available)</div>
            <div className="border border-slate-800 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142136] text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Artist</th>
                    <th className="p-2">Album</th>
                    <th className="p-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {TRACKS.map((t, idx) => (
                    <tr
                      key={t.id}
                      onClick={() => {
                        setActiveTab('now-playing')
                        playTrack(idx)
                      }}
                      className="hover:bg-slate-800 cursor-pointer"
                    >
                      <td className="p-2 text-white font-medium">{t.title}</td>
                      <td className="p-2 text-slate-400">{t.artist}</td>
                      <td className="p-2 text-slate-400">{t.album}</td>
                      <td className="p-2 text-slate-400 font-mono">{t.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Transport Console (Authentic XP Rounded Metallic Bar) */}
      <div className="h-[76px] bg-gradient-to-b from-[#1c2e4c] via-[#142239] to-[#0c1626] border-t-2 border-[#2b446e] px-4 flex flex-col justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] shrink-0">
        {/* Seekbar and Timers */}
        <div className="flex items-center gap-3 w-full mb-1.5">
          <span className="text-[11px] font-mono text-slate-300 shrink-0 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          {/* XP Glossy Seek Slider */}
          <div className="flex-1 relative flex items-center group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#08101a] rounded-lg appearance-none cursor-pointer accent-sky-400 hover:accent-sky-300 border border-slate-700/60"
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Playback Buttons & Volume Bar */}
        <div className="flex items-center justify-between">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Track */}
            <button
              onClick={prevTrack}
              title="Previous Track"
              className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 border border-slate-500 text-white flex items-center justify-center text-xs shadow transition-all active:scale-95"
            >
              ⏮
            </button>

            {/* Stop */}
            <button
              onClick={stopPlayback}
              title="Stop"
              className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 border border-slate-500 text-white flex items-center justify-center text-[10px] shadow transition-all active:scale-95"
            >
              ⏹
            </button>

            {/* Main Round Play / Pause Button (The Iconic WMP 10 Center Button) */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full bg-gradient-to-b from-sky-400 via-sky-600 to-blue-800 hover:from-sky-300 hover:to-blue-700 border-2 border-white/80 text-white flex items-center justify-center text-sm shadow-[0_2px_8px_rgba(2,132,199,0.7)] transition-all active:scale-90"
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              title="Next Track"
              className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 border border-slate-500 text-white flex items-center justify-center text-xs shadow transition-all active:scale-95"
            >
              ⏭
            </button>

            {/* Shuffle Button */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              title={isShuffle ? 'Shuffle: On' : 'Shuffle: Off'}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ml-2 ${
                isShuffle
                  ? 'bg-sky-600 text-white border-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              🔀 Shuffle
            </button>

            {/* Repeat Button */}
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              title={isRepeat ? 'Repeat: On' : 'Repeat: Off'}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                isRepeat
                  ? 'bg-sky-600 text-white border-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              🔁 Repeat
            </button>
          </div>

          {/* Right: Volume & Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="text-sm hover:scale-110 transition-transform text-slate-300"
            >
              {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-[#08101a] rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-700/60"
            />
            <span className="text-[10px] text-slate-400 font-mono w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
