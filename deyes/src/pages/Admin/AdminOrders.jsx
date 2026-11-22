
import { useEffect, useMemo, useState } from 'react'

import { supabase } from '../../services/supabase'

import {
  buildOrderQueue
} from '../../helpers/dataStructures/StoreStructures'

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  ready: 'Listo para entregar',
  delivered: 'Entregado'
}

const statuses = Object.keys(statusLabels)

function formatPrice(value) {
  return Number(value).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadOrders() {
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        total,
        status,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          subtotal
        )
      `)
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // ESTRUCTURA QUEUE: PEDIDOS PENDIENTES

  const pendingQueue = useMemo(() => {
    return buildOrderQueue(orders)
  }, [orders])

  const pendingOrders = pendingQueue.toArray()
  const nextPendingOrder = pendingQueue.peek()

  // Mostrar pendientes primero; los demás después

  const orderedOrders = useMemo(() => {
    const pending = buildOrderQueue(orders).toArray()

    const other = orders
      .filter((order) => order.status !== 'pending')
      .sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      )

    return [...pending, ...other]
  }, [orders])

  async function changeStatus(orderId, newStatus) {
    setSavingId(orderId)
    setError('')
    setMessage('')

    const { data, error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select('id, status')
      .single()

    if (updateError) {
      setError(updateError.message)
    } else {
      setOrders((current) =>
        current.map((order) =>
          order.id === data.id
            ? { ...order, status: data.status }
            : order
        )
      )

      setMessage(
        `Estado del pedido #${orderId} actualizado.`
      )
    }

    setSavingId(null)
  }

  return (
    <main className="container orders-page">
      <header className="orders-header">
        <h1>Administrar pedidos</h1>

        <p>
          Organiza los pedidos y atiende primero
          las solicitudes más antiguas.
        </p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}

      {!loading && (
        <section
          style={{
            padding: '24px',
            marginBottom: '30px',
            borderRadius: '12px',
            background: '#f2ede7',
            border: '1px solid #e8dfd5'
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: '12px'
            }}
          >
            Cola de pedidos pendientes
          </h2>

          <p>
            Pedidos en espera: <strong>{pendingOrders.length}</strong>
          </p>

          {nextPendingOrder ? (
            <p style={{ marginTop: '10px' }}>
              Siguiente por atender:{' '}
              <strong>Pedido #{nextPendingOrder.id}</strong>
            </p>
          ) : (
            <p style={{ marginTop: '10px' }}>
              No hay pedidos pendientes.
            </p>
          )}
        </section>
      )}

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : orderedOrders.length === 0 && !error ? (
        <div className="empty-cart">
          <h2>Todavía no hay pedidos</h2>
          <p>
            Los pedidos de tus clientes aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orderedOrders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >
              <div className="order-card-header">
                <div>
                  <h2>Pedido #{order.id}</h2>

                  <p>
                    {new Date(order.created_at)
                      .toLocaleString('es-CO')}
                  </p>

                  <p>
                    Cliente: {String(order.user_id).slice(0, 8)}
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

                      <p>
                        Cantidad: {item.quantity}
                      </p>
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

              <div className="admin-order-actions">
                <label htmlFor={`status-${order.id}`}>
                  Estado del pedido
                </label>

                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  disabled={savingId === order.id}
                  onChange={(event) =>
                    changeStatus(
                      order.id,
                      event.target.value
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
