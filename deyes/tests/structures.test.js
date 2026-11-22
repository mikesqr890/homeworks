
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ProductTrie,
  PriceTree,
  Stack,
  OrderQueue,
  buildOrderQueue
} from '../src/helpers/dataStructures/StoreStructures.js'

import {
  recommendProducts
} from '../src/helpers/dataStructures/OutfitGraph.js'

test('Trie encuentra productos por prefijo', () => {
  const trie = new ProductTrie()

  trie.insert({ id: 1, name: 'Camisa negra' })
  trie.insert({ id: 2, name: 'Zapatos blancos' })
  trie.insert({ id: 3, name: 'Camisa azul' })

  assert.deepEqual(
    [...trie.search('cami')].sort(),
    ['1', '3']
  )

  assert.deepEqual(
    [...trie.search('zap')],
    ['2']
  )
})

test('Árbol ordena productos por precio', () => {
  const tree = new PriceTree()

  tree.insert({ id: 1, price: 80000 })
  tree.insert({ id: 2, price: 30000 })
  tree.insert({ id: 3, price: 50000 })

  assert.deepEqual(
    tree.toSortedArray(true).map((p) => p.price),
    [30000, 50000, 80000]
  )

  assert.deepEqual(
    tree.toSortedArray(false).map((p) => p.price),
    [80000, 50000, 30000]
  )
})

test('Pila recupera el último cambio primero', () => {
  const stack = new Stack()

  stack.push('primer cambio')
  stack.push('segundo cambio')

  assert.equal(stack.pop(), 'segundo cambio')
  assert.equal(stack.pop(), 'primer cambio')
  assert.equal(stack.isEmpty(), true)
})

test('Cola respeta el orden FIFO', () => {
  const queue = new OrderQueue()

  queue.enqueue({ id: 1 })
  queue.enqueue({ id: 2 })
  queue.enqueue({ id: 3 })

  assert.equal(queue.peek().id, 1)
  assert.equal(queue.dequeue().id, 1)
  assert.equal(queue.dequeue().id, 2)
  assert.equal(queue.dequeue().id, 3)
  assert.equal(queue.isEmpty(), true)
})

test('Los pedidos pendientes se ordenan por llegada', () => {
  const orders = [
    {
      id: 3,
      status: 'pending',
      created_at: '2026-11-22T12:00:00Z'
    },
    {
      id: 1,
      status: 'pending',
      created_at: '2026-11-22T09:00:00Z'
    },
    {
      id: 2,
      status: 'confirmed',
      created_at: '2026-11-22T08:00:00Z'
    }
  ]

  const queue = buildOrderQueue(orders)

  assert.deepEqual(
    queue.toArray().map((order) => order.id),
    [1, 3]
  )
})

test('Grafo recomienda categorías complementarias', () => {
  const selected = {
    ropa: {
      id: 1,
      name: 'Camisa',
      categoryType: 'ropa'
    },
    calzado: null,
    accesorios: null
  }

  const products = [
    {
      id: 1,
      name: 'Camisa',
      categoryType: 'ropa',
      stock: 5
    },
    {
      id: 2,
      name: 'Zapatos',
      categoryType: 'calzado',
      stock: 4
    },
    {
      id: 3,
      name: 'Bolso',
      categoryType: 'accesorios',
      stock: 3
    }
  ]

  const recommendations =
    recommendProducts(products, selected)

  assert.equal(recommendations.length, 2)

  assert.equal(recommendations[0].id, 2)

  assert.equal(recommendations[1].id, 3)
})
