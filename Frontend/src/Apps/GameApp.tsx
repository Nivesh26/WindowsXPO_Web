import { useState } from 'react'

export default function GameApp() {
  const [progress, setProgress] = useState(42)

  return (
    <div className="flex-1 bg-[#ece9d8] text-neutral-800 font-sans flex flex-col justify-between p-4 select-none">
      {/* Top Banner with Hazard Stripes */}
      <div className="h-6 w-full bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_12px,#1f2937_12px,#1f2937_24px)] rounded-xs shadow-xs" />

      {/* Center Body */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-6 px-4">
        {/* Animated Construction Visual */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-500 rounded-lg flex items-center justify-center shadow-md shrink-0">
          <span className="text-5xl animate-bounce [animation-duration:1.5s]">🚧</span>
          <span className="absolute -top-2 -right-2 text-2xl animate-spin [animation-duration:6s]">⚙️</span>
          <span className="absolute -bottom-1 -left-2 text-2xl">⚠️</span>
        </div>

        {/* Construction Details */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-base font-black text-amber-900 tracking-wide flex items-center justify-center sm:justify-start gap-2">
            <span>⚠️</span> UNDER CONSTRUCTION
          </h2>
          <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
            The Windows XP retro gaming engine (<strong>3D Pinball: Space Cadet</strong> &amp; <strong>Minesweeper</strong>) is currently being assembled by our vintage software engineers.
          </p>
          <div className="mt-3 bg-white p-2.5 rounded border border-neutral-300 text-[11px] text-neutral-600 shadow-inner">
            <div className="flex justify-between font-semibold mb-1 text-neutral-800">
              <span>Assembly Progress:</span>
              <span className="font-mono text-amber-700">{progress}%</span>
            </div>
            {/* XP Classic Progress Bar */}
            <div className="w-full h-4 bg-neutral-200 border border-neutral-400 rounded-xs overflow-hidden p-0.5 relative">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-xs transition-all duration-300 flex items-center justify-end pr-1 shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button Action */}
      <div className="border-t border-neutral-300 pt-3 flex items-center justify-between">
        <span className="text-[10px] text-neutral-500 italic">
          Error 302: Game assets compiling...
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setProgress((p) => Math.min(99, p + 5))}
            className="px-4 py-1 bg-[#ece9d8] hover:bg-neutral-200 active:bg-neutral-300 border-2 border-neutral-400 rounded text-xs font-semibold cursor-pointer shadow-xs"
          >
            Hammer 🔨
          </button>
        </div>
      </div>
    </div>
  )
}
