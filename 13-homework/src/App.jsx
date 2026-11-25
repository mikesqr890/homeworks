
import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY

function App() {
  const [search, setSearch] = useState('')
  const [gifs, setGifs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const searchGifs = async (e) => {
    e.preventDefault()

    if (!search.trim() || loading) return

    setLoading(true)
    setError('')
    setGifs([])
    setSearched(true)

    try {
      if (!API_KEY) {
        throw new Error('No se encontró la API key')
      }

      const params = new URLSearchParams({
        api_key: API_KEY,
        q: search.trim(),
        limit: 25,
        offset: 0,
        rating: 'g',
        lang: 'en',
      })

      const resp = await fetch(
        `https://api.giphy.com/v1/gifs/search?${params}`
      )

      if (!resp.ok) {
        throw new Error(`Error HTTP ${resp.status}`)
      }

      const result = await resp.json()

      setGifs(result.data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <span className="badge">Challenge 13</span>
        <h1>GIF <span>Search</span></h1>
        <p>Busca y descubre tus GIFs favoritos</p>
      </header>

      <form className="search-form" onSubmit={searchGifs}>
        <input
          type="text"
          placeholder="Buscar GIFs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {loading && (
        <p className="message">Cargando GIFs...</p>
      )}

      {error && (
        <p className="error">{error}</p>
      )}

      {!searched && (
        <div className="empty-state">
          <h2>Encuentra el GIF perfecto</h2>
          <p>Escribe algo como cats, smile o happy.</p>
        </div>
      )}

      {searched && !loading && !error && gifs.length === 0 && (
        <p className="message">
          No se encontraron GIFs.
        </p>
      )}

      {gifs.length > 0 && (
        <p className="results">
          {gifs.length} GIFs encontrados
        </p>
      )}

      <div className="gif-grid">
        {gifs.map((gif) => (
          <article className="gif-card" key={gif.id}>
            <img
              src={gif.images.fixed_height.url}
              alt={gif.title || 'GIF de GIPHY'}
              loading="lazy"
            />

            <p>{gif.title || 'Sin título'}</p>
          </article>
        ))}
      </div>

      <footer className="footer">
        <a
          href="https://giphy.com/"
          target="_blank"
          rel="noreferrer"
        >
          Powered by GIPHY
        </a>
        <p>Estructuras de Datos II | Challenge 13</p>
      </footer>
    </div>
  )
}

export default App
