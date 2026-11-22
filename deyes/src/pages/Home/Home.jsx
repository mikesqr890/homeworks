
import { Link } from 'react-router'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const { user, profile, logout } = useAuth()

  return (
    <main className="home">
      <nav className="navbar">
        <Link to="/" className="logo">DE'YES</Link>

        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/catalog">Catálogo</Link>

          {user && (
            <>
              <Link to="/cart">Carrito</Link>
              <Link to="/outfits">Outfits</Link>
              <Link to="/chat">Chat</Link>
            </>
          )}

          {profile?.role === 'admin' && (
            <Link to="/admin">Administración</Link>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <button onClick={logout}>Cerrar sesión</button>
          ) : (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <span>MODA · ESTILO · PERSONALIDAD</span>

          <h1>
            Encuentra tu estilo,
            <br />
            crea tu combinación.
          </h1>

          <p>
            Descubre prendas, accesorios y zapatos
            para crear outfits que representen tu personalidad.
          </p>

          <Link to="/catalog" className="primary-button">
            Explorar colección
          </Link>
        </div>
      </section>

      <section className="home-info">
        <h2>Tu estilo comienza aquí</h2>
        <p>
          En De'yes queremos ayudarte a encontrar
          las combinaciones perfectas para cada ocasión.
        </p>
      </section>
    </main>
  )
}
