
import { Link, NavLink, useLocation } from 'react-router'

import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

import './SiteNavigation.css'

export default function SiteNavigation() {
  const { pathname } = useLocation()
  const { user, profile } = useAuth()
  const { itemCount } = useCart()

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register'

  // La página Home ya tiene su propia barra superior
  if (
    pathname === '/' ||
    isAuthPage
  ) {
    return null
  }

  return (
    <header className="deyes-navigation">
      <div className="deyes-navigation-inner">
        <Link
          to="/"
          className="deyes-navigation-logo"
        >
          DE'YES
        </Link>

        <nav aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>

          <NavLink to="/catalog">
            Catálogo
          </NavLink>

          <NavLink to="/outfits">
            Outfits
          </NavLink>

          <NavLink to="/cart">
            Carrito ({itemCount})
          </NavLink>

          {user && (
            <>
              <NavLink to="/orders">
                Mis pedidos
              </NavLink>

              <NavLink to="/chat">
                Chat
              </NavLink>
            </>
          )}

          <NavLink to="/location">
            Ubicación
          </NavLink>

          {profile?.role === 'admin' && (
            <NavLink to="/admin">
              Administración
            </NavLink>
          )}

          {!user && (
            <NavLink to="/login">
              Iniciar sesión
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
