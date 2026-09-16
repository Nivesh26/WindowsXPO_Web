import { useState, useEffect, useCallback, useRef } from 'react'

export type Difficulty = 'easy' | 'medium' | 'hard'

interface CellData {
  value: number // 0 = empty, 1-9 = filled
  solution: number
  isInitial: boolean
  notes: number[] // candidate notes 1-9
}

// Pre-tested valid Sudoku puzzles with guaranteed unique solutions
const PUZZLE_TEMPLATES: Record<Difficulty, { puzzle: number[][]; solution: number[][] }[]> = {
  easy: [
    {
      puzzle: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ],
    },
    {
      puzzle: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
      ],
      solution: [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9],
      ],
    },
  ],
  medium: [
    {
      puzzle: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0],
        [5, 8, 0, 0, 0, 9, 7, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0],
        [0, 0, 9, 8, 0, 0, 0, 3, 6],
        [0, 0, 0, 3, 0, 6, 0, 9, 0],
      ],
      solution: [
        [1, 2, 3, 6, 7, 8, 9, 4, 5],
        [5, 8, 4, 2, 3, 9, 7, 6, 1],
        [9, 6, 7, 1, 4, 5, 3, 2, 8],
        [3, 7, 2, 4, 6, 1, 5, 8, 9],
        [6, 9, 1, 5, 8, 3, 2, 7, 4],
        [4, 5, 8, 7, 9, 2, 6, 1, 3],
        [8, 3, 6, 9, 2, 4, 1, 5, 7],
        [2, 1, 9, 8, 5, 7, 4, 3, 6],
        [7, 4, 5, 3, 1, 6, 8, 9, 2],
      ],
    },
  ],
  hard: [
    {
      puzzle: [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
      ],
      solution: [
        [5, 8, 1, 6, 7, 2, 4, 3, 9],
        [7, 9, 2, 8, 4, 3, 6, 5, 1],
        [3, 6, 4, 5, 9, 1, 7, 8, 2],
        [4, 3, 8, 9, 5, 7, 2, 1, 6],
        [2, 5, 6, 1, 8, 4, 9, 7, 3],
        [1, 7, 9, 3, 2, 6, 8, 4, 5],
        [8, 4, 5, 2, 1, 9, 3, 6, 7],
        [9, 1, 3, 7, 6, 8, 5, 2, 4],
        [6, 2, 7, 4, 3, 5, 1, 9, 8],
      ],
    },
  ],
}

// Retro Sound Effects generator using Web Audio API
class RetroSound {
  private ctx: AudioContext | null = null

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playClick() {
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  playPlace() {
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  }

  playError() {
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  }

  playWin() {
    const ctx = this.getContext()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1)
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + idx * 0.1)
      osc.stop(ctx.currentTime + idx * 0.1 + 0.35)
    })
  }
}

const sounds = new RetroSound()

interface SudokuAppProps {
  onClose?: () => void
  onOpenWindow?: () => void
}

