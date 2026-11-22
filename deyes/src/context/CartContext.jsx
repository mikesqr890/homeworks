
import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react'

import { Stack } from '../helpers/dataStructures/StoreStructures'

const CartContext = createContext(null)

function getInitialCart() {
  try {
    const saved = localStorage.getItem('deyes_cart')
    const parsed = saved ? JSON.parse(saved) : []

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function initialState() {
  return {
    cart: getInitialCart(),
    history: []
  }
}

function saveChange(state, nextCart) {
  if (JSON.stringify(state.cart) === JSON.stringify(nextCart)) {
    return state
  }

  const stack = new Stack(state.history)

  stack.push(state.cart.map((item) => ({ ...item })))

  return {
    cart: nextCart,
    history: stack.toArray().slice(-10)
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const product = action.product
      const stock = Number(product.stock)

      if (!Number.isFinite(stock) || stock <= 0) {
        return state
      }

      const existing = state.cart.find(
        (item) => String(item.id) === String(product.id)
      )

      let nextCart

      if (existing) {
        nextCart = state.cart.map((item) => {
          if (String(item.id) !== String(product.id)) {
            return item
          }

          return {
            ...item,
            stock,
            quantity: Math.min(item.quantity + 1, stock)
          }
        })
      } else {
        nextCart = [
          ...state.cart,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            stock,
            quantity: 1
          }
        ]
      }

      return saveChange(state, nextCart)
    }

    case 'REMOVE': {
      const nextCart = state.cart.filter(
        (item) => String(item.id) !== String(action.id)
      )

      return saveChange(state, nextCart)
    }

    case 'QUANTITY': {
      const nextCart = state.cart.map((item) => {
        if (String(item.id) !== String(action.id)) {
          return item
        }

        const stock = Math.max(1, Number(item.stock) || 1)

        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(Number(action.quantity) || 1, stock)
          )
        }
      })

      return saveChange(state, nextCart)
    }

    case 'CLEAR':
      return saveChange(state, [])

    case 'UNDO': {
      const stack = new Stack(state.history)

      if (stack.isEmpty()) {
        return state
      }

      const previousCart = stack.pop()

      return {
        cart: previousCart,
        history: stack.toArray()
      }
    }

    case 'CHECKOUT_SUCCESS':
      return {
        cart: [],
        history: []
      }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    initialState
  )

  useEffect(() => {
    localStorage.setItem(
      'deyes_cart',
      JSON.stringify(state.cart)
    )
  }, [state.cart])

  function addToCart(product) {
    dispatch({ type: 'ADD', product })
  }

  function removeFromCart(productId) {
    dispatch({ type: 'REMOVE', id: productId })
  }

  function updateQuantity(productId, quantity) {
    dispatch({
      type: 'QUANTITY',
      id: productId,
      quantity
    })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  function undoCart() {
    dispatch({ type: 'UNDO' })
  }

  function completeCheckout() {
    dispatch({ type: 'CHECKOUT_SUCCESS' })
  }

  const total = state.cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  )

  const itemCount = state.cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        total,
        itemCount,
        canUndo: state.history.length > 0,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        undoCart,
        completeCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart debe utilizarse dentro de CartProvider'
    )
  }

  return context
}
