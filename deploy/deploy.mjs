// Деплой: собирает сайт и заливает dist/ на сервер по SSH.
// Использование: npm run deploy
// Требует ключ C:\Users\Konstantin\.ssh\marselevichk_server (уже настроен).
import { execSync } from 'node:child_process'

const HOST = 'root@31.77.149.158'
const KEY = 'C:\\Users\\Konstantin\\.ssh\\marselevichk_server'
const DEST = '/var/www/marselevichk/'

execSync('npm run build', { stdio: 'inherit', shell: true })
execSync(`scp -i "${KEY}" -r dist/. ${HOST}:${DEST}`, { stdio: 'inherit', shell: true })
execSync(
  `ssh -i "${KEY}" ${HOST} "chmod -R a+rX /var/www/marselevichk && systemctl reload nginx"`,
  { stdio: 'inherit', shell: true },
)
console.log('Деплой готов: http://marselevichk.ru (после настройки DNS) / http://31.77.149.158')
