import React, { useState } from 'react'

// Компонент поиска: хранит введённый текст и по кнопке (или Enter) вызывает onSearch родителя.
const NewsSearch = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = () => {
    // Пустой запрос (или из одних пробелов) не отправляем
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="news-search">
      <input
        type="text"
        placeholder="Введите тему, например: sport"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // Поиск по нажатию Enter — удобнее, чем только мышкой
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Поиск</button>
    </div>
  )
}

export default NewsSearch
