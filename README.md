# Lead Searcher

Консольное приложение предназначенное для автоматического поиска сделок по email-адресам в системе amoCRM с использованием Puppeteer. Пользователь вводит список ID, и скрипт выполняет поиск сделок по этим ID, возвращая ссылки на найденные сделки.

## Установка

1. Клонируйте репозиторий:

   ```bash
   git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
   cd <ИМЯ_ДИРЕКТОРИИ>
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Нужны креды, которые хранятся у меня. (:

## Запуск

1. Добавьте ID в массив по пути `src/utils/ids.js`.

2. Для запуска скрипта, используйте команду:

   ```bash
   npm start
   ```

## Пример финального вывода

```bash
username@username:~/lead-searcher$ npm start

> lead-searcher@1.0.0 start
> node index.js

Email для ID id1-exmaple: email1@example.ru
Email для ID id2-exmaple: email2@example.ru
Ссылка на первую сделку: https://new_id_exmaple.amocrm.ru/leads/detail/id_exmaple
По запросу email2@example.ru сделок не найдено
Финальный массив ссылок на сделки: [
  'https://new_id_exmaple.amocrm.ru/leads/detail/id_exmaple',
  'По запросу email2@example.ru сделок не найдено'
]
```
