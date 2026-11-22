
export const outfitCategories = [
  { id: 'ropa', name: 'Ropa' },
  { id: 'calzado', name: 'Calzado' },
  { id: 'accesorios', name: 'Accesorios' }
]

// Grafo representado mediante lista de adyacencia
export const outfitGraph = {
  ropa: [
    { category: 'calzado', weight: 3 },
    { category: 'accesorios', weight: 2 }
  ],
  calzado: [
    { category: 'ropa', weight: 3 },
    { category: 'accesorios', weight: 1 }
  ],
  accesorios: [
    { category: 'ropa', weight: 2 },
    { category: 'calzado', weight: 1 }
  ]
}

export function getCategoryType(categoryName = '') {
  const name = String(categoryName)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (
    name.includes('ropa') ||
    name.includes('prenda') ||
    name.includes('camisa') ||
    name.includes('vestido') ||
    name.includes('pantalon') ||
    name.includes('blusa')
  ) {
    return 'ropa'
  }

  if (
    name.includes('calzado') ||
    name.includes('zapato') ||
    name.includes('tenis') ||
    name.includes('sandalia') ||
    name.includes('bota')
  ) {
    return 'calzado'
  }

  if (
    name.includes('accesorio') ||
    name.includes('bolso') ||
    name.includes('cartera') ||
    name.includes('joya')
  ) {
    return 'accesorios'
  }

  return 'otros'
}

export function recommendProducts(products, selected) {
  const selectedProducts = Object.values(selected).filter(Boolean)

  if (selectedProducts.length === 0) {
    return []
  }

  const selectedIds = new Set(
    selectedProducts.map((product) => String(product.id))
  )

  const scores = {}

  for (const product of selectedProducts) {
    const connections = outfitGraph[product.categoryType] || []

    for (const connection of connections) {
      scores[connection.category] =
        (scores[connection.category] || 0) + connection.weight
    }
  }

  return products
    .filter((product) => {
      return (
        !selectedIds.has(String(product.id)) &&
        Number(product.stock) > 0 &&
        product.categoryType !== 'otros'
      )
    })
    .map((product) => {
      const isMissing = !selected[product.categoryType]

      return {
        ...product,
        recommendationScore:
          (scores[product.categoryType] || 0) +
          (isMissing ? 10 : 0)
      }
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => {
      return b.recommendationScore - a.recommendationScore
    })
    .slice(0, 4)
}
