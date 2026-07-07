pet-проект - канбан-доска в стиле Jira.

## Стек

- **Next.js 15** (App Router) + **TypeScript**
- **Redux Toolkit** -стейт-менеджмент, `createAsyncThunk` для загрузки данных
- **dnd-kit** - drag & drop карточек внутри колонок и между ними
- **CSS Modules** - стилизация без UI-библиотек
- **Jest** + **React Testing Library** - тесты

## Возможности

- Создание, редактирование и удаление задач
- Перетаскивание задач между колонками и внутри колонки
- Сохранение состояния в `localStorage`
- Типы задач и приоритеты в стиле Jira
- Состояния загрузки и ошибки

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

## Тесты

```bash
npm test
```