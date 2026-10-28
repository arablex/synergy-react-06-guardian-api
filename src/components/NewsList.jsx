import React from 'react'

// Компонент списка новостей: получает массив статей через props и выводит их.
const NewsList = ({ articles }) => {
  return (
    <div className="news-list">
      {articles.map((article) => (
        // В качестве key используем уникальный id статьи, а не индекс массива
        <div key={article.id} className="news-item">
          <h3>{article.webTitle}</h3>
          <p className="news-meta">
            {article.sectionName} ·{' '}
            {new Date(article.webPublicationDate).toLocaleDateString('ru-RU')}
          </p>
          <p>
            <a href={article.webUrl} target="_blank" rel="noopener noreferrer">
              Читать статью
            </a>
          </p>
        </div>
      ))}
    </div>
  )
}

export default NewsList
