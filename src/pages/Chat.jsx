import { useEffect, useRef, useState } from 'react'
import UnderConstruction from '../components/UnderConstruction.jsx'

const BOTS = [
  { nick: 'admin', color: '#ff6600' },
  { nick: 'xXx_Тёмный_Ангел_xXx', color: '#ff00ff' },
  { nick: 'Гость_с_модемом', color: '#00ffff' },
  { nick: 'Про100_Кст', color: '#ffff00' },
]

const PHRASES = [
  'превед из тьмы)))',
  'кто в контру? 195.24.хх.хх пароль в личку',
  'у меня дисконект каждые 5 минут, либо модем либо проклятие',
  'админ сделай смайлики с черепами',
  'я щас мп3 качаю, тариф ночной, тьма жгёт ппц',
  'давайте в чате SEANCE играть',
  'кстат кто смотрел бумер? кайф (грустный)',
  '=-O а я думал тут поинтереснее',
  'звонок на город, выхожу... пока... навсегда?',
  'моё сердце пусто как жёсткий диск до зарплаты',
]

export default function Chat() {
  const [messages, setMessages] = useState([
    { nick: 'admin', color: '#ff6600', text: 'Чат открыт. Пведите себя прилично, тьма наблюдает.' },
    { nick: 'xXx_Тёмный_Ангел_xXx', color: '#ff00ff', text: 'всем привки из склепа))' },
  ])
  const [input, setInput] = useState('')
  const boxRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const bot = BOTS[Math.floor(Math.random() * BOTS.length)]
      const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
      setMessages((prev) => [...prev.slice(-40), { nick: bot.nick, color: bot.color, text: phrase }])
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [messages])

  function send(e) {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, { nick: 'Ты', color: '#33ff33', text: input.trim() }])
    setInput('')
  }

  return (
    <>
      <div className="bevel-box">
        <h3>💬 ЧАТ «ТЁМНЫЙ УГОЛОК» (online seance)</h3>
        <div className="chat-users">
          В чате онлайн: {BOTS.length + 1} душ. Модератор: <b>admin</b>. Флуд = проклятие
          по IP.
        </div>
        <div className="chat-box" ref={boxRef}>
          {messages.map((m, i) => (
            <div key={i}>
              <span className="chat-nick" style={{ color: m.color }}>
                {m.nick}:
              </span>{' '}
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={send} style={{ display: 'flex', gap: 6 }}>
          <input
            className="retro-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Пиши сюда (не матерись, мама читает)"
          />
          <button className="retro-btn" type="submit">
            Сказать
          </button>
        </form>
      </div>

      <UnderConstruction what="ГОЛОСОВОЙ ЧАТ (нужен микрофон)" />
    </>
  )
}
