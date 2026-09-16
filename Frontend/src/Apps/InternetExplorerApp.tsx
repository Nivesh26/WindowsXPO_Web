import { useState, type FormEvent } from 'react'

export default function InternetExplorerApp() {
  const [url, setUrl] = useState<string>('http://www.nivesh.dev')
  const [currentTab, setCurrentTab] = useState<'home' | 'projects' | 'skills' | 'contact'>('home')

  const handleNavigate = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 text-[12px] font-sans h-full">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-4 text-[11px] select-none text-neutral-700">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Classic IE 6 Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1.5 text-[11px] select-none flex-wrap">
        <button
          type="button"
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 border border-transparent hover:border-neutral-300 cursor-pointer"
        >
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
            🠈
          </span>
          <span className="font-semibold text-neutral-700">Back</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1 px-1 py-0.5 rounded text-neutral-400 cursor-not-allowed"
        >
          <span className="w-5 h-5 rounded-full bg-neutral-300 text-white font-bold flex items-center justify-center text-[10px]">
            🠊
          </span>
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span className="text-red-600 font-bold text-sm">✕</span> Stop
        </button>

        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span className="text-emerald-600 font-bold text-sm">🔄</span> Refresh
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span>🏠</span> Home
        </button>

        <div className="h-5 w-px bg-neutral-300 mx-1" />

        <button
          type="button"
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span>⭐</span> Favorites
        </button>

        <button
          type="button"
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 text-neutral-700 cursor-pointer"
        >
          <span>📜</span> History
        </button>
      </div>

      {/* Address Bar */}
      <form
        onSubmit={handleNavigate}
        className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]"
      >
        <span className="text-neutral-500 font-medium">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <span className="text-[12px]">🌐</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 outline-none text-[11px] font-sans text-neutral-800"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1 px-2 py-0.5 bg-[#ece9d8] border border-[#7f9db9] rounded-xs hover:bg-neutral-200 cursor-pointer font-bold text-emerald-800"
        >
          <span>➔</span> Go
        </button>
        {/* Animated IE Throbber Globe */}
        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-xs animate-spin [animation-duration:8s]">
          e
        </div>
      </form>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white overflow-auto p-4 select-text">
        {/* Retro Header Banner */}
        <div className="border-2 border-blue-900 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white p-4 rounded-sm shadow-md mb-4 text-center">
          <h1 className="text-2xl font-black tracking-wide text-amber-300 drop-shadow">
            NIVESH WEB PORTFOLIO
          </h1>
          <p className="text-xs text-blue-200 mt-1 italic">
            Connecting modern full-stack web development with retro digital culture
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-blue-800 mb-4 gap-1 text-[12px] font-bold">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className={`px-4 py-1.5 rounded-t cursor-pointer ${
              currentTab === 'home'
                ? 'bg-blue-800 text-white'
                : 'bg-neutral-100 text-blue-900 hover:bg-blue-50'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('projects')}
            className={`px-4 py-1.5 rounded-t cursor-pointer ${
              currentTab === 'projects'
                ? 'bg-blue-800 text-white'
                : 'bg-neutral-100 text-blue-900 hover:bg-blue-50'
            }`}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('skills')}
            className={`px-4 py-1.5 rounded-t cursor-pointer ${
              currentTab === 'skills'
                ? 'bg-blue-800 text-white'
                : 'bg-neutral-100 text-blue-900 hover:bg-blue-50'
            }`}
          >
            Skills
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('contact')}
            className={`px-4 py-1.5 rounded-t cursor-pointer ${
              currentTab === 'contact'
                ? 'bg-blue-800 text-white'
                : 'bg-neutral-100 text-blue-900 hover:bg-blue-50'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Tab Contents */}
        {currentTab === 'home' && (
          <div className="space-y-4 text-neutral-800 text-xs leading-relaxed">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded">
              <span className="font-bold text-amber-900">🔔 Status:</span> Currently building
              dynamic frontend applications, interactive OS simulators, and full-stack software.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-neutral-300 p-3 rounded bg-neutral-50 shadow-xs">
                <h3 className="font-bold text-blue-900 text-sm mb-1">🚀 What I Do</h3>
                <p>
                  I specialize in crafting rich, interactive web applications that wow users with
                  responsive design, synthesized hardware sound effects, and robust architecture.
                </p>
              </div>
              <div className="border border-neutral-300 p-3 rounded bg-neutral-50 shadow-xs">
                <h3 className="font-bold text-blue-900 text-sm mb-1">💡 Architecture</h3>
                <p>
                  Built with React 19, TypeScript, and Tailwind CSS v4. Modular component-based
                  design ensuring maximum reusability and maintainability.
                </p>
              </div>
            </div>

            {/* Retro Web Badges */}
            <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 justify-center">
              <div className="border border-neutral-400 bg-neutral-200 px-2 py-0.5 text-[9px] font-mono font-bold text-neutral-700">
                [ BEST VIEWED IN IE 6 ]
              </div>
              <div className="border border-blue-400 bg-blue-100 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-800">
                [ W3C HTML 4.01 ]
              </div>
              <div className="border border-emerald-400 bg-emerald-100 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-800">
                [ 1024x768 RESOLUTION ]
              </div>
            </div>
          </div>
        )}

        {currentTab === 'projects' && (
          <div className="grid grid-cols-1 gap-3">
            <div className="border border-blue-200 bg-blue-50/40 p-3 rounded">
              <h4 className="font-bold text-blue-950 text-sm">Windows XP Interactive Portfolio</h4>
              <p className="text-xs text-neutral-600 mt-1">
                Authentic retro PC experience featuring CRT degauss simulation, Award BIOS memory
                checks, verbose driver loader, and Luna desktop window manager.
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-blue-200 text-blue-900 text-[10px] px-2 py-0.5 rounded font-mono">React</span>
                <span className="bg-blue-200 text-blue-900 text-[10px] px-2 py-0.5 rounded font-mono">TypeScript</span>
                <span className="bg-blue-200 text-blue-900 text-[10px] px-2 py-0.5 rounded font-mono">Tailwind CSS</span>
                <span className="bg-blue-200 text-blue-900 text-[10px] px-2 py-0.5 rounded font-mono">Web Audio</span>
              </div>
            </div>

            <div className="border border-blue-200 bg-blue-50/40 p-3 rounded">
              <h4 className="font-bold text-blue-950 text-sm">Full-Stack Application Platform</h4>
              <p className="text-xs text-neutral-600 mt-1">
                High-concurrency web application backend integrated with modern SPA frontend and real-time messaging.
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded font-mono">Node.js</span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded font-mono">Express</span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded font-mono">PostgreSQL</span>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'skills' && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-neutral-300 p-2.5 rounded bg-neutral-50">
              <div className="font-bold text-blue-900 mb-1">Frontend Engineering</div>
              <ul className="list-disc list-inside text-neutral-700 space-y-0.5">
                <li>React 19 & Next.js</li>
                <li>TypeScript & JavaScript (ESNext)</li>
                <li>Tailwind CSS v4 & Vanilla CSS</li>
                <li>Web Audio API Synthesizers</li>
                <li>Responsive UI/UX</li>
              </ul>
            </div>
            <div className="border border-neutral-300 p-2.5 rounded bg-neutral-50">
              <div className="font-bold text-blue-900 mb-1">Backend & DevOps</div>
              <ul className="list-disc list-inside text-neutral-700 space-y-0.5">
                <li>Node.js & Express</li>
                <li>RESTful API Architecture</li>
                <li>Git Version Control</li>
                <li>Vite & Modern Build Tools</li>
                <li>Linux / Shell Scripting</li>
              </ul>
            </div>
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="bg-neutral-50 border border-neutral-300 p-4 rounded text-xs space-y-3">
            <div className="font-bold text-blue-900 text-sm">Send Me A Message</div>
            <p className="text-neutral-600">Interested in working together or want to chat about retro OS interfaces?</p>
            <div className="space-y-2">
              <div>
                <span className="font-semibold block text-neutral-700 mb-0.5">Email:</span>
                <span className="text-blue-600 hover:underline">nivesh@example.com</span>
              </div>
              <div>
                <span className="font-semibold block text-neutral-700 mb-0.5">GitHub:</span>
                <span className="text-blue-600 hover:underline">github.com/Nivesh26</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-700">🌐</span>
          <span>Done</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Internet</span>
          <span>🔒 100%</span>
        </div>
      </div>
    </div>
  )
}
