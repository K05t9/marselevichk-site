// Мини-бэкенд для marselevichk.ru: счётчик посещений, гостевая книга, «кто онлайн».
// Ноль зависимостей — чистый node http. Данные лежат в JSON-файлах рядом.
// Запуск: node server.js  (порт 3001)
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const PORT = process.env.PORT || 3001
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const COUNTER_FILE = path.join(DATA_DIR, 'counter.json')
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json')
const MAX_ENTRIES = 200
const ONLINE_TTL_MS = 5 * 60 * 1000

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJson(file, data) {
  const tmp = file + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data))
  fs.renameSync(tmp, file)
}

// ---------- счётчик ----------
let counter = readJson(COUNTER_FILE, { total: 0 })

// ---------- гостевая ----------
let guestbook = readJson(GUESTBOOK_FILE, [
  { name: 'admin', text: 'Первый нах! Пишите здесь всё что думаете о моём сайте. Флуд = бан.', ts: '2004-03-14' },
])

// ---------- онлайн ----------
// ip -> { nick, last }
const online = new Map()

function send(res, code, data) {
  const body = JSON.stringify(data)
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 16 * 1024) {
        reject(new Error('too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('bad json'))
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'

  try {
    // POST /api/visit -> инкремент + возвращает total и онлайн
    if (req.method === 'POST' && url.pathname === '/api/visit') {
      counter.total += 1
      writeJson(COUNTER_FILE, counter)
      return send(res, 200, { total: counter.total, online: countOnline() })
    }

    // GET /api/counter
    if (req.method === 'GET' && url.pathname === '/api/counter') {
      return send(res, 200, { total: counter.total, online: countOnline() })
    }

    // POST /api/heartbeat {nick} -> пометить живым, вернуть список онлайна
    if (req.method === 'POST' && url.pathname === '/api/heartbeat') {
      const body = await readBody(req)
      const nick = String(body.nick || 'Гость').slice(0, 24)
      online.set(ip, { nick, last: Date.now() })
      return send(res, 200, { online: countOnline(), nicks: listOnline() })
    }

    // GET /api/guestbook
    if (req.method === 'GET' && url.pathname === '/api/guestbook') {
      return send(res, 200, { entries: guestbook })
    }

    // POST /api/guestbook {name, text}
    if (req.method === 'POST' && url.pathname === '/api/guestbook') {
      const body = await readBody(req)
      const name = String(body.name || '').trim().slice(0, 30)
      const text = String(body.text || '').trim().slice(0, 500)
      if (!name || !text) return send(res, 400, { error: 'Заполни все поля!!!11' })
      guestbook.unshift({ name, text, ts: new Date().toISOString().slice(0, 10) })
      guestbook = guestbook.slice(0, MAX_ENTRIES)
      writeJson(GUESTBOOK_FILE, guestbook)
      return send(res, 200, { entries: guestbook })
    }

    send(res, 404, { error: 'нет такой пагины' })
  } catch (e) {
    send(res, 400, { error: String(e.message || e) })
  }
})

function pruneOnline() {
  const now = Date.now()
  for (const [ip, info] of online) {
    if (now - info.last > ONLINE_TTL_MS) online.delete(ip)
  }
}

function countOnline() {
  pruneOnline()
  return online.size
}

function listOnline() {
  pruneOnline()
  return [...online.values()].map((v) => v.nick)
}

server.listen(PORT, '127.0.0.1', () => {
  console.log('marselevichk api on 127.0.0.1:' + PORT)
})
