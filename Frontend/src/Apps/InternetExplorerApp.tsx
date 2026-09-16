import { useState, useRef, useEffect, type FormEvent } from 'react'

interface HistoryEntry {
  url: string
  title: string
}

const FAVORITES = [
  { name: 'Google Search', url: 'https://www.google.com/search?igu=1', displayUrl: 'https://www.google.com', icon: '🔍' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org', displayUrl: 'https://en.wikipedia.org', icon: '📚' },
  { name: 'Internet Archive (Wayback)', url: 'https://archive.org', displayUrl: 'https://archive.org', icon: '🏛️' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', displayUrl: 'https://news.ycombinator.com', icon: '📰' },
  { name: 'FrogFind (Vintage Web Search)', url: 'http://frogfind.com', displayUrl: 'http://frogfind.com', icon: '🐸' },
  { name: 'Wiby (The Classic Web)', url: 'https://wiby.me', displayUrl: 'https://wiby.me', icon: '🌐' },
  { name: 'Space Jam (1996 Original)', url: 'https://www.spacejam.com/1996/', displayUrl: 'https://www.spacejam.com/1996/', icon: '🏀' },
  { name: 'MSN Windows XP Portal', url: 'about:home', displayUrl: 'http://www.msn.com', icon: '🏠' },
  { name: 'Nivesh Portfolio', url: 'about:portfolio', displayUrl: 'http://www.nivesh.dev', icon: '💼' },
]

// Domains known to enforce strict X-Frame-Options: SAMEORIGIN/DENY
const BLOCKED_DOMAINS = [
  'github.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'reddit.com',
  'linkedin.com',
  'netflix.com',
  'amazon.com',
  'apple.com',
  'tiktok.com',
  'twitch.tv',
  'youtube.com',
  'youtu.be',
]

export default function InternetExplorerApp() {
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.google.com/search?igu=1')
  const [inputUrl, setInputUrl] = useState<string>('https://www.google.com')
  const [history, setHistory] = useState<HistoryEntry[]>([
    { url: 'https://www.google.com/search?igu=1', title: 'Google' },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusText, setStatusText] = useState<string>('Done')
  const [showFavoritesMenu, setShowFavoritesMenu] = useState<boolean>(false)
  const [showHistoryMenu, setShowHistoryMenu] = useState<boolean>(false)
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('')
  const [portfolioTab, setPortfolioTab] = useState<'home' | 'projects' | 'skills' | 'contact'>('home')


  // Blocked Page State
  const [blockedTargetUrl, setBlockedTargetUrl] = useState<string>('')

  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Navigate to a target URL or search query
  const navigateTo = (target: string) => {
    let cleanUrl = target.trim()
    if (!cleanUrl) return

    // Special internal views
    if (cleanUrl === 'about:home' || cleanUrl === 'about:portfolio') {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({
        url: cleanUrl,
        title: cleanUrl === 'about:home' ? 'MSN.com - Welcome to Windows XP' : 'Nivesh Web Portfolio',
      })
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      setCurrentUrl(cleanUrl)
      setInputUrl(cleanUrl === 'about:home' ? 'http://www.msn.com' : 'http://www.nivesh.dev')
      setIsLoading(false)
      setStatusText('Done')
      return
    }

    // 2. Blocked Domains Check (sites that reject iframe embedding via X-Frame-Options)
    const lowerTarget = cleanUrl.toLowerCase()
    const matchedBlockedDomain = BLOCKED_DOMAINS.find((dom) => lowerTarget.includes(dom))

    if (matchedBlockedDomain) {
      const fullUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
      setBlockedTargetUrl(fullUrl)
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({ url: 'about:blocked', title: `Blocked - ${matchedBlockedDomain}` })
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      setCurrentUrl('about:blocked')
      setInputUrl(fullUrl)
      setIsLoading(false)
      setStatusText('Done')
      return
    }

    // 3. Regular URL or Search query
    const hasProtocol = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
    const hasDomain = cleanUrl.includes('.') && !cleanUrl.includes(' ')

    let finalUrl = cleanUrl
    if (!hasProtocol && !hasDomain) {
      // Treat as search query via Google iframe unit
      finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(cleanUrl)}`
      setInputUrl(`https://www.google.com/search?q=${encodeURIComponent(cleanUrl)}`)
    } else {
      if (!hasProtocol) {
        finalUrl = 'https://' + cleanUrl
      }
      // If google search, ensure igu=1 is present so it embeds without X-Frame-Options blocking
      if (finalUrl.includes('google.com/search') && !finalUrl.includes('igu=1')) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'igu=1'
      } else if (finalUrl === 'https://www.google.com' || finalUrl === 'https://google.com' || finalUrl === 'http://www.google.com') {
        finalUrl = 'https://www.google.com/search?igu=1'
      }
      setInputUrl(finalUrl)
    }

    setIsLoading(true)
    setStatusText(`Opening page ${finalUrl}...`)
    setCurrentUrl(finalUrl)

    // Append to navigation history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ url: finalUrl, title: finalUrl })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigateTo(inputUrl)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1
      setHistoryIndex(prevIdx)
      const target = history[prevIdx].url
      setCurrentUrl(target)
      setInputUrl(
        target === 'about:home'
          ? 'http://www.msn.com'
          : target === 'about:portfolio'
          ? 'http://www.nivesh.dev'
          : target
      )
      setIsLoading(false)
      setStatusText('Done')
    }
  }

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      const target = history[nextIdx].url
      setCurrentUrl(target)
      setInputUrl(
        target === 'about:home'
          ? 'http://www.msn.com'
          : target === 'about:portfolio'
          ? 'http://www.nivesh.dev'
          : target
      )
      setIsLoading(false)
      setStatusText('Done')
    }
  }

  const handleRefresh = () => {
    if (currentUrl.startsWith('about:')) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setStatusText('Done')
      }, 250)
    } else if (iframeRef.current) {
      setIsLoading(true)
      setStatusText(`Refreshing ${currentUrl}...`)
      iframeRef.current.src = currentUrl
    }
  }

  const handleStop = () => {
    setIsLoading(false)
    setStatusText('Done')
  }

  const handleHome = () => {
    navigateTo('https://www.google.com/search?igu=1')
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setStatusText('Done')
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const closeMenus = () => {
      setShowFavoritesMenu(false)
      setShowHistoryMenu(false)
    }
    window.addEventListener('click', closeMenus)
    return () => window.removeEventListener('click', closeMenus)
  }, [])

  return (
    <div className="flex-1 flex flex-col bg-[#ece9d8] text-neutral-800 text-[12px] font-sans h-full select-none relative overflow-hidden">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-0.5 flex gap-1 text-[11px] select-none text-neutral-700 relative z-30">
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 rounded-xs cursor-pointer">
          File
        </button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 rounded-xs cursor-pointer">
          Edit
        </button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 rounded-xs cursor-pointer">
          View
        </button>

        {/* Favorites Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowFavoritesMenu((prev) => !prev)
              setShowHistoryMenu(false)
            }}
            className={`px-2 py-0.5 rounded-xs cursor-pointer ${
              showFavoritesMenu ? 'bg-[#316ac5] text-white' : 'hover:bg-[#316ac5] hover:text-white'
            }`}
          >
            Favorites
          </button>

          {showFavoritesMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-0.5 w-64 bg-[#ece9d8] border-2 border-[#7f9db9] rounded-xs shadow-lg py-1 z-50 text-[11px] text-neutral-800"
            >
              <div className="px-2 py-1 font-bold text-neutral-600 border-b border-neutral-300 flex items-center gap-1.5">
                <span>⭐</span> Recommended Websites
              </div>
              {FAVORITES.map((fav) => (
                <button
                  key={fav.url}
                  type="button"
                  onClick={() => {
                    navigateTo(fav.url)
                    setShowFavoritesMenu(false)
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="text-xs">{fav.icon}</span>
                  <span className="truncate">{fav.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowHistoryMenu((prev) => !prev)
              setShowFavoritesMenu(false)
            }}
            className={`px-2 py-0.5 rounded-xs cursor-pointer ${
              showHistoryMenu ? 'bg-[#316ac5] text-white' : 'hover:bg-[#316ac5] hover:text-white'
            }`}
          >
            History
          </button>

          {showHistoryMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-0.5 w-72 bg-[#ece9d8] border-2 border-[#7f9db9] rounded-xs shadow-lg py-1 z-50 text-[11px] text-neutral-800"
            >
              <div className="px-2 py-1 font-bold text-neutral-600 border-b border-neutral-300 flex items-center gap-1.5">
                <span>📜</span> Visited Web Pages
              </div>
              {history.map((entry, idx) => (
                <button
                  key={`${entry.url}-${idx}`}
                  type="button"
                  onClick={() => {
                    setHistoryIndex(idx)
                    setCurrentUrl(entry.url)
                    setInputUrl(
                      entry.url === 'about:home'
                        ? 'http://www.msn.com'
                        : entry.url === 'about:portfolio'
                        ? 'http://www.nivesh.dev'
                        : entry.url
                    )
                    setShowHistoryMenu(false)
                  }}
                  className={`w-full text-left px-3 py-1 hover:bg-[#316ac5] hover:text-white flex items-center gap-2 cursor-pointer transition-colors truncate ${
                    idx === historyIndex ? 'font-bold bg-neutral-200' : ''
                  }`}
                >
                  <span>🌐</span>
                  <span className="truncate">{entry.title || entry.url}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 rounded-xs cursor-pointer"
        >
          Help
        </button>
      </div>

      {/* Classic IE 6 Toolbar */}
      <div className="bg-[#ece9d8] border-b border-[#d0ccc0] px-2 py-1 flex items-center gap-1 text-[11px] select-none flex-wrap">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          disabled={historyIndex <= 0}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded border border-transparent ${
            historyIndex > 0
              ? 'hover:bg-white/80 active:bg-neutral-300 hover:border-neutral-300 cursor-pointer text-neutral-800'
              : 'opacity-50 cursor-not-allowed text-neutral-400'
          }`}
          title="Back"
        >
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
            🠈
          </span>
          <span className="font-semibold">Back</span>
        </button>

        {/* Forward Button */}
        <button
          type="button"
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className={`flex items-center gap-1 px-1 py-0.5 rounded border border-transparent ${
            historyIndex < history.length - 1
              ? 'hover:bg-white/80 active:bg-neutral-300 hover:border-neutral-300 cursor-pointer text-neutral-800'
              : 'opacity-50 cursor-not-allowed text-neutral-400'
          }`}
          title="Forward"
        >
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
            🠊
          </span>
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={handleStop}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 text-neutral-700 cursor-pointer"
          title="Stop"
        >
          <span className="text-red-600 font-bold text-sm leading-none">✕</span> Stop
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 text-neutral-700 cursor-pointer"
          title="Refresh"
        >
          <span className="text-emerald-600 font-bold text-sm leading-none">🔄</span> Refresh
        </button>

        {/* Home Button */}
        <button
          type="button"
          onClick={handleHome}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 text-neutral-700 cursor-pointer"
          title="Home (Google)"
        >
          <span>🏠</span> Home
        </button>

        <div className="h-5 w-px bg-neutral-300 mx-1" />

        {/* Favorites Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowFavoritesMenu((prev) => !prev)
            setShowHistoryMenu(false)
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 text-neutral-700 cursor-pointer"
          title="Favorites"
        >
          <span>⭐</span> Favorites
        </button>

        {/* History Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowHistoryMenu((prev) => !prev)
            setShowFavoritesMenu(false)
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/80 active:bg-neutral-300 text-neutral-700 cursor-pointer"
          title="History"
        >
          <span>📜</span> History
        </button>
      </div>

      {/* Address Bar */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-[#ece9d8] border-b border-[#b0aba0] px-2 py-1 flex items-center gap-2 text-[11px]"
      >
        <span className="text-neutral-600 font-medium shrink-0">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] rounded-xs px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <span className="text-[12px] shrink-0">🌐</span>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Type a web address (e.g. google.com, wikipedia.org, archive.org)..."
            className="flex-1 outline-none text-[11px] font-sans text-neutral-800 select-text"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-b from-[#f0eee0] to-[#e4e1d3] border border-[#7f9db9] rounded-xs hover:brightness-105 active:brightness-95 cursor-pointer font-bold text-emerald-800 shadow-xs shrink-0"
          title="Go to URL"
        >
          <span>➔</span> Go
        </button>

        {/* Animated Windows XP Spinning Globe Throbber */}
        <div
          className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 border border-blue-800 flex items-center justify-center text-white font-bold text-[11px] shadow-sm select-none shrink-0 ${
            isLoading ? 'animate-spin [animation-duration:1.5s]' : ''
          }`}
          title={isLoading ? 'Loading page...' : 'Internet Explorer'}
        >
          <span className="italic font-serif font-black drop-shadow">e</span>
        </div>
      </form>

      {/* Quick Bookmarks / Links Bar */}
      <div className="bg-[#f5f4ea] border-b border-[#d0ccc0] px-2 py-0.5 flex items-center gap-3 text-[10px] text-neutral-600 overflow-x-auto shrink-0">
        <span className="font-bold text-neutral-700">Links:</span>
        <button
          type="button"
          onClick={() => navigateTo('https://www.google.com/search?igu=1')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🔍</span> Google
        </button>

        <button
          type="button"
          onClick={() => navigateTo('https://en.wikipedia.org')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>📚</span> Wikipedia
        </button>
        <button
          type="button"
          onClick={() => navigateTo('https://archive.org')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🏛️</span> Internet Archive
        </button>
        <button
          type="button"
          onClick={() => navigateTo('https://news.ycombinator.com')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>📰</span> Hacker News
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://frogfind.com')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🐸</span> FrogFind
        </button>
        <button
          type="button"
          onClick={() => navigateTo('https://wiby.me')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🌐</span> Wiby
        </button>
        <button
          type="button"
          onClick={() => navigateTo('about:portfolio')}
          className="hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-semibold text-blue-900"
        >
          <span>💼</span> Portfolio
        </button>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">

        {/* VIEW: Blocked Embedding Notice (X-Frame-Options Fallback) */}
        {currentUrl === 'about:blocked' && (
          <div className="flex-1 overflow-auto bg-white p-6 select-text flex flex-col items-center justify-center">
            <div className="max-w-lg w-full border border-neutral-300 bg-[#fbfbfb] p-6 rounded shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl text-amber-500 shrink-0">⚠️</div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 leading-tight">
                    The page cannot be displayed in a frame
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Security Policy Notice (X-Frame-Options: SAMEORIGIN)
                  </p>
                </div>
              </div>

              <div className="text-xs text-neutral-700 space-y-2 border-t border-b border-neutral-200 py-3 leading-relaxed">
                <p>
                  The website at <strong className="text-blue-900 font-mono break-all">{blockedTargetUrl}</strong> has modern security settings that prohibit third-party embedding.
                </p>
                <p className="text-neutral-600">
                  You can open this website directly in a regular browser tab or search for it on Google.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.open(blockedTargetUrl, '_blank', 'noopener,noreferrer')}
                  className="px-4 py-2 bg-[#0055ea] hover:bg-[#2672f7] text-white font-bold text-xs rounded-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <span>➔</span> Open in Real Browser Tab
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo(`https://www.google.com/search?igu=1&q=${encodeURIComponent(blockedTargetUrl)}`)}
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs rounded-xs cursor-pointer font-medium"
                >
                  🔍 Search on Google
                </button>
                <button
                  type="button"
                  onClick={handleHome}
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs rounded-xs cursor-pointer font-medium"
                >
                  🏠 Return Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: MSN Windows XP Start Portal */}
        {currentUrl === 'about:home' && (
          <div className="flex-1 overflow-auto bg-[#f0f4f9] p-4 select-text">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Retro MSN Header */}
              <div className="bg-gradient-to-r from-[#003399] via-[#0055ea] to-[#003399] text-white p-4 rounded-md shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 font-serif font-black text-2xl shadow-inner border border-blue-300">
                    e
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>msn</span>
                      <span className="text-xs bg-amber-400 text-blue-950 px-1.5 py-0.5 rounded-sm font-normal">
                        Windows XP
                      </span>
                    </h1>
                    <p className="text-[11px] text-blue-100">Welcome to Internet Explorer 6 Web Portal</p>
                  </div>
                </div>
                <div className="text-right text-[11px] text-blue-100">
                  <div>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                  <div className="text-amber-300 font-semibold">Broadband Connection: Online</div>
                </div>
              </div>

              {/* Integrated Search Box */}
              <div className="bg-white border-2 border-[#0055ea] p-4 rounded-md shadow-xs">
                <h2 className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
                  <span className="text-blue-600">🔍</span> Search the Real Web:
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (homeSearchQuery.trim()) {
                      navigateTo(homeSearchQuery)
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={homeSearchQuery}
                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                    placeholder="Search Google, Wikipedia, or enter any web address..."
                    className="flex-1 border border-neutral-400 px-3 py-1.5 text-xs rounded-xs outline-none focus:border-blue-600 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-b from-[#2672f7] to-[#0055ea] text-white font-bold text-xs rounded-xs hover:brightness-110 active:brightness-95 cursor-pointer shadow-xs"
                  >
                    Search Real Web
                  </button>
                </form>
              </div>

              {/* Quick Launch Cards */}
              <div>
                <h3 className="text-xs font-bold text-neutral-600 mb-2 uppercase tracking-wide">
                  Featured Web Destinations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {FAVORITES.map((site) => (
                    <div
                      key={site.url}
                      onClick={() => navigateTo(site.url)}
                      className="bg-white border border-neutral-300 hover:border-blue-600 p-3 rounded-md shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                          {site.icon}
                        </div>
                        <h4 className="font-bold text-xs text-blue-900 group-hover:underline">
                          {site.name}
                        </h4>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-2 truncate">
                        {site.displayUrl || site.url}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Built-in Portfolio Tab */}
        {currentUrl === 'about:portfolio' && (
          <div className="flex-1 overflow-auto p-4 select-text bg-white">
            <div className="border-2 border-blue-900 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white p-4 rounded-sm shadow-md mb-4 text-center">
              <h1 className="text-2xl font-black tracking-wide text-amber-300 drop-shadow">
                NIVESH WEB PORTFOLIO
              </h1>
              <p className="text-xs text-blue-200 mt-1 italic">
                Connecting modern full-stack web development with retro digital culture
              </p>
            </div>

            <div className="flex border-b-2 border-blue-800 mb-4 gap-1 text-[12px] font-bold">
              {(['home', 'projects', 'skills', 'contact'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPortfolioTab(tab)}
                  className={`px-4 py-1.5 rounded-t cursor-pointer capitalize ${
                    portfolioTab === tab
                      ? 'bg-blue-800 text-white'
                      : 'bg-neutral-100 text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {portfolioTab === 'home' && (
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
              </div>
            )}

            {portfolioTab === 'projects' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="border border-blue-200 bg-blue-50/40 p-3 rounded">
                  <h4 className="font-bold text-blue-950 text-sm">Windows XP Interactive Portfolio</h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Authentic retro PC experience featuring CRT degauss simulation, Award BIOS memory
                    checks, verbose driver loader, Luna desktop window manager, and real web browser.
                  </p>
                </div>
              </div>
            )}

            {portfolioTab === 'skills' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-neutral-300 p-2.5 rounded bg-neutral-50">
                  <div className="font-bold text-blue-900 mb-1">Frontend Engineering</div>
                  <ul className="list-disc list-inside text-neutral-700 space-y-0.5">
                    <li>React 19 & Next.js</li>
                    <li>TypeScript & JavaScript</li>
                    <li>Tailwind CSS v4</li>
                  </ul>
                </div>
                <div className="border border-neutral-300 p-2.5 rounded bg-neutral-50">
                  <div className="font-bold text-blue-900 mb-1">Backend & DevOps</div>
                  <ul className="list-disc list-inside text-neutral-700 space-y-0.5">
                    <li>Node.js & Express</li>
                    <li>RESTful APIs</li>
                    <li>Vite & Modern Build Tools</li>
                  </ul>
                </div>
              </div>
            )}

            {portfolioTab === 'contact' && (
              <div className="bg-neutral-50 border border-neutral-300 p-4 rounded text-xs space-y-3">
                <div className="font-bold text-blue-900 text-sm">Send Me A Message</div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold block text-neutral-700 mb-0.5">GitHub:</span>
                    <span className="text-blue-600 hover:underline">github.com/Nivesh26</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: Real Web Iframe Engine */}
        {!currentUrl.startsWith('about:') && (
          <div className="flex-1 w-full h-full relative flex flex-col bg-white">
            <iframe
              ref={iframeRef}
              src={currentUrl}
              onLoad={handleIframeLoad}
              title="Internet Explorer Browser Viewport"
              className="flex-1 w-full h-full border-none bg-white"
            />
          </div>
        )}
      </div>

      {/* Classic IE Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d0ccc0] px-3 py-1 text-[11px] text-neutral-600 flex justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="animate-pulse text-blue-700 font-medium">⏳ {statusText}</span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="text-blue-700">🌐</span> Done
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span>🔒</span> Internet
          </span>
          <span className="text-neutral-400">|</span>
          <span>100%</span>
        </div>
      </div>

      {/* About Internet Explorer Modal */}
      {showHelpModal && (
        <div
          onClick={() => setShowHelpModal(false)}
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[340px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-sm shadow-2xl flex flex-col text-neutral-800"
          >
            <div className="bg-gradient-to-r from-[#0055ea] to-[#3a93ff] text-white px-2 py-1 flex items-center justify-between text-xs font-bold">
              <span>About Internet Explorer</span>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="hover:bg-red-600 px-1.5 rounded-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-serif font-black shadow-md">
                  e
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Microsoft Internet Explorer</h3>
                  <p className="text-[11px] text-neutral-600">Version 6.0.2900.2180 (Windows XP Edition)</p>
                </div>
              </div>
              <p className="text-neutral-700 leading-relaxed border-t border-neutral-300 pt-2 text-[11px]">
                Features integrated Google Search, YouTube XP Player, live web browsing, and authentic Windows XP Luna interface controls.
              </p>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-1 bg-white hover:bg-neutral-100 border border-neutral-400 rounded-xs text-xs font-medium cursor-pointer shadow-xs"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
