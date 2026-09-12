import { useEffect, useState } from 'react'
import { loadGuestbook, postGuestbook } from '../api.js'

const SEED = [
  {
    name: 'admin',
    date: '14.03.2004',
    text: 'Первый нах! Пишите здесь всё что думаете о моём сайте. Флуд = проклятие.',
  },
  {
    name: 'Dj_NaKlNiK_666',
    date: '15.03.2004',
    text: 'крутой сайт!!!1 а есть мп3 Славный? скинь на мыло плиз',
  },
  {
    name: '~*~АлЁнКa~*~',
    date: '22.03.2004',
    text: 'прикольно))) заходи ко мне на страничку, у меня там фотки и тесты',
  },
]

function localEntries() {
  try {
    const raw = localStorage.getItem('retro_guestbook')
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return SEED
}

export default function Guestbook() {
  const [entries, setEntries] = useState(SEED)
  const [remote, setRemote] = useState(null)
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    loadGuestbook().then((data) => {
      if (data) {
        setRemote(true)
        setEntries(data)
      } else {
        setRemote(false)
        setEntries(localEntries())
      }
    })
  }, [])

  function saveLocal(list) {
    localStorage.setItem('retro_guestbook', JSON.stringify(list))
  }

  async function submit(e) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) {
      alert('Заполни все поля!!!11')
      return
    }
    const posted = await postGuestbook(name.trim().slice(0, 30), text.trim().slice(0, 500))
    if (posted) {
      setRemote(true)
      setEntries(posted)
    } else {
      setRemote(false)
      const list = [
        { name: name.trim().slice(0, 30), text: text.trim().slice(0, 500), date: 'сегодня' },
        ...localEntries(),
      ]
      saveLocal(list)
      setEntries(list)
      alert('Бэкенд спит, запись сохранена у тебя в браузере (как в 2004-м)')
    }
    setName('')
    setText('')
  }

  return (
    <div className="bevel-box">
      <h3>📖 ГОСТЕВАЯ КНИГА</h3>
      <div style={{ fontSize: 11, color: '#8a5a8a', marginBottom: 6 }}>
        {remote === null && 'подключаемся к склепу сервера...'}
        {remote === true && '✔ записи живут на сервере — все видят всех'}
        {remote === false && '⚠ сервер недоступен, записи живут только у тебя в браузере'}
      </div>
      <form onSubmit={submit} style={{ marginBottom: 10 }}>
        <input
          className="retro-input"
          placeholder="Твой ник (или сгенерируй на главной)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 6 }}
        />
        <textarea
          className="retro-input"
          rows={3}
          placeholder="Сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 6, resize: 'vertical' }}
        />
        <button className="retro-btn" type="submit">
          ОТПРАВИТЬ
        </button>
      </form>
      {entries.map((e, i) => (
        <div key={i} className="guestbook-entry">
          <span className="gb-date">{e.ts || e.date}</span>
          <span className="gb-name">{e.name}</span> написал:
          <div>{e.text}</div>
        </div>
      ))}
    </div>
  )
}
