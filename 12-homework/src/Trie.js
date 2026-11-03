import Heap from "./Heap";


class TrieNode {
  constructor() {
    this.children = {}; 
    this.isEndOfWord = false;
    this.product = null; 
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
    this.count = 0;
  }

  normalize(text) {
    return text.trim().toLowerCase();
  }

  insert(name, popularity) {
    const word = this.normalize(name);
    if (!word) return false;

    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    if (!node.isEndOfWord) this.count++;
    node.isEndOfWord = true;
    node.product = { name: name.trim(), popularity: Number(popularity) };
    return true;
  }

  findNode(prefix) {
    let node = this.root;
    for (const char of this.normalize(prefix)) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  collect(node, results = []) {
    if (node.isEndOfWord) results.push(node.product);
    for (const char of Object.keys(node.children)) {
      this.collect(node.children[char], results);
    }
    return results;
  }

  searchByPrefix(prefix) {
    const node = this.findNode(prefix);
    return node ? this.collect(node) : [];
  }

  searchTopK(prefix, k) {
    const node = this.findNode(prefix);
    if (!node || k <= 0) return [];

    const heap = new Heap(
      (a, b) => a.popularity - b.popularity || b.name.localeCompare(a.name)
    );

    for (const product of this.collect(node)) {
      heap.push(product);
      if (heap.size() > k) heap.pop(); 
    }

    const result = [];
    while (!heap.isEmpty()) result.push(heap.pop());
    return result.reverse();
  }
}