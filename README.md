# CallPal

Консольное приложение для автоматизации ежедневной сверки в отделе продаж: по списку ID организаций находит связанные сделки в amoCRM по email и проверяет статус подключения WhatsApp-канала в Revvy. То, что раньше делалось руками по каждому клиенту, теперь прогоняется одним скриптом.

## Стек

Node.js, Puppeteer (браузерная автоматизация amoCRM и Revvy), axios (внутреннее API).

## Установка

```bash
git clone git@github.com:ilyayaya27/callPal.git
cd callPal
npm install
cp .env.example .env
```

Заполните `.env` своими доступами (см. `.env.example`) — креды приватные, для конкретной amoCRM/Revvy-инсталляции, публично не раздаются.

## Запуск

1. Добавьте ID организаций в массив в `src/utils/ids.js`.
2. Запустите:

   ```bash
   npm start
   ```

## Пример вывода

```bash
$ npm start

Email для ID id1-example: email1@example.ru
Ссылка на первую сделку: https://example.amocrm.ru/leads/detail/12345
По запросу email2@example.ru сделок не найдено

ID: id1-example - Status: Требует перехода по QR-коду (не работает)
ID: id2-example - Status: Работает
```
