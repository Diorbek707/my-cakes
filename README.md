# Sweet Cakes

## Запуск через терминал
1. Установите Node.js 18+ (https://nodejs.org)
2. В папке проекта: `npm install`
3. `npm run dev` — откройте http://localhost:5173
4. `npm run host` — доступ с телефона в той же Wi-Fi сети
5. `npm run build` — готовый сайт в папке dist, `npm run preview` — проверить сборку

## Настройка
Скопируйте `.env.example` в `.env` и поменяйте номер WhatsApp и пароль админки.
Админка: боковое меню → «Админ-панель» (пароль по умолчанию SweetOwner-7391).

## Структура
- src/components — Carousel, CartDrawer, Pic
- src/pages — витрина (Shop)
- src/admin — админ-панель и CRUD-таблицы
- src/locales — переводы ru / uz / en
- src/styles — base, layout, shop, admin, responsive
- src/hooks, src/utils, src/data, src/config.js

## Вход в админку (скрыт от посетителей)
Откройте адрес сайта с добавкой `#/owner-k7x2` (например http://localhost:5173/#/owner-k7x2) и введите пароль SweetOwner-7391.
После входа в верхней панели появится кнопка «Админ» (только у вас).
