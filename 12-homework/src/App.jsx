import { useState } from "react";
import Trie from "./Trie";
import "./App.css";

function createInitialTrie() {
  const t = new Trie();
  t.insert("air max", 90);
  t.insert("air force", 95);
  t.insert("air jordan", 85);
  t.insert("adidas boost", 80);
  t.insert("adidas superstar", 88);
  t.insert("puma suede", 70);
  t.insert("nike pegasus", 92);
  return t;
}

function App() {
  const [trie] = useState(createInitialTrie);
  const [version, setVersion] = useState(0); 
  const [message, setMessage] = useState("");

  
  const [name, setName] = useState("");
  const [popularity, setPopularity] = useState("");

  
  const [prefix, setPrefix] = useState("air");
  const [k, setK] = useState(2);

  const handleInsert = () => {
    const value = Number(popularity);
    if (!name.trim() || popularity === "" || Number.isNaN(value)) {
      setMessage("Escribe un nombre y una popularidad válida");
      return;
    }
    const existed = trie.search(name);
    trie.insert(name, value);
    setVersion((v) => v + 1);
    setMessage(existed ? `"${name}" ya existía: popularidad actualizada` : `"${name}" agregado`);
    setName("");
    setPopularity("");
  };

  
  const topK = trie.searchTopK(prefix, Number(k));
  const totalMatches = trie.searchByPrefix(prefix).length;

  const allProducts = trie
    .searchByPrefix("")
    .sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));

  return (
    <div className="app" data-version={version}>
      <h1>Challenge 12 – Buscador inteligente + Top resultados</h1>

      <div className="layout">
        <section className="card">
          <h3>Agregar producto</h3>
          <input
            placeholder="Nombre (ej: air max)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Popularidad (ej: 90)"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
          />
          <button onClick={handleInsert}>Insertar</button>
          {message && <p className="message">{message}</p>}
          <p className="hint">Productos guardados en el Trie: {trie.count}</p>
        </section>

        <section className="card results">
          <h3>Buscar por prefijo</h3>
          <div className="row">
            <input
              placeholder="Prefijo (ej: air)"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
            <label>
              Top K:
              <input
                className="k-input"
                type="number"
                min="1"
                value={k}
                onChange={(e) => setK(e.target.value)}
              />
            </label>
          </div>

          <p className="hint">
            {totalMatches} coincidencia(s) para "{prefix}" — mostrando las {Math.min(totalMatches, Number(k) || 0)} más populares
          </p>

          {topK.length === 0 ? (
            <p>No hay resultados.</p>
          ) : (
            <ol>
              {topK.map((p) => (
                <li key={p.name}>
                  <span className="product-name">{p.name}</span>
                  <span className="bar-wrap">
                    <span className="bar" style={{ width: `${Math.min(p.popularity, 100)}%` }} />
                  </span>
                  <span className="pop">{p.popularity}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="card all-products">
        <h3>Todos los productos ({allProducts.length})</h3>
        <p className="hint">Haz clic en un producto para buscar por su nombre.</p>
        <ul>
          {allProducts.map((p) => (
            <li key={p.name}>
              <button className="chip" onClick={() => setPrefix(p.name)}>
                {p.name} <strong>{p.popularity}</strong>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
