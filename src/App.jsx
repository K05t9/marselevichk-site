import { useEffect, useState } from 'react'
import { CursorTrail, TitleManager, HitCounter, OnlineCounter } from './components/Effects.jsx'
import RetroWindow from './components/RetroWindow.jsx'
import {
  BatRain,
  Ghost,
  Fog,
  SkullCorners,
  GothicPlayer,
  CurseCounter,
  Candles,
  GothicHr,
  CrossField,
  BatCursor,
} from './components/Gothic.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Lab from './pages/Lab.jsx'
import Sites from './pages/Sites.jsx'

// Мини-роутер на хэше. Каждая страница = будущий субдомен
// (chat.marselevichk.ru и т.п.), пока живёт в виде #/chat
const ROUTES = {
  '/': { component: Home, label: 'ГЛАВНАЯ' },
  '/sites': { component: Sites, label: 'МОИ САЙТЫ' },
  '/chat': { component: Chat, label: 'ЧАТ' },
  '/lab': { component: Lab, label: 'ЛАБОРАТОРИЯ' },
}

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/')
  useEffect(() => {
    const onChange = () => {
      setRoute(window.location.hash.slice(1) || '/')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

function WelcomePopup({ onClose }) {
  return (
    <>
      <div className="popup-overlay" />
      <div className="popup-window">
        <RetroWindow title="☠ ВОЙТИ ВО ТЬМУ?" onClose={onClose}>
          <p style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 22 }}>🦇</p>
          <p style={{ margin: '0 0 8px' }} className="blink">
            Осторожно: сайт лучше всего смотреть в Internet Explorer 6 при
            разрешении 800×600 и при свече!
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 12 }}>
            Включите колонки, чтобы услышать готический MIDI 🎵 (вы не услышите
            ничего, это часть концепции)
          </p>
          <div style={{ textAlign: 'center' }}>
            <button className="retro-btn" onClick={onClose}>
              Войти
            </button>
            <button className="retro-btn" onClick={onClose} style={{ marginLeft: 8 }}>
              Убежать
            </button>
          </div>
        </RetroWindow>
      </div>
    </>
  )
}

