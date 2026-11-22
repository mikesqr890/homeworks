
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'

import { supabase } from '../../services/supabase'
import { useCart } from '../../context/CartContext'

import {
  ProductTrie,
  PriceTree
} from '../../helpers/dataStructures/StoreStructures'

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function formatPrice(value) {
  return Number(value).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
}

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [order, setOrder] = useState('recent')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const { addToCart, itemCount } = useCart()

  useEffect(() => {
    let active = true

    async function loadCatalog() {
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
            .order('name')
        ])

      if (!active) return

      if (productsResult.error) {
        setError(productsResult.error.message)
      } else {
        setProducts(productsResult.data || [])
      }

      if (categoriesResult.error) {
        console.error(categoriesResult.error.message)
      } else {
        setCategories(categoriesResult.data || [])
      }

      setLoading(false)
    }

    loadCatalog()

    return () => {
      active = false
    }
  }, [])

  // CONSTRUIR EL TRIE CON LOS PRODUCTOS

  const trie = useMemo(() => {
    const tree = new ProductTrie()

    for (const product of products) {
      tree.insert(product)
    }

    return tree
  }, [products])

  // FILTRAR Y ORDENAR PRODUCTOS

  const filteredProducts = useMemo(() => {
    const query = normalizeText(search)
    const words = query.split(/\s+/).filter(Boolean)

    const matchingIds = words.map((word) => trie.search(word))

    let result = products.filter((product) => {
      const productName = normalizeText(product.name)

      const matchesSearch =
        !query ||
        matchingIds.every((ids, index) =>
          ids.has(String(product.id)) ||
          productName.includes(words[index])
        )

      const matchesCategory =
        category === 'all' ||
        String(product.category_id) === category

      return matchesSearch && matchesCategory
    })

    if (order === 'low' || order === 'high') {
      const priceTree = new PriceTree()

      for (const product of result) {
        priceTree.insert(product)
      }

      result = priceTree.toSortedArray(order === 'low')
    }

    return result
  }, [products, search, category, order, trie])

  function handleAddToCart(product) {
    addToCart(product)
    setNotice(`${product.name} agregado al carrito.`)
  }

  if (loading) {
    return (
      <main className="container catalog-page">
        <p>Cargando catálogo...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container catalog-page">
        <h1>No pudimos cargar el catálogo</h1>
        <p className="error-message">{error}</p>
      </main>
    )
  }

  return (
    <main className="container catalog-page">
      <section className="catalog-header">
        <h1>Nuestra colección</h1>

        <p>
          Descubre las prendas, zapatos y accesorios de De'yes.
        </p>
      </section>

      <section className="catalog-filters">
        <input
          type="search"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filtrar categoría"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="all">Todas las categorías</option>

          {categories.map((item) => (
            <option
              key={item.id}
              value={String(item.id)}
            >
              {item.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Ordenar productos"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        >
          <option value="recent">Más recientes</option>
          <option value="low">Menor precio</option>
          <option value="high">Mayor precio</option>
        </select>
      </section>

      <p
        style={{
          textAlign: 'left',
          color: '#81786f',
          marginBottom: '20px'
        }}
      >
        {filteredProducts.length} productos encontrados
      </p>

      {notice && (
        <p
          className="success-message"
          role="status"
          style={{ marginBottom: '20px' }}
        >
          {notice}
        </p>
      )}

      <div className="catalog-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
              />
            ) : (
              <div className="product-placeholder">
                De'yes
              </div>
            )}

            <div className="product-info">
              <h3>{product.name}</h3>

              <p>
                {product.description || 'Descubre tu estilo con De\'yes.'}
              </p>

              <strong>{formatPrice(product.price)}</strong>

              <p>
                {Number(product.stock) > 0
                  ? `Disponibles: ${product.stock}`
                  : 'Producto agotado'}
              </p>

              <button
                type="button"
                disabled={Number(product.stock) <= 0}
                onClick={() => handleAddToCart(product)}
              >
                {Number(product.stock) > 0
                  ? 'Agregar al carrito'
                  : 'Agotado'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-cart">
          <h2>No encontramos productos</h2>
          <p>Prueba con otra búsqueda o categoría.</p>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <Link to="/cart" className="catalog-cart-link">
          Ver mi carrito ({itemCount})
        </Link>
      </div>
    </main>
  )
}
