
import { useState } from "react";

export function StackPage() {
  const [books, setBooks] = useState([
    {
      id: 1,
      name: "Cien años de soledad",
      isbn: "978-0307474728",
      author: "Gabriel García Márquez",
      publisher: "Editorial Sudamericana"
    },
    {
      id: 2,
      name: "El principito",
      isbn: "978-0156012195",
      author: "Antoine de Saint-Exupéry",
      publisher: "Reynal & Hitchcock"
    },
    {
      id: 3,
      name: "Don Quijote de la Mancha",
      isbn: "978-8420412146",
      author: "Miguel de Cervantes",
      publisher: "Alfaguara"
    }
  ]);

  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");

  const addBook = (e) => {
    e.preventDefault();
    if (![name, isbn, author, publisher].every((v) => v.trim())) return;

    setBooks((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        isbn: isbn.trim(),
        author: author.trim(),
        publisher: publisher.trim()
      }
    ]);

    setName("");
    setIsbn("");
    setAuthor("");
    setPublisher("");
  };

  return (
    <section className="exercise">
      <div className="exercise-title">
        <h2>Pila de libros</h2>
        <span>LIFO</span>
      </div>

      <p>El último libro agregado es el primero en salir.</p>

      <form className="book-form" onSubmit={addBook}>
        <input placeholder="Nombre del libro" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <input placeholder="ISBN" value={isbn}
          onChange={(e) => setIsbn(e.target.value)} required />
        <input placeholder="Autor" value={author}
          onChange={(e) => setAuthor(e.target.value)} required />
        <input placeholder="Editorial" value={publisher}
          onChange={(e) => setPublisher(e.target.value)} required />
        <button type="submit">Agregar libro</button>
      </form>

      <button className="remove-button"
        onClick={() => setBooks((current) => current.slice(0, -1))}
        disabled={!books.length}>
        Sacar último libro
      </button>

      <div className="list-container">
        <h3>Libros en la pila: {books.length}</h3>

        {[...books].reverse().map((book, index) => (
          <article className="item" key={book.id}>
            <strong>{index === 0 ? "TOP → " : ""}{book.name}</strong>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Editorial:</strong> {book.publisher}</p>
          </article>
        ))}

        {books.length === 0 && <p>No hay libros en la pila.</p>}
      </div>
    </section>
  );
}

export function QueuePage() {
  const [people, setPeople] = useState([
    { id: 1, name: "Carlos", amount: 500000, arrivalDate: "2026-09-30T08:00:00" },
    { id: 2, name: "Laura", amount: 300000, arrivalDate: "2026-09-30T08:05:00" },
    { id: 3, name: "Andrés", amount: 800000, arrivalDate: "2026-09-30T08:10:00" }
  ]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const sortedPeople = [...people].sort(
    (a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate)
  );

  const addPerson = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    setPeople((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        amount: Number(amount),
        arrivalDate: new Date().toISOString()
      }
    ]);

    setName("");
    setAmount("");
  };

  return (
    <section className="exercise">
      <div className="exercise-title">
        <h2>Cola de personas - ATM</h2>
        <span>FIFO</span>
      </div>

      <p>La primera persona en llegar es la primera en ser atendida.</p>

      <form className="book-form" onSubmit={addPerson}>
        <input placeholder="Nombre" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <input type="number" min="1" placeholder="Valor a retirar"
          value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Agregar persona</button>
      </form>

      <button className="remove-button"
        disabled={!people.length}
        onClick={() => {
          if (sortedPeople.length) {
            setPeople((current) =>
              current.filter((person) => person.id !== sortedPeople[0].id)
            );
          }
        }}>
        Atender primera persona
      </button>

      <div className="list-container">
        <h3>Personas en la cola: {sortedPeople.length}</h3>

        {sortedPeople.map((person, index) => (
          <article className="item" key={person.id}>
            <strong>{index === 0 ? "PRÓXIMO → " : ""}{person.name}</strong>
            <p><strong>Retiro:</strong> ${person.amount.toLocaleString("es-CO")}</p>
            <p><strong>Llegada:</strong> {new Date(person.arrivalDate).toLocaleString("es-CO")}</p>
          </article>
        ))}

        {!sortedPeople.length && <p>No hay personas en la cola.</p>}
      </div>
    </section>
  );
}
