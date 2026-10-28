import React, { useState, useEffect } from 'react'
import NewsSearch from './components/NewsSearch'
import NewsList from './components/NewsList'
import { searchArticles, API_KEY } from './api/guardian'
import './App.css'

// Начальные значения берём из адресной строки (?q=sport&page=2),
// чтобы страницу выдачи можно было открыть по ссылке.
const params = new URLSearchParams(window.location.search)
const initialQuery = params.get('q') || ''
const initialPage = Number(params.get('page')) || 1

function App() {
  const [articles, setArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Загрузка новостей через REST API The Guardian (К1, К4)
  const fetchNews = async (searchQuery, page = 1) => {
    setLoading(true)
    setError('')
    try {
      const data = await searchArticles(searchQuery, page)
      setArticles(data.results)
      setTotalPages(data.pages)
      setQuery(searchQuery)
      setCurrentPage(page)
      // Запоминаем запрос и страницу в адресной строке (без перезагрузки)
      window.history.replaceState(null, '', `?q=${encodeURIComponent(searchQuery)}&page=${page}`)
    } catch (err) {
      console.error('Ошибка при загрузке новостей:', err)
      // Понятное сообщение для пользователя вместо «пустой» страницы
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Сервер отклонил API-ключ. Проверьте VITE_GUARDIAN_KEY.')
      } else if (err.response?.status === 429) {
        setError('Слишком много запросов к API. Подождите немного и повторите.')
      } else {
        setError('Не удалось загрузить новости. Проверьте интернет и повторите попытку.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Если в адресе уже есть ?q=..., сразу загружаем эту выдачу при открытии страницы
  useEffect(() => {
    if (initialQuery && API_KEY) {
      fetchNews(initialQuery, initialPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Пагинация (К3): direction = -1 (назад) или +1 (вперёд)
  const handlePageChange = (direction) => {
    const nextPage = currentPage + direction
    if (nextPage > 0 && nextPage <= totalPages) {
      fetchNews(query, nextPage)
    }
  }

  return (
    <div className="app">
      <h1>Новости The Guardian</h1>

      {/* Новый поиск всегда начинается с первой страницы */}
      <NewsSearch onSearch={(q) => fetchNews(q, 1)} initialQuery={initialQuery} />

      {!API_KEY && (
        <p className="message error">
          Не задан API-ключ. Создайте файл .env.local со строкой VITE_GUARDIAN_KEY=ваш_ключ.
        </p>
      )}
      {loading && <p className="message">Загрузка…</p>}
      {error && <p className="message error">{error}</p>}
      {!loading && !error && query && articles.length === 0 && (
        <p className="message">По запросу «{query}» ничего не найдено.</p>
      )}

      <NewsList articles={articles} />

      {articles.length > 0 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(-1)} disabled={loading || currentPage <= 1}>
            Предыдущая
          </button>
          <span>
            Страница: {currentPage} из {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={loading || currentPage >= totalPages}
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  )
}

export default App
