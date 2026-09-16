import { useState } from 'react'

export default function MyComputerApp() {
  const [selectedItem, setSelectedItem] = useState<string | null>('drive-c')

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans">
      {/* Explorer Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] select-none text-neutral-700">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Explorer Standard Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] select-none">
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-500 cursor-not-allowed">
          <span className="text-emerald-600 font-bold">🠈</span> Back
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-500 cursor-not-allowed">
          <span className="text-emerald-600 font-bold">🠊</span>
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-700 cursor-pointer">
          <span>📁🠉</span>
        </button>
        <div className="h-4 w-px bg-neutral-300 mx-1" />
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-700 cursor-pointer">
          <span>🔍</span> Search
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/60 text-neutral-700 cursor-pointer">
          <span>📂</span> Folders
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <img src="/icons/my-computer.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-neutral-800 font-medium">My Computer</span>
        </div>
        <button type="button" className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer">
          Go
        </button>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows XP Tasks Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px]">
          {/* System Tasks Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>System Tasks</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>ℹ️</span> View system info
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>➕</span> Add or remove programs
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/control-panel.png" alt="" className="w-3.5 h-3.5 object-contain" /> Change a setting
              </span>
            </div>
          </div>

          {/* Other Places Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Other Places</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🌐</span> My Network Places
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/my-documents.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Documents
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/folder.png" alt="" className="w-3.5 h-3.5 object-contain" /> Shared Documents
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/control-panel.png" alt="" className="w-3.5 h-3.5 object-contain" /> Control Panel
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Details</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] text-neutral-800 text-[10px] leading-tight">
              <div className="font-bold text-blue-950">Local Disk (C:)</div>
              <div className="text-neutral-600 mt-1">Local Fixed Disk</div>
              <div className="text-neutral-600">File System: NTFS</div>
              <div className="text-neutral-600">Free Space: 52.4 GB</div>
              <div className="text-neutral-600">Total Size: 74.5 GB</div>
            </div>
          </div>
        </div>

        {/* Right Drives & Folders View */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          {/* Section: Files Stored on this Computer */}
          <div className="mb-5">
            <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
              Files Stored on This Computer
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setSelectedItem('shared-docs')}
                className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                  selectedItem === 'shared-docs' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                }`}
              >
                <img src="/icons/folder.png" alt="" className="w-6 h-6 object-contain" />
                <span className="font-medium text-[11px]">Shared Documents</span>
              </div>
              <div
                onClick={() => setSelectedItem('nivesh-docs')}
                className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                  selectedItem === 'nivesh-docs' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                }`}
              >
                <img src="/icons/my-documents.png" alt="" className="w-6 h-6 object-contain" />
                <span className="font-medium text-[11px]">Nivesh&apos;s Documents</span>
              </div>
            </div>
          </div>

          {/* Section: Hard Disk Drives */}
          <div className="mb-5">
            <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
              Hard Disk Drives
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedItem('drive-c')}
                className={`flex items-center gap-3 p-2.5 rounded border border-neutral-200 cursor-pointer ${
                  selectedItem === 'drive-c' ? 'bg-[#316ac5] text-white border-[#316ac5]' : 'hover:bg-blue-50'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-b from-neutral-200 to-neutral-400 rounded-sm border border-neutral-500 flex items-center justify-center text-xl shadow-xs shrink-0">
                  💾
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[12px]">Local Disk (C:)</div>
                  <div className={`text-[10px] mt-0.5 ${selectedItem === 'drive-c' ? 'text-blue-100' : 'text-neutral-500'}`}>
                    52.4 GB free of 74.5 GB
                  </div>
                  {/* Space Progress Bar */}
                  <div className="w-full h-2 bg-neutral-200 rounded-xs overflow-hidden mt-1 border border-neutral-300">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[30%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Devices with Removable Storage */}
          <div>
            <div className="text-[11px] font-bold text-blue-900 border-b border-blue-200 pb-1 mb-3">
              Devices with Removable Storage
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setSelectedItem('drive-a')}
                className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                  selectedItem === 'drive-a' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                }`}
              >
                <span className="text-2xl">💾</span>
                <div>
                  <div className="font-medium text-[11px]">3½ Floppy (A:)</div>
                  <div className={`text-[10px] ${selectedItem === 'drive-a' ? 'text-blue-100' : 'text-neutral-400'}`}>
                    1.44 MB
                  </div>
                </div>
              </div>
              <div
                onClick={() => setSelectedItem('drive-d')}
                className={`flex items-center gap-2.5 p-2 rounded cursor-pointer ${
                  selectedItem === 'drive-d' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50'
                }`}
              >
                <span className="text-2xl">💿</span>
                <div>
                  <div className="font-medium text-[11px]">CD Drive (D:)</div>
                  <div className={`text-[10px] ${selectedItem === 'drive-d' ? 'text-blue-100' : 'text-neutral-400'}`}>
                    Windows XP Pro SP3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explorer Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <span>5 objects</span>
        <span>My Computer</span>
      </div>
    </div>
  )
}
