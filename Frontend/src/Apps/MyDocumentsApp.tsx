import { useState } from 'react'

interface DocumentItem {
  id: string
  name: string
  type: 'folder' | 'file'
  icon: string
  size: string
  date: string
  content?: string
}

export default function MyDocumentsApp() {
  const [selectedId, setSelectedId] = useState<string>('resume')
  const [openedFile, setOpenedFile] = useState<DocumentItem | null>(null)

  const items: DocumentItem[] = [
    { id: 'pictures', name: 'My Pictures', type: 'folder', icon: '🖼️', size: '', date: '09/16/2026' },
    { id: 'music', name: 'My Music', type: 'folder', icon: '🎵', size: '', date: '09/16/2026' },
    { id: 'projects', name: 'Portfolio Projects', type: 'folder', icon: '📁', size: '', date: '09/16/2026' },
    {
      id: 'resume',
      name: 'Resume_Nivesh.pdf',
      type: 'file',
      icon: '📄',
      size: '240 KB',
      date: '09/16/2026',
      content: 'NIVESH - FULL-STACK SOFTWARE ENGINEER\n\nExperience:\n- Built high-performance web applications using React, TypeScript, and modern styling.\n- Designed interactive OS simulation systems with custom audio synthesis.\n\nEducation:\n- Computer Science & Engineering\n\nCore Competencies:\n- Frontend: React, Next.js, TypeScript, Tailwind CSS, Web Audio API\n- Backend: Node.js, Express, REST APIs\n- Tools: Git, Vite, Linux / Shell Scripting',
    },
    {
      id: 'about',
      name: 'About_Me.txt',
      type: 'file',
      icon: '📝',
      size: '4 KB',
      date: '09/16/2026',
      content: 'Hello World!\n\nI am Nivesh, a creative developer passionate about bridging retro aesthetics with modern performant code.\n\nThis Windows XP simulation was built with love, nostalgia, and attention to micro-details like scanlines, Award BIOS POST checks, and classic Luna styling.',
    },
    {
      id: 'contact',
      name: 'Contact_Info.txt',
      type: 'file',
      icon: '📝',
      size: '2 KB',
      date: '09/16/2026',
      content: 'Get In Touch:\n\nEmail: nivesh@example.com\nGitHub: https://github.com/Nivesh26\nLinkedIn: linkedin.com/in/nivesh\nLocation: Kathmandu / Global',
    },
  ]

  const selectedItem = items.find((i) => i.id === selectedId)

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

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]">
        <span className="text-neutral-500">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <span className="text-[12px]">📁</span>
          <span className="text-neutral-800 font-medium">C:\Documents and Settings\Nivesh\My Documents</span>
        </div>
        <button type="button" className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer">
          Go
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px]">
          {/* File and Folder Tasks */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>File and Folder Tasks</span>
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

          {/* Details */}
          {selectedItem && (
            <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
              <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
                <span>Details</span>
                <span className="text-[10px]">▲</span>
              </div>
              <div className="p-2 bg-[#d6dff7] text-neutral-800 text-[10px] leading-tight">
                <div className="font-bold text-blue-950">{selectedItem.name}</div>
                <div className="text-neutral-600 mt-1">Type: {selectedItem.type === 'folder' ? 'File Folder' : 'Document'}</div>
                {selectedItem.size && <div className="text-neutral-600">Size: {selectedItem.size}</div>}
                <div className="text-neutral-600">Date Modified: {selectedItem.date}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Files Grid */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => {
              const isSelected = selectedId === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => {
                    if (item.type === 'file') setOpenedFile(item)
                  }}
                  className={`flex flex-col items-center p-2 rounded cursor-pointer select-none text-center ${
                    isSelected ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-50 text-neutral-800'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="text-[11px] font-medium leading-tight max-w-[110px] truncate">
                    {item.name}
                  </span>
                  {item.size && (
                    <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-blue-200' : 'text-neutral-400'}`}>
                      {item.size}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick File Preview Modal inside window */}
          {openedFile && (
            <div className="mt-6 border-2 border-blue-400 rounded p-3 bg-neutral-50 shadow-md">
              <div className="flex justify-between items-center border-b border-neutral-300 pb-1 mb-2">
                <span className="font-bold text-[12px] text-blue-900 flex items-center gap-1.5">
                  <span>{openedFile.icon}</span> {openedFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenedFile(null)}
                  className="text-xs font-bold text-neutral-500 hover:text-red-600 cursor-pointer px-1"
                >
                  ✕ Close Preview
                </button>
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap bg-white p-3 border border-neutral-200 rounded max-h-[160px] overflow-y-auto leading-relaxed">
                {openedFile.content}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <span>{items.length} objects</span>
        <span>My Documents</span>
      </div>
    </div>
  )
}
