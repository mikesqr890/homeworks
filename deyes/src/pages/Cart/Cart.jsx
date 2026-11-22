
import { useState } from 'react'
import { Link } from 'react-router'

import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

function formatPrice(value) {
  return Number(value).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
}

export default function Cart() {
  const {
    cart,
    total,
    itemCount,
    canUndo,
    removeFromCart,
    updateQuantity,
    clearCart,
    undoCart,
    completeCheckout
  } = useCart()

  const { user } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const undoButtonStyle = {
    padding: '12px 20px',
    border: '1px solid #b9a38d',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#66503c',
    fontWeight: '600',
    marginTop: '20px',
    marginBottom: '10px'
  }

  async function handleCheckout() {
    if (!user || cart.length === 0 || saving) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const items = cart.map((item) => ({
        id: String(item.id),
        quantity: Number(item.quantity)
      }))

      const { data, error: orderError } = await supabase.rpc(
        'create_order',
        { p_items: items }
      )

      if (orderError) throw orderError

      completeCheckout()

      setSuccess(
        `El pedido #${data} se registró correctamente.`
      )
    } catch (err) {
      setError(
        err.message || 'No pudimos registrar tu pedido.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container cart-page">
      <h1>Mi carrito de compras</h1>

      <p>Revisa los productos seleccionados en De'yes.</p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {success && (
        <div className="order-success" role="status">
          <h2>¡Pedido registrado!</h2>

          <p>{success}</p>

          <p>
            Puedes consultar su estado desde Mis pedidos.
          </p>

          <Link to="/orders">Ver mis pedidos</Link>
        </div>
      )}

      {!success && canUndo && !saving && (
        <button
          type="button"
          style={undoButtonStyle}
          onClick={undoCart}
        >
          ↶ Deshacer último cambio
        </button>
      )}

      {cart.length === 0 ? (
        !success && (
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>

            <p>
              Explora nuestra colección y encuentra
              tu outfit ideal.
            </p>

            <Link to="/catalog" className="primary-button">
              Explorar catálogo
            </Link>
          </div>
        )
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                  />
                )}

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>{formatPrice(item.price)}</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      disabled={saving || item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      disabled={
                        saving || item.quantity >= item.stock
                      }
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    Subtotal: {formatPrice(
                      item.price * item.quantity
                    )}
                  </strong>

                  <button
                    type="button"
                    className="remove-button"
                    disabled={saving}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Resumen del pedido</h2>

            <p>Artículos seleccionados: {itemCount}</p>

            <h3>
              Total estimado: {formatPrice(total)}
            </h3>

            <p>
              Los precios y existencias se verificarán
              nuevamente al confirmar el pedido.
            </p>

            <button
              type="button"
              disabled={saving || !user}
              onClick={handleCheckout}
            >
              {saving
                ? 'Registrando pedido...'
                : 'Confirmar pedido'}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={clearCart}
            >
              Vaciar carrito
            </button>

            <Link to="/catalog">
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}
