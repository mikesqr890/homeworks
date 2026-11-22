
import {
  Routes,
  Route,
  Outlet,
  NavLink,
  Link,
  useLocation
} from 'react-router'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Catalog from '../pages/Catalog/Catalog'
import Cart from '../pages/Cart/Cart'
import Orders from '../pages/Orders/Orders'
import Outfits from '../pages/Outfits/Outfits'
import Chat from '../pages/Chat/Chat'
import Location from '../pages/Location/Location'

import Admin from '../pages/Admin/Admin'
import AdminOrders from '../pages/Admin/AdminOrders'
import AdminChat from '../pages/Admin/AdminChat'

import SiteNavigation from '../components/Shared/SiteNavigation'
import ProtectedRoute from './ProtectedRoute'

function NotFound() {
  return (
    <main
      className="container"
      style={{ padding: '70px 0' }}
    >
      <h1>Página no encontrada</h1>

      <p style={{ margin: '20px 0' }}>
        La página que buscas no existe.
      </p>

      <Link to="/catalog" className="primary-button">
        Volver al catálogo
      </Link>
    </main>
  )
}

function SiteFooter() {
  const { pathname } = useLocation()

  if (
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null
  }

  return (
    <footer className="deyes-footer">
      <strong>DE'YES</strong>

      <p>
        Moda, estilo y combinaciones personalizadas.
        Florida, Valle del Cauca, Colombia.
      </p>

      <div className="deyes-footer-links">
        <Link to="/catalog">Catálogo</Link>
        <Link to="/outfits">Cápsula de Outfit</Link>
        <Link to="/location">Ubicación</Link>
        <Link to="/chat">Atención al cliente</Link>
      </div>
    </footer>
  )
}

function AdminLayout() {
  const linkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #dcd4ca',
    background: isActive ? '#292621' : '#fff',
    color: isActive ? '#fff' : '#292621'
  })

  return (
    <>
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '25px'
        }}
      >
        <NavLink
          to="/admin"
          end
          style={linkStyle}
        >
          Productos
        </NavLink>

        <NavLink
          to="/admin/orders"
          style={linkStyle}
        >
          Pedidos
        </NavLink>

        <NavLink
          to="/admin/chat"
          style={linkStyle}
        >
          Chat
        </NavLink>
      </div>

      <Outlet />
    </>
  )
}

export default function AppRoutes() {
  return (
    <>
      <SiteNavigation />

      <Routes>
        {/* PÚBLICAS */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/catalog"
          element={<Catalog />}
        />

        <Route
          path="/location"
          element={<Location />}
        />

        {/* USUARIOS AUTENTICADOS */}

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/outfits" element={<Outfits />} />

          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* ADMINISTRACIÓN */}

        <Route
          element={
            <ProtectedRoute requiredRole="admin" />
          }
        >
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Admin />} />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/chat"
              element={<AdminChat />}
            />
          </Route>
        </Route>

        {/* NO ENCONTRADA */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <SiteFooter />
    </>
  )
}
