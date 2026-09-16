interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenApp: (appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku') => void
  onLogOff: () => void
  onTurnOff: () => void
}

export default function StartMenu({ isOpen, onClose, onOpenApp, onLogOff, onTurnOff }: StartMenuProps) {
  if (!isOpen) return null

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-[30px] left-0 w-[380px] sm:w-[420px] bg-[#003399] rounded-t-lg shadow-[0_8px_30px_rgba(0,0,0,0.65)] border-2 border-[#003399] flex flex-col z-50 select-none overflow-hidden text-neutral-800 font-sans"
    >
      {/* Top Header with User Profile */}
      <div className="h-[60px] bg-gradient-to-r from-[#003399] via-[#0055ea] to-[#2277ff] p-3 flex items-center gap-3 border-b-2 border-amber-400/80 shadow-inner relative">
        {/* User Avatar Frame */}
        <div className="w-12 h-12 rounded border-2 border-amber-300 overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-md shrink-0">
          🦆
        </div>
        <div>
          <div className="text-white font-bold text-base tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Nivesh
          </div>
          <div className="text-blue-200 text-[11px]">Windows XP Professional</div>
        </div>
      </div>

      {/* Two-Column Middle Body */}
      <div className="flex bg-white h-[380px]">
        {/* Left Column (White background - Applications) */}
        <div className="flex-1 bg-white p-2 flex flex-col justify-between border-r border-[#95bdee] min-h-0 overflow-hidden">
          {/* Scrollable Applications List */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 min-h-0">
            {/* Pinned App: Internet */}
            <div
              onClick={() => {
                onOpenApp('internet')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/internet-explorer.png" alt="Internet Explorer" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">Internet</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Internet Explorer</span>
              </div>
            </div>

            {/* Pinned App: E-mail */}
            <div
              onClick={() => {
                onOpenApp('notepad')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 flex items-center justify-center text-xl shrink-0">✉️</div>
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">E-mail</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Outlook Express</span>
              </div>
            </div>

            <div className="h-px bg-neutral-200 my-1 mx-1" />

            {/* Recent App: Notepad */}
            <div
              onClick={() => {
                onOpenApp('notepad')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/notepad.png" alt="Notepad" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">Notepad</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Text Editor</span>
              </div>
            </div>

            {/* Recent App: My Documents */}
            <div
              onClick={() => {
                onOpenApp('my-documents')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/my-documents.png" alt="My Documents" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">My Documents</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Personal Files</span>
              </div>
            </div>

            {/* Recent App: My Computer */}
            <div
              onClick={() => {
                onOpenApp('my-computer')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/my-computer.png" alt="My Computer" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">My Computer</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">System Drives</span>
              </div>
            </div>

            {/* Media Player */}
            <div
              onClick={() => {
                onOpenApp('media-player')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/wmp.png" alt="Windows Media Player" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">Windows Media Player</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Audio & Video</span>
              </div>
            </div>

            {/* Games Folder */}
            <div
              onClick={() => {
                onOpenApp('games')
                onClose()
              }}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer transition-colors"
            >
              <img src="/icons/games.png" alt="Games" className="w-7 h-7 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-[12px] group-hover:text-white text-neutral-900">Games</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-blue-100">Games Folder</span>
              </div>
            </div>
          </div>

          {/* All Programs Green Bar */}
          <div className="border-t border-neutral-200 pt-2 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => onOpenApp('my-computer')}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded hover:bg-[#316ac5] hover:text-white group cursor-pointer font-bold text-[12px] text-neutral-800"
            >
              <span>All Programs</span>
              <span className="w-4 h-4 rounded-full bg-[#388e3c] group-hover:bg-emerald-400 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                ▶
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (Light Blue background - System Folders & Tools) */}
        <div className="w-[170px] bg-[#d3e5fa] p-2 flex flex-col gap-1 text-[11px] text-blue-950 overflow-y-auto min-h-0">
          <div
            onClick={() => {
              onOpenApp('my-documents')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <img src="/icons/my-documents.png" alt="" className="w-5 h-5 object-contain shrink-0" />
            <span className="font-bold">My Documents</span>
          </div>

          <div
            onClick={() => {
              onOpenApp('my-documents')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <span className="text-base">🖼️</span>
            <span>My Pictures</span>
          </div>

          <div
            onClick={() => {
              onOpenApp('my-documents')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <span className="text-base">🎵</span>
            <span>My Music</span>
          </div>

          <div
            onClick={() => {
              onOpenApp('my-computer')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <img src="/icons/my-computer.png" alt="" className="w-5 h-5 object-contain shrink-0" />
            <span className="font-bold">My Computer</span>
          </div>

          <div className="h-px bg-[#b0cbed] my-1" />

          <div
            onClick={() => {
              onOpenApp('control-panel')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <img src="/icons/control-panel.png" alt="" className="w-5 h-5 object-contain shrink-0" />
            <span>Control Panel</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer">
            <span className="text-base">🌐</span>
            <span>Connect To</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer">
            <span className="text-base">🖨️</span>
            <span>Printers and Faxes</span>
          </div>

          <div className="h-px bg-[#b0cbed] my-1" />

          <div
            onClick={() => {
              onOpenApp('notepad')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <span className="text-base">❓</span>
            <span>Help and Support</span>
          </div>

          <div
            onClick={() => {
              onOpenApp('my-computer')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <span className="text-base">🔍</span>
            <span>Search</span>
          </div>

          <div
            onClick={() => {
              onOpenApp('notepad')
              onClose()
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white cursor-pointer"
          >
            <span className="text-base">⚡</span>
            <span>Run...</span>
          </div>
        </div>
      </div>

      {/* Bottom Navy Bar: Log Off and Turn Off Computer */}
      <div className="h-[44px] bg-gradient-to-r from-[#002d96] via-[#0044cc] to-[#002d96] border-t-2 border-amber-400/80 px-4 flex items-center justify-end gap-4 shadow-inner">
        {/* Log Off Button */}
        <button
          type="button"
          onClick={onLogOff}
          className="flex items-center gap-2 text-white hover:text-amber-200 text-xs font-semibold cursor-pointer transition-colors"
        >
          <div className="w-5 h-5 rounded bg-amber-500 border border-amber-300 flex items-center justify-center text-[10px] shadow-xs">
            🔑
          </div>
          <span>Log Off</span>
        </button>

        {/* Turn Off Computer Button */}
        <button
          type="button"
          onClick={onTurnOff}
          className="flex items-center gap-2 text-white hover:text-amber-200 text-xs font-semibold cursor-pointer transition-colors"
        >
          <div className="w-5 h-5 rounded bg-red-600 border border-red-400 flex items-center justify-center text-[10px] shadow-xs">
            ⏻
          </div>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  )
}
