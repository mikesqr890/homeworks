import { createContext, useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from "react-router-dom";

import "./App.css";

// --------------------
// CONTEXT
// --------------------

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === "user@mail.com" && password === "123") {
      setUser(email);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --------------------
// LOGIN
// --------------------

function Login() {
  const { user, login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/pila" />;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login(email, password);

    if (result) {
      setError("");
      navigate("/pila");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Challenge 06</h1>

        <h2>Iniciar sesión</h2>

        <p className="login-info">
          Demo Login Page
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="user@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="credentials">
          <p>
            <strong>Email:</strong> user@mail.com
          </p>

          <p>
            <strong>Password:</strong> 123
          </p>
        </div>

      </div>
    </div>
  );
}

// --------------------
// RUTA PRIVADA
// --------------------

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

// --------------------
// LAYOUT PRIVADO
// --------------------

function PrivateLayout() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-container">

      <header className="header">

        <div>
          <h1>Challenge 06</h1>
          <p>Ejercicios de React</p>
        </div>

        <div className="user-section">

          <span>
            Usuario: <strong>{user}</strong>
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>

      <nav className="navbar">

        <Link to="/pila">
          Pila de libros
        </Link>

        <Link to="/cola">
          Cola ATM
        </Link>

      </nav>

      <main className="content">

        <Routes>

          {/* IMPORTANTE: ahora son rutas relativas */}
          <Route path="pila" element={<StackPage />} />

          <Route path="cola" element={<QueuePage />} />

          <Route
            path="*"
            element={<Navigate to="/pila" />}
          />

        </Routes>

      </main>

    </div>
  );
}

// --------------------
// EJERCICIO 1
// PILA
// --------------------

function StackPage() {

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

    if (!name || !isbn || !author || !publisher) {
      return;
    }

    const newBook = {
      id: Date.now(),
      name,
      isbn,
      author,
      publisher
    };

    setBooks([...books, newBook]);

    setName("");
    setIsbn("");
    setAuthor("");
    setPublisher("");
  };

  const removeBook = () => {
    if (books.length === 0) {
      return;
    }

    setBooks(books.slice(0, -1));
  };

  return (
    <div className="exercise">

      <div className="exercise-title">

        <h2>Pila de libros</h2>

        <span>LIFO</span>

      </div>

      <p>
        El último libro agregado es el primero en salir.
      </p>

      <form className="book-form" onSubmit={addBook}>

        <input
          type="text"
          placeholder="Nombre del libro"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Editorial"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />

        <button type="submit">
          Agregar libro
        </button>

      </form>

      <button
        className="remove-button"
        onClick={removeBook}
      >
        Sacar último libro
      </button>

      <div className="list-container">

        <h3>
          Libros en la pila: {books.length}
        </h3>

        {books.length === 0 ? (
          <p>No hay libros en la pila.</p>
        ) : (
          [...books].reverse().map((book, index) => (

            <div
              className="item"
              key={book.id}
            >

              <div className="item-header">

                <strong>
                  {index === 0 ? "TOP → " : ""}
                  {book.name}
                </strong>

              </div>

              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>

              <p>
                <strong>Autor:</strong> {book.author}
              </p>

              <p>
                <strong>Editorial:</strong> {book.publisher}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

// --------------------
// EJERCICIO 2
// COLA
// --------------------

function QueuePage() {

  const [people, setPeople] = useState([
    {
      id: 1,
      name: "Carlos",
      amount: 500000,
      arrivalDate: "2026-09-30T08:00:00"
    },
    {
      id: 2,
      name: "Laura",
      amount: 300000,
      arrivalDate: "2026-09-30T08:05:00"
    },
    {
      id: 3,
      name: "Andrés",
      amount: 800000,
      arrivalDate: "2026-09-30T08:10:00"
    }
  ]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addPerson = (e) => {
    e.preventDefault();

    if (!name || !amount) {
      return;
    }

    const newPerson = {
      id: Date.now(),
      name,
      amount: Number(amount),
      arrivalDate: new Date().toISOString()
    };

    setPeople([...people, newPerson]);

    setName("");
    setAmount("");
  };

  const removePerson = () => {
    if (people.length === 0) {
      return;
    }

    const sortedPeople = [...people].sort(
      (a, b) =>
        new Date(a.arrivalDate) -
        new Date(b.arrivalDate)
    );

    setPeople(sortedPeople.slice(1));
  };

  const sortedPeople = [...people].sort(
    (a, b) =>
      new Date(a.arrivalDate) -
      new Date(b.arrivalDate)
  );

  return (
    <div className="exercise">

      <div className="exercise-title">

        <h2>Cola de personas - ATM</h2>

        <span>FIFO</span>

      </div>

      <p>
        La primera persona en llegar es la primera en ser atendida.
      </p>

      <form className="book-form" onSubmit={addPerson}>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor a retirar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">
          Agregar persona
        </button>

      </form>

      <button
        className="remove-button"
        onClick={removePerson}
      >
        Atender primera persona
      </button>

      <div className="list-container">

        <h3>
          Personas en la cola: {sortedPeople.length}
        </h3>

        {sortedPeople.length === 0 ? (
          <p>No hay personas en la cola.</p>
        ) : (
          sortedPeople.map((person, index) => (

            <div
              className="item"
              key={person.id}
            >

              <div className="item-header">

                <strong>
                  {index === 0 ? "PRÓXIMO → " : ""}
                  {person.name}
                </strong>

              </div>

              <p>
                <strong>Retiro:</strong>{" "}
                ${person.amount.toLocaleString("es-CO")}
              </p>

              <p>
                <strong>Llegada:</strong>{" "}
                {new Date(person.arrivalDate).toLocaleString("es-CO")}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

// --------------------
// APP
// --------------------

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* PARTE PRIVADA */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;