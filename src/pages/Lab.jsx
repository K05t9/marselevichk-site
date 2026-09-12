import { useEffect, useRef, useState } from 'react'
import UnderConstruction from '../components/UnderConstruction.jsx'

/* ---------------------------------------------------------
   Демка 1: «Матрица» на canvas. Символы реально падают.
   --------------------------------------------------------- */
function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    const chars = '01АБВГДЖЗИКЛМНОПРСТУФХЦЧШЩЯ@#$%'.split('')
    const fontSize = 16
    let columns, drops

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -40))
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = fontSize + 'px monospace'
      for (let i = 0; i < columns; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.97 ? '#ccffcc' : '#00ff00'
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="demo-canvas"
      title="Ты уже проснулся, Нео"
    />
  )
}

/* ---------------------------------------------------------
   Демка 2: скринсейвер с летающим логотипом — классика
   Windows XP на плазме в баре.
   --------------------------------------------------------- */
function BouncingLogo() {
  const boxRef = useRef(null)
  const elRef = useRef(null)
  const pos = useRef({ x: 40, y: 40, dx: 1.6, dy: 1.2 })
  const [colorIdx, setColorIdx] = useState(0)
  const colorIdxRef = useRef(0)
  const colors = ['#ff6600', '#00ccff', '#ff00ff', '#33ff33', '#ffff00']

  useEffect(() => {
    let raf
    function step() {
      const box = boxRef.current
      const el = elRef.current
      if (box && el) {
        const p = pos.current
        const maxX = box.clientWidth - el.offsetWidth
        const maxY = box.clientHeight - el.offsetHeight
        if (p.x <= 0 || p.x >= maxX) {
          p.dx = -p.dx
          colorIdxRef.current = (colorIdxRef.current + 1) % colors.length
          setColorIdx(colorIdxRef.current)
        }
        if (p.y <= 0 || p.y >= maxY) {
          p.dy = -p.dy
          colorIdxRef.current = (colorIdxRef.current + 1) % colors.length
          setColorIdx(colorIdxRef.current)
        }
        p.x = Math.min(Math.max(p.x + p.dx, 0), Math.max(maxX, 0))
        p.y = Math.min(Math.max(p.y + p.dy, 0), Math.max(maxY, 0))
        el.style.transform = `translate(${p.x}px, ${p.y}px)`
      }
      raf = requestAnimationFrame(step)
    }
    step()
    return () => cancelAnimationFrame(raf)
  }, [colors.length])

  return (
    <div ref={boxRef} className="demo-frame" style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
      <div
        ref={elRef}
        style={{
          position: 'absolute',
          padding: '8px 18px',
          fontWeight: 'bold',
          fontFamily: 'Verdana, sans-serif',
          fontSize: 22,
          border: '2px solid currentColor',
          color: colors[colorIdx],
          whiteSpace: 'nowrap',
        }}
      >
        INTERNET EXPLORER
      </div>
    </div>
  )
}

/* ---------------------------------------------------------
   Демка 3: кислотный туннель. Неоновые кольца летят на тебя,
   цвета циклятся — помогает выйти из матрицы в другую сторону.
   --------------------------------------------------------- */
function AcidTunnel() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0

    function draw() {
      const w = (canvas.width = canvas.offsetWidth)
      const h = (canvas.height = canvas.offsetHeight)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
      ctx.fillRect(0, 0, w, h)
      const cx = w / 2 + Math.sin(t / 40) * w * 0.12
      const cy = h / 2 + Math.cos(t / 55) * h * 0.12
      const rings = 22
      for (let i = rings; i > 0; i--) {
        const p = ((i + (t % 30)) / rings) % 1
        const r = p * Math.max(w, h) * 0.7
        const hue = (t * 4 + i * 24) % 360
        ctx.beginPath()
        ctx.strokeStyle = `hsla(${hue}, 100%, ${18 + p * 40}%, 0.9)`
        ctx.lineWidth = 2 + p * 5
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      t += 0.6
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="demo-canvas" title="Вход с ticket'ом, выход без" />
}

/* ---------------------------------------------------------
   Демка 4: готический салют. Частицы разлетаются и гаснут,
   как обещания «завтра точно лягу спать пораньше».
   --------------------------------------------------------- */
function GothicFireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    const parts = []
    const colors = ['#ff2ea6', '#cc2222', '#aa00ff', '#00ffcc', '#ccff00']

    function explode() {
      const x = 60 + Math.random() * (canvas.offsetWidth - 120)
      const y = 40 + Math.random() * (canvas.offsetHeight - 100)
      const color = colors[Math.floor(Math.random() * colors.length)]
      for (let i = 0; i < 42; i++) {
        const a = (Math.PI * 2 * i) / 42 + Math.random() * 0.2
        const v = 1 + Math.random() * 3.4
        parts.push({ x, y, dx: Math.cos(a) * v, dy: Math.sin(a) * v, life: 1, color })
      }
    }

    function draw() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.dx
        p.y += p.dy
        p.dy += 0.04
        p.life -= 0.014
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 2.5, 2.5)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()
    const spawner = setInterval(explode, 1400)
    explode()
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawner)
    }
  }, [])

  return <canvas ref={canvasRef} className="demo-canvas" title="Салют во тьме" />
}

export default function Lab() {
  return (
    <>
      <div className="bevel-box">
        <h3>🧪 ЛАБОРАТОРИЯ (future subdomain: lab.marselevichk.ru)</h3>
        <p style={{ fontSize: 13 }}>
          Тут живут мои интерактивные эксперименты на React: каждая демка —
          самостоятельный компонент, который можно вынести на отдельный субдомен
          или прикрутить куда угодно.
        </p>
      </div>

      <div className="bevel-box">
        <h3>Демка №1: Матрица</h3>
        <MatrixRain />
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 4 }}>
          canvas + requestAnimationFrame. Атмосферно, как ночной чат.
        </div>
      </div>

      <div className="bevel-box">
        <h3>Демка №2: Скринсейвер</h3>
        <BouncingLogo />
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 4 }}>
          Логотип меняет цвет об стену. Ставь на второй монитор и делай вид, что работаешь.
        </div>
      </div>

      <div className="bevel-box">
        <h3>Демка №3: Кислотный туннель</h3>
        <AcidTunnel />
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 4 }}>
          Неон, кольца, фазовая модуляция цвета. Смотреть на голодный желудок не
          рекомендуется.
        </div>
      </div>

      <div className="bevel-box">
        <h3>Демка №4: Готический салют</h3>
        <GothicFireworks />
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 4 }}>
          Частицы с гравитацией и затуханием. Цвета — фирменная палитра сайта.
        </div>
      </div>

      <UnderConstruction what="ДЕМКА №5 (в процессе заклинания)" />
    </>
  )
}
