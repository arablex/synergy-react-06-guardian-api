import axios from 'axios'

// Ключ API берём из переменной окружения (файл .env.local), а не пишем в код:
// ключи нельзя хранить в репозитории. В Vite такие переменные начинаются с VITE_.
export const API_KEY = import.meta.env.VITE_GUARDIAN_KEY

// Адрес API можно переопределить (нужно только для тестов); по умолчанию — настоящий The Guardian
const BASE_URL = import.meta.env.VITE_GUARDIAN_API_URL || 'https://content.guardianapis.com'

// Размер страницы выдачи (сколько статей приходит за один запрос)
export const PAGE_SIZE = 10

// REST-запрос (К4): метод GET, ресурс /search, параметры — в query-строке.
// Параметры передаём объектом params — axios сам закодирует их (пробелы, кириллица и т.д.),
// поэтому не нужно склеивать строку вручную.
export async function searchArticles(query, page = 1) {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: query,
      page,
      'page-size': PAGE_SIZE,
      'api-key': API_KEY,
    },
  })
  // Guardian оборачивает ответ в поле response: { results, pages, total, currentPage, ... }
  return response.data.response
}
