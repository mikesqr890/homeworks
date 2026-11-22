
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  ready: 'Listo para entregar',
  delivered: 'Entregado'
}

export default function Orders() {
  const { user } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadOrders() {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            subtotal
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        setError(error.message)
      } else {
        setOrders(data || [])
      }

      setLoading(false)
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [user])

  const formatPrice = (value) =>
    Number(value).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    })

  return (
    <main className="container orders-page">
      <header className="orders-header">
        <h1>Mis pedidos</h1>

        <p>
          Consulta tus compras y revisa su estado.
        </p>

        <Link to="/catalog">
          Seguir comprando
        </Link>
      </header>

      {loading && <p>Cargando pedidos...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-cart">
          <h2>Aún no tienes pedidos</h2>
          <p>
            Cuando realices tu primera compra,
            aparecerá aquí.
          </p>

          <Link to="/catalog" className="primary-button">
            Explorar catálogo
          </Link>
        </div>
      )}

      {!loading && !error && (
        <div className="orders-list">
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >
              <div className="order-card-header">
                <div>
                  <h2>
                    Pedido #{order.id}
                  </h2>

                  <p>
                    {new Date(order.created_at)
                      .toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                  </p>
                </div>

                <span
                  className={`order-status status-${order.status}`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="order-products">
                {(order.order_items || []).map((item) => (
                  <div
                    className="order-product"
                    key={item.id}
                  >
                    <div>
                      <strong>{item.product_name}</strong>
                      <p>Cantidad: {item.quantity}</p>
                    </div>

                    <span>
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>
                  Total: {formatPrice(order.total)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
