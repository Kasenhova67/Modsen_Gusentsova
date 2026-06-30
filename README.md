# Expense Tracker API

RESTful API для учёта доходов и расходов. Реализовано на **NestJS**, **TypeORM**, **PostgreSQL**.

**Публичный URL:**  
[https://modsengusentsova-production.up.railway.app](https://modsengusentsova-production.up.railway.app)

**Swagger документация:**  
[https://modsengusentsova-production.up.railway.app/api/docs](https://modsengusentsova-production.up.railway.app/api/docs)

---

## Технологический стек для Варианта 2

- **NestJS** 
- **TypeScript** 
- **TypeORM** 
- **PostgreSQL** 
- **Docker** 
- **Railway** 
- **Swagger** 
- **class-validator** 
- **class-transformer** 

---

##  Функциональность для Варианта 2

### Part 1 — Основной функционал

#### Категории (Categories)
- `POST /categories` — создать категорию
- `GET /categories` — получить все категории (пагинация, поиск, сортировка)
- `GET /categories/:id` — получить категорию по ID
- `PATCH /categories/:id` — обновить категорию
- `DELETE /categories/:id` — удалить категорию (с проверкой 409 Conflict)

#### Транзакции (Transactions)
- `POST /transactions` — создать транзакцию
- `GET /transactions` — получить все транзакции (пагинация, фильтрация, поиск, сортировка)
- `GET /transactions/:id` — получить транзакцию по ID
- `PATCH /transactions/:id` — обновить транзакцию
- `DELETE /transactions/:id` — удалить транзакцию

#### Сводка (Summary)
- `GET /summary` — сводка доходов, расходов и баланса за период

---

### Part 2 — Статистика и отчёты

- `GET /statistics/categories` — отчёт по категориям (фильтр по типу: all / expense / income)
- `GET /statistics/monthly` — динамика по месяцам (последние 6 месяцев)
- `GET /statistics/top` — топ-5 категорий по расходам

---

## Быстрые ссылки для проверки

### Категории

| Что проверяем | Ссылка |
|---------------|--------|
| Все категории | [`/categories`](https://modsengusentsova-production.up.railway.app/categories) |
| Пагинация (стр. 2, 5 записей) | [`/categories?page=2&limit=5`](https://modsengusentsova-production.up.railway.app/categories?page=2&limit=5) |
| Поиск по названию | [`/categories?search=Food`](https://modsengusentsova-production.up.railway.app/categories?search=Food) |
| Сортировка (А → Я) | [`/categories?sortBy=name&sortOrder=ASC`](https://modsengusentsova-production.up.railway.app/categories?sortBy=name&sortOrder=ASC) |
| Сортировка (Я → А) | [`/categories?sortBy=name&sortOrder=DESC`](https://modsengusentsova-production.up.railway.app/categories?sortBy=name&sortOrder=DESC) |
| Сортировка по дате | [`/categories?sortBy=createdAt&sortOrder=DESC`](https://modsengusentsova-production.up.railway.app/categories?sortBy=createdAt&sortOrder=DESC) |

### Транзакции

| Что проверяем | Ссылка |
|---------------|--------|
| Все транзакции | [`/transactions`](https://modsengusentsova-production.up.railway.app/transactions) |
| Пагинация (стр. 2, 5 записей) | [`/transactions?page=2&limit=5`](https://modsengusentsova-production.up.railway.app/transactions?page=2&limit=5) |
| Фильтр по типу (расходы) | [`/transactions?type=expense`](https://modsengusentsova-production.up.railway.app/transactions?type=expense) |
| Фильтр по типу (доходы) | [`/transactions?type=income`](https://modsengusentsova-production.up.railway.app/transactions?type=income) |
| Фильтр по периоду | [`/transactions?dateFrom=2025-01-01&dateTo=2025-12-31`](https://modsengusentsova-production.up.railway.app/transactions?dateFrom=2025-01-01&dateTo=2025-12-31) |
| Поиск по описанию | [`/transactions?search=bill`](https://modsengusentsova-production.up.railway.app/transactions?search=bill) |
| Сортировка по сумме (↓) | [`/transactions?sortBy=amount&sortOrder=DESC`](https://modsengusentsova-production.up.railway.app/transactions?sortBy=amount&sortOrder=DESC) |
| Сортировка по сумме (↑) | [`/transactions?sortBy=amount&sortOrder=ASC`](https://modsengusentsova-production.up.railway.app/transactions?sortBy=amount&sortOrder=ASC) |

### Сводка и статистика

| Что проверяем | Ссылка |
|---------------|--------|
| Сводка за 2025 год | [`/summary?dateFrom=2025-01-01&dateTo=2025-12-31`](https://modsengusentsova-production.up.railway.app/summary?dateFrom=2025-01-01&dateTo=2025-12-31) |
| Сводка за текущий месяц | [`/summary`](https://modsengusentsova-production.up.railway.app/summary) |
| Отчёт по категориям | [`/statistics/categories?dateFrom=2025-01-01&dateTo=2025-12-31&type=all`](https://modsengusentsova-production.up.railway.app/statistics/categories?dateFrom=2025-01-01&dateTo=2025-12-31&type=all) |
| Динамика по месяцам | [`/statistics/monthly`](https://modsengusentsova-production.up.railway.app/statistics/monthly) |
| Топ-5 категорий | [`/statistics/top?dateFrom=2025-01-01&dateTo=2025-12-31`](https://modsengusentsova-production.up.railway.app/statistics/top?dateFrom=2025-01-01&dateTo=2025-12-31) |

---

