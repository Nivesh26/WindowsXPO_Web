import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Restart = () => {
  const navigate = useNavigate()
  const [restarting, setRestarting] = useState(false)
  const [countdown, setCountdown] = useState(3)

  // Trigger the restart sequence
  const handleRestart = () => {
    setRestarting(true)
  }

  // Countdown then navigate to loading page
  useEffect(() => {
    if (!restarting) return
    if (countdown === 0) {
      navigate('/loading')
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [restarting, countdown, navigate])

  return (
    <div
      className="w-full h-screen overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #1a3a7c 0%, #0f2660 40%, #071640 100%)',
        fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
      }}
    >
      {restarting ? (
        /* Restarting animation screen */
        <div className="flex flex-col items-center gap-8 select-none">
          {/* Windows XP logo */}
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-1.5 w-14 h-14">
              <div className="bg-red-500 rounded-sm shadow-lg" />
              <div className="bg-emerald-500 rounded-sm shadow-lg" />
              <div className="bg-blue-500 rounded-sm shadow-lg" />
              <div className="bg-yellow-400 rounded-sm shadow-lg" />
            </div>
            <div className="text-white">
              <div className="text-3xl font-light tracking-widest">Windows</div>
              <div className="text-sm font-bold tracking-[0.4em] text-sky-200 uppercase">XP</div>
            </div>
          </div>

          <div className="text-white text-center space-y-3">
            <p className="text-xl font-semibold">Please wait...</p>
            <p className="text-sm text-sky-200">Windows is restarting</p>
          </div>

          {/* XP-style progress bar */}
          <div className="w-72 h-3 bg-[#0a1a4a] rounded-full border border-[#2a4a9a] overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full"
              style={{
                width: `${((3 - countdown) / 3) * 100}%`,
                background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
                transition: 'width 0.9s linear',
                boxShadow: '0 0 12px #00d2ff88',
              }}
            />
          </div>

          <p className="text-sky-300 text-xs animate-pulse">
            Restarting in {countdown}...
          </p>
        </div>
      ) : (
        /* Windows XP Turn Off Computer dialog */
        <div className="flex flex-col items-center gap-8 select-none">

          {/* Outer XP dialog chrome */}
          <div
            className="rounded-lg overflow-hidden shadow-2xl border border-[#6a8fc4]"
            style={{ width: 380, background: 'linear-gradient(180deg, #1c5fba 0%, #0e3d8a 100%)' }}
          >
            {/* Title Bar */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{
                background: 'linear-gradient(90deg, #1569d4 0%, #0f52b6 50%, #1d4da0 100%)',
              }}
            >
              <img src="/icons/my-computer.png" alt="" className="w-4 h-4 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <span className="text-white font-bold text-sm tracking-wide flex-1">Turn off computer</span>
              <button
                type="button"
                onClick={() => navigate('/desktop')}
                className="w-5 h-5 bg-red-500 hover:bg-red-400 rounded-sm text-white text-xs font-black flex items-center justify-center cursor-pointer shadow-sm"
              >
                ✕
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-6 flex flex-col items-center gap-6">
              {/* Windows XP logo */}
              <div className="flex items-center gap-2 mb-1">
                <div className="grid grid-cols-2 gap-1 w-8 h-8">
                  <div className="bg-red-500 rounded-[2px]" />
                  <div className="bg-emerald-400 rounded-[2px]" />
                  <div className="bg-blue-400 rounded-[2px]" />
                  <div className="bg-yellow-300 rounded-[2px]" />
                </div>
                <span className="text-white font-light text-xl tracking-widest">Windows<span className="font-bold text-sky-200 ml-2 text-sm tracking-[0.3em]">XP</span></span>
              </div>

              <p className="text-sky-100 text-sm text-center leading-relaxed">
                What do you want the computer to do?
              </p>

              {/* Three action buttons */}
              <div className="flex gap-5 justify-center">
                {/* Stand By */}
                <button
                  type="button"
                  onClick={() => navigate('/desktop')}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ffd700] to-[#e6a800] border-2 border-[#ffd700]/60 shadow-lg group-hover:brightness-110 group-hover:scale-105 transition-all flex items-center justify-center">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <span className="text-white text-xs font-semibold text-center leading-tight">Stand By</span>
                </button>

                {/* Restart — main action */}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#4da6ff] to-[#0055d4] border-[3px] border-[#7ac0ff]/70 shadow-xl group-hover:brightness-125 group-hover:scale-110 transition-all flex items-center justify-center ring-4 ring-[#4da6ff]/30">
                    <span className="text-4xl">🔄</span>
                  </div>
                  <span className="text-white text-sm font-bold text-center leading-tight drop-shadow">Restart</span>
                </button>

                {/* Turn Off */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ff5555] to-[#c00] border-2 border-[#ff7777]/60 shadow-lg group-hover:brightness-110 group-hover:scale-105 transition-all flex items-center justify-center">
                    <span className="text-3xl">⏻</span>
                  </div>
                  <span className="text-white text-xs font-semibold text-center leading-tight">Turn Off</span>
                </button>
              </div>

              {/* Cancel button */}
              <button
                type="button"
                onClick={() => navigate('/desktop')}
                className="mt-1 px-10 py-1.5 bg-[#ece9d8] hover:bg-white border border-[#7f9db9] rounded-xs text-neutral-800 text-xs font-semibold shadow-md cursor-pointer active:shadow-inner"
              >
                Cancel
              </button>
            </div>
          </div>


        </div>
      )}
    </div>
  )
}

export default Restart
