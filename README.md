# Kinora

Каталог фильмов, сериалов и аниме: рейтинги, трейлеры, актёрские составы и персональные списки. Портфолио-проект уровня production: Server Components, кэширование внешнего API, авторизация, 3D-сцена в hero и аккуратная система дизайна.

> Этот продукт использует TMDB API, но не одобрен и не сертифицирован TMDB. **Данные о фильмах предоставлены [TMDB](https://www.themoviedb.org/).**

## Возможности

- **Каталог как у Netflix** — горизонтальные карусели («В тренде», «Популярное», «Топ аниме», «Новинки сериалов», подборки по жанрам) с drag-скроллом, snap и стрелками по краям.
- **Страница тайтла** — backdrop, постер, рейтинг, жанры, актёрский состав, встроенный YouTube-трейлер, похожие тайтлы; у сериалов — сезоны с ленивой подгрузкой серий.
- **Раздел аниме** — отдельный фильтр TMDB (жанр Animation + происхождение JP).
- **Поиск** — живая выдача в шапке (debounce 300 мс, клавиатурная навигация) и страница поиска с фильтрами по жанру, году, рейтингу и сортировкой.
- **Аккаунты и списки** — email/пароль через Auth.js, списки «Смотреть позже» и «Избранное» в PostgreSQL, optimistic-обновления кнопок.
- **3D-hero** — монохромная сцена на react-three-fiber: дышащая сетка точек и парящие wireframe-«кадры» с параллаксом от мыши; на мобильных упрощается, при `prefers-reduced-motion` заменяется статичным фоном.
- **Плавность** — инерционный скролл Lenis, scroll-reveal анимации (fade + 12px, stagger 60 мс), только `transform`/`opacity`.
- **Устойчивость** — кэширование ответов TMDB (revalidate 1–24 ч), skeleton-состояния, плейсхолдеры постеров, деградация секций по отдельности при ошибках API, адаптивность до 360 px.

## Стек

| Слой | Технологии |
| --- | --- |
| Фреймворк | Next.js 16 (App Router, Server Components, Turbopack), TypeScript strict |
| Данные | TMDB API v3 (типизированный серверный клиент в `lib/tmdb/`) |
| БД | PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`) |
| Auth | Auth.js (next-auth v5), credentials + JWT, bcryptjs |
| 3D | three.js + @react-three/fiber + drei |
| Анимации | Motion (Framer Motion) + Lenis |
| Стили | Tailwind CSS v4, Inter |

## Запуск

### 1. Ключ TMDB

1. Зарегистрируйтесь на [themoviedb.org](https://www.themoviedb.org/signup).
2. Откройте [Настройки → API](https://www.themoviedb.org/settings/api) и запросите ключ разработчика.
3. Скопируйте **API Key (v3 auth)** — подойдёт и v4 Read Access Token.

### 2. Переменные окружения

```bash
cp .env.example .env
```

Заполните `.env`:

```env
TMDB_API_KEY="bb921d994f0023dc0acc8e0ca0889a65"
DATABASE_URL="postgresql://postgres:password@localhost:5432/kinora"
AUTH_SECRET="230d229269eeaba3b1ab4b17a8dfed00b6a34223f7e5161f01310bdf8621a4b9"
```

### 3. База данных

Любой PostgreSQL 14+. Затем:

```bash
npm install
npm run db:migrate   # применить схему
npm run db:seed      # демо-пользователь demo@kinora.app / demo12345 + примеры списков
```

<details>
<summary>Локальный dev-инстанс без Docker (Windows, установлен PostgreSQL)</summary>

В репозитории настроены скрипты для отдельного дев-кластера в `./.pgdata` (порт 5433, trust-auth, основной кластер не затрагивается):

```bash
initdb -D .pgdata -U postgres -A trust -E UTF8   # один раз
npm run db:start                                  # запустить
createdb -U postgres -h localhost -p 5433 kinora  # один раз
npm run db:stop                                   # остановить
```

`DATABASE_URL` для этого варианта: `postgresql://postgres@localhost:5433/kinora`.

</details>

### 4. Приложение

```bash
npm run dev     # http://localhost:3000
npm run build   # production-сборка
npm start
```

## Скрипты

| Команда | Действие |
| --- | --- |
| `npm run dev` | dev-сервер (Turbopack) |
| `npm run build` / `npm start` | production (Webpack) |
| `npm run build:turbopack` | production через Turbopack¹ |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma-миграции |
| `npm run db:seed` | сид демо-данных |
| `npm run db:studio` | Prisma Studio |
| `npm run db:start` / `db:stop` | локальный dev-Postgres из `./.pgdata` |

¹ На Windows у Turbopack встречается гонка при создании junction-линков для внешних пакетов (`pg`, `@prisma/client`) — сборка может падать с `TurbopackInternalError: failed to create junction point`. Поэтому production-сборка по умолчанию идёт через Webpack; на Linux/CI можно использовать `build:turbopack`.

## Деплой на Vercel

Сгенерированный Prisma-клиент (`lib/generated/prisma`) не хранится в git — он создаётся автоматически: `postinstall` и `build` запускают `prisma generate`.

1. В настройках проекта Vercel добавьте переменные окружения: `TMDB_API_KEY`, `DATABASE_URL` (любой облачный PostgreSQL — Neon, Supabase, Prisma Postgres), `AUTH_SECRET`.
2. Примените схему к облачной базе: `npx prisma migrate deploy` (локально, с `DATABASE_URL` облачной базы в `.env`).
3. Деплойте — команда сборки стандартная (`npm run build`).

## Структура

```
app/                # маршруты: главная, /movies, /tv, /anime, /search,
                    # /movie/[id], /tv/[id], /library, /login, /register, API-роуты
components/
  ui/               # PosterCard, Carousel, Reveal, скелетоны, кнопка трейлера
  home/             # hero + 3D-сцена, featured-фильм, карусели
  catalog/          # сетка, фильтры, пагинация
  title/            # детальная страница: каст, сезоны, кнопки списков
  search/, auth/, library/, layout/
lib/
  tmdb/             # весь клиент TMDB: types.ts, client.ts (server-only), image.ts
  auth.ts, db.ts    # Auth.js и Prisma-синглтон
server/actions/     # Server Actions: регистрация, вход, списки
prisma/             # схема, миграции, seed.ts
```

## Дизайн

Палитра ограничена монохромом: белый / off-white `#FAFAF9`, тёмно-синий `#0A1628`/`#0F1D33`, акцент `#1E4FD8`, серые `#64748B`/`#94A3B8`, границы `#E2E8F0`. Единственный источник цвета на странице — постеры и кадры фильмов. Границы 1px вместо теней, Inter в двух начертаниях, крупные заголовки с letter-spacing −0.02em, тёмно-синие секции чередуются с белыми.

## Скриншоты

Скриншоты стоит снимать после подключения ключа TMDB — без него каталог показывает заглушку. Рекомендуемые кадры: главная (hero + карусели), страница фильма, поиск с фильтрами, «Мои списки».

---

Данные предоставлены [The Movie Database (TMDB)](https://www.themoviedb.org/). Проект не связан с TMDB и не сертифицирован ею.
#   K i n o r a 
 
 #   K i n o r a 
 
 