import { useState } from 'react'

export default function NotepadApp() {
  const [text, setText] = useState<string>(
`=============================================================
  WELCOME TO NIVESH'S WINDOWS XP PORTFOLIO!
=============================================================

Hey there! Thank you for booting into my retro workstation.

ABOUT ME:
• Name: Nivesh
• Role: Full-Stack Engineer & Creative Web Developer
• Location: Kathmandu / Remote

CORE TECHNICAL EXPERTISE:
• Frontend: React, Next.js, TypeScript, Tailwind CSS, HTML5/CSS3
• Audio & Media: Web Audio API (real-time synthesizer sound generation)
• Backend: Node.js, Express, RESTful APIs, Database Design
• Systems & Tools: Git, Vite, Linux Shell, Responsive UX

EXPLORE THIS DESKTOP:
1. Double-click "My Computer" to inspect system drives & storage.
2. Open "My Documents" to read my resume and bio.
3. Open "Internet Explorer" to browse web projects.
4. Click the green "start" button in the bottom left to access
   the classic Windows XP start menu, or turn off the computer!

Feel free to edit this note directly or write your own thoughts.

Have fun reliving the golden era of computing!
=============================================================`
  )

  return (
    <div className="flex-1 flex flex-col bg-white text-black font-mono text-[13px] h-full">
      {/* Classic Notepad Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-3 text-[11px] font-sans select-none text-neutral-800">
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Format</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
      </div>

      {/* Editor Body */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-3 bg-white text-black outline-none resize-none overflow-auto font-mono text-[12px] leading-relaxed select-text"
        placeholder="Type notes here..."
        spellCheck={false}
      />

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-0.5 text-[11px] font-sans text-neutral-600 flex justify-between select-none">
        <span>Windows (CRLF)</span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  )
}
