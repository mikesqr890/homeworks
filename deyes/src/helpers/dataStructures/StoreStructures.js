
function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// 1. TRIE: BÚSQUEDA DE PRODUCTOS

class TrieNode {
  constructor() {
    this.children = new Map()
    this.productIds = new Set()
  }
}

export class ProductTrie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(product) {
    const words = normalizeText(product.name)
      .split(/[^a-z0-9]+/)
      .filter(Boolean)

    for (const word of words) {
      let node = this.root

      for (const character of word) {
        if (!node.children.has(character)) {
          node.children.set(character, new TrieNode())
        }

        node = node.children.get(character)
        node.productIds.add(String(product.id))
      }
    }
  }

  search(prefix) {
    const query = normalizeText(prefix)

    if (!query) return new Set()

    let node = this.root

    for (const character of query) {
      if (!node.children.has(character)) {
        return new Set()
      }

      node = node.children.get(character)
    }

    return new Set(node.productIds)
  }
}

// 2. ÁRBOL BINARIO DE BÚSQUEDA: PRECIOS

class PriceNode {
  constructor(product) {
    this.product = product
    this.left = null
    this.right = null
  }
}

export class PriceTree {
  constructor() {
    this.root = null
  }

  insert(product) {
    const node = new PriceNode(product)

    if (!this.root) {
      this.root = node
      return
    }

    let current = this.root

    while (true) {
      const currentPrice = Number(current.product.price)
      const newPrice = Number(product.price)

      if (newPrice < currentPrice) {
        if (!current.left) {
          current.left = node
          return
        }

        current = current.left
      } else {
        if (!current.right) {
          current.right = node
          return
        }

        current = current.right
      }
    }
  }

  toSortedArray(ascending = true) {
    const result = []

    function traverse(node) {
      if (!node) return

      if (ascending) {
        traverse(node.left)
        result.push(node.product)
        traverse(node.right)
      } else {
        traverse(node.right)
        result.push(node.product)
        traverse(node.left)
      }
    }

    traverse(this.root)
    return result
  }
}

// 3. PILA: HISTORIAL PARA DESHACER

export class Stack {
  constructor(items = []) {
    this.items = [...items]
  }

  push(item) {
    this.items.push(item)
  }

  pop() {
    return this.items.pop()
  }

  isEmpty() {
    return this.items.length === 0
  }

  toArray() {
    return [...this.items]
  }
}

// 4. COLA: PEDIDOS PENDIENTES

export class OrderQueue {
  constructor() {
    this.items = []
    this.frontIndex = 0
  }

  enqueue(order) {
    this.items.push(order)
  }

  dequeue() {
    if (this.isEmpty()) return null

    const order = this.items[this.frontIndex]
    this.frontIndex += 1

    return order
  }

  peek() {
    return this.isEmpty()
      ? null
      : this.items[this.frontIndex]
  }

  isEmpty() {
    return this.frontIndex >= this.items.length
  }

  size() {
    return this.items.length - this.frontIndex
  }

  toArray() {
    return this.items.slice(this.frontIndex)
  }
}

export function buildOrderQueue(orders) {
  const queue = new OrderQueue()

  const pending = orders
    .filter((order) => order.status === 'pending')
    .sort((a, b) => {
      const dateDifference =
        new Date(a.created_at) - new Date(b.created_at)

      return dateDifference || Number(a.id) - Number(b.id)
    })

  for (const order of pending) {
    queue.enqueue(order)
  }

  return queue
}
