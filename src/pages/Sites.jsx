export default function Sites() {
  return (
    <>
      <div className="bevel-box">
        <h3>🏛 МОИ САЙТЫ (ПОРТФОЛИО)</h3>
        <p style={{ fontSize: 13 }}>
          Здесь я выставляю напоказ сайты, которые сделал. Кликните по баннеру —
          откроется в новом окне, гостям с модемом лучше нажимать вечером, тариф ночной.
        </p>
      </div>

      <div className="construction">
        <div className="construction-inner">
          <div style={{ fontSize: 12, color: '#8080ff', marginBottom: 6 }}>
            ЭКСПОНАТ №1 • добавлен в коллекцию сегодня • <span className="new-badge">NEW!</span>
          </div>
          <div
            style={{
              display: 'inline-block',
              border: '4px ridge #ffd700',
              background: 'linear-gradient(180deg, #000066, #000022)',
              padding: 14,
              margin: '6px 0',
            }}
          >
            <a
              href="https://институт-трезвости.рф/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'Impact, "Arial Black", sans-serif',
                fontSize: 30,
                color: '#ffd700',
                textDecoration: 'none',
                textShadow: '2px 2px 0 #800000',
                letterSpacing: 1,
              }}
            >
              🏛 ИНСТИТУТ ТРЕЗВОСТИ
            </a>
            <div style={{ fontSize: 13, color: '#ffffff', marginTop: 6 }}>
              институт-трезвости.рф
            </div>
          </div>
          <div style={{ textAlign: 'left', color: '#ffffff', fontSize: 13, marginTop: 8 }}>
            <b style={{ color: '#ff6600' }}>Что за зверь:</b> профессиональная психологическая
            помощь и реабилитация. Настоящий, работающий сайт — не как «фотогалерея» выше.
            <br />
            <b style={{ color: '#ff6600' }}>Кем сделан:</b> мной. Код, дизайн и благодарность
            близких — всё моё.
            <br />
            <b style={{ color: '#ff6600' }}>Награды:</b> «Сайт дня» от самого себя, 3 дня
            подряд.
          </div>
          <div style={{ marginTop: 10 }}>
            <a
              className="retro-btn"
              href="https://институт-трезвости.рф/"
              target="_blank"
              rel="noreferrer"
            >
              ОТКРЫТЬ САЙТ &gt;&gt;&gt;
            </a>
          </div>
        </div>
      </div>

      <div className="bevel-box" style={{ textAlign: 'center' }}>
        <h3>📊 СТАТИСТИКА ПОРТФОЛИО</h3>
        <table className="spec-table" style={{ textAlign: 'left' }}>
          <tbody>
            <tr>
              <th>Сайтов сделано</th>
              <td>1 (но зато какой)</td>
            </tr>
            <tr>
              <th>Сайтов в планах</th>
              <td>∞ (см. страницу ЛАБОРАТОРИЯ)</td>
            </tr>
            <tr>
              <th>Процент выёб..ва</th>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
