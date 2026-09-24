import { useState } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([
    {
      name: 'Cien años de soledad',
      isbn: '978-0307474728',
      author: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana'
    },
    {
      name: 'El principito',
      isbn: '978-0156012195',
      author: 'Antoine de Saint-Exupéry',
      editorial: 'Reynal & Hitchcock'
    },
    {
      name: 'Don Quijote de la Mancha',
      isbn: '978-8420412146',
      author: 'Miguel de Cervantes',
      editorial: 'Alfaguara'
    }
  ])

  const [name, setName] = useState('')
  const [isbn, setIsbn] = useState('')
  const [author, setAuthor] = useState('')
  const [editorial, setEditorial] = useState('')

  const addBook = (event) => {
    event.preventDefault()

    const newBook = {
      name,
      isbn,
      author,
      editorial
    }

    setBooks([...books, newBook])

    setName('')
    setIsbn('')
    setAuthor('')
    setEditorial('')
  }

  const removeBook = () => {
    if (books.length > 0) {
      setBooks(books.slice(0, -1))
    }
  }

  return (
    <div className="container">
      <h1>Pila de Libros</h1>
      <p className="description">
        Estructura de datos tipo Stack - LIFO
      </p>

      <div className="content">
        <section className="form-section">
          <h2>Agregar nuevo libro</h2>

          <form onSubmit={addBook}>
            <input
              type="text"
              placeholder="Nombre del libro"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Autor"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Editorial"
              value={editorial}
              onChange={(event) => setEditorial(event.target.value)}
              required
            />

            <button type="submit">
              Agregar libro
            </button>
          </form>

          <button
            className="remove-button"
            onClick={removeBook}
            disabled={books.length === 0}
          >
            Sacar último libro
          </button>
        </section>

        <section className="stack-section">
          <h2>Pila de libros</h2>

          {books.length === 0 ? (
            <p className="empty">La pila está vacía</p>
          ) : (
            <div className="stack">
              {books
                .slice()
                .reverse()
                .map((book, index) => (
                  <div className="book" key={index}>
                    <h3>{book.name}</h3>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Autor:</strong> {book.author}</p>
                    <p><strong>Editorial:</strong> {book.editorial}</p>

                    {index === 0 && (
                      <span className="top-label">
                        TOP
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App