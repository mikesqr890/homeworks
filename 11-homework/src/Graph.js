const slug = (text) => text.trim().toLowerCase();
export const cityId = (name) => `city-${slug(name)}`;
export const personId = (name) => `person-${slug(name)}`;

export default class Graph {
  constructor() {
    this.nodes = []; 
    this.adjacency = {}; 
  }

  isEmpty() {
    return this.nodes.length === 0;
  }


  searchNode(id) {
    return this.nodes.find((n) => n.id === id) || null;
  }

  
  addNode(node) {
    if (this.searchNode(node.id)) return false;
    this.nodes.push(node);
    this.adjacency[node.id] = [];
    return true;
  }

  addCity(name) {
    if (!name.trim()) return false;
    return this.addNode({ id: cityId(name), type: "city", name: name.trim() });
  }

  addPerson(name, age, cityName) {
    const city = this.searchNode(cityId(cityName));
    if (!name.trim() || !city) return false;

    const person = {
      id: personId(name),
      type: "person",
      name: name.trim(),
      age: Number(age),
      city: city.name,
    };
    if (!this.addNode(person)) return false;
    return this.addEdge(person.id, city.id);
  }

  addEdge(idA, idB) {
    if (idA === idB) return false;
    if (!this.searchNode(idA) || !this.searchNode(idB)) return false;
    if (this.adjacency[idA].includes(idB)) return false;
    this.adjacency[idA].push(idB);
    this.adjacency[idB].push(idA);
    return true;
  }

  printAdjacency(id) {
    return this.adjacency[id] || [];
  }

  removeNode(id) {
    const node = this.searchNode(id);
    if (!node) return false;

    if (node.type === "city" && this.getPeopleByCity(node.name).length > 0) {
      return false;
    }

    this.adjacency[id].forEach((neighbor) => {
      this.adjacency[neighbor] = this.adjacency[neighbor].filter((n) => n !== id);
    });
    delete this.adjacency[id];
    this.nodes = this.nodes.filter((n) => n.id !== id);
    return true;
  }

  print() {
    console.log("===== GRAFO =====");
    this.nodes.forEach((node) => {
      const neighbors = this.adjacency[node.id]
        .map((nId) => this.searchNode(nId).name)
        .join(", ");
      console.log(`${node.name} (${node.type}) -> [${neighbors}]`);
    });
  }

  getPeopleByCity(cityName) {
    const city = this.searchNode(cityId(cityName));
    if (!city) return [];
    return this.adjacency[city.id]
      .map((id) => this.searchNode(id))
      .filter((n) => n.type === "person");
  }

    toGraphData() {
    const width = 800;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 60;

    const nodes = this.nodes.map((n, i) => {
      // posición inicial repartida en círculo
      const angle = (2 * Math.PI * i) / this.nodes.length;
      return {
        id: n.id,
        label: n.type === "person" ? `${n.name} (${n.age})` : n.name,
        color: n.type === "city" ? "#e07a5f" : "#3d85c6",
        symbolType: n.type === "city" ? "square" : "circle",
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      };
    });

    const links = [];
    this.nodes.forEach((n) => {
      this.adjacency[n.id].forEach((neighbor) => {
        if (n.id < neighbor) links.push({ source: n.id, target: neighbor });
      });
    });

    return { nodes, links };
  }
}