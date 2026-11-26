
import { useState } from 'react'
import './App.scss'

// Estructura Trie
class TrieNode {
  constructor() {
    this.children = {}
    this.isEnd = false
    this.title = ''
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(title) {
    let node = this.root

    for (const char of title.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode()
      }

      node = node.children[char]
    }

    node.isEnd = true
    node.title = title
  }

  search(title) {
    let node = this.root

    for (const char of title.toLowerCase()) {
      if (!node.children[char]) {
        return false
      }

      node = node.children[char]
    }

    return node.isEnd
  }

  startsWith(prefix) {
    let node = this.root

    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return []
      }

      node = node.children[char]
    }

    const results = []

    const collect = (current) => {
      if (current.isEnd) {
        results.push(current.title)
      }

      for (const char in current.children) {
        collect(current.children[char])
      }
    }

    collect(node)

    return results
  }
}

// Estructura Max Heap
class MaxHeap {
  constructor() {
    this.heap = []
  }

  insert(song) {
    this.heap.push(song)
    let index = this.heap.length - 1

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)

      if (this.heap[parent].plays >= this.heap[index].plays) {
        break
      }

      ;[this.heap[parent], this.heap[index]] = [
        this.heap[index],
        this.heap[parent]
      ]

      index = parent
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()

    const max = this.heap[0]

    this.heap[0] = this.heap.pop()

    let index = 0

    while (true) {
      const left = index * 2 + 1
      const right = index * 2 + 2
      let largest = index

      if (
        left < this.heap.length &&
        this.heap[left].plays > this.heap[largest].plays
      ) {
        largest = left
      }

      if (
        right < this.heap.length &&
        this.heap[right].plays > this.heap[largest].plays
      ) {
        largest = right
      }

      if (largest === index) break

      ;[this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index]
      ]

      index = largest
    }

    return max
  }

  getRanking() {
    const ranking = []

    while (this.heap.length > 0) {
      ranking.push(this.extractMax())
    }

    return ranking
  }
}

// Grafo no dirigido
class Graph {
  constructor() {
    this.adjacencyList = new Map()
  }

  addVertex(song) {
    if (!this.adjacencyList.has(song)) {
      this.adjacencyList.set(song, [])
    }
  }

  addEdge(song1, song2) {
    this.addVertex(song1)
    this.addVertex(song2)

    if (!this.adjacencyList.get(song1).includes(song2)) {
      this.adjacencyList.get(song1).push(song2)
    }

    if (!this.adjacencyList.get(song2).includes(song1)) {
      this.adjacencyList.get(song2).push(song1)
    }
  }

  getRecommendations(song) {
    return this.adjacencyList.get(song) || []
  }
}

// Canciones iniciales
const initialSongs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', plays: 980 },
  { id: 2, title: 'Starboy', artist: 'The Weeknd', genre: 'Pop', plays: 850 },
  { id: 3, title: 'Save Your Tears', artist: 'The Weeknd', genre: 'Pop', plays: 600 },
  { id: 4, title: 'As It Was', artist: 'Harry Styles', genre: 'Pop', plays: 720 },
  { id: 5, title: 'Levitating', artist: 'Dua Lipa', genre: 'Pop', plays: 650 },
  { id: 6, title: 'Dakiti', artist: 'Bad Bunny', genre: 'Reggaeton', plays: 900 },
  { id: 7, title: 'Tití Me Preguntó', artist: 'Bad Bunny', genre: 'Reggaeton', plays: 810 },
  { id: 8, title: 'Numb', artist: 'Linkin Park', genre: 'Rock', plays: 700 },
  { id: 9, title: 'In the End', artist: 'Linkin Park', genre: 'Rock', plays: 780 }
]

