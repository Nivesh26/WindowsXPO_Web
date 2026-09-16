import { useState } from 'react'

interface CategoryItem {
  id: string
  title: string
  desc: string
  icon: string
  tasks: string[]
}

export default function ControlPanelApp() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  const categories: CategoryItem[] = [
    {
      id: 'appearance',
      title: 'Appearance and Themes',
      desc: 'Change the computer’s theme or background, or configure screen saver and display resolution.',
      icon: '🎨',
      tasks: ['Change the desktop background', 'Choose a screen saver', 'Change the screen resolution'],
    },
    {
      id: 'network',
      title: 'Network and Internet Connections',
      desc: 'Connect to the Internet, configure home networks, and adjust firewall settings.',
      icon: '🌐',
      tasks: ['Set up a home network', 'Network Connections', 'Internet Options'],
    },
    {
      id: 'programs',
      title: 'Add or Remove Programs',
      desc: 'Install or remove programs and Windows components.',
      icon: '💿',
      tasks: ['Change or Remove Programs', 'Add New Programs', 'Add/Remove Windows Components'],
    },
    {
      id: 'sounds',
      title: 'Sounds, Speech, and Audio Devices',
      desc: 'Change the sound scheme for your computer, or configure your speakers and audio settings.',
      icon: '🔊',
      tasks: ['Adjust the system volume', 'Change the sound scheme', 'Speaker settings'],
    },
    {
      id: 'performance',
      title: 'Performance and Maintenance',
      desc: 'See basic information about your computer, clean up your hard disk, and arrange disk space.',
      icon: '⚡',
      tasks: ['Free up disk space', 'Rearrange items on your hard disk', 'System diagnostics'],
    },
    {
      id: 'hardware',
      title: 'Printers and Other Hardware',
      desc: 'Change settings for your printer, keyboard, mouse, and game controllers.',
      icon: '🖨️',
      tasks: ['View installed printers and fax', 'Keyboard properties', 'Mouse pointers and speed'],
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      desc: 'Change user account settings and passwords for people who share this computer.',
      icon: '👤',
      tasks: ['Change Nivesh account', 'Create a new account', 'Change how users log on or off'],
    },
    {
      id: 'datetime',
      title: 'Date, Time, Language, and Regional Options',
      desc: 'Change the date, time, time zone, numbers, currency, and language settings.',
      icon: '📅',
      tasks: ['Change the date and time', 'Add other languages', 'Regional formats'],
    },
    {
      id: 'security',
      title: 'Security Center',
      desc: 'Configure settings to help protect your computer, including Windows Firewall and Automatic Updates.',
      icon: '🛡️',
      tasks: ['Windows Firewall', 'Automatic Updates', 'Internet Security Options'],
    },
  ]

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

      {/* Explorer Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] select-none">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            selectedCategory ? 'hover:bg-white/60 text-neutral-800 cursor-pointer' : 'text-neutral-400 cursor-not-allowed'
          }`}
        >
          <span className="text-emerald-600 font-bold">🠈</span> Back
        </button>
        <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded text-neutral-400 cursor-not-allowed">
          <span className="text-emerald-600 font-bold">🠊</span>
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
          <img src="/icons/control-panel.png" alt="" className="w-4 h-4 object-contain" />
          <span className="text-neutral-800 font-medium">
            Control Panel{selectedCategory ? ` > ${selectedCategory.title}` : ''}
          </span>
        </div>
        <button type="button" className="px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer">
          Go
        </button>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Windows XP Tasks Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7ba7e1] via-[#6393d6] to-[#5083cb] p-2.5 overflow-y-auto hidden sm:flex flex-col gap-3 select-none text-[11px]">
          {/* Control Panel Tasks */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>Control Panel</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🔄</span> Switch to Classic View
              </span>
            </div>
          </div>

          {/* See Also */}
          <div className="rounded-t-sm overflow-hidden shadow-xs bg-white">
            <div className="bg-gradient-to-r from-[#215dc6] to-[#4280e8] text-white font-bold px-2 py-1 flex justify-between items-center text-[11px]">
              <span>See Also</span>
              <span className="text-[10px]">▲</span>
            </div>
            <div className="p-2 bg-[#d6dff7] flex flex-col gap-1.5 text-blue-900">
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>🌐</span> Windows Update
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-1.5">
                <span>❓</span> Help and Support
              </span>
            </div>
          </div>
        </div>

        {/* Right Category View */}
        <div className="flex-1 bg-white p-5 overflow-y-auto">
          {selectedCategory ? (
            /* Detailed Category View */
            <div>
              <div className="flex items-center gap-3 border-b-2 border-blue-900 pb-3 mb-4">
                <span className="text-4xl">{selectedCategory.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-blue-900">{selectedCategory.title}</h2>
                  <p className="text-xs text-neutral-600 mt-0.5">{selectedCategory.desc}</p>
                </div>
              </div>

              <div className="text-xs font-bold text-blue-950 mb-2">Pick a task...</div>
              <div className="space-y-2 mb-6">
                {selectedCategory.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline cursor-pointer p-1 rounded hover:bg-blue-50"
                  >
                    <span>➔</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
              >
                🠈 Back to All Categories
              </button>
            </div>
          ) : (
            /* Main Categories Grid */
            <div>
              <div className="mb-4">
                <h1 className="text-base font-bold text-blue-950">Pick a category</h1>
                <p className="text-xs text-neutral-500">Configure your Windows XP computer settings and hardware.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="flex items-start gap-3 p-2.5 rounded border border-transparent hover:border-blue-300 hover:bg-blue-50/60 cursor-pointer transition-colors group"
                  >
                    <span className="text-3xl shrink-0 transition-transform group-hover:scale-110">{cat.icon}</span>
                    <div>
                      <div className="font-bold text-[12px] text-blue-900 group-hover:underline">
                        {cat.title}
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                        {cat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <span>Control Panel</span>
        <span>My Computer</span>
      </div>
    </div>
  )
}
