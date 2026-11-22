
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'

import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

import {
  outfitCategories,
  getCategoryType,
  recommendProducts
} from '../../helpers/dataStructures/OutfitGraph'

import './Outfits.css'

const emptySelection = {
  ropa: null,
  calzado: null,
  accesorios: null
}

function formatPrice(value) {
  return Number(value).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
}

export default function Outfits() {
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [products, setProducts] = useState([])
  const [savedOutfits, setSavedOutfits] = useState([])

  const [activeCategory, setActiveCategory] = useState('ropa')
  const [selected, setSelected] = useState(emptySelection)
  const [outfitName, setOutfitName] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // CARGAR PRODUCTOS Y CATEGORÍAS

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setLoading(true)

      const [productsResult, categoriesResult] =
        await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false }),

          supabase
            .from('categories')
            .select('id, name')
        ])

      if (!active) return

      if (productsResult.error) {
        setError(productsResult.error.message)
        setLoading(false)
        return
      }

      if (categoriesResult.error) {
        setError(categoriesResult.error.message)
        setLoading(false)
        return
      }

      const categoriesMap = new Map(
        (categoriesResult.data || []).map((item) => [
          String(item.id),
          item.name
        ])
      )

      const mapped = (productsResult.data || []).map(
        (product) => ({
          ...product,
          categoryType: getCategoryType(
            categoriesMap.get(String(product.category_id)) || ''
          )
        })
      )

      setProducts(mapped)
      setLoading(false)
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  // CARGAR OUTFITS DE SUPABASE

  useEffect(() => {
    let active = true

    async function loadSavedOutfits() {
      setLoadingSaved(true)
      setSavedOutfits([])
      setSelected({ ...emptySelection })
      setOutfitName('')

      if (!user?.id) {
        setLoadingSaved(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from('deyes_saved_outfits')
        .select('id, name, product_ids, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (queryError) {
        setError(queryError.message)
      } else {
        setSavedOutfits(data || [])
      }

      setLoadingSaved(false)
    }

    loadSavedOutfits()

    return () => {
      active = false
    }
  }, [user?.id])

  // PRODUCTOS POR CATEGORÍA

  const availableProducts = useMemo(() => {
    return products.filter((product) => (
      product.categoryType === activeCategory &&
      Number(product.stock) > 0
    ))
  }, [products, activeCategory])

  const selectedProducts = useMemo(() => {
    return Object.values(selected).filter(Boolean)
  }, [selected])

  const total = selectedProducts.reduce(
    (sum, product) => sum + Number(product.price),
    0
  )

  // RECOMENDACIONES DEL GRAFO

  const recommendations = useMemo(() => {
    return recommendProducts(products, selected)
  }, [products, selected])

  // SELECCIONAR PRODUCTO

  function selectProduct(product) {
    if (Number(product.stock) <= 0) return

    setSelected((current) => ({
      ...current,
      [product.categoryType]: product
    }))

    setMessage('')
  }

  // QUITAR PRODUCTO

  function removeProduct(category) {
    setSelected((current) => ({
      ...current,
      [category]: null
    }))

    setMessage('')
  }

  // LIMPIAR COMBINACIÓN

  function clearSelection() {
    setSelected({ ...emptySelection })
    setOutfitName('')
    setMessage('')
  }

  // GUARDAR EN SUPABASE

  async function saveOutfit() {
    if (!user?.id || saving) return

    if (selectedProducts.length === 0) {
      setMessage('Selecciona al menos un producto.')
      return
    }

    if (!outfitName.trim()) {
      setMessage('Escribe un nombre para tu outfit.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    const productIds = selectedProducts.map(
      (product) => product.id
    )

    const { data, error: saveError } = await supabase
      .from('deyes_saved_outfits')
      .insert({
        user_id: user.id,
        name: outfitName.trim(),
        product_ids: productIds
      })
      .select('id, name, product_ids, created_at')
      .single()

    if (saveError) {
      setError(saveError.message)
    } else {
      setSavedOutfits((current) => [data, ...current])
      setMessage('¡Tu outfit se guardó en tu cuenta!')
      setOutfitName('')
    }

    setSaving(false)
  }

  // ELIMINAR DE SUPABASE

  async function deleteOutfit(outfitId) {
    if (!user?.id || saving) return

    setSaving(true)
    setError('')
    setMessage('')

    const { data, error: deleteError } = await supabase
      .from('deyes_saved_outfits')
      .delete()
      .eq('id', outfitId)
      .eq('user_id', user.id)
      .select('id')

    if (deleteError) {
      setError(deleteError.message)
    } else if (!data || data.length === 0) {
      setError('No se pudo encontrar el outfit para eliminarlo.')
    } else {
      setSavedOutfits((current) =>
        current.filter((outfit) => outfit.id !== outfitId)
      )

      setMessage('Outfit eliminado correctamente.')
    }

    setSaving(false)
  }

  // RECUPERAR PRODUCTOS DE UN OUTFIT

  function getOutfitProducts(outfit) {
    const ids = Array.isArray(outfit.product_ids)
      ? outfit.product_ids
      : []

    return ids
      .map((id) =>
        products.find(
          (product) => String(product.id) === String(id)
        )
      )
      .filter(Boolean)
  }

  // CARGAR OUTFIT GUARDADO

  function loadOutfit(outfit) {
    const nextSelection = { ...emptySelection }
    const outfitProducts = getOutfitProducts(outfit)

    for (const product of outfitProducts) {
      if (
        product.categoryType in nextSelection &&
        Number(product.stock) > 0
      ) {
        nextSelection[product.categoryType] = product
      }
    }

    setSelected(nextSelection)
    setOutfitName(outfit.name)

    setMessage(
      'Outfit cargado. Puedes modificarlo y guardarlo como uno nuevo.'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // AGREGAR OUTFIT AL CARRITO

  function addOutfitToCart() {
    if (selectedProducts.length === 0) return

    for (const product of selectedProducts) {
      addToCart(product)
    }

    setMessage('Productos agregados al carrito.')
  }

  if (loading) {
    return (
      <main className="container outfit-page">
        <p>Cargando productos...</p>
      </main>
    )
  }

  return (
    <main className="container outfit-page">

      <header className="outfit-heading">
        <span>DE'YES · TU ESTILO</span>

        <h1>Cápsula de Outfit</h1>

        <p>
          Combina tus prendas favoritas, descubre
          recomendaciones y guarda tus looks en tu cuenta.
        </p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="outfit-layout">

        {/* SELECCIÓN DE PRODUCTOS */}

        <section className="outfit-builder">

          <div className="outfit-section-heading">
            <h2>Elige tus productos</h2>
            <p>Selecciona una categoría para comenzar.</p>
          </div>

          <div className="outfit-tabs">
            {outfitCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={
                  activeCategory === category.id
                    ? 'outfit-tab active'
                    : 'outfit-tab'
                }
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
                {selected[category.id] && ' ✓'}
              </button>
            ))}
          </div>

          {availableProducts.length === 0 ? (
            <div className="outfit-empty">
              No hay productos disponibles
              en esta categoría.
            </div>
          ) : (
            <div className="outfit-products-grid">
              {availableProducts.map((product) => {
                const isSelected =
                  selected[activeCategory]?.id === product.id

                return (
                  <article
                    key={product.id}
                    className={
                      isSelected
                        ? 'outfit-product selected'
                        : 'outfit-product'
                    }
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="outfit-placeholder">
                        De'yes
                      </div>
                    )}

                    <div className="outfit-product-body">
                      <h3>{product.name}</h3>
                      <p>{formatPrice(product.price)}</p>

                      <button
                        type="button"
                        onClick={() => selectProduct(product)}
                      >
                        {isSelected
                          ? 'Seleccionado ✓'
                          : 'Seleccionar'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* RESUMEN DEL OUTFIT */}

        <aside className="outfit-summary">
          <h2>Tu combinación</h2>
          <p>Así va quedando tu outfit.</p>

          <div className="outfit-selected-list">
            {outfitCategories.map((category) => {
              const product = selected[category.id]

              return (
                <div
                  className="outfit-selected-item"
                  key={category.id}
                >
                  {product ? (
                    <>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                        />
                      ) : (
                        <div className="outfit-small-placeholder">
                          De'yes
                        </div>
                      )}

                      <div>
                        <small>{category.name}</small>
                        <strong>{product.name}</strong>

                        <span>
                          {formatPrice(product.price)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeProduct(category.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="outfit-empty-slot">
                      <span>+</span>
                      <p>{category.name} sin seleccionar</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="outfit-total">
            <span>Total estimado</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <label htmlFor="outfit-name">
            Nombre de tu outfit
          </label>

          <input
            id="outfit-name"
            type="text"
            maxLength={60}
            placeholder="Ej. Mi look de fin de semana"
            value={outfitName}
            onChange={(event) =>
              setOutfitName(event.target.value)
            }
          />

          <button
            type="button"
            className="outfit-primary-button"
            onClick={saveOutfit}
            disabled={saving || selectedProducts.length === 0}
          >
            {saving ? 'Guardando...' : 'Guardar outfit'}
          </button>

          <button
            type="button"
            className="outfit-secondary-button"
            onClick={addOutfitToCart}
            disabled={selectedProducts.length === 0}
          >
            Agregar outfit al carrito
          </button>

          <button
            type="button"
            className="outfit-clear-button"
            onClick={clearSelection}
          >
            Limpiar combinación
          </button>

          {message && (
            <p className="outfit-message" role="status">
              {message}
            </p>
          )}

          <Link to="/cart" className="outfit-cart-link">
            Ir a mi carrito
          </Link>
        </aside>
      </div>

      {/* RECOMENDACIONES */}

      <section className="outfit-recommendations">
        <div className="outfit-section-heading">
          <h2>Completa tu estilo</h2>

          <p>
            Descubre recomendaciones para complementar
            las prendas que seleccionaste.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <p>
            Selecciona un producto para descubrir
            recomendaciones.
          </p>
        ) : (
          <div className="outfit-recommendation-grid">
            {recommendations.map((product) => (
              <article
                className="outfit-recommendation"
                key={product.id}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="outfit-placeholder">
                    De'yes
                  </div>
                )}

                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>

                <button
                  type="button"
                  onClick={() => selectProduct(product)}
                >
                  Añadir a mi outfit
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* OUTFITS GUARDADOS */}

      <section className="saved-outfits">
        <div className="outfit-section-heading">
          <h2>Mis outfits guardados</h2>
          <p>
            Tus combinaciones están asociadas
            a tu cuenta de De'yes.
          </p>
        </div>

        {loadingSaved ? (
          <p>Cargando tus outfits...</p>
        ) : savedOutfits.length === 0 ? (
          <div className="outfit-empty">
            Todavía no has guardado ninguna combinación.
          </div>
        ) : (
          <div className="saved-outfits-grid">
            {savedOutfits.map((outfit) => {
              const outfitProducts = getOutfitProducts(outfit)

              const outfitTotal = outfitProducts.reduce(
                (sum, product) =>
                  sum + Number(product.price),
                0
              )

              return (
                <article
                  className="saved-outfit-card"
                  key={outfit.id}
                >
                  <h3>{outfit.name}</h3>

                  <div className="saved-outfit-images">
                    {outfitProducts.map((product) =>
                      product.image_url ? (
                        <img
                          key={product.id}
                          src={product.image_url}
                          alt={product.name}
                        />
                      ) : (
                        <div
                          key={product.id}
                          className="outfit-small-placeholder"
                        >
                          De'yes
                        </div>
                      )
                    )}
                  </div>

                  <p>
                    {outfitProducts.length} productos disponibles
                  </p>

                  <strong>
                    {formatPrice(outfitTotal)}
                  </strong>

                  <div className="saved-outfit-actions">
                    <button
                      type="button"
                      onClick={() => loadOutfit(outfit)}
                      disabled={saving}
                    >
                      Utilizar
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteOutfit(outfit.id)}
                      disabled={saving}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
