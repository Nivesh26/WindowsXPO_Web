import { useState, useEffect, useCallback, useRef } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
  id: string
}

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const RANK_VALUE: Record<Rank, number> = {
  A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, J: 11, Q: 12, K: 13,
}

function isRed(suit: Suit) { return suit === '♥' || suit === '♦' }

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, faceUp: false, id: `${rank}${suit}` })
    }
  }
  return deck
}

function shuffle(arr: Card[]): Card[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dealGame() {
  const deck = shuffle(createDeck())
  const tableau: Card[][] = Array.from({ length: 7 }, () => [])
  let idx = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] }
      card.faceUp = row === col
      tableau[col].push(card)
    }
  }
  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }))
  return { tableau, stock, waste: [] as Card[], foundations: [[], [], [], []] as Card[][] }
}

interface CardPosition {
  area: 'tableau' | 'waste' | 'foundation' | 'stock'
  col: number
  row?: number
}

function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 'A'
  const top = foundation[foundation.length - 1]
  return top.suit === card.suit && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] + 1
}

function canPlaceOnTableau(card: Card, column: Card[]): boolean {
  if (column.length === 0) return card.rank === 'K'
  const top = column[column.length - 1]
  return top.faceUp && isRed(card.suit) !== isRed(top.suit) && RANK_VALUE[card.rank] === RANK_VALUE[top.rank] - 1
}

interface DragState {
  cards: Card[]
  from: CardPosition
}

