import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BootSequence() {
  const navigate = useNavigate()
  // Boot phases: 'bios' -> 'drivers' -> 'xp-boot' -> 'welcome'
  const [phase, setPhase] = useState<'bios' | 'drivers' | 'xp-boot' | 'welcome'>('bios')
  const [memoryCount, setMemoryCount] = useState<number>(0)
  const [biosStage, setBiosStage] = useState<number>(0)
  const [driverIndex, setDriverIndex] = useState<number>(0)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  // Web Audio Context for synthesized PC speaker POST beep and drive chatter
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

  // Classic single BIOS POST beep (PC speaker sine 880Hz for 90ms)
  const playPostBeep = () => {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(880, now) // A5 classic motherboard buzzer

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.setValueAtTime(0.2, now + 0.09)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.11)
  }

  // Drive head seek chatter sound
  const playDriveChatter = () => {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(120 + Math.random() * 100, now)
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.035)
  }

  // Windows XP Startup / Logon Sound
  const playLogonChime = () => {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [
      { freq: 311.13, start: 0, dur: 1.0 },    // Eb4
      { freq: 466.16, start: 0.16, dur: 0.9 }, // Bb4
      { freq: 415.30, start: 0.32, dur: 0.9 }, // Ab4
      { freq: 622.25, start: 0.48, dur: 1.2 }, // Eb5
      { freq: 932.33, start: 0.64, dur: 1.4 }, // Bb5
    ]
    notes.forEach((n) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(n.freq, now + n.start)
      gain.gain.setValueAtTime(0.001, now + n.start)
      gain.gain.linearRampToValueAtTime(0.12, now + n.start + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + n.start)
      osc.stop(now + n.start + n.dur + 0.05)
    })
  }

  const handleUserLogon = () => {
    if (isLoggingIn) {
      navigate('/desktop')
      return
    }
    setIsLoggingIn(true)
    playLogonChime()
    setTimeout(() => {
      navigate('/desktop')
    }, 1200)
  }

  // Windows XP verbose kernel drivers list
  const driverFiles = [
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\ntoskrnl.exe',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\hal.dll',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\KDCOM.DLL',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\BOOTVID.dll',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\config\\system',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\c_1252.nls',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\c_437.nls',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\l_intl.nls',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\ACPI.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\WMILIB.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\pci.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\isapnp.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\pciide.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\PCIIDEX.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\MountMgr.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\ftdisk.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\dmload.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\dmio.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\PartMgr.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\VolSnap.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\atapi.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\disk.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\CLASSPNP.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\fltmgr.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\sr.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\KBDCLASS.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\MOUCLASS.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\fastfat.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\RTL8139.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\ALCXWDM.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\USBPORT.SYS',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\usbehci.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\usbhub.sys',
    'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\\system32\\drivers\\ndis.sys',
    'Loading Nivesh Portfolio Kernel Environment... [OK]',
    'Starting Windows Subsystem for XP Experience... [OK]',
    'Mounting Virtual Desktop Filesystem C:\\... [OK]',
    'Initializing Windows Graphical GDI & Direct3D... [OK]',
  ]



  // Step 1: BIOS Memory Counter & Stages
  useEffect(() => {
    if (phase !== 'bios') return

    // Animate memory count from 0 to 524288K
    const memoryInterval = setInterval(() => {
      setMemoryCount((prev) => {
        const next = prev + 32768
        if (next >= 524288) {
          clearInterval(memoryInterval)
          return 524288
        }
        return next
      })
    }, 45)

    // Sequence of BIOS output
    const t1 = setTimeout(() => setBiosStage(1), 600)
    const t2 = setTimeout(() => setBiosStage(2), 1200)
    const t3 = setTimeout(() => {
      setBiosStage(3)
      playDriveChatter()
    }, 1800)
    const t4 = setTimeout(() => {
      setBiosStage(4)
      playDriveChatter()
    }, 2400)
    const t5 = setTimeout(() => {
      setBiosStage(5)
      playPostBeep()
    }, 3100)

    // Transition to driver loading phase
    const tNext = setTimeout(() => {
      setPhase('drivers')
    }, 4200)

    return () => {
      clearInterval(memoryInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(tNext)
    }
  }, [phase])

  // Step 2: Driver list streaming
  useEffect(() => {
    if (phase !== 'drivers') return

    const driverInterval = setInterval(() => {
      setDriverIndex((prev) => {
        if (prev < driverFiles.length) {
          if (prev % 4 === 0) playDriveChatter()
          return prev + 1
        } else {
          clearInterval(driverInterval)
          setTimeout(() => setPhase('xp-boot'), 600)
          return prev
        }
      })
    }, 65)

    return () => clearInterval(driverInterval)
  }, [phase, driverFiles.length])

  // Step 3: XP Boot animation transitions to Welcome screen
  useEffect(() => {
    if (phase !== 'xp-boot') return

    const bootTimer = setTimeout(() => {
      setPhase('welcome')
    }, 4500)

    return () => clearTimeout(bootTimer)
  }, [phase])



  return (
    <div className="w-screen h-screen bg-black text-white font-mono overflow-hidden select-none relative flex flex-col justify-between">
      {/* Subtle CRT Phosphor Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none z-40 opacity-70" />

      {/* =========================================================================
          STAGE 1: AWARD MODULAR BIOS (POST & MEMORY CHECK)
          ========================================================================= */}
      {phase === 'bios' && (
        <div className="p-6 sm:p-10 text-[13px] sm:text-[15px] leading-relaxed tracking-wider h-full flex flex-col justify-between">
          <div>
            {/* BIOS Header + Energy Star Logo */}
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-white">Award Modular BIOS v6.00PG, An Energy Star Ally</div>
                <div className="text-neutral-300">Copyright (C) 1984-2003, Award Software, Inc.</div>
                <div className="text-neutral-400 mt-2">ASUS P4P800-E DELUXE ACPI BIOS Revision 1009</div>
              </div>

              {/* Energy Star EPA Logo */}
              <div className="border-2 border-white p-1.5 text-center leading-none hidden sm:block">
                <div className="text-[10px] font-bold tracking-widest text-emerald-400">energy</div>
                <div className="text-[7px] tracking-tight uppercase text-neutral-300">EPA POLLUTION PREVENTER</div>
              </div>
            </div>

            {/* Processor Details */}
            <div className="mt-6 text-neutral-100">
              Intel(R) Pentium(R) 4 CPU 2.80GHz
            </div>

            {/* Live Memory Counter */}
            <div className="mt-1 font-bold">
              Memory Testing : <span className="text-yellow-300">{memoryCount}K</span> {memoryCount >= 524288 ? 'OK' : ''}
            </div>

            {/* Hardware & Drive Detection */}
            {biosStage >= 1 && (
              <div className="mt-4 text-neutral-300">
                Primary Master   : WDC WD800JB-00JJC0 80GB Ultra ATA/100
              </div>
            )}
            {biosStage >= 2 && (
              <div className="text-neutral-300">
                Primary Slave    : SONY DVD-ROM DDU1612
              </div>
            )}
            {biosStage >= 3 && (
              <div className="text-neutral-400">
                Secondary Master : None
              </div>
            )}
            {biosStage >= 4 && (
              <div className="text-neutral-400">
                Secondary Slave  : None
              </div>
            )}
            {biosStage >= 5 && (
              <div className="mt-4 text-emerald-400 font-bold">
                USB Device(s) : 1 Keyboard, 1 Mouse, 1 Storage Device
              </div>
            )}
          </div>

          {/* BIOS Footer */}
          <div className="mt-auto pt-6 border-t border-neutral-800 text-[12px] text-neutral-400 flex flex-col sm:flex-row justify-between gap-2">
            <div>Press <span className="text-white font-bold">DEL</span> to enter SETUP, <span className="text-white font-bold">F8</span> for BBS POPUP</div>
            <div className="text-neutral-500">08/10/2003-I865G-W83627-6A79AM4AC-00</div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 2: WINDOWS XP KERNEL CODE STREAMING (VERBOSE DRIVER LOAD)
          ========================================================================= */}
      {phase === 'drivers' && (
        <div className="p-6 sm:p-10 text-[12px] sm:text-[13px] leading-snug tracking-normal overflow-hidden h-full flex flex-col justify-end bg-black">
          <div className="text-neutral-400 mb-3 border-b border-neutral-800 pb-2">
            Microsoft(R) Windows(R) XP [Version 5.1.2600] Kernel Boot Loader
          </div>
          <div className="flex flex-col gap-0.5">
            {driverFiles.slice(0, driverIndex).map((line, idx) => (
              <div
                key={idx}
                className={
                  line.includes('[OK]') || line.includes('[DONE]')
                    ? 'text-emerald-400 font-bold'
                    : 'text-neutral-300'
                }
              >
                {line}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 text-yellow-300">
            <span className="inline-block w-2.5 h-4 bg-yellow-300 animate-pulse" />
            <span>Loading Windows Subsystems...</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: ICONIC WINDOWS XP BOOT SCREEN
          ========================================================================= */}
      {phase === 'xp-boot' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
          <div className="flex flex-col items-center">
            {/* Windows XP 4-color Flag and Title */}
            <div className="flex items-center gap-4 mb-10">
              <div className="grid grid-cols-2 gap-1.5 w-14 h-14 -rotate-10 skew-x-[-10deg]">
                <div className="bg-[#ea3f24] rounded-tl-sm rounded-tr-xl rounded-br-none rounded-bl-sm shadow-[0_0_14px_#ea3f24]" />
                <div className="bg-[#7ab800] rounded-tl-xl rounded-tr-sm rounded-br-sm rounded-bl-none shadow-[0_0_14px_#7ab800]" />
                <div className="bg-[#00a1f1] rounded-tl-none rounded-tr-sm rounded-br-sm rounded-bl-xl shadow-[0_0_14px_#00a1f1]" />
                <div className="bg-[#ffba08] rounded-tl-sm rounded-tr-none rounded-br-xl rounded-bl-sm shadow-[0_0_14px_#ffba08]" />
              </div>
              <div className="font-['Franklin_Gothic_Medium',Arial,sans-serif] text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                Windows<span className="italic font-normal text-3xl sm:text-4xl text-[#df5827] ml-2">XP</span>
              </div>
            </div>

            {/* Smooth Moving Blue Lozenges Track */}
            <div className="w-[200px] h-3.5 bg-black border-2 border-[#3c546e] rounded-sm overflow-hidden relative p-0.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)]">
              <div className="flex gap-1 w-[46px] h-2 absolute top-0.5 animate-[xp-progress-sweep_2s_infinite_ease-in-out]">
                <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
                <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
                <div className="flex-1 bg-gradient-to-b from-[#5b9ffc] via-[#2264cc] to-[#164696] rounded-xs shadow-[0_0_6px_#3d8aff]" />
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-400 font-sans tracking-wide">
              Microsoft(R) Windows(R) XP Professional
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 4: WINDOWS XP "WELCOME" LOGIN / DESKTOP TRANSITION
          ========================================================================= */}
      {phase === 'welcome' && (
        <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#003399] via-[#0055ea] to-[#002288] text-white font-sans relative">
          {/* Top Navy Bar */}
          <div className="h-16 bg-[#001f5c] border-b-2 border-amber-400/80 flex items-center px-8 shadow-md">
            <span className="text-white/80 font-bold text-sm tracking-wider">Windows XP Professional</span>
          </div>

          {/* Center Welcome Screen Content */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 px-6">
            {/* Left Column: Windows XP Branding */}
            <div className="flex flex-col items-center sm:items-end border-b sm:border-b-0 sm:border-r border-white/20 pb-6 sm:pb-0 sm:pr-12">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-2 gap-1 w-10 h-10 -rotate-10 skew-x-[-10deg]">
                  <div className="bg-[#ea3f24] rounded-tl-xs rounded-tr-md rounded-br-none rounded-bl-xs shadow-[0_0_8px_#ea3f24]" />
                  <div className="bg-[#7ab800] rounded-tl-md rounded-tr-xs rounded-br-xs rounded-bl-none shadow-[0_0_8px_#7ab800]" />
                  <div className="bg-[#00a1f1] rounded-tl-none rounded-tr-xs rounded-br-xs rounded-bl-md shadow-[0_0_8px_#00a1f1]" />
                  <div className="bg-[#ffba08] rounded-tl-xs rounded-tr-none rounded-br-md rounded-bl-xs shadow-[0_0_8px_#ffba08]" />
                </div>
                <div className="font-['Franklin_Gothic_Medium',Arial,sans-serif] text-3xl font-black text-white">
                  Windows<span className="italic font-normal text-2xl text-[#df5827] ml-1">XP</span>
                </div>
              </div>
              <div className="font-['Segoe_Script','Comic_Sans_MS',cursive] text-2xl sm:text-3xl text-amber-200 mt-4 drop-shadow-md">
                Welcome
              </div>
            </div>

            {/* Right Column: User Account - Click to log on */}
            <div
              onClick={handleUserLogon}
              className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 p-3.5 pr-6 rounded-lg border border-white/20 hover:border-amber-300/80 transition-all cursor-pointer shadow-lg backdrop-blur-sm active:scale-[0.99]"
            >
              {/* Profile Avatar Frame */}
              <div className="w-14 h-14 rounded border-2 border-amber-300 group-hover:border-amber-200 overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-md transition-transform group-hover:scale-105">
                🦆
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-white drop-shadow group-hover:text-amber-100 transition-colors">
                  Nivesh
                </div>
                {isLoggingIn ? (
                  <div className="text-xs text-blue-200 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Loading your personal settings...
                  </div>
                ) : (
                  <div className="text-xs text-blue-200/90 group-hover:text-amber-200 flex items-center gap-1.5 mt-1 transition-colors font-medium">
                    <span>Click to log on</span>
                    <span className="text-[11px]">➜</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navy Bar with Turn Off Button */}
          <div className="h-16 bg-[#001f5c] border-t-2 border-amber-400/80 flex items-center justify-between px-8 shadow-inner">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-red-600 hover:bg-red-500 border border-red-400 flex items-center justify-center text-[10px] shadow">
                ⏻
              </div>
              Turn off computer
            </button>
            <div className="text-xs text-neutral-400">
              After you log on, you can add or change accounts.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
