import { useState } from 'react'
import SudokuApp from './SudokuApp'
import SolitaireApp from './SolitaireApp'

interface GamesFolderAppProps {
  onOpenApp?: (appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku') => void
}

type GameView = 'folder' | 'sudoku' | 'solitaire'

const GAMES = [
  {
    id: 'sudoku' as const,
    name: 'Sudoku',
    icon: '/icons/sudoku.png',
    desc: 'Classic Windows XP Puzzle',
    size: '142 KB',
    emoji: '🔢',
  },
  {
    id: 'solitaire' as const,
    name: 'Solitaire',
    icon: null,
    desc: 'Klondike Card Game',
    size: '88 KB',
    emoji: '🃏',
  },
]

export default function GamesFolderApp({ onOpenApp }: GamesFolderAppProps) {
  const [view, setView] = useState<GameView>('folder')
  const [selected, setSelected] = useState<string | null>(null)

  const handleBackToFolder = () => setView('folder')

  const addressPath =
    view === 'sudoku'
      ? 'C:\\Program Files\\Games\\Sudoku.exe'
      : view === 'solitaire'
      ? 'C:\\Program Files\\Games\\Solitaire.exe'
      : 'C:\\Program Files\\Games'

  const statusText =
    view === 'sudoku'
      ? 'Sudoku running | C:\\Program Files\\Games\\Sudoku.exe'
      : view === 'solitaire'
      ? 'Solitaire running | C:\\Program Files\\Games\\Solitaire.exe'
      : `${GAMES.length} objects | ${GAMES.reduce((s, g) => s + parseInt(g.size), 0)} KB`

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans h-full select-none overflow-hidden">
      {/* Explorer Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] text-neutral-700 shrink-0">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Explorer Standard Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] shrink-0">
        <button
          type="button"
          onClick={handleBackToFolder}
          disabled={view === 'folder'}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border border-transparent ${
            view !== 'folder'
              ? 'hover:bg-white/80 hover:border-[#7f9db9] text-neutral-900 cursor-pointer shadow-xs'
              : 'text-neutral-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className={`text-base font-bold leading-none ${view !== 'folder' ? 'text-emerald-600' : 'text-neutral-400'}`}>🠈</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-neutral-400 opacity-50 cursor-not-allowed"
        >
          <span className="text-base font-bold leading-none">🠊</span>
        </button>

        <div className="h-4 w-px bg-neutral-300 mx-1" />

        <button
          type="button"
          onClick={handleBackToFolder}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span>📁</span>
          <span>Folders</span>
        </button>

        {view === 'folder' && (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setView('sudoku')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 text-emerald-950 font-semibold cursor-pointer shadow-xs"
            >
              <span>🔢</span>
              <span>Play Sudoku</span>
            </button>
            <button
              type="button"
              onClick={() => setView('solitaire')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 border border-red-400 text-red-900 font-semibold cursor-pointer shadow-xs"
            >
              <span>🃏</span>
              <span>Play Solitaire</span>
            </button>
          </div>
        )}
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px] shrink-0">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          {view === 'solitaire' ? (
            <span className="text-[13px]">🃏</span>
          ) : (
            <img
              src={view === 'sudoku' ? '/icons/sudoku.png' : '/icons/folder-open.png'}
              alt=""
              className="w-4 h-4 object-contain"
            />
          )}
          <span className="text-neutral-800 font-medium">{addressPath}</span>
        </div>
        <button
          type="button"
          onClick={view === 'folder' ? () => setView('sudoku') : handleBackToFolder}
          className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer"
        >
          Go
        </button>
      </div>

      {/* Main View Area */}
      {view === 'sudoku' ? (
        <SudokuApp
          onOpenWindow={() => {
            if (onOpenApp) {
              onOpenApp('sudoku')
              handleBackToFolder()
            }
          }}
        />
      ) : view === 'solitaire' ? (
        <SolitaireApp />
      ) : (
        // Folder Listing View
        <div className="flex-1 flex overflow-hidden">
          {/* Left Windows XP Tasks Sidebar */}
          <div className="w-[180px] sm:w-[200px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px] shrink-0">
            {/* Game Tasks */}
            <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
              <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
                <span>Game Tasks</span>
                <span className="text-[10px]">▲</span>
              </div>
              <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
                <div
                  onClick={() => setView('sudoku')}
                  className="hover:underline cursor-pointer flex items-center gap-1.5 font-bold text-blue-950"
                >
                  <img src="/icons/sudoku.png" alt="" className="w-4 h-4 object-contain" />
                  <span>Play Sudoku</span>
                </div>
                <div
                  onClick={() => setView('solitaire')}
                  className="hover:underline cursor-pointer flex items-center gap-1.5 font-bold text-blue-950"
                >
                  <span className="text-[15px]">🃏</span>
                  <span>Play Solitaire</span>
                </div>
                {onOpenApp && (
                  <div
                    onClick={() => onOpenApp('sudoku')}
                    className="hover:underline cursor-pointer flex items-center gap-1.5 text-blue-900 text-[10px]"
                  >
                    <span>🗗</span>
                    <span>Open Sudoku in New Window</span>
                  </div>
                )}
                <span className="hover:underline cursor-pointer flex items-center gap-1.5 text-blue-800 text-[10px]">
                  <span>➕</span> Make a new folder
                </span>
              </div>
            </div>

            {/* Other Places */}
            <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
              <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
                <span>Other Places</span>
                <span className="text-[10px]">▲</span>
              </div>
              <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
                <span
                  onClick={() => onOpenApp?.('my-computer')}
                  className="hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <img src="/icons/my-computer.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Computer
                </span>
                <span
                  onClick={() => onOpenApp?.('my-documents')}
                  className="hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <img src="/icons/my-documents.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Documents
                </span>
                <span
                  onClick={() => onOpenApp?.('control-panel')}
                  className="hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <img src="/icons/control-panel.png" alt="" className="w-3.5 h-3.5 object-contain" /> Control Panel
                </span>
              </div>
            </div>

            {/* Details Panel — shows selected game info */}
            <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
              <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
                <span>Details</span>
                <span className="text-[10px]">▲</span>
              </div>
              <div className="p-2 bg-[#d6dff7] text-neutral-800 text-[10px] leading-tight flex flex-col gap-1">
                {selected ? (() => {
                  const g = GAMES.find(gm => gm.id === selected)!
                  return (
                    <>
                      <div className="font-bold text-blue-950 flex items-center gap-1.5">
                        {g.icon ? <img src={g.icon} alt="" className="w-4 h-4 object-contain" /> : <span>{g.emoji}</span>}
                        <span>{g.name}</span>
                      </div>
                      <div className="text-neutral-600">Application</div>
                      <div className="text-neutral-600">{g.desc}</div>
                      <div className="text-neutral-600">Size: {g.size}</div>
                      <div className="text-neutral-600">Date Modified: 09/16/2026</div>
                    </>
                  )
                })() : (
                  <>
                    <div className="font-bold text-blue-950">Games</div>
                    <div className="text-neutral-600">Folder</div>
                    <div className="text-neutral-600">{GAMES.length} items</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Folder Content */}
          <div
            onClick={() => setSelected(null)}
            className="flex-1 bg-white p-4 overflow-y-auto"
          >
            {/* Folder Header */}
            <div className="text-[11px] text-neutral-500 mb-3 border-b border-neutral-200 pb-1 flex justify-between items-center">
              <span>Files Stored in Games</span>
              <span className="text-[10px] text-neutral-400">Double-click to launch</span>
            </div>

            {/* Grid of Files */}
            <div className="flex flex-wrap gap-4 items-start">
              {GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={(e) => { e.stopPropagation(); setSelected(game.id) }}
                  onDoubleClick={(e) => { e.stopPropagation(); setView(game.id) }}
                  className={`w-[100px] p-2 flex flex-col items-center rounded cursor-pointer transition-colors group relative ${
                    selected === game.id
                      ? 'bg-[#0b61ff]/20 border border-[#0b61ff]/70 shadow-xs'
                      : 'hover:bg-neutral-100 border border-transparent'
                  }`}
                >
                  {/* File Icon */}
                  <div className="relative w-14 h-14 flex items-center justify-center mb-1">
                    {game.icon ? (
                      <img
                        src={game.icon}
                        alt={game.name}
                        className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-[42px] drop-shadow-md group-hover:scale-105 transition-transform">
                        {game.emoji}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded shadow">
                      EXE
                    </span>
                  </div>

                  {/* File Title */}
                  <span
                    className={`text-center text-xs font-semibold px-1 rounded ${
                      selected === game.id ? 'bg-[#316ac5] text-white' : 'text-neutral-900 group-hover:text-blue-900'
                    }`}
                  >
                    {game.name}
                  </span>

                  {/* File Subtitle */}
                  <span className="text-[10px] text-neutral-500 text-center mt-0.5">Application</span>

                  {/* Quick Play Button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setView(game.id) }}
                    className="mt-2 w-full py-0.5 bg-gradient-to-b from-[#3c8bf0] to-[#0055ea] hover:brightness-110 text-white rounded text-[10px] font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>▶</span> Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explorer Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none shrink-0">
        <span>{statusText}</span>
        <span>My Computer</span>
      </div>
    </div>
  )
}