export default function App() {
  const route = useHashRoute()
  const [popupOpen, setPopupOpen] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('retro_theme') || 'gothic')
  const [isNight, setIsNight] = useState(() => {
    const h = new Date().getHours()
    return h >= 23 || h < 6
  })

  // Ночной режим: с 23:00 до 6:00 тьма густеет
  useEffect(() => {
    const t = setInterval(() => {
      const h = new Date().getHours()
      setIsNight(h >= 23 || h < 6)
    }, 60000)
    return () => clearInterval(t)
  }, [])

  function toggleTheme() {
    const next = theme === 'gothic' ? 'y2k' : 'gothic'
    setTheme(next)
    localStorage.setItem('retro_theme', next)
  }

  TitleManager()

  const page = ROUTES[route] || ROUTES['/']
  const Page = page.component

  return (
    <div
      className={
        'page-wrap bat-cursor' +
        (theme === 'y2k' ? ' theme-y2k' : '') +
        (isNight ? ' deep-night' : '')
      }
    >
      <CursorTrail />
      <BatCursor />
      <CrossField count={26} />
      <BatRain intervalMs={isNight ? 500 : 900} />
      <Ghost />
      <Fog />
      <SkullCorners />

      {popupOpen && <WelcomePopup onClose={() => setPopupOpen(false)} />}

      <table className="main-table" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td colSpan={2}>
              <div className="wordart">Константин Марсельевич 2004</div>
              <div className="drips" aria-hidden="true">
                <span className="drip" />
                <span className="drip" />
                <span className="drip" />
                <span className="drip" />
                <span className="drip" />
              </div>
              <div style={{ textAlign: 'center', padding: '0 0 4px', fontSize: 13 }}>
                <span className="acid-blink">ТРУ 1337 КОДЕР</span>{' '}
                • Lord of the FrontPage • замок marselevichk.ru{' '}
                <span className="night-badge">НОЧНОЙ РЕЖИМ</span>
              </div>
              <div className="chain-row" aria-hidden="true">
                ⛓️🖤⛓️💀⛓️💜⛓️
              </div>
              <Candles count={5} />
              <div className="checker-strip" aria-hidden="true" />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <marquee className="marquee-bar" scrollAmount={6}>
                +++ ДОБРО ПОЖАЛОВАТЬ ВО ТЬМУ +++ СКОРО ОТКРЫТИЕ СКЛЕПА НОВОГО РАЗДЕЛА +++
                ПРОСЬБА НЕ ФЛУДИТЬ В ГОСТЕВОЙ, ИНАЧЕ ПРОКЛЯТИЕ +++ ФАЙЛ ОБМЕННИК РАБОТАЕТ
                ТОЛЬКО В ПОЛНОЧЬ +++ WELCOME TO MY DARK HOMEPAGE +++
              </marquee>
              <marquee
                className="marquee-bar secondary"
                scrollAmount={4}
                direction="right"
              >
                🦇 мocy летят 🦇 души павшие не дают мне спать 🦇 моя тьма не кончится
                никогда (тариф ночной) 🦇 скучаю по герла... 🦇
              </marquee>
            </td>
          </tr>
          <tr>
            <td className="sidebar">
              <h4>:: НАВИГАЦИЯ ::</h4>
              {Object.entries(ROUTES).map(([path, r]) => (
                <a
                  key={path}
                  className={'nav-link' + (route === path ? ' active' : '')}
                  href={'#' + path}
                >
                  {r.label}
                </a>
              ))}
              <div className="theme-switch">
                <button className="retro-btn" style={{ fontSize: 11, width: '100%' }} onClick={toggleTheme}>
                  {theme === 'gothic' ? '⚡ ВКЛЮЧИТЬ Y2K' : '☠ ВЕРНУТЬ ТЬМУ'}
                </button>
                <div style={{ fontSize: 10, color: '#8a5a8a', marginTop: 3 }}>
                  {theme === 'gothic' ? (
                    <>
                      <span className="theme-note">перламутр включен. </span>
                      сейчас: 2004, тёмная версия
                    </>
                  ) : (
                    'сейчас: 2000, перламутровая версия'
                  )}
                </div>
              </div>
              <GothicHr />
              <h4>:: СВЯЗЬ ::</h4>
              <div style={{ fontSize: 11, color: '#8a5a8a', textAlign: 'center' }}>
                ICQ: 666-133-713
                <br />
                почта ворона: konstantin@marselevichk.ru
                <br />
                <span className="blink" style={{ color: '#ff0000' }}>
                  Я ВО ТЬМЕ
                </span>
              </div>
              <GothicPlayer />
              <Candles count={3} />
            </td>
            <td className="content-cell">
              <Page />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="checker-strip" aria-hidden="true" />
              <div className="hearts-divider" aria-hidden="true">
                <span>🖤</span>
                <span>💜</span>
                <span>🖤</span>
                <span>💜</span>
                <span>🖤</span>
              </div>
              <div className="badges-row">
                <a className="btn88 btn88-IE" href="#" onClick={(e) => e.preventDefault()}>
                  BEST VIEWED IN<br />IE 6.0 (BY CANDLELIGHT)
                </a>
                <a className="btn88 btn88-navy" href="#" onClick={(e) => e.preventDefault()}>
                  MADE WITH<br />DARK NOTEPAD
                </a>
                <a className="btn88 btn88-matrix" href="#" onClick={(e) => e.preventDefault()}>
                  NO FRAMES<br />NO MERCY
                </a>
                <a className="btn88 btn88-hot" href="#" onClick={(e) => e.preventDefault()}>
                  HOT GOTH SITE<br />AWARD 2004
                </a>
                <a className="btn88 btn88-navy" href="#" onClick={(e) => e.preventDefault()}>
                  Y2K<br />SURVIVOR
                </a>
                <a className="btn88 btn88-hot" href="#" onClick={(e) => e.preventDefault()}>
                  100%<br />DARKNESS
                </a>
                <a className="btn88 btn88-matrix" href="#" onClick={(e) => e.preventDefault()}>
                  RGB<br />INSIDE
                </a>
                <a className="btn88 btn88-IE" href="#" onClick={(e) => e.preventDefault()}>
                  GOTH<br />&amp; PROUD
                </a>
                <a
                  className="btn88 btn88-IE"
                  href="https://институт-трезвости.рф/"
                  target="_blank"
                  rel="noreferrer"
                  title="Мой настоящий сайт!"
                >
                  ИНСТИТУТ<br />ТРЕЗВОСТИ
                </a>
              </div>
              <hr className="hr-gothic" />
              <div className="footer">
                Посетителей: <HitCounter /> • <OnlineCounter /> • <CurseCounter />
                <br />
                © 2004–∞ Константин Марсельевич, тру 1337 кодер. При копировании материала
                ссылка обязательна, иначе проклятие уже наложено.
                <br />
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Заклинания сайта
                </a>{' '}
                |{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Вебмастеру тьмы
                </a>{' '}
                |{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Черная реклама
                </a>
                <div style={{ marginTop: 4, fontSize: 10, color: '#553a55' }}>
                  этот сайт охраняют два вращающихся черепа. они видели вещи.
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
