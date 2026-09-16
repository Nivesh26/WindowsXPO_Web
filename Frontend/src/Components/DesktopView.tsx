import { useState, useRef } from 'react'

export default function DesktopView() {
  const [isPowerOn, setIsPowerOn] = useState<boolean>(false)
  const [isBooting, setIsBooting] = useState<boolean>(false)
  const [floppyInserted, setFloppyInserted] = useState<boolean>(false)
  const [powerButtonPressed, setPowerButtonPressed] = useState<boolean>(false)

  // Web Audio Context for synthesized retro hardware sound effects
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx()
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  // Synthesize mechanical power switch click
  const playPowerClick = () => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Heavy mechanical switch "thunk"
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.09)

    // High mechanical snap
    const snapOsc = ctx.createOscillator()
    const snapGain = ctx.createGain()
    snapOsc.type = 'square'
    snapOsc.frequency.setValueAtTime(1800, now)
    snapOsc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

    snapGain.gain.setValueAtTime(0.2, now)
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    snapOsc.connect(snapGain)
    snapGain.connect(ctx.destination)
    snapOsc.start(now)
    snapOsc.stop(now + 0.05)
  }

  // Synthesize authentic CRT degauss coil discharge hum
  const playDegaussSound = () => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // 60Hz Degauss surge
    const degaussOsc = ctx.createOscillator()
    const degaussGain = ctx.createGain()
    degaussOsc.type = 'sawtooth'
    degaussOsc.frequency.setValueAtTime(90, now)
    degaussOsc.frequency.exponentialRampToValueAtTime(45, now + 0.7)

    degaussGain.gain.setValueAtTime(0.45, now)
    degaussGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    degaussOsc.connect(degaussGain)
    degaussGain.connect(ctx.destination)
    degaussOsc.start(now)
    degaussOsc.stop(now + 0.85)

    // High-voltage CRT flyback whistle (faint 15.7 kHz)
    const flybackOsc = ctx.createOscillator()
    const flybackGain = ctx.createGain()
    flybackOsc.type = 'sine'
    flybackOsc.frequency.setValueAtTime(7500, now)
    flybackOsc.frequency.exponentialRampToValueAtTime(12000, now + 0.4)

    flybackGain.gain.setValueAtTime(0.05, now)
    flybackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    flybackOsc.connect(flybackGain)
    flybackGain.connect(ctx.destination)
    flybackOsc.start(now)
    flybackOsc.stop(now + 0.65)
  }

  // Synthesize floppy drive stepper seek sound
  const playFloppySound = () => {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const stepTime = now + i * 0.07
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(280 + i * 60, stepTime)

      gain.gain.setValueAtTime(0.15, stepTime)
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(stepTime)
      osc.stop(stepTime + 0.045)
    }
  }

  // Toggle Power
  const togglePower = () => {
    setPowerButtonPressed(true)
    setTimeout(() => setPowerButtonPressed(false), 200)

    playPowerClick()

    if (!isPowerOn) {
      // Powering ON
      playDegaussSound()
      setIsBooting(true)
      setIsPowerOn(true)
      const timer = setTimeout(() => {
        setIsBooting(false)
      }, 3500)
      return () => clearTimeout(timer)
    } else {
      // Powering OFF
      setIsPowerOn(false)
      setIsBooting(false)
    }
  }

  // Keyboard layout keys definition
  const fRow = ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
  const numRow = ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK']
  const qRow = ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\']
  const aRow = ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER']
  const zRow = ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT']
  const bottomRow = ['CTRL', 'WIN', 'ALT', 'SPACEBAR', 'ALT', 'WIN', 'MENU', 'CTRL']

  return (
    <div className="h-screen w-full bg-[radial-gradient(circle_at_50%_30%,#2f343f_0%,#171921_55%,#0d0f14_100%)] flex flex-col items-center justify-center relative overflow-hidden font-sans select-none text-slate-100">
      {/* Ambient Room Lighting Glow */}
      <div className="absolute -top-[10%] left-1/4 w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(255,236,179,0.12)_0%,rgba(255,214,138,0.04)_45%,transparent_70%)] pointer-events-none z-0" />

      {/* Main Desk Surface */}
      <main className="relative w-full max-w-7xl mx-auto px-4 py-2 flex flex-col items-center justify-center z-10 h-full max-h-screen overflow-hidden">
        {/* Sticky Note on Desk - Elevated Higher Up */}
        <div className="absolute left-4 sm:left-8 md:left-12 lg:left-16 top-1/4 md:top-[28%] -translate-y-1/2 z-30 select-none">
          <div className="relative bg-gradient-to-br from-[#fef9c3] via-[#fef08a] to-[#fde047] px-3.5 py-2.5 rounded-sm shadow-[0_6px_14px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.8)] -rotate-3 border border-amber-300/60 max-w-[160px]">
            {/* Frosted Tape on top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/50 shadow-xs rounded-2xs rotate-1 pointer-events-none backdrop-blur-[1px]" />
            <p className="font-['Comic_Sans_MS','Chalkboard_SE','Segoe_Print',cursive,sans-serif] text-xs font-bold text-[#713f12] flex items-center gap-1.5 leading-snug">
              <span>📌</span> Turn on the computer
            </p>
          </div>
        </div>

        {/* Desk Mat Base Shadow */}
        <div className="absolute bottom-0 left-[5%] right-[5%] h-[380px] bg-gradient-to-b from-[#1f140e] via-[#2c1a11] to-[#180d07] rounded-t-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.08),inset_0_-10px_30px_rgba(0,0,0,0.8),0_-8px_40px_rgba(0,0,0,0.7)] border-t-[3px] border-[#4a3020] z-0 pointer-events-none" />

        {/* Realistic SVG Cables Connecting Hardware */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1280 750" fill="none" preserveAspectRatio="none">
          {/* Keyboard coiled cable snaking behind monitor to CPU */}
          <path
            d="M 520 540 C 490 510, 480 440, 560 410 C 640 380, 780 400, 830 380"
            stroke="#1c1917"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Mouse cable curved smoothly toward CPU */}
          <path
            d="M 850 560 C 880 500, 860 440, 855 390"
            stroke="#1c1917"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Monitor Power & VGA Cable into CPU */}
          <path
            d="M 450 370 C 470 380, 720 385, 780 375"
            stroke="#15171a"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* CPU Power Cord disappearing behind desk */}
          <path
            d="M 940 380 C 970 410, 990 480, 1020 580"
            stroke="#111214"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>

        {/* Workstation Top: CRT Monitor + CPU Tower */}
        <div className="relative w-full flex justify-center items-end gap-6 md:gap-10 z-20 mb-2 scale-[0.78] sm:scale-[0.85] md:scale-[0.92] lg:scale-100 origin-bottom">
          {/* =======================================================
              CRT MONITOR (VINTAGE BEIGE, 4:3 RATIO)
              ======================================================= */}
          <div className="relative flex flex-col items-center">
            {/* Monitor Outer Chassis */}
            <div className="relative w-[480px] h-[380px] bg-gradient-to-br from-[#eee7d5] via-[#ded6bf] to-[#c8bfab] rounded-t-[28px] rounded-b-[20px] p-[22px_24px_16px] flex flex-col justify-between border-2 border-[#b8ae98] shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.35),inset_-5px_0_10px_rgba(0,0,0,0.2),inset_5px_0_10px_rgba(255,255,255,0.5),0_15px_35px_rgba(0,0,0,0.55)] z-20">
              {/* Top Heat Ventilation Slits */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-1 bg-[#6a614e] rounded-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.4)]"
                  />
                ))}
              </div>

              {/* CRT Inner Screen Bezel */}
              <div className="relative w-full h-[300px] bg-gradient-to-br from-[#a79c85] to-[#877c66] rounded-[20px] p-2.5 flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),inset_0_-2px_6px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.25)]">
                {/* Curved Glass Screen Tube */}
                <div
                  className={`relative w-full h-full rounded-[36px/28px] overflow-hidden flex flex-col items-center justify-center border border-[#1a1e22] transition-colors duration-400 ${
                    isPowerOn
                      ? 'bg-black shadow-[inset_0_0_40px_rgba(0,50,120,0.5),0_0_25px_rgba(45,125,246,0.25)]'
                      : 'bg-[radial-gradient(circle_at_45%_40%,#151b1e_0%,#0d1113_60%,#060809_100%)] shadow-[inset_0_0_25px_rgba(0,0,0,0.95),inset_0_0_10px_rgba(20,24,28,0.9),0_0_4px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {/* Glass Specular Glare Highlights */}
                  <div className="absolute top-1.5 left-3 w-40 h-24 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-[50px_80px_30px_40px] -rotate-12 pointer-events-none" />
                  <div className="absolute bottom-3 right-4.5 w-36 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-full pointer-events-none" />

                  {/* Aperture Grille Scanlines Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_3px] pointer-events-none opacity-85" />

                  {!isPowerOn ? (
                    /* OFF STATE: Dark Screen with Faint Phosphor Grid & Power Off Prompt */
                    <>
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(120,160,140,0.4)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-100 border border-slate-700 px-3 py-1 rounded text-xs whitespace-nowrap shadow-xl pointer-events-none animate-[bounce-hint_1.8s_infinite_ease-in-out]">
                        ⚡ Click CPU or Monitor Power button to turn on
                      </div>
                    </>
                  ) : (
                    /* ON STATE: Degauss Flash & Windows XP Boot sequence */
                    <>
                      {isBooting && (
                        <div className="absolute inset-0 bg-white z-20 pointer-events-none animate-[degauss-flash_0.6s_cubic-bezier(0.1,0.9,0.2,1)_forwards]" />
                      )}
                      <div className="w-full h-full flex flex-col items-center justify-center relative bg-black text-white p-4.5 text-center">
                        <div className="flex flex-col items-center">
                          {/* 4-Color XP Flag & Title */}
                          <div className="flex items-center gap-2 mb-7">
                            <div className="grid grid-cols-2 gap-[3px] w-9 h-9 -rotate-10 skew-x-[-10deg]">
                              <div className="bg-[#ea3f24] rounded-tl-xs rounded-tr-md rounded-br-none rounded-bl-xs shadow-[0_0_8px_#ea3f24]" />
                              <div className="bg-[#7ab800] rounded-tl-md rounded-tr-xs rounded-br-xs rounded-bl-none shadow-[0_0_8px_#7ab800]" />
                              <div className="bg-[#00a1f1] rounded-tl-none rounded-tr-xs rounded-br-xs rounded-bl-md shadow-[0_0_8px_#00a1f1]" />
                              <div className="bg-[#ffba08] rounded-tl-xs rounded-tr-none rounded-br-md rounded-bl-xs shadow-[0_0_8px_#ffba08]" />
                            </div>
                            <div className="font-['Franklin_Gothic_Medium',Arial,sans-serif] text-[26px] font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                              Windows<span className="italic font-normal text-[19px] text-[#df5827] ml-1">XP</span>
                            </div>
                          </div>

                          {/* XP Loading Progress Bar */}
                          <div className="w-[170px] h-3 bg-black border border-[#3c546e] rounded overflow-hidden relative p-px shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]">
                            <div className="flex gap-[3px] w-[38px] h-2 absolute top-px animate-[xp-progress-sweep_2.2s_infinite_ease-in-out]">
                              <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
                              <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
                              <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
                            </div>
                          </div>

                          <div className="mt-6 text-[9px] text-slate-400 tracking-wider">
                            {isBooting ? 'Starting Windows XP...' : "Welcome to Nivesh's Portfolio"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Monitor Bottom Bezel: Controls, Badging, and Power Switch */}
              <div className="flex items-center justify-between mt-2 px-1.5">
                <div className="text-[11px] font-black tracking-widest text-[#645b49] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] flex items-center gap-1.5 font-['Trebuchet_MS',sans-serif]">
                  XP-VISION <span className="bg-[#8b8069] text-[#dfd7c2] px-1 py-0.5 rounded text-[8px] tracking-normal font-bold">CRT 753</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Static Monitor Control Knobs/Buttons */}
                  <div className="w-3.5 h-2 bg-gradient-to-b from-[#d3c9b2] to-[#a89e87] rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] border border-[#7c725c] cursor-default" />
                  <div className="w-3.5 h-2 bg-gradient-to-b from-[#d3c9b2] to-[#a89e87] rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] border border-[#7c725c] cursor-default" />
                  <div className="w-3.5 h-2 bg-gradient-to-b from-[#d3c9b2] to-[#a89e87] rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] border border-[#7c725c] cursor-default" />
                  <div className="w-3.5 h-2 bg-gradient-to-b from-[#d3c9b2] to-[#a89e87] rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)] border border-[#7c725c] cursor-default" />

                  {/* Monitor Power Button with Tactile Push */}
                  <button
                    type="button"
                    onClick={togglePower}
                    className={`w-5.5 h-3.5 bg-gradient-to-b from-[#ded5be] to-[#b3a890] rounded-xs shadow-[0_2px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] border border-[#6b624d] cursor-pointer flex items-center justify-center hover:brightness-110 transition-all ${
                      powerButtonPressed ? 'translate-y-px shadow-[0_1px_1px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(0,0,0,0.4)]' : ''
                    }`}
                    title="Monitor Power Switch"
                  >
                    <span className="text-[8px] text-[#554e3d] font-bold">⏻</span>
                  </button>

                  {/* Power Indicator LED: Standby Blinking Amber when OFF, Green when ON */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full border border-[#3a3426] ml-0.5 transition-all duration-300 ${
                      isPowerOn
                        ? 'bg-emerald-500 shadow-[0_0_8px_#22c55e,0_0_14px_rgba(34,197,94,0.7)]'
                        : 'bg-amber-500 shadow-[0_0_8px_#f59e0b,0_0_14px_rgba(245,158,11,0.6)] animate-[standby-pulse_2.4s_infinite_ease-in-out]'
                    }`}
                    title={isPowerOn ? 'Power: Active' : 'Power: Standby (Amber)'}
                  />
                </div>
              </div>
            </div>

            {/* Monitor Swivel Neck & Sturdy Base */}
            <div className="w-[140px] h-6 bg-gradient-to-b from-[#9b917c] to-[#6e6552] rounded-b-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.4)] -mt-0.5 z-10" />
            <div className="w-60 h-6.5 bg-gradient-to-b from-[#ddd5c0] via-[#beb49e] to-[#9a907a] rounded-t-xl rounded-b-md shadow-[inset_0_2px_3px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)] border border-[#a89e88] -mt-0.5 z-10" />
          </div>

          {/* =======================================================
              CPU TOWER (VINTAGE BEIGE MID-TOWER SYSTEM UNIT)
              ======================================================= */}
          <div className="relative flex flex-col items-center z-20">
            <div className="relative w-[210px] h-[420px] bg-gradient-to-b from-[#ede7d6] via-[#ded6bf] to-[#c5bca8] rounded-t-xl rounded-b-md shadow-[inset_0_3px_5px_rgba(255,255,255,0.9),inset_-4px_0_8px_rgba(0,0,0,0.25),inset_4px_0_8px_rgba(255,255,255,0.5),0_18px_36px_rgba(0,0,0,0.6)] border-2 border-[#b8ae98] p-3.5 pb-5 flex flex-col gap-3">
              {/* 5.25" CD-ROM Drive Bay */}
              <div className="bg-gradient-to-b from-[#d3c9b3] to-[#b8ae98] border border-[#9c927c] rounded-md p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.6)] flex flex-col gap-1.5">
                <div className="h-5.5 bg-gradient-to-b from-[#eee8d7] to-[#ded7c2] border border-[#a89e87] rounded flex items-center justify-between px-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.2)]">
                  <span className="text-[8px] font-extrabold text-[#786f5c] tracking-tight">COMPACT DISC 52x MAX</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#25221c] rounded-full border border-[#736b59]" title="Headphone Jack (3.5mm)" />
                  <div className="w-3.5 h-1.5 bg-[repeating-linear-gradient(90deg,#6c6350_0px,#6c6350_1px,#a89e87_1px,#a89e87_2px)] rounded-xs" title="Volume Wheel" />
                  <div className={`w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_#22c55e] transition-opacity ${isPowerOn ? 'opacity-100' : 'opacity-20'}`} />
                  <div
                    className="w-5.5 h-2 bg-gradient-to-b from-[#e3dcce] to-[#b8ad96] border border-[#7b715d] rounded-xs shadow cursor-default"
                  />
                </div>
              </div>

              {/* 3.5" Floppy Disk Drive Bay */}
              <div className="bg-gradient-to-b from-[#d3c9b3] to-[#b8ae98] border border-[#9c927c] rounded-md p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.6)] flex flex-col gap-1">
                <div
                  className="h-4.5 bg-[#23201b] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] relative flex items-center justify-center cursor-pointer overflow-hidden"
                  title={floppyInserted ? "Click to eject floppy" : "Click to insert 3.5\" floppy disk"}
                  onClick={() => {
                    playFloppySound()
                    setFloppyInserted(!floppyInserted)
                  }}
                >
                  <div className="w-[85%] h-1 bg-[#736a57] rounded shadow-[0_1px_0_rgba(0,0,0,0.7)]" />
                  {floppyInserted && (
                    <div className="absolute top-px w-[75%] h-3.5 bg-[#2b569a] rounded border border-[#1a3560] flex items-center justify-center text-white text-[7px] font-bold">
                      PORTFOLIO 1.44MB
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full bg-emerald-600 transition-all ${isPowerOn && floppyInserted ? 'opacity-100 shadow-[0_0_6px_#16a34a]' : 'opacity-15'}`} />
                  <button
                    type="button"
                    className="w-3.5 h-2 bg-gradient-to-b from-[#d3c9b3] to-[#9e937d] border border-[#6b624e] rounded-xs shadow cursor-pointer active:translate-y-px"
                    title="Eject floppy disk"
                    onClick={() => {
                      playFloppySound()
                      setFloppyInserted(!floppyInserted)
                    }}
                  />
                </div>
              </div>

              {/* CPU Middle Control Section */}
              <div className="bg-gradient-to-b from-[#d8cfba] to-[#c4baa3] rounded-lg p-2.5 border border-[#a89e87] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.6)] flex flex-col gap-3">
                <div className="flex items-center justify-around">
                  {/* Big Tactile Main Power Push Button */}
                  <button
                    type="button"
                    onClick={togglePower}
                    className={`w-11 h-11 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffdf7_0%,#dfd6c0_45%,#a89e85_100%)] border-2 border-[#7c725c] shadow-[0_4px_8px_rgba(0,0,0,0.45),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-3px_4px_rgba(0,0,0,0.35)] cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
                      powerButtonPressed ? 'translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(0,0,0,0.6)]' : ''
                    }`}
                    title="CPU Power Button"
                  >
                    <span className={`text-lg font-bold transition-colors ${isPowerOn ? 'text-emerald-700 drop-shadow-[0_0_4px_#22c55e]' : 'text-[#4f4738]'}`}>
                      ⏻
                    </span>
                  </button>

                  {/* Static Reset Button */}
                  <div
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ded5be] to-[#a89e85] border border-[#706753] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.3)] cursor-default flex items-center justify-center text-[8px] text-[#554d3d] font-bold"
                  >
                    R
                  </div>

                  {/* Retro Turbo / Speed 7-Segment Display */}
                  <div className={`bg-[#111412] rounded px-1.5 py-0.5 font-mono text-[11px] font-black tracking-widest border border-[#433d32] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] transition-colors ${
                    isPowerOn ? 'text-emerald-500 drop-shadow-[0_0_6px_#22c55e]' : 'text-emerald-950'
                  }`} title="CPU Speed">
                    {isPowerOn ? 'XP' : '--'}
                  </div>
                </div>

                {/* Status Indicator LEDs on CPU */}
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full border border-[#4a4233] transition-all ${
                      isPowerOn ? 'bg-emerald-500 shadow-[0_0_8px_#22c55e,0_0_12px_rgba(34,197,94,0.8)]' : 'bg-[#363126]'
                    }`} />
                    <span className="text-[8px] font-bold text-[#6f6551] uppercase">PWR</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full border border-[#4a4233] transition-all ${
                      isPowerOn ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-[hdd-flicker_0.25s_infinite]' : 'bg-[#382522]'
                    }`} />
                    <span className="text-[8px] font-bold text-[#6f6551] uppercase">HDD</span>
                  </div>
                </div>
              </div>

              {/* Vintage Badges / Case Stickers */}
              <div className="flex items-center justify-around mt-1">
                <div className="bg-gradient-to-br from-[#1b3573] to-[#0d1e44] border border-[#7ea8f8] rounded p-1 shadow flex flex-col items-center" title="Designed for Windows XP">
                  <span className="text-[6px] font-extrabold text-white">Designed for</span>
                  <span className="text-[6px] font-black text-amber-400">Windows® XP</span>
                </div>
                <div className="bg-gradient-to-br from-[#e4e4e4] to-[#b8b8b8] border border-[#8e8e8e] rounded p-1 shadow text-center" title="Intel Pentium 4 Inside">
                  <div className="text-[7px] font-black text-[#004b98]">intel</div>
                  <div className="text-[5px] font-bold text-neutral-800">Pentium® 4</div>
                </div>
              </div>

              {/* Bottom Air Intake Slats */}
              <div className="mt-auto flex flex-col gap-1 px-1.5">
                <div className="h-1 bg-[#5d5442] rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.4)]" />
                <div className="h-1 bg-[#5d5442] rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.4)]" />
                <div className="h-1 bg-[#5d5442] rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.4)]" />
                <div className="h-1 bg-[#5d5442] rounded-xs shadow-[inset_0_1px_1px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.4)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Foreground Input Hardware: Keyboard + Mouse Station */}
        <div className="flex items-center justify-center gap-6 md:gap-8 w-full z-20 scale-[0.78] sm:scale-[0.85] md:scale-[0.92] lg:scale-100 origin-top">
          {/* =======================================================
              RETRO KEYBOARD (IBM MODEL M / BEIGE MECHANICAL - STATIC)
              ======================================================= */}
          <div className="relative">
            <div className="relative bg-gradient-to-b from-[#ede7d6] via-[#ded6be] to-[#c4baa4] rounded-t-xl rounded-b-lg p-3 pb-3.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.55),0_4px_6px_rgba(0,0,0,0.35)] border-2 border-[#b3a891] flex flex-col gap-1.5 [transform:perspective(600px)_rotateX(10deg)] origin-bottom cursor-default select-none">
              {/* Keyboard Header */}
              <div className="flex justify-between items-center px-1.5 pb-1">
                <span className="text-[8px] font-extrabold text-[#7b725e] tracking-widest">MODEL XP-101 MECHANICAL</span>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-[7px] font-bold text-[#706755]">
                    <span className={`w-1.5 h-1.5 rounded-full border border-[#5a5240] ${isPowerOn ? 'bg-emerald-500 shadow-[0_0_6px_#22c55e]' : 'bg-[#393327]'}`} />
                    <span>NUM</span>
                  </div>
                  <div className="flex items-center gap-1 text-[7px] font-bold text-[#706755]">
                    <span className={`w-1.5 h-1.5 rounded-full border border-[#5a5240] ${isPowerOn ? 'bg-emerald-500 shadow-[0_0_6px_#22c55e]' : 'bg-[#393327]'}`} />
                    <span>CAPS</span>
                  </div>
                  <div className="flex items-center gap-1 text-[7px] font-bold text-[#706755]">
                    <span className="w-1.5 h-1.5 rounded-full border border-[#5a5240] bg-[#393327]" />
                    <span>SCROLL</span>
                  </div>
                </div>
              </div>

              {/* Key Matrix (Static) */}
              <div className="flex flex-col gap-1">
                {/* Function Key Row */}
                <div className="flex gap-1">
                  {fRow.map((k) => (
                    <div
                      key={k}
                      className="h-6 min-w-[22px] px-1 bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold text-[#2b2822] cursor-default select-none"
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* Number Key Row */}
                <div className="flex gap-1">
                  {numRow.map((k) => (
                    <div
                      key={k}
                      className={`h-6 min-w-[22px] px-1 rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold cursor-default select-none ${
                        k === 'BACK'
                          ? 'min-w-[36px] bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] text-[#2b2822]'
                          : 'bg-gradient-to-b from-[#f8f4e8] via-[#e2dbca] to-[#cac1ad] text-[#3b372f]'
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* QWERTY Row */}
                <div className="flex gap-1">
                  {qRow.map((k) => (
                    <div
                      key={k}
                      className={`h-6 min-w-[22px] px-1 rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold cursor-default select-none ${
                        k === 'TAB' || k === '\\'
                          ? 'min-w-[36px] bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] text-[#2b2822]'
                          : 'bg-gradient-to-b from-[#f8f4e8] via-[#e2dbca] to-[#cac1ad] text-[#3b372f]'
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* ASDF Row */}
                <div className="flex gap-1">
                  {aRow.map((k) => (
                    <div
                      key={k}
                      className={`h-6 min-w-[22px] px-1 rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold cursor-default select-none ${
                        k === 'CAPS' || k === 'ENTER'
                          ? 'min-w-[46px] bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] text-[#2b2822]'
                          : 'bg-gradient-to-b from-[#f8f4e8] via-[#e2dbca] to-[#cac1ad] text-[#3b372f]'
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* ZXCV Row */}
                <div className="flex gap-1">
                  {zRow.map((k, idx) => (
                    <div
                      key={`${k}-${idx}`}
                      className={`h-6 min-w-[22px] px-1 rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold cursor-default select-none ${
                        k === 'SHIFT'
                          ? 'min-w-[46px] bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] text-[#2b2822]'
                          : 'bg-gradient-to-b from-[#f8f4e8] via-[#e2dbca] to-[#cac1ad] text-[#3b372f]'
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                {/* Spacebar & Modifiers Row */}
                <div className="flex gap-1">
                  {bottomRow.map((k, idx) => (
                    <div
                      key={`${k}-${idx}`}
                      className={`h-6 rounded-xs shadow-[0_3px_0_#9c927c,0_4px_4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center text-[8px] font-bold cursor-default select-none ${
                        k === 'SPACEBAR'
                          ? 'grow min-w-[150px] bg-gradient-to-b from-[#f8f4e8] via-[#e2dbca] to-[#cac1ad]'
                          : 'min-w-[22px] px-1 bg-gradient-to-b from-[#dbd4c2] via-[#c4baa4] to-[#aba089] text-[#2b2822]'
                      }`}
                    >
                      {k === 'SPACEBAR' ? '' : k}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* =======================================================
              RETRO MOUSE & BLUE CLOTH MOUSEPAD (STATIC)
              ======================================================= */}
          <div className="relative">
            <div className="relative flex items-center justify-center">
              {/* Nostalgic Blue Fabric Mousepad */}
              <div className="w-[130px] h-[160px] bg-[radial-gradient(circle_at_40%_40%,#1e4585_0%,#122c59_100%)] rounded-xl shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_0_12px_rgba(0,0,0,0.6)] border-2 border-[#28549e] relative flex items-center justify-center">
                <span className="absolute bottom-2 right-2.5 text-[7px] font-black text-white/25 tracking-wider">XP PAD</span>
                {/* Vintage 2-Button Beige Mouse (Static) */}
                <div className="w-[62px] h-[98px] bg-gradient-to-b from-[#ede7d6] via-[#ddd5c0] to-[#c0b69e] rounded-t-[26px] rounded-b-[24px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.55)] border border-[#b3a890] relative flex flex-col items-center cursor-default select-none" title="Vintage 2-Button PS/2 Mouse">
                  <div className="w-full h-[38px] flex relative">
                    <div className="flex-1 border-b border-[#8e836b] rounded-tl-[24px] border-r border-r-[#8e836b] cursor-default" />
                    <div className="flex-1 border-b border-[#8e836b] rounded-tr-[24px] cursor-default" />
                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-2 h-4.5 bg-[repeating-linear-gradient(180deg,#595243_0px,#595243_2px,#363228_2px,#363228_4px)] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.4)] border border-[#2f2a20]" />
                  </div>
                  <div className="grow w-full flex items-center justify-center">
                    <span className="text-[7px] font-extrabold text-[#928872] tracking-wider">PS/2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}