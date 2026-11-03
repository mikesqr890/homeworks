import { useState } from "react";
import { Graph as D3Graph } from "react-d3-graph";
import GraphDS, { cityId, personId } from "./Graph";
import "./App.css";

// Datos de ejemplo
function createInitialGraph() {
  const g = new GraphDS();
  ["Cali", "Bogotá", "Medellín"].forEach((c) => g.addCity(c));
  g.addPerson("Ana", 20, "Cali");
  g.addPerson("Luis", 22, "Cali");
  g.addPerson("Sofía", 21, "Bogotá");
  g.addPerson("Carlos", 25, "Medellín");
  g.addEdge(personId("Ana"), personId("Luis"));
  g.addEdge(personId("Ana"), personId("Sofía"));
  return g;
}

const config = {
  nodeHighlightBehavior: true,
  directed: false,
  width: 800,
  height: 500,
  d3: { gravity: -400, linkLength: 150 },
  node: {
    size: 700,
    fontSize: 14,
    highlightFontSize: 16,
    labelProperty: "label",
  },
  link: { highlightColor: "#81b29a" },
};

function App() {
  const [graph] = useState(createInitialGraph);
  const [version, setVersion] = useState(0); 
  const [message, setMessage] = useState("");

  // formularios
  const [cityName, setCityName] = useState("");
  const [personName, setPersonName] = useState("");
  const [personAge, setPersonAge] = useState("");
  const [personCity, setPersonCity] = useState("");
  const [friendA, setFriendA] = useState("");
  const [friendB, setFriendB] = useState("");
  const [queryCity, setQueryCity] = useState("");
  const [people, setPeople] = useState(null);

  const cities = graph.nodes.filter((n) => n.type === "city");
  const persons = graph.nodes.filter((n) => n.type === "person");

  const refresh = (msg) => {
    setVersion((v) => v + 1);
    setMessage(msg);
  };

  const handleAddCity = () => {
    if (graph.addCity(cityName)) {
      refresh(`Ciudad "${cityName}" agregada`);
      setCityName("");
    } else {
      setMessage("No se pudo agregar la ciudad (vacía o repetida)");
    }
  };

  const handleAddPerson = () => {
    if (!personName.trim() || !personAge || !personCity) {
      setMessage("Completa nombre, edad y ciudad");
      return;
    }
    if (graph.addPerson(personName, personAge, personCity)) {
      refresh(`Persona "${personName}" agregada`);
      setPersonName("");
      setPersonAge("");
    } else {
      setMessage("No se pudo agregar la persona (¿nombre repetido?)");
    }
  };

  const handleAddFriendship = () => {
    if (graph.addEdge(friendA, friendB)) {
      refresh("Amistad creada");
    } else {
      setMessage("No se pudo crear la amistad (¿iguales o ya son amigos?)");
    }
  };

  const handleQuery = () => {
    const result = graph.getPeopleByCity(queryCity);
    setPeople(result);
    console.log(`Personas que viven en ${queryCity}:`, result);
  };

  return (
    <div className="app">
      <h1>Challenge 11 – Grafo de amigos y ciudades</h1>

      <div className="layout">
        <div className="panel">
          <section>
            <h3>Agregar ciudad</h3>
            <input
              placeholder="Nombre de la ciudad"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <button onClick={handleAddCity}>Agregar</button>
          </section>

          <section>
            <h3>Agregar persona</h3>
            <input
              placeholder="Nombre"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Edad"
              value={personAge}
              onChange={(e) => setPersonAge(e.target.value)}
            />
            <select value={personCity} onChange={(e) => setPersonCity(e.target.value)}>
              <option value="">Ciudad...</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleAddPerson}>Agregar</button>
          </section>

          <section>
            <h3>Crear amistad</h3>
            <select value={friendA} onChange={(e) => setFriendA(e.target.value)}>
              <option value="">Persona 1...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select value={friendB} onChange={(e) => setFriendB(e.target.value)}>
              <option value="">Persona 2...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button onClick={handleAddFriendship}>Conectar</button>
          </section>

          <section>
            <h3>Personas por ciudad</h3>
            <select value={queryCity} onChange={(e) => setQueryCity(e.target.value)}>
              <option value="">Ciudad...</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleQuery} disabled={!queryCity}>Listar</button>
            {people && (
              <ul>
                {people.length === 0 && <li>Nadie vive aquí</li>}
                {people.map((p) => (
                  <li key={p.id}>{p.name} – {p.age} años</li>
                ))}
              </ul>
            )}
          </section>

          <button className="secondary" onClick={() => graph.print()}>
            Imprimir grafo en consola
          </button>
          {message && <p className="message">{message}</p>}
        </div>

        <div className="graph-container">
          {}
          <D3Graph
            key={version}
            id="graph-id"
            data={graph.toGraphData()}
            config={config}
          />
        </div>
      </div>
    </div>
  );
}

export default App;