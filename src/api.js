// Клиент мини-API marselevichk. Все методы деградируют в fallback,
// если бэкенд недоступен — сайт обязан работать даже во тьме.

async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error('api ' + res.status)
  return res.json()
}

/** Зарегистрировать визит. Возвращает {total, online} или null. */
export async function registerVisit() {
  try {
    return await api('POST', '/api/visit')
  } catch {
    return null
  }
}

/** Heartbeat с погонялом. Возвращает {online, nicks} или null. */
export async function heartbeat(nick) {
  try {
    return await api('POST', '/api/heartbeat', { nick })
  } catch {
    return null
  }
}

/** Загрузить гостевую. Возвращает массив записей или null. */
export async function loadGuestbook() {
  try {
    const data = await api('GET', '/api/guestbook')
    return data.entries
  } catch {
    return null
  }
}

/** Отправить запись. Возвращает обновлённый массив или null. */
export async function postGuestbook(name, text) {
  try {
    const data = await api('POST', '/api/guestbook', { name, text })
    return data.entries
  } catch {
    return null
  }
}