function App() {
  const [songs, setSongs] = useState(initialSongs)
  const [query, setQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('Pop')
  const [plays, setPlays] = useState('')

  // Insertar canciones en el Trie
  const trie = new Trie()

  songs.forEach((song) => {
    trie.insert(song.title)
  })

  const suggestions = query.trim()
    ? trie.startsWith(query.trim())
    : []

  // Construir ranking con Max Heap
  const heap = new MaxHeap()

  songs.forEach((song) => {
    heap.insert(song)
  })

  const ranking = heap.getRanking()

  // Construir grafo relacionando canciones por género
  const graph = new Graph()

  songs.forEach((song) => {
    graph.addVertex(song.title)
  })

  for (let i = 0; i < songs.length; i++) {
    for (let j = i + 1; j < songs.length; j++) {
      if (songs[i].genre === songs[j].genre) {
        graph.addEdge(songs[i].title, songs[j].title)
      }
    }
  }

  const recommendations = selectedSong
    ? graph.getRecommendations(selectedSong.title)
    : []

  // Buscar una canción
  const searchSong = () => {
    const value = query.trim()

    if (!value) {
      setMessage('Escribe el nombre de una canción.')
      setSelectedSong(null)
      return
    }

    if (trie.search(value)) {
      const song = songs.find(
        (song) => song.title.toLowerCase() === value.toLowerCase()
      )

      setSelectedSong(song)
      setMessage('Canción encontrada.')
    } else {
      setSelectedSong(null)
      setMessage('La canción no existe en la biblioteca.')
    }
  }

  // Agregar una canción
  const addSong = (e) => {
    e.preventDefault()

    if (!title.trim() || !artist.trim()) {
      setMessage('Completa los campos de la canción.')
      return
    }

    if (trie.search(title.trim())) {
      setMessage('Esta canción ya existe.')
      return
    }

    const newSong = {
      id: Date.now(),
      title: title.trim(),
      artist: artist.trim(),
      genre,
      plays: Number(plays)
    }

    setSongs([...songs, newSong])
    setTitle('')
    setArtist('')
    setGenre('Pop')
    setPlays('')
    setMessage('Canción agregada correctamente.')
  }

  // Seleccionar una canción
  const selectSong = (songTitle) => {
    const song = songs.find((song) => song.title === songTitle)

    setSelectedSong(song)
    setQuery(songTitle)
    setMessage('')
  }

  // Simular una reproducción
  const playSong = (id) => {
    setSongs(
      songs.map((song) =>
        song.id === id
          ? { ...song, plays: song.plays + 1 }
          : song
      )
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>♫ Spotify EDU</h1>
        <p>Plataforma musical educativa</p>
      </header>

      <main className="dashboard">

        <section className="panel search-panel">
          <h2>Buscar canciones</h2>
          <span className="tag">Trie</span>

          <div className="search-box">
            <input
              type="text"
              placeholder="Escribe el nombre de una canción..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setMessage('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') searchSong()
              }}
            />

            <button onClick={searchSong}>
              Buscar
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions">
              <p>Sugerencias</p>

              {suggestions.map((song) => (
                <div
                  className="suggestion"
                  key={song}
                  onClick={() => selectSong(song)}
                >
                  ♫ {song}
                </div>
              ))}
            </div>
          )}

          {message && (
            <p className="message">{message}</p>
          )}
        </section>

        <section className="panel">
          <h2>Agregar canción</h2>

          <form onSubmit={addSong}>
            <input
              type="text"
              placeholder="Nombre de la canción"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Artista"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option>Pop</option>
              <option>Reggaeton</option>
              <option>Rock</option>
              <option>Rap</option>
              <option>Electronica</option>
              <option>Salsa</option>
            </select>

            <input
              type="number"
              placeholder="Número de reproducciones"
              min="0"
              step="1"
              value={plays}
              onChange={(e) => setPlays(e.target.value)}
              required
            />

            <button type="submit">
              Agregar canción
            </button>
          </form>
        </section>

        <section className="panel ranking-panel">
          <h2>Ranking de popularidad</h2>
          <span className="tag">Max Heap</span>

          <div className="ranking">
            {ranking.map((song, index) => (
              <div className="song" key={song.id}>
                <span className="position">
                  {index + 1}
                </span>

                <div className="cover">♫</div>

                <div
                  className="song-info"
                  onClick={() => selectSong(song.title)}
                >
                  <h3>{song.title}</h3>
                  <p>{song.artist} · {song.genre}</p>
                </div>

                <span className="plays">
                  {song.plays} reproducciones
                </span>

                <button
                  className="play-button"
                  title="Simular reproducción"
                  aria-label={`Simular reproducción de ${song.title}`}
                  onClick={() => playSong(song.id)}
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Canciones relacionadas</h2>
          <span className="tag">Grafo no dirigido</span>

          {selectedSong ? (
            <>
              <div className="selected-song">
                <div className="cover">♫</div>

                <div>
                  <h3>{selectedSong.title}</h3>
                  <p>{selectedSong.artist}</p>
                </div>
              </div>

              <h4>Recomendaciones</h4>

              {recommendations.length > 0 ? (
                recommendations.map((song) => (
                  <div
                    className="recommendation"
                    key={song}
                    onClick={() => selectSong(song)}
                  >
                    ♫ {song}
                  </div>
                ))
              ) : (
                <p>No hay canciones relacionadas.</p>
              )}
            </>
          ) : (
            <p>Selecciona una canción para ver sus recomendaciones.</p>
          )}
        </section>

      </main>

      <footer>
        Spotify EDU | Parcial 3 - UAO
      </footer>
    </div>
  )
}

export default App
