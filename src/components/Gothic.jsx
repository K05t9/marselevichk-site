import { useEffect, useRef, useState } from 'react'

/* ============================================================
   Визуальный мусор в готическом стиле + немного звука.
   Всё декоративное, всё лишнее, всё как надо.
   ============================================================ */

const BATS = ['🦇', '🦇', '🦇', '🖤', '🥀']

/** Рой летучих мышей, вечерами поднимается с нижних полей */
export function BatRain({ intervalMs = 900 }) {
  const [bats, setBats] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    function spawn() {
      const id = ++idRef.current
      const bat = {
        id,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 7,
        size: 14 + Math.random() * 18,
        char: BATS[Math.floor(Math.random() * BATS.length)],
      }
      setBats((prev) => [...prev.slice(-14), bat])
      setTimeout(() => {
        setBats((prev) => prev.filter((b) => b.id !== id))
      }, bat.duration * 1000)
    }
    const interval = setInterval(spawn, intervalMs)
    spawn()
    return () => clearInterval(interval)
  }, [intervalMs])

  return (
    <div className="bat-layer" aria-hidden="true">
      {bats.map((b) => (
        <span
          key={b.id}
          className="bat"
          style={{
            left: b.left + '%',
            fontSize: b.size,
            animationDuration: b.duration + 's',
          }}
        >
          {b.char}
        </span>
      ))}
    </div>
  )
}

