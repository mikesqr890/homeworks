import { useState } from "react";
import "./App.css";

/*LISTA ENLAZADA*/

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  peek() {
    return this.head;
  }

  size() {
    return this.length;
  }

  remove() {
    if (this.head === null) {
      return null;
    }

    const removedNode = this.head;
    this.head = this.head.next;

    if (this.head === null) {
      this.tail = null;
    }

    this.length--;

    return removedNode;
  }

  print() {
    let current = this.head;
    const values = [];

    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }
}


/* =====================================================
   LISTA DOBLEMENTE ENLAZADA
   Se utilizará para el historial del navegador
===================================================== */

class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new DoublyNode(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.previous = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  peek() {
    return this.head;
  }

  size() {
    return this.length;
  }

  remove() {
    if (this.head === null) {
      return null;
    }

    const removedNode = this.head;

    this.head = this.head.next;

    if (this.head !== null) {
      this.head.previous = null;
    } else {
      this.tail = null;
    }

    this.length--;

    return removedNode;
  }

  print() {
    let current = this.head;
    const values = [];

    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }
}


// Lista de canciones
const songsList = new LinkedList();

songsList.append({
  title: "Blinding Lights",
  artist: "The Weeknd"
});

songsList.append({
  title: "Starboy",
  artist: "The Weeknd"
});

songsList.append({
  title: "As It Was",
  artist: "Harry Styles"
});

songsList.append({
  title: "One More Time",
  artist: "Daft Punk"
});

songsList.append({
  title: "Save Your Tears",
  artist: "The Weeknd"
});


// Lista doble para historial
const historyList = new DoublyLinkedList();

historyList.append({
  title: "Google",
  url: "https://www.google.com"
});

historyList.append({
  title: "YouTube",
  url: "https://www.youtube.com"
});

historyList.append({
  title: "GitHub",
  url: "https://github.com"
});

historyList.append({
  title: "MDN Web Docs",
  url: "https://developer.mozilla.org"
});

historyList.append({
  title: "React",
  url: "https://react.dev"
});


/* =====================================================
   APP
===================================================== */

function App() {

  // Página actual
  const [page, setPage] = useState("songs");

  // Canción actual
  const [currentSong, setCurrentSong] = useState(songsList.head);

  // Página actual del historial
  const [currentHistory, setCurrentHistory] = useState(historyList.head);


  /* ===================================================
     NAVEGACIÓN DE CANCIONES
  =================================================== */

  const nextSong = () => {
    if (currentSong !== null && currentSong.next !== null) {
      setCurrentSong(currentSong.next);
    }
  };

  const previousSong = () => {

    // La lista de canciones es simplemente enlazada,
    // por lo que no tiene referencia al nodo anterior.

    if (currentSong === songsList.head) {
      return;
    }

    let current = songsList.head;
    let previous = null;

    while (current !== null && current !== currentSong) {
      previous = current;
      current = current.next;
    }

    if (previous !== null) {
      setCurrentSong(previous);
    }
  };


  /* ===================================================
     NAVEGACIÓN DEL HISTORIAL
  =================================================== */

  const nextPage = () => {
    if (
      currentHistory !== null &&
      currentHistory.next !== null
    ) {
      setCurrentHistory(currentHistory.next);
    }
  };

  const previousPage = () => {
    if (
      currentHistory !== null &&
      currentHistory.previous !== null
    ) {
      setCurrentHistory(currentHistory.previous);
    }
  };


  /* ===================================================
     CAMBIAR DE PÁGINA
  =================================================== */

  const goToSongs = () => {
    setPage("songs");
  };

  const goToHistory = () => {
    setPage("history");
  };


  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="app">

      {/* ==============================================
          ENCABEZADO
      ============================================== */}

      <header className="header">

        <h1>Challenge 03</h1>

        <p>
          Listas enlazadas y doblemente enlazadas
        </p>

        <nav className="navbar">

          <button onClick={goToSongs}>
            Canciones
          </button>

          <button onClick={goToHistory}>
            Historial del navegador
          </button>

        </nav>

      </header>


      {/* ==============================================
          PÁGINA DE CANCIONES
      ============================================== */}

      {page === "songs" && (

        <main className="page">

          <h2>Lista enlazada - Canciones</h2>

          <p>
            Esta página utiliza una lista enlazada para
            recorrer las canciones en orden.
          </p>


          {currentSong && (

            <section className="card">

              <h3>{currentSong.value.title}</h3>

              <p>
                Artista: {currentSong.value.artist}
              </p>

              <div className="buttons">

                <button
                  onClick={previousSong}
                  disabled={currentSong === songsList.head}
                >
                  ⏮ Anterior
                </button>

                <button
                  onClick={nextSong}
                  disabled={currentSong.next === null}
                >
                  Siguiente ⏭
                </button>

              </div>

            </section>

          )}


          {/* Mostrar las canciones */}

          <section className="list-section">

            <h3>
              Canciones en la lista
            </h3>

            <ul>

              {songsList.print().map((song, index) => (

                <li key={index}>

                  {index + 1}. {song.title} -
                  {" "}{song.artist}

                </li>

              ))}

            </ul>

            <p>
              Tamaño de la lista: {songsList.size()}
            </p>

          </section>

        </main>

      )}


      {/* ==============================================
          PÁGINA DEL HISTORIAL
      ============================================== */}

      {page === "history" && (

        <main className="page">

          <h2>Lista doblemente enlazada - Historial</h2>

          <p>
            Esta página utiliza una lista doblemente
            enlazada para navegar hacia atrás y hacia
            adelante.
          </p>


          {currentHistory && (

            <section className="card">

              <h3>
                {currentHistory.value.title}
              </h3>

              <p>
                {currentHistory.value.url}
              </p>

              <div className="buttons">

                <button
                  onClick={previousPage}
                  disabled={currentHistory.previous === null}
                >
                  ← Atrás
                </button>

                <button
                  onClick={nextPage}
                  disabled={currentHistory.next === null}
                >
                  Adelante →
                </button>

              </div>

            </section>

          )}


          {/* Mostrar el historial */}

          <section className="list-section">

            <h3>
              Páginas visitadas
            </h3>

            <ul>

              {historyList.print().map((page, index) => (

                <li key={index}>

                  {index + 1}. {page.title}

                </li>

              ))}

            </ul>

            <p>
              Tamaño de la lista: {historyList.size()}
            </p>

          </section>

        </main>

      )}

    </div>
  );
}

export default App;