export default function SolitaireApp() {
  const [tableau, setTableau] = useState<Card[][]>([])
  const [stock, setStock] = useState<Card[]>([])
  const [waste, setWaste] = useState<Card[]>([])
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hint, setHint] = useState<string | null>(null)
  const [autoCompleting, setAutoCompleting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const initGame = useCallback(() => {
    const g = dealGame()
    setTableau(g.tableau)
    setStock(g.stock)
    setWaste(g.waste)
    setFoundations(g.foundations)
    setScore(0)
    setMoves(0)
    setTime(0)
    setGameWon(false)
    setDrag(null)
    setHint(null)
    setAutoCompleting(false)
  }, [])

  useEffect(() => { initGame() }, [initGame])

  useEffect(() => {
    if (gameWon) { if (timerRef.current) clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameWon])

  // Check win condition
  useEffect(() => {
    if (foundations.every(f => f.length === 13)) {
      setGameWon(true)
    }
  }, [foundations])

  // Auto-complete: if no cards face-down and stock empty
  const canAutoComplete = !autoCompleting && !gameWon &&
    stock.length === 0 && waste.length === 0 &&
    tableau.every(col => col.every(c => c.faceUp))

  useEffect(() => {
    if (!canAutoComplete) return
    setAutoCompleting(true)
    let delay = 0
    const autoMove = () => {
      setTableau(prev => {
        const newTab = prev.map(col => [...col])
        const newFound = foundations.map(f => [...f])
        let moved = false
        for (let col = 0; col < 7; col++) {
          if (newTab[col].length === 0) continue
          const card = newTab[col][newTab[col].length - 1]
          for (let fi = 0; fi < 4; fi++) {
            if (canPlaceOnFoundation(card, newFound[fi])) {
              newFound[fi].push(newTab[col].pop()!)
              moved = true
              setFoundations([...newFound])
              setScore(s => s + 15)
              break
            }
          }
          if (moved) break
        }
        return newTab
      })
    }
    for (let i = 0; i < 52; i++) {
      delay += 80
      setTimeout(autoMove, delay)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAutoComplete])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // Drag handlers
  const startDrag = (e: React.MouseEvent, cards: Card[], from: CardPosition) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragPos({ x: e.clientX, y: e.clientY })
    setDrag({ cards, from })
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!drag) return
    setDragPos({ x: e.clientX, y: e.clientY })
  }, [drag])

  const removeFromSource = useCallback((from: CardPosition, cards: Card[]) => {
    if (from.area === 'tableau') {
      setTableau(prev => {
        const next = prev.map(col => [...col])
        next[from.col] = next[from.col].slice(0, next[from.col].length - cards.length)
        if (next[from.col].length > 0) {
          next[from.col][next[from.col].length - 1] = { ...next[from.col][next[from.col].length - 1], faceUp: true }
        }
        return next
      })
    } else if (from.area === 'waste') {
      setWaste(prev => prev.slice(0, prev.length - 1))
    } else if (from.area === 'foundation') {
      setFoundations(prev => {
        const next = prev.map(f => [...f])
        next[from.col] = next[from.col].slice(0, next[from.col].length - 1)
        return next
      })
    }
  }, [])

  const dropOnTableau = useCallback((col: number) => {
    if (!drag) return
    const colCards = tableau[col]
    const [topCard] = drag.cards
    if (canPlaceOnTableau(topCard, colCards)) {
      removeFromSource(drag.from, drag.cards)
      setTableau(prev => {
        const next = prev.map(c => [...c])
        next[col] = [...next[col], ...drag.cards]
        return next
      })
      setScore(s => s + (drag.from.area === 'waste' ? 5 : drag.from.area === 'foundation' ? -15 : 0))
      setMoves(m => m + 1)
    }
    setDrag(null)
  }, [drag, tableau, removeFromSource])

  const dropOnFoundation = useCallback((fi: number) => {
    if (!drag || drag.cards.length !== 1) return
    const card = drag.cards[0]
    if (canPlaceOnFoundation(card, foundations[fi])) {
      removeFromSource(drag.from, drag.cards)
      setFoundations(prev => {
        const next = prev.map(f => [...f])
        next[fi] = [...next[fi], card]
        return next
      })
      setScore(s => s + 15)
      setMoves(m => m + 1)
    }
    setDrag(null)
  }, [drag, foundations, removeFromSource])

  const onMouseUp = useCallback(() => {
    setDrag(null)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const clickStock = () => {
    if (stock.length === 0) {
      // Flip waste back
      setStock([...waste].reverse().map(c => ({ ...c, faceUp: false })))
      setWaste([])
      setScore(s => Math.max(0, s - 100))
    } else {
      const card = { ...stock[stock.length - 1], faceUp: true }
      setStock(prev => prev.slice(0, prev.length - 1))
      setWaste(prev => [...prev, card])
    }
    setMoves(m => m + 1)
  }

  const doubleClickCard = (card: Card, from: CardPosition) => {
    // Try to auto-place on foundation
    for (let fi = 0; fi < 4; fi++) {
      if (canPlaceOnFoundation(card, foundations[fi])) {
        removeFromSource(from, [card])
        setFoundations(prev => {
          const next = prev.map(f => [...f])
          next[fi] = [...next[fi], card]
          return next
        })
        setScore(s => s + 15)
        setMoves(m => m + 1)
        return
      }
    }
  }

  const getHint = () => {
    // Find first valid move
    const allFaceUp: { card: Card; from: CardPosition }[] = []
    tableau.forEach((col, ci) => {
      col.forEach((card, ri) => {
        if (card.faceUp) allFaceUp.push({ card, from: { area: 'tableau', col: ci, row: ri } })
      })
    })
    if (waste.length > 0) {
      allFaceUp.push({ card: waste[waste.length - 1], from: { area: 'waste', col: 0 } })
    }

    for (const { card, from } of allFaceUp) {
      for (let fi = 0; fi < 4; fi++) {
        if (canPlaceOnFoundation(card, foundations[fi])) {
          setHint(`Move ${card.rank}${card.suit} to Foundation`)
          setTimeout(() => setHint(null), 2500)
          return
        }
      }
      for (let col = 0; col < 7; col++) {
        if (col === from.col) continue
        if (canPlaceOnTableau(card, tableau[col])) {
          setHint(`Move ${card.rank}${card.suit} to Column ${col + 1}`)
          setTimeout(() => setHint(null), 2500)
          return
        }
      }
    }
    setHint('No obvious hints found')
    setTimeout(() => setHint(null), 2000)
  }

  const cardColor = (suit: Suit) => isRed(suit) ? 'text-red-600' : 'text-neutral-900'

  const CardFace = ({ card, small = false }: { card: Card; small?: boolean }) => (
    <div className={`select-none ${small ? 'text-[9px]' : 'text-[11px]'} font-bold leading-none ${cardColor(card.suit)}`}>
      <div>{card.rank}</div>
      <div>{card.suit}</div>
    </div>
  )

  const CardBack = ({ small = false }: { small?: boolean }) => (
    <div className={`w-full h-full bg-gradient-to-br from-[#1a4dbf] via-[#2055c5] to-[#1040ae] rounded-[2px] flex items-center justify-center ${small ? '' : ''}`}>
      <div className="w-[85%] h-[85%] border border-[#4070e0]/60 rounded-[1px] bg-[repeating-linear-gradient(45deg,#1a4dbf,#1a4dbf_3px,#1848b5_3px,#1848b5_6px)]" />
    </div>
  )

  // Card component
  const CardEl = ({
    card, from, draggable = true
  }: {
    card: Card
    from: CardPosition
    draggable?: boolean
  }) => {
    const isDragging = drag?.cards[0].id === card.id && drag.from.area === from.area && drag.from.col === from.col

    return (
      <div
        className={`absolute w-[62px] h-[88px] rounded-[3px] border shadow-sm transition-none cursor-pointer select-none
          ${isDragging ? 'opacity-20' : ''}
          ${card.faceUp
            ? 'bg-white border-neutral-300 hover:border-blue-400 hover:shadow-md'
            : 'bg-white border-neutral-300 cursor-default'}
        `}
        onMouseDown={card.faceUp && draggable ? (e) => {
          if (from.area === 'tableau') {
            // grab this card + all below it
            const col = tableau[from.col]
            const idx = col.findIndex(c => c.id === card.id)
            const cards = col.slice(idx)
            startDrag(e, cards, from)
          } else {
            startDrag(e, [card], from)
          }
        } : undefined}
        onDoubleClick={card.faceUp ? () => doubleClickCard(card, from) : undefined}
      >
        {card.faceUp ? (
          <div className="w-full h-full p-[3px] flex flex-col justify-between">
            <CardFace card={card} />
            <div className={`text-center text-[18px] leading-none ${cardColor(card.suit)}`}>{card.suit}</div>
            <div className={`self-end rotate-180`}><CardFace card={card} /></div>
          </div>
        ) : (
          <CardBack />
        )}
      </div>
    )
  }

  const CARD_W = 62
  const CARD_H = 88
  const STACK_OFFSET_DOWN = 18
  const STACK_OFFSET_FACE_UP = 22

  return (
    <div
      ref={gameAreaRef}
      className="flex-1 flex flex-col h-full select-none overflow-hidden"
      style={{ background: '#1a6b2a', fontFamily: 'Tahoma, sans-serif' }}
    >
      {/* XP-style Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#aaa] px-2 py-0.5 flex gap-3 text-[11px] text-neutral-700 shrink-0">
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Game</button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer" onClick={initGame}>Deal</button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer" onClick={getHint}>Hint</button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Options</button>
        <button type="button" className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</button>
        <div className="ml-auto flex items-center gap-4 text-[10px] font-mono text-neutral-600">
          <span>⏱ {formatTime(time)}</span>
          <span>🎯 Score: <strong className="text-emerald-800">{score}</strong></span>
          <span>🔄 Moves: <strong>{moves}</strong></span>
        </div>
      </div>

      {/* Hint bar */}
      {hint && (
        <div className="bg-amber-100 border-b border-amber-300 px-3 py-1 text-[11px] text-amber-900 font-semibold text-center shrink-0">
          💡 {hint}
        </div>
      )}

      {/* Game Won Banner */}
      {gameWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white border-4 border-[#316ac5] rounded-lg shadow-2xl p-8 text-center pointer-events-auto">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-black text-[#316ac5] mb-1">You Win!</h2>
            <p className="text-sm text-neutral-600 mb-1">Score: <strong>{score}</strong> | Time: <strong>{formatTime(time)}</strong> | Moves: <strong>{moves}</strong></p>
            <button
              type="button"
              onClick={initGame}
              className="mt-4 px-6 py-2 bg-gradient-to-b from-[#4da6ff] to-[#0055ea] text-white font-bold rounded shadow cursor-pointer hover:brightness-110"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex-1 p-3 overflow-auto">
        {/* Top Row: Stock, Waste, Foundations */}
        <div className="flex gap-3 mb-4 items-start">
          {/* Stock */}
          <div
            className="w-[62px] h-[88px] rounded-[3px] border-2 border-dashed border-[#2d8a40]/70 flex items-center justify-center cursor-pointer hover:border-white/60 transition-colors relative shrink-0"
            onClick={clickStock}
          >
            {stock.length > 0 ? (
              <div className="w-[62px] h-[88px] rounded-[3px] border border-neutral-300 overflow-hidden">
                <CardBack />
              </div>
            ) : (
              <div className="text-white/50 text-2xl font-bold select-none">↺</div>
            )}
            {stock.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-[#316ac5] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {stock.length}
              </div>
            )}
          </div>

          {/* Waste */}
          <div className="w-[62px] h-[88px] rounded-[3px] border-2 border-dashed border-[#2d8a40]/70 relative shrink-0">
            {waste.length > 0 && (() => {
              const card = waste[waste.length - 1]
              const from: CardPosition = { area: 'waste', col: 0 }
              return (
                <div
                  className="absolute w-[62px] h-[88px] rounded-[3px] border border-neutral-300 bg-white shadow-sm cursor-pointer hover:border-blue-400"
                  onMouseDown={(e) => startDrag(e, [card], from)}
                  onDoubleClick={() => doubleClickCard(card, from)}
                >
                  <div className="w-full h-full p-[3px] flex flex-col justify-between">
                    <CardFace card={card} />
                    <div className={`text-center text-[18px] leading-none ${cardColor(card.suit)}`}>{card.suit}</div>
                    <div className="self-end rotate-180"><CardFace card={card} /></div>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="flex-1" />

          {/* Foundations */}
          {foundations.map((foundation, fi) => (
            <div
              key={fi}
              className="w-[62px] h-[88px] rounded-[3px] border-2 border-dashed border-[#2d8a40]/70 flex items-center justify-center relative shrink-0 hover:border-white/60 transition-colors"
              onMouseUp={() => dropOnFoundation(fi)}
            >
              {foundation.length > 0 ? (() => {
                const card = foundation[foundation.length - 1]
                const from: CardPosition = { area: 'foundation', col: fi }
                return (
                  <div
                    className="absolute w-[62px] h-[88px] rounded-[3px] border border-neutral-300 bg-white shadow-sm cursor-pointer hover:border-blue-400"
                    onMouseDown={(e) => startDrag(e, [card], from)}
                  >
                    <div className="w-full h-full p-[3px] flex flex-col justify-between">
                      <CardFace card={card} />
                      <div className={`text-center text-[18px] leading-none ${cardColor(card.suit)}`}>{card.suit}</div>
                      <div className="self-end rotate-180"><CardFace card={card} /></div>
                    </div>
                  </div>
                )
              })() : (
                <span className="text-white/30 text-xl select-none">{SUITS[fi]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-3 items-start">
          {tableau.map((col, ci) => {
            const totalCards = col.length
            return (
              <div
                key={ci}
                className="relative shrink-0"
                style={{
                  width: CARD_W,
                  height: Math.max(CARD_H, CARD_H + (totalCards > 1 ? (totalCards - 1) * STACK_OFFSET_FACE_UP : 0)),
                  minHeight: CARD_H,
                }}
                onMouseUp={() => dropOnTableau(ci)}
              >
                {/* Empty column placeholder */}
                <div
                  className="absolute w-[62px] h-[88px] rounded-[3px] border-2 border-dashed border-[#2d8a40]/70 hover:border-white/50 transition-colors"
                  style={{ top: 0, left: 0 }}
                />
                {/* Cards */}
                {col.map((card, ri) => {
                  const offset = ri === 0 ? 0 : col.slice(0, ri).reduce((acc, c) => {
                    return acc + (c.faceUp ? STACK_OFFSET_FACE_UP : STACK_OFFSET_DOWN)
                  }, 0)
                  return (
                    <div
                      key={card.id}
                      style={{ position: 'absolute', top: offset, left: 0, zIndex: ri + 1 }}
                    >
                      <CardEl
                        card={card}
                        from={{ area: 'tableau', col: ci, row: ri }}
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dragged cards overlay */}
      {drag && (
        <div
          style={{
            position: 'fixed',
            left: dragPos.x - dragOffset.x,
            top: dragPos.y - dragOffset.y,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {drag.cards.map((card, i) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                top: i * STACK_OFFSET_FACE_UP,
                left: 0,
                width: CARD_W,
                height: CARD_H,
              }}
              className="rounded-[3px] border border-neutral-300 bg-white shadow-xl"
            >
              <div className="w-full h-full p-[3px] flex flex-col justify-between">
                <CardFace card={card} />
                <div className={`text-center text-[18px] leading-none ${cardColor(card.suit)}`}>{card.suit}</div>
                <div className="self-end rotate-180"><CardFace card={card} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#aaa] px-3 py-0.5 text-[11px] text-neutral-600 flex justify-between shrink-0">
        <span>Klondike Solitaire | {gameWon ? '🎉 Game Complete!' : `${foundations.reduce((s, f) => s + f.length, 0)}/52 cards placed`}</span>
        <span>{canAutoComplete ? '✅ Auto-complete available' : `Stock: ${stock.length} | Waste: ${waste.length}`}</span>
      </div>
    </div>
  )
}