export default function SudokuApp({ onOpenWindow }: SudokuAppProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [grid, setGrid] = useState<CellData[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null)
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false)
  const [mistakes, setMistakes] = useState<number>(0)
  const [timer, setTimer] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isGameWon, setIsGameWon] = useState<boolean>(false)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [hintsLeft, setHintsLeft] = useState<number>(3)
  const [smileyState, setSmileyState] = useState<'normal' | 'surprised' | 'won' | 'lost'>('normal')
  const [history, setHistory] = useState<CellData[][][]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Initialize game puzzle
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const templates = PUZZLE_TEMPLATES[diff]
    const chosen = templates[Math.floor(Math.random() * templates.length)]

    const newGrid: CellData[][] = []
    for (let r = 0; r < 9; r++) {
      const row: CellData[] = []
      for (let c = 0; c < 9; c++) {
        const val = chosen.puzzle[r][c]
        row.push({
          value: val,
          solution: chosen.solution[r][c],
          isInitial: val !== 0,
          notes: [],
        })
      }
      newGrid.push(row)
    }

    setGrid(newGrid)
    setDifficulty(diff)
    setSelectedCell(null)
    setMistakes(0)
    setTimer(0)
    setIsPaused(false)
    setIsGameWon(false)
    setIsGameOver(false)
    setHintsLeft(3)
    setSmileyState('normal')
    setHistory([])
  }, [difficulty])

  useEffect(() => {
    startNewGame()
  }, [startNewGame])

  // Timer interval
  useEffect(() => {
    if (isPaused || isGameWon || isGameOver) return
    const id = setInterval(() => {
      setTimer((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isPaused, isGameWon, isGameOver])

  // Format seconds to mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Count placed numbers 1-9 for keypad status
  const numberCounts: Record<number, number> = {}
  for (let n = 1; n <= 9; n++) numberCounts[n] = 0
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value >= 1 && cell.value <= 9 && cell.value === cell.solution) {
        numberCounts[cell.value] = (numberCounts[cell.value] || 0) + 1
      }
    })
  })

  // Check if puzzle is fully solved
  const checkWinCondition = (currentGrid: CellData[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c].value !== currentGrid[r][c].solution) {
          return false
        }
      }
    }
    return true
  }

  // Input a number into the selected cell
  const handleInputNumber = (num: number) => {
    if (!selectedCell || isPaused || isGameWon || isGameOver) return
    const { r, c } = selectedCell
    const cell = grid[r][c]
    if (cell.isInitial) return

    setSmileyState('surprised')
    setTimeout(() => {
      if (!isGameWon && !isGameOver) setSmileyState('normal')
    }, 300)

    // Save history
    setHistory((prev) => [...prev, grid.map((row) => row.map((cl) => ({ ...cl, notes: [...cl.notes] })))])

    const nextGrid = grid.map((row, ri) =>
      row.map((cl, ci) => {
        if (ri === r && ci === c) {
          if (isNotesMode) {
            // Toggle candidate note
            const nextNotes = cl.notes.includes(num)
              ? cl.notes.filter((n) => n !== num)
              : [...cl.notes, num].sort()
            return { ...cl, notes: nextNotes }
          } else {
            // Placing value
            return { ...cl, value: cl.value === num ? 0 : num, notes: [] }
          }
        }
        return cl
      })
    )

    if (!isNotesMode) {
      if (num !== cell.solution) {
        // Wrong number
        sounds.playError()
        const nextMistakes = mistakes + 1
        setMistakes(nextMistakes)
        if (nextMistakes >= 3) {
          setIsGameOver(true)
          setSmileyState('lost')
        }
      } else {
        // Correct number
        sounds.playPlace()
        // Auto-remove this note from same row, column, box
        for (let ri = 0; ri < 9; ri++) {
          for (let ci = 0; ci < 9; ci++) {
            const inSameRow = ri === r
            const inSameCol = ci === c
            const inSameBox = Math.floor(ri / 3) === Math.floor(r / 3) && Math.floor(ci / 3) === Math.floor(c / 3)
            if (inSameRow || inSameCol || inSameBox) {
              nextGrid[ri][ci].notes = nextGrid[ri][ci].notes.filter((n) => n !== num)
            }
          }
        }

        if (checkWinCondition(nextGrid)) {
          setIsGameWon(true)
          setSmileyState('won')
          sounds.playWin()
        }
      }
    } else {
      sounds.playClick()
    }

    setGrid(nextGrid)
  }

  // Clear cell
  const handleErase = () => {
    if (!selectedCell || isPaused || isGameWon || isGameOver) return
    const { r, c } = selectedCell
    if (grid[r][c].isInitial) return

    setHistory((prev) => [...prev, grid.map((row) => row.map((cl) => ({ ...cl, notes: [...cl.notes] })))])

    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cl, ci) => {
          if (ri === r && ci === c) {
            return { ...cl, value: 0, notes: [] }
          }
          return cl
        })
      )
    )
    sounds.playClick()
  }

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0 || isPaused || isGameWon || isGameOver) return
    const previous = history[history.length - 1]
    setHistory((prev) => prev.slice(0, prev.length - 1))
    setGrid(previous)
    sounds.playClick()
  }

  // Use a hint
  const handleUseHint = () => {
    if (!selectedCell || hintsLeft <= 0 || isPaused || isGameWon || isGameOver) return
    const { r, c } = selectedCell
    const cell = grid[r][c]
    if (cell.isInitial || cell.value === cell.solution) return

    setHintsLeft((h) => h - 1)
    const nextGrid = grid.map((row, ri) =>
      row.map((cl, ci) => {
        if (ri === r && ci === c) {
          return { ...cl, value: cl.solution, isInitial: true, notes: [] }
        }
        return cl
      })
    )

    sounds.playPlace()
    if (checkWinCondition(nextGrid)) {
      setIsGameWon(true)
      setSmileyState('won')
      sounds.playWin()
    }
    setGrid(nextGrid)
  }

  // Keyboard navigation & number input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameWon || isGameOver) return

      // Navigation
      if (e.key === 'ArrowUp' && selectedCell) {
        setSelectedCell((prev) => prev ? { r: Math.max(0, prev.r - 1), c: prev.c } : null)
        sounds.playClick()
      } else if (e.key === 'ArrowDown' && selectedCell) {
        setSelectedCell((prev) => prev ? { r: Math.min(8, prev.r + 1), c: prev.c } : null)
        sounds.playClick()
      } else if (e.key === 'ArrowLeft' && selectedCell) {
        setSelectedCell((prev) => prev ? { r: prev.r, c: Math.max(0, prev.c - 1) } : null)
        sounds.playClick()
      } else if (e.key === 'ArrowRight' && selectedCell) {
        setSelectedCell((prev) => prev ? { r: prev.r, c: Math.min(8, prev.c + 1) } : null)
        sounds.playClick()
      } else if (e.key >= '1' && e.key <= '9') {
        handleInputNumber(parseInt(e.key))
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase()
      } else if (e.key.toLowerCase() === 'n' || e.key.toLowerCase() === 'p') {
        setIsNotesMode((m) => !m)
        sounds.playClick()
      } else if (e.key.toLowerCase() === 'h') {
        handleUseHint()
      } else if (e.key === 'F2') {
        e.preventDefault()
        startNewGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, isPaused, isGameWon, isGameOver, isNotesMode, hintsLeft, grid])

  const selectedValue = selectedCell ? grid[selectedCell.r]?.[selectedCell.c]?.value : null

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-[#ece9d8] text-neutral-800 font-sans select-none overflow-hidden h-full border-t border-[#dcd7c8]"
    >
      {/* Windows XP Classic Game Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex items-center justify-between text-[11px] text-neutral-800 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group">
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Game</span>
            <div className="hidden group-hover:flex flex-col absolute top-full left-0 bg-[#ece9d8] border-2 border-[#0055ea] shadow-lg rounded-b z-50 min-w-[140px] py-1 text-neutral-900 text-xs">
              <button
                onClick={() => startNewGame(difficulty)}
                className="text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex justify-between"
              >
                <span>New</span> <span className="text-[10px] text-neutral-500">F2</span>
              </button>
              <div className="my-1 border-t border-[#d0ccc0]" />
              <button
                onClick={() => startNewGame('easy')}
                className={`text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-1.5 ${difficulty === 'easy' ? 'font-bold' : ''}`}
              >
                <span>{difficulty === 'easy' ? '✓' : ' '}</span> Easy
              </button>
              <button
                onClick={() => startNewGame('medium')}
                className={`text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-1.5 ${difficulty === 'medium' ? 'font-bold' : ''}`}
              >
                <span>{difficulty === 'medium' ? '✓' : ' '}</span> Medium
              </button>
              <button
                onClick={() => startNewGame('hard')}
                className={`text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-1.5 ${difficulty === 'hard' ? 'font-bold' : ''}`}
              >
                <span>{difficulty === 'hard' ? '✓' : ' '}</span> Hard
              </button>
              <div className="my-1 border-t border-[#d0ccc0]" />
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          <div className="relative group">
            <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Difficulty</span>
            <div className="hidden group-hover:flex flex-col absolute top-full left-0 bg-[#ece9d8] border-2 border-[#0055ea] shadow-lg rounded-b z-50 min-w-[120px] py-1 text-neutral-900 text-xs">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => startNewGame(d)}
                  className={`text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white capitalize flex items-center gap-1.5 ${
                    difficulty === d ? 'font-bold' : ''
                  }`}
                >
                  <span>{difficulty === d ? '✓' : ' '}</span> {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleUseHint}
            disabled={hintsLeft <= 0 || !selectedCell}
            className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hint ({hintsLeft})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenWindow && (
            <button
              onClick={onOpenWindow}
              title="Open Sudoku in its own window"
              className="px-2 py-0.5 bg-white hover:bg-neutral-100 border border-neutral-400 rounded text-[10px] font-semibold text-blue-900 flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>🗗</span> Pop-out Window
            </button>
          )}
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Sudoku v1.0
          </span>
        </div>
      </div>

      {/* Classic Beveled Game Control & Score Bar (Minesweeper / Solitaire style) */}
      <div className="p-2 sm:p-3 bg-[#ece9d8] flex justify-center shrink-0">
        <div className="w-full max-w-[440px] bg-[#ece9d8] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-2 flex items-center justify-between shadow-inner">
          {/* Digital Timer (Sunken Black LCD box) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-neutral-600 font-bold uppercase">Time</span>
            <div className="bg-black text-red-500 font-mono text-base sm:text-lg font-black px-2 py-0.5 rounded-xs border-2 border-[#808080] tracking-wider shadow-inner w-[65px] text-center">
              {formatTimer(timer)}
            </div>
          </div>

          {/* Interactive Minesweeper Smiley Face Button */}
          <button
            onClick={() => startNewGame()}
            title="Click to restart puzzle (F2)"
            className="w-9 h-9 bg-[#ece9d8] hover:bg-neutral-200 active:border-t-2 active:border-l-2 active:border-[#808080] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] rounded flex items-center justify-center text-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            {smileyState === 'surprised'
              ? '😮'
              : smileyState === 'won'
              ? '😎'
              : smileyState === 'lost'
              ? '😵'
              : '😊'}
          </button>

          {/* Mistakes Display & Difficulty Pill */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-neutral-500 uppercase font-bold">Mistakes</span>
              <div className="text-xs font-bold font-mono text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded border border-red-300">
                {mistakes} / 3
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <span className="text-[9px] text-neutral-500 uppercase font-bold">Level</span>
              <span className="text-[10px] capitalize font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">
                {difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col items-center justify-start sm:justify-center">
        {/* Sudoku 9x9 Board with Sunken Outer Border */}
        <div className="relative p-1.5 bg-[#ece9d8] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white shadow-md rounded-xs">
          {/* Paused Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-[#ece9d8]/90 z-20 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-blue-900 mb-2">Game Paused</div>
              <button
                onClick={() => setIsPaused(false)}
                className="px-4 py-1.5 bg-gradient-to-b from-[#3c8bf0] to-[#0055ea] text-white font-bold text-xs rounded border border-blue-900 shadow hover:brightness-110 cursor-pointer"
              >
                Resume Game
              </button>
            </div>
          )}

          {/* Victory Celebration Overlay */}
          {isGameWon && (
            <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center p-4 text-center rounded">
              <div className="text-4xl animate-bounce mb-2">🏆</div>
              <h3 className="text-lg font-black text-white drop-shadow">Puzzle Solved!</h3>
              <p className="text-xs text-blue-200 mt-1 mb-3">
                Completed in <strong>{formatTimer(timer)}</strong> with {mistakes} mistake(s).
              </p>
              <button
                onClick={() => startNewGame()}
                className="px-4 py-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white font-bold text-xs rounded border border-emerald-900 shadow hover:brightness-110 cursor-pointer"
              >
                Play Another Puzzle (F2)
              </button>
            </div>
          )}

          {/* Game Over (3 mistakes) Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-red-950/80 z-30 flex flex-col items-center justify-center p-4 text-center rounded">
              <div className="text-4xl mb-2">💥</div>
              <h3 className="text-lg font-black text-white drop-shadow">Game Over!</h3>
              <p className="text-xs text-red-200 mt-1 mb-3">
                You reached 3 mistakes. Better luck next time!
              </p>
              <button
                onClick={() => startNewGame()}
                className="px-4 py-1.5 bg-gradient-to-b from-amber-500 to-amber-700 text-white font-bold text-xs rounded border border-amber-900 shadow hover:brightness-110 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* 9x9 Grid */}
          <div className="grid grid-cols-9 bg-[#1e293b] border-2 border-[#1e293b] shadow-inner">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c
                const isSameRowOrCol = selectedCell && (selectedCell.r === r || selectedCell.c === c)
                const isSameBox =
                  selectedCell &&
                  Math.floor(selectedCell.r / 3) === Math.floor(r / 3) &&
                  Math.floor(selectedCell.c / 3) === Math.floor(c / 3)
                const isSameNum = selectedValue && cell.value !== 0 && cell.value === selectedValue
                const isConflict = cell.value !== 0 && cell.value !== cell.solution

                // Border logic for 3x3 heavy boxes
                const borderRight = c % 3 === 2 && c !== 8 ? 'border-r-2 border-[#1e293b]' : 'border-r border-slate-300'
                const borderBottom = r % 3 === 2 && r !== 8 ? 'border-b-2 border-[#1e293b]' : 'border-b border-slate-300'

                // Cell background styling
                let bgClass = 'bg-white'
                if (isSelected) {
                  bgClass = 'bg-[#ffe484] shadow-inner ring-2 ring-[#0055ea] z-10'
                } else if (isSameNum) {
                  bgClass = 'bg-[#bae6fd]'
                } else if (isSameRowOrCol || isSameBox) {
                  bgClass = 'bg-[#f1f5f9]'
                } else if (cell.isInitial) {
                  bgClass = 'bg-[#f8fafc]'
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => {
                      setSelectedCell({ r, c })
                      sounds.playClick()
                    }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-sm sm:text-base relative transition-colors cursor-pointer select-none ${borderRight} ${borderBottom} ${bgClass}`}
                  >
                    {cell.value !== 0 ? (
                      <span
                        className={`${
                          isConflict
                            ? 'text-red-600 font-black animate-pulse'
                            : cell.isInitial
                            ? 'text-slate-900 font-black'
                            : 'text-[#0055ea] font-extrabold'
                        }`}
                      >
                        {cell.value}
                      </span>
                    ) : (
                      // Render Notes (candidates 1-9 in 3x3 layout)
                      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none text-[8px] sm:text-[9px] leading-none text-slate-500 font-mono">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <div key={n} className="flex items-center justify-center">
                            {cell.notes.includes(n) ? n : ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Sudoku Action Controls & Number Keypad */}
        <div className="w-full max-w-[440px] mt-2 flex flex-col gap-2">
          {/* Quick Action Tools */}
          <div className="flex items-center justify-between gap-1 text-xs">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="flex-1 py-1 px-2 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-400 rounded text-neutral-800 font-medium flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>⮌</span> Undo
            </button>

            <button
              onClick={handleErase}
              className="flex-1 py-1 px-2 bg-white hover:bg-neutral-100 border border-neutral-400 rounded text-neutral-800 font-medium flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>⌫</span> Erase
            </button>

            <button
              onClick={() => {
                setIsNotesMode(!isNotesMode)
                sounds.playClick()
              }}
              className={`flex-1 py-1 px-2 border rounded font-medium flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer ${
                isNotesMode
                  ? 'bg-amber-400 text-amber-950 border-amber-600 font-bold'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-400'
              }`}
            >
              <span>✏️</span> Notes {isNotesMode ? '(ON)' : '(OFF)'}
            </button>

            <button
              onClick={handleUseHint}
              disabled={hintsLeft <= 0}
              className="flex-1 py-1 px-2 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-400 rounded text-neutral-800 font-medium flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>💡</span> Hint ({hintsLeft})
            </button>
          </div>

          {/* 1-9 Number Input Keypad */}
          <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              const isCompleted = numberCounts[num] >= 9
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputNumber(num)}
                  disabled={isCompleted}
                  className={`h-9 sm:h-10 rounded border text-sm sm:text-base font-bold flex flex-col items-center justify-center transition-all shadow-xs cursor-pointer ${
                    isCompleted
                      ? 'bg-neutral-200 text-neutral-400 border-neutral-300 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-b from-white to-[#ece9d8] hover:from-sky-100 hover:to-blue-200 text-blue-900 border-[#0055ea]/60 active:scale-95'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[8px] font-mono text-neutral-500 -mt-1">
                    {Math.max(0, 9 - (numberCounts[num] || 0))}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Explorer / Game Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none shrink-0">
        <span>Click cell &amp; type 1-9 or use keypad | F2 for New Game</span>
        <span>Windows XP Entertainment Pack</span>
      </div>
    </div>
  )
}
