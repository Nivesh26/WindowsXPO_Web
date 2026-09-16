import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Shutdown() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'saving' | 'shutting-down' | 'safe-to-turn-off' | 'power-off'>('saving')
  const [fadeBlack, setFadeBlack] = useState(false)
  const soundPlayedRef = useRef(false)

  // Synthesize authentic Windows XP Shutdown Chords
  const playShutdownSound = () => {
    if (soundPlayedRef.current) return
    soundPlayedRef.current = true

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()

      // Windows XP Shutdown Jingle descending chord notes:
      // G#4 (415.3Hz), D#4 (311.1Hz), G#3 (207.65Hz), D#3 (155.56Hz)
      const chords = [
        { freq: 415.3, time: 0.0, dur: 0.6 },
        { freq: 311.13, time: 0.35, dur: 0.7 },
        { freq: 207.65, time: 0.75, dur: 0.9 },
        { freq: 155.56, time: 1.15, dur: 1.4 },
      ]

      const now = ctx.currentTime
      chords.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + time)

        // Warm harmonic overtone
        const overtone = ctx.createOscillator()
        const overtoneGain = ctx.createGain()
        overtone.type = 'triangle'
        overtone.frequency.setValueAtTime(freq * 2, now + time)

        gain.gain.setValueAtTime(0, now + time)
        gain.gain.linearRampToValueAtTime(0.22, now + time + 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur)

        overtoneGain.gain.setValueAtTime(0, now + time)
        overtoneGain.gain.linearRampToValueAtTime(0.08, now + time + 0.05)
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur * 0.7)

        osc.connect(gain)
        gain.connect(ctx.destination)
        overtone.connect(overtoneGain)
        overtoneGain.connect(ctx.destination)

        osc.start(now + time)
        osc.stop(now + time + dur)
        overtone.start(now + time)
        overtone.stop(now + time + dur)
      })
    } catch {
      // Audio autoplay policy fallback
    }
  }

  useEffect(() => {
    // Play shutdown chime
    playShutdownSound()

    // Timeline of shutdown phases
    const t1 = setTimeout(() => {
      setPhase('shutting-down')
    }, 1800)

    const t2 = setTimeout(() => {
      setPhase('safe-to-turn-off')
    }, 4600)

    const t3 = setTimeout(() => {
      setFadeBlack(true)
    }, 6800)

    const t4 = setTimeout(() => {
      navigate('/')
    }, 7500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [navigate])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none font-sans"
      style={{
        background:
          phase === 'safe-to-turn-off'
            ? '#000000'
            : 'radial-gradient(ellipse at 50% 38%, #1f50a8 0%, #0d2f78 45%, #05143a 100%)',
        transition: 'background 0.8s ease-in-out',
      }}
    >
      {/* Top XP Header Bar */}
      {phase !== 'safe-to-turn-off' && (
        <div className="w-full h-14 bg-gradient-to-b from-[#002573] to-transparent flex items-center px-8 border-b border-[#2d5db3]/30">
          <div className="flex items-center gap-2">
            <img src="/windows-xp.png" alt="Windows XP" className="w-5 h-5 object-contain" />
            <span className="text-white/80 text-sm font-semibold tracking-wide">
              Windows<span className="text-sky-300 ml-1 font-bold">XP</span>
            </span>
          </div>
        </div>
      )}

      {/* Center Stage Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {phase === 'safe-to-turn-off' ? (
          /* Classic "It is now safe to turn off your computer" Retro Screen */
          <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
            <h1
              className="text-2xl sm:text-4xl font-bold tracking-widest text-[#ff7700] drop-shadow-[0_0_15px_rgba(255,119,0,0.6)]"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              It is now safe to turn off your computer.
            </h1>
            <p className="text-neutral-500 text-xs tracking-wider">
              Powering down...
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white rounded text-xs cursor-pointer shadow-sm transition-colors"
            >
              Power Off Immediately
            </button>
          </div>
        ) : (
          /* Windows XP Luna Shutdown Animation */
          <div className="flex flex-col items-center gap-6 max-w-md w-full animate-fade-in">
            {/* Windows XP Logo Brand */}
            <div className="flex items-center gap-4">
              <img
                src="/windows-xp.png"
                alt="Windows XP"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
              />
              <div className="text-white text-left">
                <div className="text-2xl sm:text-3xl font-light tracking-wide drop-shadow-md">
                  Microsoft<sup className="text-xs">®</sup>
                </div>
                <div className="text-3xl sm:text-4xl font-bold tracking-wider leading-none drop-shadow-md flex items-baseline gap-2">
                  <span>Windows</span>
                  <span className="text-sky-300 text-2xl tracking-[0.25em]">XP</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center space-y-1 mt-3">
              <div className="text-white text-base sm:text-lg font-medium drop-shadow">
                {phase === 'saving' ? 'Saving your settings...' : 'Windows is shutting down...'}
              </div>
              <div className="text-sky-200 text-xs sm:text-sm font-light">
                Please wait while Windows closes programs and saves data
              </div>
            </div>

            {/* Windows XP Chaser Progress Bar */}
            <div className="w-64 sm:w-72 h-4 bg-[#07173e] rounded-sm border-2 border-[#3b6ec2] p-0.5 overflow-hidden shadow-inner relative">
              <div className="w-full h-full relative overflow-hidden bg-[#0a2055] rounded-xs">
                {/* 3 XP animated blue chaser blocks */}
                <div className="absolute inset-y-0 flex gap-1 animate-xp-marquee">
                  <div className="w-3 h-full bg-gradient-to-r from-[#4d97ff] via-[#85bdff] to-[#4d97ff] rounded-xs shadow-[0_0_6px_#60a5fa]" />
                  <div className="w-3 h-full bg-gradient-to-r from-[#4d97ff] via-[#85bdff] to-[#4d97ff] rounded-xs shadow-[0_0_6px_#60a5fa]" />
                  <div className="w-3 h-full bg-gradient-to-r from-[#4d97ff] via-[#85bdff] to-[#4d97ff] rounded-xs shadow-[0_0_6px_#60a5fa]" />
                </div>
              </div>
            </div>

            {/* Quick Skip button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[11px] text-sky-300 hover:text-white underline cursor-pointer mt-4"
            >
              Skip animation
            </button>
          </div>
        )}
      </div>

      {/* Bottom XP Footer Bar */}
      {phase !== 'safe-to-turn-off' && (
        <div className="w-full h-12 bg-gradient-to-t from-[#00174a] to-transparent flex items-center justify-between px-8 text-sky-200 text-xs border-t border-[#2d5db3]/20">
          <span>Microsoft Corporation</span>
          <span className="text-[10px] text-sky-400">Windows XP Professional</span>
        </div>
      )}

      {/* CRT Off / Fade to Black Overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-700 ${
          fadeBlack ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Keyframe animation styling for XP chaser bar */}
      <style>{`
        @keyframes xpMarquee {
          0% {
            transform: translateX(-50px);
          }
          100% {
            transform: translateX(290px);
          }
        }
        .animate-xp-marquee {
          animation: xpMarquee 1.6s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
