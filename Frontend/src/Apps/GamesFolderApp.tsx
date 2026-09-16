export default function GamesFolderApp() {
  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans h-full">
      {/* Explorer Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] select-none text-neutral-700">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <img src="/icons/folder-open.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-neutral-800 font-medium">C:\Program Files\Games</span>
        </div>
        <button type="button" className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer">
          Go
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows XP Tasks Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px]">
          {/* File and Folder Tasks */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Folder Tasks</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>➕</span> Make a new folder
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🌐</span> Publish to the Web
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🔗</span> Share this folder
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
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/my-computer.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Computer
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <img src="/icons/my-documents.png" alt="" className="w-3.5 h-3.5 object-contain" /> My Documents
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Details</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] text-neutral-800 text-[10px] leading-tight">
              <div className="font-bold text-blue-950">Games</div>
              <div className="text-neutral-600 mt-1">File Folder</div>
              <div className="text-neutral-600">Date Modified: 09/16/2026</div>
            </div>
          </div>
        </div>

        {/* Right Folder Content: Empty Folder */}
        <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center text-neutral-500 select-none">
          <img src="/icons/folder-open.png" alt="Empty Folder" className="w-16 h-16 object-contain mb-3 opacity-70" />
          <div className="text-sm font-semibold text-neutral-700">
            This folder is empty.
          </div>
        </div>
      </div>

      {/* Explorer Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <span>0 objects</span>
        <span>My Computer</span>
      </div>
    </div>
  )
}
