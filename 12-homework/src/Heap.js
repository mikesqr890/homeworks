export default class Heap {
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }
  left(i) {
    return 2 * i + 1;
  }
  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }

  size() {
    return this.data.length;
  }

  isEmpty() {
    return this.data.length === 0;
  }

  toArray() {
    return [...this.data];
  }

  peek() {
    return this.data.length > 0 ? this.data[0] : null;
  }

  push(value) {
    this.data.push(value);
    this.percolateUp(this.data.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    const min = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this.percolateDown(0);
    }
    return min;
  }

  heapify(array) {
    this.data = [...array];
    for (let i = this.parent(this.data.length - 1); i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  percolateUp(i) {
    while (i > 0 && this.compare(this.data[i], this.data[this.parent(i)]) < 0) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  percolateDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = this.left(i);
      const r = this.right(i);

      if (l < n && this.compare(this.data[l], this.data[smallest]) < 0) smallest = l;
      if (r < n && this.compare(this.data[r], this.data[smallest]) < 0) smallest = r;

      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }
}