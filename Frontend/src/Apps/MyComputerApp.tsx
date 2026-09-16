import { useState } from 'react'

interface MyComputerAppProps {
  onOpenApp?: (appId: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku') => void
}

type LocationPath =
  | 'my-computer'
  | 'drive-c'
  | 'drive-c-windows'
  | 'drive-c-program-files'
  | 'drive-c-docs'
  | 'drive-d'
  | 'drive-a'
  | 'shared-docs'
  | 'network-places'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file' | 'drive' | 'app'
  subType?: string
  icon?: string
  emoji?: string
  size?: string
  date?: string
  targetLocation?: LocationPath
  targetApp?: 'my-computer' | 'my-documents' | 'notepad' | 'internet' | 'recycle-bin' | 'games' | 'control-panel' | 'media-player' | 'sudoku'
  content?: string
}

export default function MyComputerApp({ onOpenApp }: MyComputerAppProps) {
  // Navigation stack state
  const [history, setHistory] = useState<LocationPath[]>(['my-computer'])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [selectedItemId, setSelectedItemId] = useState<string | null>('drive-c')

  // Modals state
  const [activeModal, setActiveModal] = useState<'none' | 'system-info' | 'add-remove-programs'>('none')
  const [systemInfoTab, setSystemInfoTab] = useState<'general' | 'computerName' | 'hardware' | 'advanced'>('general')
  const [openedFile, setOpenedFile] = useState<FileItem | null>(null)

  // Add/Remove programs list state
  const [installedPrograms, setInstalledPrograms] = useState([
    { id: 'office', name: 'Microsoft Office 2003 Professional', size: '450.00 MB', freq: 'Frequently', lastUsed: '09/14/2026', icon: '📄' },
    { id: 'wmp', name: 'Windows Media Player 9 Series', size: '24.50 MB', freq: 'Rarely', lastUsed: '09/16/2026', icon: '🎵' },
    { id: 'winrar', name: 'WinRAR 3.40 Archive Manager', size: '3.20 MB', freq: 'Occasionally', lastUsed: '09/10/2026', icon: '📦' },
    { id: 'acrobat', name: 'Adobe Acrobat Reader 6.0', size: '35.80 MB', freq: 'Occasionally', lastUsed: '09/01/2026', icon: '📑' },
    { id: 'msn', name: 'MSN Messenger 6.2', size: '12.40 MB', freq: 'Frequently', lastUsed: '09/15/2026', icon: '💬' },
    { id: 'sudoku', name: 'Sudoku XP Puzzle Edition', size: '1.20 MB', freq: 'Frequently', lastUsed: '09/16/2026', icon: '🔢' },
    { id: 'solitaire', name: 'Solitaire Classic', size: '0.80 MB', freq: 'Frequently', lastUsed: '09/16/2026', icon: '🃏' },
    { id: 'ie6', name: 'Microsoft Internet Explorer 6.0', size: '45.00 MB', freq: 'Frequently', lastUsed: '09/16/2026', icon: '🌐' },
  ])
  const [selectedProgramId, setSelectedProgramId] = useState<string>('office')

  const currentPath = history[historyIndex]

  // Navigation handlers
  const navigateTo = (path: LocationPath) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(path)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setSelectedItemId(null)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSelectedItemId(null)
    }
  }

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSelectedItemId(null)
    }
  }

  const handleUp = () => {
    if (currentPath === 'my-computer') return
    if (currentPath === 'drive-c-windows' || currentPath === 'drive-c-program-files' || currentPath === 'drive-c-docs') {
      navigateTo('drive-c')
    } else {
      navigateTo('my-computer')
    }
  }

  // Address label formatting
  const getAddressLabel = (path: LocationPath): string => {
    switch (path) {
      case 'my-computer':
        return 'My Computer'
      case 'drive-c':
        return 'C:\\'
      case 'drive-c-windows':
        return 'C:\\WINDOWS'
      case 'drive-c-program-files':
        return 'C:\\Program Files'
      case 'drive-c-docs':
        return 'C:\\Documents and Settings'
      case 'drive-d':
        return 'D:\\ (CD Drive - XP Installation)'
      case 'drive-a':
        return 'A:\\ (3½ Floppy)'
      case 'shared-docs':
        return 'C:\\Documents and Settings\\All Users\\Shared Documents'
      case 'network-places':
        return 'My Network Places'
    }
  }

  // File system contents per directory
  const getDirectoryItems = (path: LocationPath): FileItem[] => {
    switch (path) {
      case 'drive-c':
        return [
          { id: 'win', name: 'WINDOWS', type: 'folder', subType: 'System Folder', icon: '/icons/folder.png', date: '08/24/2004', targetLocation: 'drive-c-windows' },
          { id: 'pf', name: 'Program Files', type: 'folder', subType: 'System Folder', icon: '/icons/folder.png', date: '08/24/2004', targetLocation: 'drive-c-program-files' },
          { id: 'docs', name: 'Documents and Settings', type: 'folder', subType: 'User Profiles', icon: '/icons/folder.png', date: '08/24/2004', targetLocation: 'drive-c-docs' },
          {
            id: 'boot-ini',
            name: 'boot.ini',
            type: 'file',
            subType: 'Configuration Settings',
            emoji: '⚙️',
            size: '211 bytes',
            date: '08/24/2004',
            content: `[boot loader]\ntimeout=30\ndefault=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS\n[operating systems]\nmulti(0)disk(0)rdisk(0)partition(1)\\WINDOWS="Microsoft Windows XP Professional" /noexecute=optin /fastdetect`,
          },
          {
            id: 'autoexec',
            name: 'autoexec.bat',
            type: 'file',
            subType: 'MS-DOS Batch File',
            emoji: '⚙️',
            size: '0 bytes',
            date: '08/24/2004',
            content: `@ECHO OFF\nREM Windows XP MS-DOS Subsystem Startup\nPROMPT $P$G\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND\nSET TEMP=C:\\WINDOWS\\TEMP\nSET TMP=C:\\WINDOWS\\TEMP`,
          },
          {
            id: 'config-sys',
            name: 'config.sys',
            type: 'file',
            subType: 'System Configuration',
            emoji: '⚙️',
            size: '0 bytes',
            date: '08/24/2004',
            content: `REM Windows XP MS-DOS Configuration\nDEVICE=C:\\WINDOWS\\HIMEM.SYS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=40`,
          },
          {
            id: 'pagefile',
            name: 'pagefile.sys',
            type: 'file',
            subType: 'System Page File',
            emoji: '🗄️',
            size: '768 MB',
            date: '09/16/2026',
            content: `[Windows Virtual Memory Paging File - 768 MB Allocated]`,
          },
        ]

      case 'drive-c-windows':
        return [
          { id: 'sys32', name: 'System32', type: 'folder', subType: 'System Folder', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'fonts', name: 'Fonts', type: 'folder', subType: 'System Fonts', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'media', name: 'Media', type: 'folder', subType: 'Sound Schemes', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'explorer', name: 'explorer.exe', type: 'app', subType: 'Application', emoji: '🗔', size: '1,032 KB', date: '08/24/2004' },
          { id: 'notepad-app', name: 'notepad.exe', type: 'app', subType: 'Application', icon: '/icons/notepad.png', size: '69 KB', date: '08/24/2004', targetApp: 'notepad' },
          {
            id: 'win-ini',
            name: 'win.ini',
            type: 'file',
            subType: 'Configuration Settings',
            emoji: '📝',
            size: '428 bytes',
            date: '08/24/2004',
            content: `; for 16-bit app support\n[fonts]\n[extensions]\n[mci extensions]\n[files]\n[Mail]\nMAPI=1\nCMC=1\nCMCDLLNAME32=mapi32.dll\nCMCDLLNAME=mapi.dll\nMAPIX=1\nMAPIXVER=1.0.0.1\nOLEMessaging=1`,
          },
        ]

      case 'drive-c-program-files':
        return [
          { id: 'pf-games', name: 'Games', type: 'folder', subType: 'System Folder', icon: '/icons/games.png', date: '08/24/2004', targetApp: 'games' },
          { id: 'pf-ie', name: 'Internet Explorer', type: 'folder', subType: 'System Folder', icon: '/icons/internet-explorer.png', date: '08/24/2004', targetApp: 'internet' },
          { id: 'pf-wmp', name: 'Windows Media Player', type: 'folder', subType: 'System Folder', icon: '/icons/wmp.png', date: '08/24/2004', targetApp: 'media-player' },
          { id: 'pf-acc', name: 'Accessories', type: 'folder', subType: 'System Folder', icon: '/icons/folder.png', date: '08/24/2004' },
        ]

      case 'drive-c-docs':
        return [
          { id: 'doc-all', name: 'All Users', type: 'folder', subType: 'Shared Profile', icon: '/icons/folder.png', date: '08/24/2004', targetLocation: 'shared-docs' },
          { id: 'doc-nivesh', name: 'Nivesh', type: 'folder', subType: 'User Profile', icon: '/icons/my-documents.png', date: '08/24/2004', targetApp: 'my-documents' },
        ]

      case 'drive-d':
        return [
          { id: 'i386', name: 'I386', type: 'folder', subType: 'Windows Setup Directory', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'support', name: 'SUPPORT', type: 'folder', subType: 'Deployment Tools', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'docs-d', name: 'DOCS', type: 'folder', subType: 'ReadMe Documentation', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'setup-exe', name: 'SETUP.EXE', type: 'app', subType: 'Application', emoji: '💿', size: '1,420 KB', date: '08/24/2004' },
          {
            id: 'autorun-inf',
            name: 'AUTORUN.INF',
            type: 'file',
            subType: 'Setup Information',
            emoji: '⚙️',
            size: '56 bytes',
            date: '08/24/2004',
            content: `[AutoRun]\nOPEN=SETUP.EXE\nICON=SETUP.EXE,0`,
          },
          {
            id: 'readme-htm',
            name: 'README.HTM',
            type: 'file',
            subType: 'HTML Document',
            emoji: '🌐',
            size: '34.2 KB',
            date: '08/24/2004',
            content: `Microsoft(R) Windows(R) XP Professional Service Pack 3\n\nWelcome to Microsoft Windows XP Professional!\n\nThis CD-ROM contains the complete installation software and recovery tools for Windows XP Service Pack 3.\n\nMinimum System Requirements:\n- Intel Pentium 233 MHz or higher processor\n- 64 MB of RAM (128 MB recommended)\n- 1.5 GB of available hard-disk space\n- Super VGA (800 x 600) or higher resolution video adapter`,
          },
        ]

      case 'drive-a':
        return [
          {
            id: 'notes-txt',
            name: 'homework_notes.txt',
            type: 'file',
            subType: 'Text Document',
            emoji: '📝',
            size: '1.4 KB',
            date: '09/15/2026',
            content: `University Project Notes - Operating System Simulation:\n\n1. Design authentic Windows XP UI components.\n2. Add dynamic sound and visual controls.\n3. Verify file hierarchy and static drive sizes.\n4. Complete Solitaire and Sudoku apps.\n\nDue Date: Friday!`,
          },
          {
            id: 'budget-xls',
            name: 'budget_2004.xls',
            type: 'file',
            subType: 'Microsoft Excel Worksheet',
            emoji: '📊',
            size: '28.5 KB',
            date: '04/12/2004',
            content: `Quarterly Budget 2004:\nQ1: $12,400\nQ2: $15,800\nQ3: $14,200\nQ4: $18,900\nTotal Annual: $61,300`,
          },
          {
            id: 'floppy-driver',
            name: 'FLOPPY.SYS',
            type: 'file',
            subType: 'System Driver',
            emoji: '💾',
            size: '14.2 KB',
            date: '08/24/2004',
            content: `[Standard Floppy Disk Controller Driver Binary]`,
          },
        ]

      case 'shared-docs':
        return [
          { id: 'sh-music', name: 'Shared Music', type: 'folder', subType: 'Audio Collection', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'sh-pics', name: 'Shared Pictures', type: 'folder', subType: 'Picture Collection', icon: '/icons/folder.png', date: '08/24/2004' },
          { id: 'sh-video', name: 'Shared Video', type: 'folder', subType: 'Video Collection', icon: '/icons/folder.png', date: '08/24/2004' },
          {
            id: 'sh-readme',
            name: 'Shared_Notes.txt',
            type: 'file',
            subType: 'Text Document',
            emoji: '📝',
            size: '850 bytes',
            date: '09/16/2026',
            content: `Shared Documents Folder:\n\nFiles placed in this folder are accessible to all user accounts created on this computer (Nivesh, Guest, Administrator).\n\nYou can use this directory to share music albums, wallpaper images, and project documentation across users.`,
          },
        ]

      case 'network-places':
        return [
          { id: 'net-entire', name: 'Entire Network', type: 'folder', subType: 'Network Directory', emoji: '🌐', date: '09/16/2026' },
          { id: 'net-mshome', name: 'MSHOME Workgroup', type: 'folder', subType: 'Workgroup', emoji: '🖥️', date: '09/16/2026' },
          { id: 'net-share', name: 'SharedDocs on NIVESH-PC', type: 'folder', subType: 'Network Share', icon: '/icons/folder.png', date: '09/16/2026', targetLocation: 'shared-docs' },
        ]

      default:
        return []
    }
  }

  const currentItems = getDirectoryItems(currentPath)
  const selectedItem = currentItems.find((item) => item.id === selectedItemId)

  // Handle double clicking items
  const handleItemDoubleClick = (item: FileItem) => {
    if (item.targetApp && onOpenApp) {
      onOpenApp(item.targetApp)
      return
    }
    if (item.targetLocation) {
      navigateTo(item.targetLocation)
      return
    }
    if (item.content !== undefined) {
      setOpenedFile(item)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans h-full select-none overflow-hidden relative">
      {/* Explorer Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] select-none text-neutral-700 shrink-0">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span
          onClick={() => setActiveModal('add-remove-programs')}
          className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer"
        >
          Tools
        </span>
        <span
          onClick={() => setActiveModal('system-info')}
          className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer"
        >
          Help
        </span>
      </div>

      {/* Explorer Standard Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] select-none shrink-0">
        <button
          type="button"
          onClick={handleBack}
          disabled={historyIndex === 0}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            historyIndex > 0 ? 'hover:bg-white/70 text-neutral-800 cursor-pointer' : 'text-neutral-400 cursor-not-allowed opacity-60'
          }`}
          title="Back"
        >
          <span className={`font-bold text-sm ${historyIndex > 0 ? 'text-emerald-600' : 'text-neutral-400'}`}>🠈</span> Back
        </button>
        <button
          type="button"
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            historyIndex < history.length - 1 ? 'hover:bg-white/70 text-neutral-800 cursor-pointer' : 'text-neutral-400 cursor-not-allowed opacity-60'
          }`}
          title="Forward"
        >
          <span className={`font-bold text-sm ${historyIndex < history.length - 1 ? 'text-emerald-600' : 'text-neutral-400'}`}>🠊</span>
        </button>
        <button
          type="button"
          onClick={handleUp}
          disabled={currentPath === 'my-computer'}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            currentPath !== 'my-computer' ? 'hover:bg-white/70 text-neutral-800 cursor-pointer' : 'text-neutral-400 cursor-not-allowed opacity-60'
          }`}
          title="Up One Level"
        >
          <span>📁🠉</span>
        </button>
        <div className="h-4 w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => setActiveModal('system-info')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/70 text-neutral-700 cursor-pointer"
        >
          <span>🔍</span> System Info
        </button>
        <button
          type="button"
          onClick={() => navigateTo('my-computer')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/70 text-neutral-700 cursor-pointer"
        >
          <span>📂</span> Folders
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px] shrink-0">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <img src="/icons/my-computer.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-neutral-800 font-medium">{getAddressLabel(currentPath)}</span>
        </div>
        <button
          type="button"
          onClick={() => navigateTo(currentPath)}
          className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer"
        >
          Go
        </button>
      </div>

      {/* Main Split Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows XP Tasks Sidebar */}
        <div className="w-[185px] sm:w-[200px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px] shrink-0">
          {/* System Tasks Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>System Tasks</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <div
                onClick={() => setActiveModal('system-info')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <span>ℹ️</span> View system info
              </div>
              <div
                onClick={() => setActiveModal('add-remove-programs')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <span>➕</span> Add or remove programs
              </div>
              <div
                onClick={() => onOpenApp?.('control-panel')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <img src="/icons/control-panel.png" alt="" className="w-3.5 h-3.5 object-contain" /> Change a setting
              </div>
            </div>
          </div>

          {/* Other Places Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Other Places</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <div
                onClick={() => navigateTo('network-places')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <span>🌐</span> My Network Places
              </div>
              <div
                onClick={() => onOpenApp?.('my-documents')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <img src="/icons/my-documents.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Documents
              </div>
              <div
                onClick={() => navigateTo('shared-docs')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <img src="/icons/folder.png" alt="" className="w-3.5 h-3.5 object-contain" /> Shared Documents
              </div>
              <div
                onClick={() => onOpenApp?.('control-panel')}
                className="hover:underline cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <img src="/icons/control-panel.png" alt="" className="w-3.5 h-3.5 object-contain" /> Control Panel
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Details</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] text-neutral-800 text-[10px] leading-tight">
              {currentPath === 'my-computer' && selectedItemId === 'drive-c' ? (
                <>
                  <div className="font-bold text-blue-950">Local Disk (C:)</div>
                  <div className="text-neutral-600 mt-1">Local Fixed Disk</div>
                  <div className="text-neutral-600">File System: NTFS</div>
                  <div className="text-neutral-600">Free Space: 52.4 GB</div>
                  <div className="text-neutral-600">Total Size: 74.5 GB</div>
                </>
              ) : currentPath === 'my-computer' && selectedItemId === 'drive-d' ? (
                <>
                  <div className="font-bold text-blue-950">Backup Disk (D:)</div>
                  <div className="text-neutral-600 mt-1">Local Fixed Disk</div>
                  <div className="text-neutral-600">File System: NTFS</div>
                  <div className="text-neutral-600">Free Space: 18.2 GB</div>
                  <div className="text-neutral-600">Total Size: 40.0 GB</div>
                </>
              ) : currentPath === 'my-computer' && selectedItemId === 'drive-a' ? (
                <>
                  <div className="font-bold text-blue-950">3½ Floppy (A:)</div>
                  <div className="text-neutral-600 mt-1">3½-Inch Floppy Disk</div>
                  <div className="text-neutral-600">File System: FAT</div>
                  <div className="text-neutral-600">Free Space: 720 KB</div>
                  <div className="text-neutral-600">Total Size: 1.44 MB</div>
                </>
              ) : currentPath === 'my-computer' && selectedItemId === 'drive-cd' ? (
                <>
                  <div className="font-bold text-blue-950">CD Drive (E:)</div>
                  <div className="text-neutral-600 mt-1">Compact Disc</div>
                  <div className="text-neutral-600">File System: CDFS</div>
                  <div className="text-neutral-600">Free Space: 0 bytes</div>
                  <div className="text-neutral-600">Total Size: 650 MB</div>
                </>
              ) : currentPath === 'my-computer' && selectedItemId === 'shared-docs' ? (
                <>
                  <div className="font-bold text-blue-950">Shared Documents</div>
                  <div className="text-neutral-600 mt-1">System Folder</div>
                  <div className="text-neutral-600">Shared across all local user accounts</div>
                </>
              ) : currentPath === 'my-computer' && selectedItemId === 'nivesh-docs' ? (
                <>
                  <div className="font-bold text-blue-950">Nivesh&apos;s Documents</div>
                  <div className="text-neutral-600 mt-1">Personal Folder</div>
                  <div className="text-neutral-600">Location: C:\Documents and Settings\Nivesh</div>
                </>
              ) : selectedItem ? (
                <>
                  <div className="font-bold text-blue-950 truncate">{selectedItem.name}</div>
                  <div className="text-neutral-600 mt-1">{selectedItem.subType || (selectedItem.type === 'folder' ? 'File Folder' : 'Document')}</div>
                  {selectedItem.size && <div className="text-neutral-600">Size: {selectedItem.size}</div>}
                  {selectedItem.date && <div className="text-neutral-600">Date Modified: {selectedItem.date}</div>}
                </>
              ) : (
                <>
                  <div className="font-bold text-blue-950">{getAddressLabel(currentPath)}</div>
                  <div className="text-neutral-600 mt-1">System Folder</div>
                  <div className="text-neutral-600">{currentItems.length} objects</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Drives & Folders View */}
        <div
          onClick={() => setSelectedItemId(null)}
          className="flex-1 bg-white p-4 overflow-y-auto"
        >
          {/* ROOT VIEW: My Computer */}
          {currentPath === 'my-computer' ? (
            <div>
              {/* Section 1: Files Stored on this Computer */}
              <div className="mb-5">
                <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
                  Files Stored on This Computer
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('shared-docs') }}
                    onDoubleClick={() => navigateTo('shared-docs')}
                    className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                      selectedItemId === 'shared-docs' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <img src="/icons/folder.png" alt="" className="w-6 h-6 object-contain" />
                    <span className="font-medium text-[11px]">Shared Documents</span>
                  </div>
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('nivesh-docs') }}
                    onDoubleClick={() => onOpenApp?.('my-documents')}
                    className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                      selectedItemId === 'nivesh-docs' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <img src="/icons/my-documents.png" alt="" className="w-6 h-6 object-contain" />
                    <span className="font-medium text-[11px]">Nivesh&apos;s Documents</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Hard Disk Drives */}
              <div className="mb-5">
                <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
                  Hard Disk Drives
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Drive C */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('drive-c') }}
                    onDoubleClick={() => navigateTo('drive-c')}
                    className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer ${
                      selectedItemId === 'drive-c' ? 'bg-[#316ac5] text-white border-[#316ac5]' : 'border-neutral-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-b from-neutral-200 to-neutral-400 rounded-sm border border-neutral-500 flex items-center justify-center text-xl shadow-xs shrink-0">
                      💾
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[12px]">Local Disk (C:)</div>
                      <div className={`text-[10px] mt-0.5 ${selectedItemId === 'drive-c' ? 'text-blue-100' : 'text-neutral-500'}`}>
                        52.4 GB free of 74.5 GB
                      </div>
                      <div className="w-full h-2 bg-neutral-200 rounded-xs overflow-hidden mt-1 border border-neutral-300">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[30%]" />
                      </div>
                    </div>
                  </div>

                  {/* Drive D */}
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('drive-d') }}
                    onDoubleClick={() => navigateTo('drive-d')}
                    className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer ${
                      selectedItemId === 'drive-d' ? 'bg-[#316ac5] text-white border-[#316ac5]' : 'border-neutral-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-b from-neutral-200 to-neutral-400 rounded-sm border border-neutral-500 flex items-center justify-center text-xl shadow-xs shrink-0">
                      💾
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[12px]">Backup (D:)</div>
                      <div className={`text-[10px] mt-0.5 ${selectedItemId === 'drive-d' ? 'text-blue-100' : 'text-neutral-500'}`}>
                        18.2 GB free of 40.0 GB
                      </div>
                      <div className="w-full h-2 bg-neutral-200 rounded-xs overflow-hidden mt-1 border border-neutral-300">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[54%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Devices with Removable Storage */}
              <div>
                <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
                  Devices with Removable Storage
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('drive-a') }}
                    onDoubleClick={() => navigateTo('drive-a')}
                    className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                      selectedItemId === 'drive-a' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-2xl">💾</span>
                    <div>
                      <div className="font-medium text-[11px]">3½ Floppy (A:)</div>
                      <div className={`text-[10px] ${selectedItemId === 'drive-a' ? 'text-blue-100' : 'text-neutral-400'}`}>
                        1.44 MB
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedItemId('drive-cd') }}
                    onDoubleClick={() => navigateTo('drive-d')}
                    className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                      selectedItemId === 'drive-cd' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-2xl">💿</span>
                    <div>
                      <div className="font-medium text-[11px]">CD Drive (E:)</div>
                      <div className={`text-[10px] ${selectedItemId === 'drive-cd' ? 'text-blue-100' : 'text-neutral-400'}`}>
                        Windows XP Pro SP3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SUBDIRECTORY VIEW (C:, D:, A:, Shared Docs, Network Places, etc.) */
            <div>
              <div className="text-[11px] text-neutral-500 mb-3 border-b border-neutral-200 pb-1 flex justify-between items-center">
                <span className="font-semibold text-blue-950">Contents of {getAddressLabel(currentPath)}</span>
                <span className="text-[10px] text-neutral-400">Double-click to open</span>
              </div>

              {currentItems.length === 0 ? (
                <div className="text-center py-10 text-neutral-400">This folder is empty.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {currentItems.map((item) => {
                    const isSelected = selectedItemId === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id) }}
                        onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item) }}
                        className={`flex flex-col items-center p-2 rounded cursor-pointer select-none text-center group ${
                          isSelected ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50 text-neutral-800'
                        }`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center mb-1">
                          {item.icon ? (
                            <img src={item.icon} alt="" className="w-8 h-8 object-contain drop-shadow-xs" />
                          ) : (
                            <span className="text-3xl drop-shadow-xs">{item.emoji || '📁'}</span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium leading-tight max-w-[120px] truncate">
                          {item.name}
                        </span>
                        {item.size ? (
                          <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-blue-200' : 'text-neutral-400'}`}>
                            {item.size}
                          </span>
                        ) : (
                          <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-blue-200' : 'text-neutral-400'}`}>
                            {item.subType || 'Folder'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Explorer Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none shrink-0">
        <span>{currentPath === 'my-computer' ? '5 objects' : `${currentItems.length} objects`}</span>
        <span>My Computer</span>
      </div>

      {/* MODAL 1: Windows XP System Properties Dialog */}
      {activeModal === 'system-info' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-2">
          <div className="w-full max-w-[430px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden font-sans text-neutral-800 text-[11px]">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-2 py-1 text-white font-bold flex justify-between items-center select-none">
              <div className="flex items-center gap-1.5">
                <img src="/icons/my-computer.png" alt="" className="w-3.5 h-3.5 object-contain" />
                <span>System Properties</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-4 h-4 bg-[#d84020] hover:bg-red-600 rounded-xs flex items-center justify-center text-white font-bold text-xs leading-none shadow-inner cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tabs Header */}
            <div className="px-2 pt-2 flex gap-1 border-b border-[#919b9c] select-none text-[11px]">
              <button
                type="button"
                onClick={() => setSystemInfoTab('general')}
                className={`px-3 py-1 rounded-t border-t border-l border-r ${
                  systemInfoTab === 'general' ? 'bg-[#ece9d8] border-[#919b9c] font-bold -mb-px' : 'bg-[#e0dccf] border-transparent text-neutral-600'
                }`}
              >
                General
              </button>
              <button
                type="button"
                onClick={() => setSystemInfoTab('computerName')}
                className={`px-3 py-1 rounded-t border-t border-l border-r ${
                  systemInfoTab === 'computerName' ? 'bg-[#ece9d8] border-[#919b9c] font-bold -mb-px' : 'bg-[#e0dccf] border-transparent text-neutral-600'
                }`}
              >
                Computer Name
              </button>
              <button
                type="button"
                onClick={() => setSystemInfoTab('hardware')}
                className={`px-3 py-1 rounded-t border-t border-l border-r ${
                  systemInfoTab === 'hardware' ? 'bg-[#ece9d8] border-[#919b9c] font-bold -mb-px' : 'bg-[#e0dccf] border-transparent text-neutral-600'
                }`}
              >
                Hardware
              </button>
              <button
                type="button"
                onClick={() => setSystemInfoTab('advanced')}
                className={`px-3 py-1 rounded-t border-t border-l border-r ${
                  systemInfoTab === 'advanced' ? 'bg-[#ece9d8] border-[#919b9c] font-bold -mb-px' : 'bg-[#e0dccf] border-transparent text-neutral-600'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-3">
              {systemInfoTab === 'general' && (
                <div className="flex gap-4 items-start">
                  {/* XP Flag Logo */}
                  <div className="w-24 shrink-0 flex flex-col items-center pt-2">
                    <img src="/windows-xp.png" alt="Windows XP" className="w-16 h-16 object-contain drop-shadow" />
                    <div className="text-[10px] font-bold text-blue-900 mt-2 text-center">
                      Microsoft®<br />Windows® XP
                    </div>
                  </div>

                  {/* System Info Text */}
                  <div className="flex-1 text-[11px] leading-tight space-y-3">
                    <div>
                      <div className="font-bold text-neutral-900">System:</div>
                      <div className="text-neutral-700 pl-3 mt-0.5">Microsoft Windows XP</div>
                      <div className="text-neutral-700 pl-3">Professional</div>
                      <div className="text-neutral-700 pl-3">Version 2002</div>
                      <div className="text-neutral-700 pl-3">Service Pack 3</div>
                    </div>

                    <div>
                      <div className="font-bold text-neutral-900">Registered to:</div>
                      <div className="text-neutral-700 pl-3 mt-0.5">Nivesh</div>
                      <div className="text-neutral-700 pl-3">NIVESH-WORKSTATION</div>
                      <div className="text-neutral-500 pl-3 text-[10px]">55274-640-1234567-23456</div>
                    </div>

                    <div>
                      <div className="font-bold text-neutral-900">Computer:</div>
                      <div className="text-neutral-700 pl-3 mt-0.5">Intel(R) Pentium(R) 4 CPU 3.20GHz</div>
                      <div className="text-neutral-700 pl-3">3.20 GHz, 1.00 GB of RAM</div>
                      <div className="text-neutral-500 pl-3 text-[10px]">Physical Address Extension</div>
                    </div>
                  </div>
                </div>
              )}

              {systemInfoTab === 'computerName' && (
                <div className="space-y-3 text-[11px]">
                  <div>Windows uses the following information to identify your computer on the network.</div>
                  <div className="bg-white border border-neutral-300 p-2.5 rounded space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Computer description:</span>
                      <span className="font-medium">Nivesh&apos;s Development Rig</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Full computer name:</span>
                      <span className="font-medium">NIVESH-PC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Workgroup:</span>
                      <span className="font-medium">MSHOME</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    To rename this computer or join a domain, click Network ID or Change in classic control panel.
                  </div>
                </div>
              )}

              {systemInfoTab === 'hardware' && (
                <div className="space-y-3 text-[11px]">
                  <div className="font-bold text-neutral-800">Hardware Wizard</div>
                  <div>The Add Hardware Wizard helps you install hardware.</div>
                  <div className="border-t border-neutral-300 pt-2 font-bold text-neutral-800">Device Manager</div>
                  <div>The Device Manager lists all the hardware devices installed on your computer.</div>
                  <div className="bg-white border border-neutral-300 p-2 text-[10px] text-neutral-600 rounded">
                    ✓ Intel(R) 82801EB Ultra ATA Storage Controller<br />
                    ✓ NVIDIA GeForce FX 5200 (128 MB)<br />
                    ✓ Realtek AC&apos;97 Audio Sound Card<br />
                    ✓ Realtek RTL8139 Family Fast Ethernet NIC
                  </div>
                </div>
              )}

              {systemInfoTab === 'advanced' && (
                <div className="space-y-2 text-[11px]">
                  <div className="font-bold text-neutral-800">Performance</div>
                  <div className="text-neutral-600">Visual effects, processor scheduling, memory usage, and virtual memory (768 MB).</div>
                  <div className="border-t border-neutral-300 pt-2 font-bold text-neutral-800">User Profiles</div>
                  <div className="text-neutral-600">Desktop settings associated with your logon (NIVESH - 14.8 MB).</div>
                  <div className="border-t border-neutral-300 pt-2 font-bold text-neutral-800">Startup and Recovery</div>
                  <div className="text-neutral-600">System startup, system failure, and debugging information.</div>
                </div>
              )}
            </div>

            {/* Bottom Buttons */}
            <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-4 py-0.5 bg-[#ece9d8] border border-[#0055ea] rounded hover:bg-blue-100 font-medium cursor-pointer shadow-xs"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-3 py-0.5 bg-[#ece9d8] border border-neutral-400 rounded hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled
                className="px-3 py-0.5 bg-[#ece9d8] border border-neutral-300 rounded text-neutral-400 cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Windows XP Add or Remove Programs Dialog */}
      {activeModal === 'add-remove-programs' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-2">
          <div className="w-full max-w-[560px] h-[440px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl flex flex-col overflow-hidden font-sans text-neutral-800 text-[11px]">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-2 py-1 text-white font-bold flex justify-between items-center select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <span>➕</span>
                <span>Add or Remove Programs</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-4 h-4 bg-[#d84020] hover:bg-red-600 rounded-xs flex items-center justify-center text-white font-bold text-xs leading-none shadow-inner cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Action Panels */}
              <div className="w-[120px] bg-gradient-to-b from-[#215dc6] to-[#124294] p-1.5 flex flex-col gap-1.5 text-white text-[10px] select-none shrink-0">
                <div className="bg-white/20 border border-white/40 rounded p-1.5 flex flex-col items-center text-center cursor-pointer shadow-inner">
                  <span className="text-xl">🗂️</span>
                  <span className="font-bold leading-tight mt-1">Change or Remove Programs</span>
                </div>
                <div className="hover:bg-white/10 rounded p-1.5 flex flex-col items-center text-center cursor-pointer text-white/80">
                  <span className="text-xl">💿</span>
                  <span className="leading-tight mt-1">Add New Programs</span>
                </div>
                <div className="hover:bg-white/10 rounded p-1.5 flex flex-col items-center text-center cursor-pointer text-white/80">
                  <span className="text-xl">🪟</span>
                  <span className="leading-tight mt-1">Add/Remove Windows Components</span>
                </div>
              </div>

              {/* Right Programs List */}
              <div className="flex-1 bg-white p-2 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center text-[11px] text-neutral-600 border-b border-neutral-300 pb-1 mb-1.5 shrink-0">
                  <span className="font-bold text-neutral-800">Currently installed programs:</span>
                  <div className="flex items-center gap-1">
                    <span>Sort by:</span>
                    <select className="border border-neutral-300 rounded text-[10px] px-1 py-0.5 bg-neutral-50">
                      <option>Name</option>
                      <option>Size</option>
                      <option>Frequency of Use</option>
                      <option>Date Last Used</option>
                    </select>
                  </div>
                </div>

                {/* Programs Scroll List */}
                <div className="flex-1 overflow-y-auto border border-neutral-300 divide-y divide-neutral-200">
                  {installedPrograms.map((prog) => {
                    const isSelected = selectedProgramId === prog.id
                    return (
                      <div
                        key={prog.id}
                        onClick={() => setSelectedProgramId(prog.id)}
                        className={`p-2 cursor-pointer text-[11px] ${
                          isSelected ? 'bg-[#d6e3f8] border-y border-blue-400' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-blue-950">
                            <span className="text-base">{prog.icon}</span>
                            <span>{prog.name}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500">Size: {prog.size}</div>
                        </div>

                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between items-end">
                            <div className="text-[10px] text-neutral-600 leading-tight">
                              <div>Used: <span className="font-medium text-neutral-800">{prog.freq}</span></div>
                              <div>Last Used On: <span className="font-medium text-neutral-800">{prog.lastUsed}</span></div>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  alert(`Configuring ${prog.name}...`)
                                }}
                                className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded hover:bg-blue-100 text-[10px] font-medium cursor-pointer shadow-xs"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setInstalledPrograms(prev => prev.filter(p => p.id !== prog.id))
                                }}
                                className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded hover:bg-red-100 text-[10px] font-medium cursor-pointer shadow-xs text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-1.5 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-neutral-500">{installedPrograms.length} installed applications</span>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-4 py-0.5 bg-[#ece9d8] border border-neutral-500 rounded hover:bg-neutral-200 font-medium cursor-pointer shadow-xs text-[11px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Text File / Notepad Viewer */}
      {openedFile && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-2">
          <div className="w-full max-w-[500px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl flex flex-col overflow-hidden font-sans text-neutral-800 text-[11px]">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#215dc6] to-[#0055ea] px-2 py-1 text-white font-bold flex justify-between items-center select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <img src="/icons/notepad.png" alt="" className="w-3.5 h-3.5 object-contain" />
                <span>{openedFile.name} - Notepad</span>
              </div>
              <button
                type="button"
                onClick={() => setOpenedFile(null)}
                className="w-4 h-4 bg-[#d84020] hover:bg-red-600 rounded-xs flex items-center justify-center text-white font-bold text-xs leading-none shadow-inner cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Menu Bar */}
            <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[10px] text-neutral-700 select-none">
              <span className="hover:bg-[#316ac5] hover:text-white px-1 rounded-xs cursor-pointer">File</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 rounded-xs cursor-pointer">Edit</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 rounded-xs cursor-pointer">Format</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 rounded-xs cursor-pointer">View</span>
              <span className="hover:bg-[#316ac5] hover:text-white px-1 rounded-xs cursor-pointer">Help</span>
            </div>

            {/* Notepad Content Area */}
            <div className="p-2 bg-white">
              <textarea
                readOnly
                value={openedFile.content}
                className="w-full h-[200px] p-2 font-mono text-[11px] leading-relaxed resize-none border border-neutral-300 rounded-xs focus:outline-none select-text"
              />
            </div>

            {/* Bottom Footer */}
            <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-1.5 flex justify-between items-center select-none text-[10px] text-neutral-600">
              <span>Encoding: ANSI</span>
              <button
                type="button"
                onClick={() => setOpenedFile(null)}
                className="px-3 py-0.5 bg-[#ece9d8] border border-neutral-400 rounded hover:bg-neutral-200 cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