/** Курсор-летучая мышь: машет крыльями и чуть отстаёт от руки */
export function BatCursor() {
  const elRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const dir = useRef(1)

  useEffect(() => {
    function onMove(e) {
      target.current = { x: e.clientX, y: e.clientY }
      if (e.movementX !== 0) dir.current = e.movementX > 0 ? 1 : -1
    }
    window.addEventListener('mousemove', onMove)

    let raf
    function loop() {
      const p = pos.current
      const t = target.current
      p.x += (t.x - p.x) * 0.35
      p.y += (t.y - p.y) * 0.35
      if (elRef.current) {
        elRef.current.style.transform = `translate(${p.x}px, ${p.y}px) scaleX(${dir.current})`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={elRef} className="bat-cursor-el" aria-hidden="true">
      🦇
    </span>
  )
}

/** Призрак, который периодически проплывает через экран. Он не причинит вреда. */
export function Ghost() {
  return (
    <span className="ghost" aria-hidden="true">
      👻
    </span>
  )
}

/** Туман понизу экрана */
export function Fog() {
  return <div className="fog" aria-hidden="true" />
}

/** Вращающиеся черепа по углам. Охраняют сайт. */
export function SkullCorners() {
  return (
    <>
      <span className="skull-corner tl" aria-hidden="true">
        💀
      </span>
      <span className="skull-corner tr" aria-hidden="true">
        💀
      </span>
    </>
  )
}

const CROSSES = ['♰', '♱', '☨', '✝', '⚰']

/** Поле готических крестов на заднем плане. Много. */
export function CrossField({ count = 22 }) {
  const crosses = Array.from({ length: count }, (_, i) => {
    const seed = ((i * 2654435761) % 1000) / 1000
    const seed2 = ((i * 40503) % 997) / 997
    return {
      id: i,
      left: seed * 100,
      top: seed2 * 100,
      size: 18 + Math.floor(seed2 * 60),
      char: CROSSES[i % CROSSES.length],
      delay: (seed * 4).toFixed(2),
      color: ['#3d0a0a', '#2a0a2a', '#1a0a3d', '#3d0a28'][i % 4],
    }
  })
  return (
    <div className="cross-layer" aria-hidden="true">
      {crosses.map((c) => (
        <span
          key={c.id}
          className="cross-item"
          style={{
            left: c.left + '%',
            top: c.top + '%',
            fontSize: c.size,
            color: c.color,
            animationDelay: c.delay + 's',
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------
   Настоящий MIDI-плеер: Web Audio синтезирует зацикленную
   «готическую мелодию» из осцилляторов. Файлов нет, чистый код.
   --------------------------------------------------------- */

// частоты (Гц): ля-минор, всё мрачно
const N = {
  A2: 110.0, C3: 130.81, D3: 146.83, E3: 164.81, F2: 87.31, G2: 98.0,
  A3: 220.0, B3: 246.94, C4: 261.63, E4: 329.63, G4: 392.0, A4: 440.0,
}

// 16 шагов (восьмые), 0 = пауза
const LEAD = [
  N.A3, 0, N.C4, N.E4, 0, N.C4, N.A3, 0,
  N.B3, 0, N.E4, N.G4, 0, N.E4, N.C4, 0,
]
const BASS_ROOTS = [N.A2, N.A2, N.F2, N.G2] // корень на такт (4 шага = такт)

export function GothicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const timerRef = useRef(null)
  const stepRef = useRef(0)

  function note(freq, time, dur, type, peak) {
    const ctx = ctxRef.current
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1800
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, time)
    g.gain.linearRampToValueAtTime(peak, time + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, time + dur)
    osc.connect(filter)
    filter.connect(g)
    g.connect(gainRef.current)
    osc.start(time)
    osc.stop(time + dur + 0.05)
  }

  function tick() {
    const ctx = ctxRef.current
    const step = stepRef.current
    const t = ctx.currentTime + 0.05
    const lead = LEAD[step % LEAD.length]
    if (lead) note(lead, t, 0.35, 'square', 0.18)
    if (step % 4 === 0) {
      const bass = BASS_ROOTS[Math.floor(step / 4) % BASS_ROOTS.length]
      note(bass / 2, t, 0.6, 'triangle', 0.32)
      note(bass, t, 0.5, 'sawtooth', 0.1)
    }
    stepRef.current = step + 1
  }

  function start() {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      ctxRef.current = new Ctx()
      gainRef.current = ctxRef.current.createGain()
      gainRef.current.gain.value = volume
      gainRef.current.connect(ctxRef.current.destination)
    }
    ctxRef.current.resume()
    stepRef.current = 0
    tick()
    timerRef.current = setInterval(tick, 214) // ~140 bpm, восьмые
    setPlaying(true)
  }

  function stop() {
    clearInterval(timerRef.current)
    timerRef.current = null
    setPlaying(false)
  }

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  useEffect(
    () => () => {
      clearInterval(timerRef.current)
      if (ctxRef.current) ctxRef.current.close()
    },
    [],
  )

  return (
    <div className="win" style={{ margin: '8px 0' }}>
      <div className="win-titlebar">
        <span>♪ WINAMP (it really whips)</span>
      </div>
      <div className="win-body" style={{ padding: 6 }}>
        <div style={{ fontSize: 10, fontFamily: 'Courier New, monospace', color: '#ff9999' }}>
          01. gothic_midnight_2004.mid
        </div>
        <div style={{ fontSize: 10, fontFamily: 'Courier New, monospace', color: '#774a77' }}>
          {playing ? '▶ играет • синтез Web Audio' : '■ стоп • MIDI-тембра'}
        </div>
        <div className="player-eq" style={{ opacity: playing ? 1 : 0.35 }}>
          {[0, 0.15, 0.3, 0.45, 0.6, 0.1, 0.35, 0.5, 0.25, 0.55].map((d, i) => (
            <span
              key={i}
              className="bar"
              style={{ animationDelay: d + 's', animationDuration: 0.7 + d + 's' }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <button className="retro-btn" style={{ fontSize: 11, padding: '2px 8px' }} onClick={playing ? stop : start}>
            {playing ? '■' : '▶'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(e.target.value / 100)}
            style={{ flex: 1, accentColor: '#cc2222' }}
            title="крутилка громкости"
          />
        </div>
      </div>
    </div>
  )
}

/** Счётчик проклятий. Растёт сам, как и должно. */
export function CurseCounter() {
  const [curses, setCurses] = useState(666)
  useEffect(() => {
    const t = setInterval(() => {
      setCurses((c) => c + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ color: '#ff2222', textShadow: '0 0 8px #8b0000' }}>
      {curses} проклятий наложено
    </span>
  )
}

/** Свечи в память о дизайне 1998 года */
export function Candles({ count = 3 }) {
  return (
    <div className="candle-row" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="flicker" style={{ animationDelay: i * 0.4 + 's' }}>
          🕯
        </span>
      ))}
    </div>
  )
}

/** Готический разделитель */
export function GothicHr() {
  return (
    <div className="pentagram-divider" aria-hidden="true">
      <span className="spin">⛧</span>
      <span> ⚰ </span>
      <span className="spin" style={{ animationDirection: 'reverse' }}>
        ⛧
      </span>
    </div>
  )
}
