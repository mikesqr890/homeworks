
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import styles from './Admin.module.scss'

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  size: '',
  color: '',
  category_id: '',
  active: true
}

export default function Admin() {
  const { profile, logout } = useAuth()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')

    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),

      supabase
        .from('categories')
        .select('*')
        .order('name')
    ])

    if (productsResult.error) {
      setError(productsResult.error.message)
    } else {
      setProducts(productsResult.data || [])
    }

    if (categoriesResult.error) {
      setError(categoriesResult.error.message)
    } else {
      setCategories(categoriesResult.data || [])
    }

    setLoading(false)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function resetForm() {
    setForm(initialForm)
    setImage(null)
    setEditingId(null)

    const input = document.getElementById('product-image')
    if (input) input.value = ''
  }

  async function uploadImage() {
    if (!image) return null

    const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const filePath = `products/${Date.now()}-${safeName}`

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, image, {
        contentType: image.type,
        upsert: false
      })

    if (error) throw error

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      let imageUrl = null

      if (image) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        const currentProduct = products.find(
          (product) => product.id === editingId
        )

        imageUrl = currentProduct?.image_url || null
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        size: form.size.trim(),
        color: form.color.trim(),
        category_id: form.category_id
          ? Number(form.category_id)
          : null,
        active: form.active,
        image_url: imageUrl
      }

      let result

      if (editingId) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
      } else {
        result = await supabase
          .from('products')
          .insert(productData)
      }

      if (result.error) throw result.error

      setMessage(
        editingId
          ? 'Producto actualizado correctamente.'
          : 'Producto registrado correctamente.'
      )

      resetForm()
      await loadData()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  function editProduct(product) {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      size: product.size || '',
      color: product.color || '',
      category_id: product.category_id
        ? String(product.category_id)
        : '',
      active: product.active
    })

    setImage(null)
    setMessage('')
    setError('')

    document.getElementById('product-image')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  async function deleteProduct(id) {
    const confirmed = window.confirm(
      '¿Estás seguro de eliminar este producto?'
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }

    if (editingId === id) resetForm()

    setMessage('Producto eliminado correctamente.')
    await loadData()
  }

  if (loading) {
    return <p className={styles.loading}>Cargando administración...</p>
  }

  return (
    <main className={styles.admin}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>DE'YES</Link>

        <div>
          <span>Administrador: {profile?.full_name}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <section className={styles.heading}>
        <span>GESTIÓN DE LA TIENDA</span>
        <h1>Panel administrativo</h1>
        <p>Administra los productos y el inventario de De'yes.</p>
      </section>

      <section className={styles.stats}>
        <article>
          <span>Productos registrados</span>
          <strong>{products.length}</strong>
        </article>

        <article>
          <span>Productos activos</span>
          <strong>
            {products.filter((product) => product.active).length}
          </strong>
        </article>

        <article>
          <span>Unidades en inventario</span>
          <strong>
            {products.reduce(
              (total, product) => total + product.stock,
              0
            )}
          </strong>
        </article>
      </section>

      <section className={styles.formSection}>
        <h2>{editingId ? 'Editar producto' : 'Registrar producto'}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nombre del producto</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Camisa casual"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Precio</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Stock disponible</label>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Categoría</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Sin categoría</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Talla</label>
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="Ej. M, L, 38 o Única"
            />
          </div>

          <div className={styles.field}>
            <label>Color</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Ej. Negro"
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe las características del producto"
              rows="3"
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Fotografía del producto</label>
            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImage(e.target.files[0] || null)}
            />
            <small>Formatos JPG, PNG o WEBP. Máximo 5 MB.</small>
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Producto visible en el catálogo
          </label>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.actions}>
            <button type="submit" disabled={saving}>
              {saving
                ? 'Guardando...'
                : editingId
                  ? 'Guardar cambios'
                  : 'Registrar producto'}
            </button>

            {editingId && (
              <button
                type="button"
                className={styles.cancel}
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.tableSection}>
        <h2>Productos registrados</h2>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.product}>
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                        />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>

                  <td>
                    ${Number(product.price).toLocaleString('es-CO')}
                  </td>

                  <td>{product.stock}</td>

                  <td>
                    <span className={
                      product.active ? styles.active : styles.inactive
                    }>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td>
                    <div className={styles.rowActions}>
                      <button onClick={() => editProduct(product)}>
                        Editar
                      </button>

                      <button
                        className={styles.delete}
                        onClick={() => deleteProduct(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!products.length && (
                <tr>
                  <td colSpan="5">Todavía no hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
