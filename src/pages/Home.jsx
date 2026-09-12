import Guestbook from '../components/Guestbook.jsx'
import UnderConstruction from '../components/UnderConstruction.jsx'
import { Candles, GothicHr } from '../components/Gothic.jsx'
import { NickGenerator } from '../components/Effects.jsx'

export default function Home() {
  return (
    <>
      <div className="bevel-box">
        <h3>🦇 ПРИВЕТ, СТРАННИК НОЧИ</h3>
        <p>
          Ты попал на <b className="blink">САМЫЙ ТЁМНЫЙ</b> личный сайт рунета. Здесь я
          выкладываю готические мп3, обои с черепами 1024×768 и свои мысли о вечной тьме
          и RGB-подсветке.
        </p>
        <p style={{ fontSize: 12, color: '#8a5a8a' }}>
          Сайт работает на технологии <span className="new-badge">NEW!</span> DHTML и
          древней магии. Если что-то не работает — обнови браузер, перезагрузи модем и
          зажги свечу.
        </p>
        <Candles count={3} />
      </div>

      <NickGenerator />

      <div className="bevel-box">
        <h3>💀 МОЙ КОМП (тёмная башня 2024 года выпуска)</h3>
        <table className="spec-table">
          <tbody>
            <tr>
              <th>Процессор</th>
              <td>Intel Core i9-9900K (8 ядер, 16 потоков тьмы)</td>
            </tr>
            <tr>
              <th>Видеокарта</th>
              <td>NVIDIA GeForce RTX 3080 12GB (светится в темноте — RGB как у гроба)</td>
            </tr>
            <tr>
              <th>Оперативка</th>
              <td>64 ГБ DDR4 RGB (подсветка дышит, как неспящий модем)</td>
            </tr>
            <tr>
              <th>Накопители</th>
              <td>SSD NVMe 2TB (все души моих проектов) + HDD 4TB (архив тьмы 2004–2024)</td>
            </tr>
            <tr>
              <th>Монитор</th>
              <td>27" 240Hz (мыши в киберспортивном разрешении)</td>
            </tr>
            <tr>
              <th>Охлаждение</th>
              <td>водянка (шумит как вампир на выдохе)</td>
            </tr>
            <tr>
              <th>Периферия</th>
              <td>механическая клава с розовыми свитчами, мышь 26K DPI</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 6 }}>
          FPS в Матрице: да. Нагрев комнаты: +3°, зимой экономлю на отоплении.
        </div>
      </div>

      <div className="bevel-box">
        <h3>🎮 ВО ЧТО Я ИГРАЮ НОЧАМИ / ЧТО СЛУШАЮ</h3>
        <table className="spec-table">
          <tbody>
            <tr>
              <th>Игра №1</th>
              <td>Gothic 2: Ночь Ворона (пройден 9 раз, за орков тоже)</td>
            </tr>
            <tr>
              <th>Игра №2</th>
              <td>Counter-Strike 2 (рейтинг: тёмный серебро)</td>
            </tr>
            <tr>
              <th>Игра №3</th>
              <td>Dark Souls (умирал красиво, тыщи раз)</td>
            </tr>
            <tr>
              <th>Музыка</th>
              <td>Rammstein, HIM, Depeche Mode и мп3 из 2004-го (раритет)</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 6 }}>
          P.S. Скоро сделаю раздел «Мои сочинения» — училка одобрила, тьма тоже.
        </div>
      </div>

      <UnderConstruction what="СКЛЕП «ФОТОГАЛЕРЕЯ»" />

      <Guestbook />

      <GothicHr />

      <div className="bevel-box" style={{ textAlign: 'center' }}>
        <h3>⛓ КОЛЬЦО ТЁМНЫХ САЙТОВ</h3>
        <p>Это кольцо сайтов, посвящённых программированию, жизни и сумраку.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="retro-btn" href="#" onClick={(e) => e.preventDefault()}>
            &lt;&lt; Пред.
          </a>
          <a className="retro-btn" href="#" onClick={(e) => e.preventDefault()}>
            Случайный
          </a>
          <a className="retro-btn" href="#" onClick={(e) => e.preventDefault()}>
            След. &gt;&gt;
          </a>
        </div>
        <div style={{ fontSize: 11, color: '#8a5a8a', marginTop: 6 }}>
          Участников в кольце: 47 (двое ушли в свет, они не вернулись)
        </div>
      </div>
    </>
  )
}
