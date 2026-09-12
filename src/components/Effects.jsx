import { useEffect, useRef, useState } from 'react'
import { registerVisit, heartbeat } from '../api.js'

const STARS = ['🖤', '💜', '⚡', '✦', '🔥']

/**
 * Классический шлейф за курсором. Теперь из сердец и молний.
 */
export function CursorTrail() {
  const [stars, setStars] = useState([])
  const lastSpawn = useRef(0)
  const idRef = useRef(0)

  useEffect(() => {
    function onMove(e) {
      const now = Date.now()
      if (now - lastSpawn.current < 45) return
      lastSpawn.current = now
      const id = ++idRef.current
      const star = {
        id,
        x: e.clientX + (Math.random() * 10 - 5),
        y: e.clientY + (Math.random() * 10 - 5),
        char: STARS[Math.floor(Math.random() * STARS.length)],
      }
      setStars((prev) => [...prev.slice(-25), star])
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id))
      }, 900)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {stars.map((s) => (
        <span key={s.id} className="cursor-star" style={{ left: s.x, top: s.y }}>
          {s.char}
        </span>
      ))}
    </>
  )
}

const NORMAL_PHRASES = [
  '☠ КОНСТАНТИН МАРСЕЛЕВИЧ 2004 ☠',
  '>>> тру 1337 готический кодер <<<',
  '*** ТЕМНАЯ СТОРОНА РУНЕТА ***',
  '..:: ты 666666-й посетитель ::..',
]

const BEG_PHRASES = [
  'ТУДА НЕ УХОДИ!!! 🦇',
  'ОСТАНЬСЯ ВО ТЬМЕ...',
  'ты правда уходишь? 😔',
  'мы будем ждать... вечно...',
]

/**
 * Живой заголовок вкладки: листает фразы, а когда пользователь уходит
 * со страницы — умоляет вернуться, и встречает его на обратном пути.
 */
export function TitleManager() {
  useEffect(() => {
    let i = 0
    let restoreTimer = null
    let cycle = setInterval(() => {
      document.title = NORMAL_PHRASES[i % NORMAL_PHRASES.length]
      i++
    }, 2500)

    function onVisibility() {
      if (document.hidden) {
        clearInterval(cycle)
        clearTimeout(restoreTimer)
        let j = 0
        cycle = setInterval(() => {
          document.title = BEG_PHRASES[j % BEG_PHRASES.length]
          j++
        }, 1200)
      } else {
        clearInterval(cycle)
        document.title = 'С ВОЗВРАЩЕНИЕМ ВО ТЬМУ 🖤'
        restoreTimer = setTimeout(() => {
          cycle = setInterval(() => {
            document.title = NORMAL_PHRASES[i % NORMAL_PHRASES.length]
            i++
          }, 2500)
        }, 4000)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(cycle)
      clearTimeout(restoreTimer)
      document.removeEventListener('visibilitychange', onVisibility)
      document.title = NORMAL_PHRASES[0]
    }
  }, [])
}

/**
 * Настоящий счётчик посетителей: бэкенд инкрементит и возвращает total.
 * Если бэкенд спит — честно показываем локальный фейк.
 */
export function HitCounter() {
  const [total, setTotal] = useState(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    registerVisit().then((data) => {
      if (data) {
        setTotal(data.total)
        setLive(true)
      } else {
        const key = 'retro_hits_local'
        const next = parseInt(localStorage.getItem(key) || '0', 10) + 133700 + 1
        localStorage.setItem(key, String(next))
        setTotal(next)
      }
    })
  }, [])

  if (total === null) return <span className="hit-counter">......</span>
  return (
    <span title={live ? 'живой счётчик с сервера' : 'бэкенд спит, счёт локальный'} className="hit-counter">
      {String(total).padStart(6, '0').split('').map((d, i) => (
        <span key={i} className="digit">
          {d}
        </span>
      ))}
    </span>
  )
}

/**
 * «Кто онлайн»: раз в минуту стучится на бэкенд со своим погонялом.
 */
export function OnlineCounter() {
  const [online, setOnline] = useState(null)

  useEffect(() => {
    let stop = false
    function nick() {
      if (!localStorage.getItem('retro_nick')) {
        localStorage.setItem('retro_nick', genNick())
      }
      return localStorage.getItem('retro_nick')
    }
    async function beat() {
      const data = await heartbeat(nick())
      if (!stop && data) setOnline(data.online)
    }
    beat()
    const t = setInterval(beat, 60000)
    return () => {
      stop = true
      clearInterval(t)
    }
  }, [])

  return (
    <span title={online === null ? 'бэкенд спит' : 'живой счёт с сервера'}>
      {online === null ? 'Online: 1 (и его тьма)' : `Online: ${online}`}
    </span>
  )
}

// ---------- Генератор погонял 2004 ----------

const GEN_PREFIX = ['xXx', '~*~', 'DJ_', 'Mr.', '::.','[', '_the_', '◄']
const GEN_DARK = ['Тёмный', 'Кровавый', 'Падший', 'Ночной', 'Мрачный', 'Забытый', 'Проклятый', 'Последний', 'Холодный', 'Сумрачный']
const GEN_WHO = ['Волк', 'Ангел', 'Ворон', 'Демон', 'Кодер', 'Вампир', 'Лорд', 'Странник', 'Рыцарь', 'Меч']
const GEN_SUFFIX = ['666', '_1337', '2004', 'xXx', 'dead_inside', 'of_Darkness', '66613', '™']
const GEN_DECOR = ['~', '*', '†', '♂', '♥', '.::', '::.', '///']

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function genNick() {
  const r = Math.random()
  let nick = ''
  if (r < 0.8) nick += pick(GEN_PREFIX)
  nick += pick(GEN_DARK) + '_' + pick(GEN_WHO)
  if (Math.random() < 0.85) nick += pick(GEN_SUFFIX)
  if (Math.random() < 0.5) nick = pick(GEN_DECOR) + nick
  if (Math.random() < 0.5) nick += pick(GEN_DECOR).split('').reverse().join('')
  return nick
}

/**
 * Генератор погонял: поле ввода + кнопка. Классика жанра.
 */
export function NickGenerator() {
  const [nick, setNick] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    setNick(genNick())
    setCopied(false)
  }

  function copy() {
    navigator.clipboard?.writeText(nick).then(
      () => setCopied(true),
      () => {},
    )
  }

  return (
    <div className="bevel-box">
      <h3>🧬 ГЕНЕРАТОР ПОГОНЯЛ 2004</h3>
      <div style={{ display: 'flex', gap: 6 }}>
        <input className="retro-input" placeholder="введи своё реальное имя (не обязательно)" />
        <button className="retro-btn" onClick={generate}>
          Сгенерить
        </button>
      </div>
      {nick && (
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <div className="acid-text" style={{ fontSize: 20, fontFamily: "'Courier New', monospace" }}>
            {nick}
          </div>
          <button className="retro-btn" style={{ marginTop: 6, fontSize: 11 }} onClick={copy}>
            {copied ? '✔ Скопировано!' : 'Скопировать'}
          </button>
        </div>
      )}
      <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 6 }}>
        Погоняло уникально с вероятностью 146%. Совпадение погонял = судьба.
      </div>
    </div>
  )
}
