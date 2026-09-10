import { useState, useRef, useEffect } from 'react';
import './App.css';


class NodoPaciente {
  constructor(paciente) {
    this.paciente = paciente;
    this.next = null;
  }
}

class ListaPacientes {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(paciente) {
    const nuevoNodo = new NodoPaciente(paciente);

    if (!this.head) {
      this.head = nuevoNodo;
    } else {
      this.tail.next = nuevoNodo;
    }

    this.tail = nuevoNodo;
    this.length++;
  }

  atenderPrimero() {
    if (!this.head) return null;

    const atendido = this.head;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this.length--;
    return atendido.paciente;
  }

  toArray() {
    const resultado = [];
    let actual = this.head;

    while (actual) {
      resultado.push(actual.paciente);
      actual = actual.next;
    }

    return resultado;
  }
}


class NodoHistorial {
  constructor(registro) {
    this.registro = registro;
    this.prev = null;
    this.next = null;
  }
}

class HistorialAtencion {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(registro) {
    const nuevoNodo = new NodoHistorial(registro);

    if (!this.head) {
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
    } else {
      nuevoNodo.prev = this.tail;
      this.tail.next = nuevoNodo;
      this.tail = nuevoNodo;
    }

    this.length++;
  }

  toArray() {
    const resultado = [];
    let actual = this.head;

    while (actual) {
      resultado.push(actual.registro);
      actual = actual.next;
    }

    return resultado;
  }

  toArrayReverse() {
    const resultado = [];
    let actual = this.tail;

    while (actual) {
      resultado.push(actual.registro);
      actual = actual.prev;
    }

    return resultado;
  }
}


class NodoMedico {
  constructor(medico) {
    this.medico = medico;
    this.next = null;
  }
}

class RotacionMedicos {
  constructor() {
    this.head = null;
    this.tail = null;
    this.actual = null;
    this.length = 0;
  }

  append(medico) {
    const nuevoNodo = new NodoMedico(medico);

    if (!this.head) {
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
      nuevoNodo.next = nuevoNodo;
      this.actual = nuevoNodo;
    } else {
      nuevoNodo.next = this.head;
      this.tail.next = nuevoNodo;
      this.tail = nuevoNodo;
    }

    this.length++;
  }

  rotar() {
    if (!this.actual) return null;

    this.actual = this.actual.next;
    return this.actual.medico;
  }

  medicoActual() {
    return this.actual ? this.actual.medico : null;
  }

  toArray() {
    const resultado = [];

    if (!this.head) return resultado;

    let actual = this.head;

    do {
      resultado.push(actual.medico);
      actual = actual.next;
    } while (actual !== this.head);

    return resultado;
  }
}


class NodoMiembro {
  constructor(miembro) {
    this.miembro = miembro;
    this.prev = null;
    this.next = null;
  }
}

class ComiteAdministrativo {
  constructor() {
    this.head = null;
    this.actual = null;
    this.length = 0;
  }

  append(miembro) {
    const nuevoNodo = new NodoMiembro(miembro);

    if (!this.head) {
      this.head = nuevoNodo;
      this.actual = nuevoNodo;

      nuevoNodo.next = nuevoNodo;
      nuevoNodo.prev = nuevoNodo;
    } else {
      const tail = this.head.prev;

      tail.next = nuevoNodo;
      nuevoNodo.prev = tail;

      nuevoNodo.next = this.head;
      this.head.prev = nuevoNodo;
    }

    this.length++;
  }

  siguiente() {
    if (!this.actual) return null;

    this.actual = this.actual.next;
    return this.actual.miembro;
  }

  anterior() {
    if (!this.actual) return null;

    this.actual = this.actual.prev;
    return this.actual.miembro;
  }

  miembroActual() {
    return this.actual ? this.actual.miembro : null;
  }

  toArray() {
    const resultado = [];

    if (!this.head) return resultado;

    let actual = this.head;

    do {
      resultado.push(actual.miembro);
      actual = actual.next;
    } while (actual !== this.head);

    return resultado;
  }
}


function App() {
  const listaPacientes = useRef(new ListaPacientes()).current;
  const historial = useRef(new HistorialAtencion()).current;
  const rotacionMedicos = useRef(new RotacionMedicos()).current;
  const comite = useRef(new ComiteAdministrativo()).current;

  const [pacientes, setPacientes] = useState([]);
  const [historialLista, setHistorialLista] = useState([]);
  const [medicoTurno, setMedicoTurno] = useState(null);
  const [medicosLista, setMedicosLista] = useState([]);
  const [comiteLista, setComiteLista] = useState([]);
  const [miembroActual, setMiembroActual] = useState(null);

  const [nombrePaciente, setNombrePaciente] = useState('');
  const [motivoPaciente, setMotivoPaciente] = useState('');

  const [historialInverso, setHistorialInverso] = useState(false);

 
  useEffect(() => {
    // Pacientes de ejemplo
    if (listaPacientes.length === 0) {
      [
        'Mariana Ospina',
        'Felipe Cárdenas',
        'Laura Vélez',
        'Andrés Muñoz'
      ].forEach((nombre, i) => {
        listaPacientes.append({
          id: i + 1,
          nombre,
          motivo: 'Consulta general'
        });
      });
    }

    setPacientes(listaPacientes.toArray());

    // Médicos de ejemplo
    if (rotacionMedicos.length === 0) {
      [
        'Dr. Iván Salcedo',
        'Dra. Camila Rojas',
        'Dr. Esteban Vargas',
        'Dra. Paula Escobar'
      ].forEach((nombre) => {
        rotacionMedicos.append({
          nombre,
          especialidad: 'Medicina General'
        });
      });
    }

    setMedicosLista(rotacionMedicos.toArray());
    setMedicoTurno(rotacionMedicos.medicoActual());

    // Miembros del comité de ejemplo
    if (comite.length === 0) {
      [
        'Rocío Herrera',
        'Tomás Aguirre',
        'Valentina Prieto',
        'Santiago Mejía'
      ].forEach((nombre) => {
        comite.append({
          nombre,
          cargo: 'Miembro'
        });
      });
    }

    setComiteLista(comite.toArray());
    setMiembroActual(comite.miembroActual());

    
  }, []);

 
  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevoMedico = rotacionMedicos.rotar();
      setMedicoTurno(nuevoMedico);
    }, 10000);

    return () => clearInterval(intervalo);

    
  }, []);

 
  const agregarPaciente = () => {
    if (!nombrePaciente.trim()) return;

    listaPacientes.append({
      id: Date.now(),
      nombre: nombrePaciente,
      motivo: motivoPaciente || 'Sin especificar',
    });

    setPacientes(listaPacientes.toArray());

    setNombrePaciente('');
    setMotivoPaciente('');
  };

 
  const atenderPaciente = () => {
    const atendido = listaPacientes.atenderPrimero();

    if (!atendido) return;

    historial.append({
      paciente: atendido.nombre,
      medico: medicoTurno
        ? medicoTurno.nombre
        : 'Sin médico asignado',
      fecha: new Date().toLocaleTimeString(),
    });

    setPacientes(listaPacientes.toArray());
    setHistorialLista(historial.toArray());
    setHistorialInverso(false);
  };


  const cambiarMedico = () => {
    const nuevoMedico = rotacionMedicos.rotar();
    setMedicoTurno(nuevoMedico);
  };


  const mostrarHistorialAnterior = () => {
    setHistorialInverso(true);
    setHistorialLista(historial.toArrayReverse());
  };

  const mostrarHistorialSiguiente = () => {
    setHistorialInverso(false);
    setHistorialLista(historial.toArray());
  };


  const siguienteMiembro = () => {
    const siguiente = comite.siguiente();
    setMiembroActual(siguiente);
  };

  const anteriorMiembro = () => {
    const anterior = comite.anterior();
    setMiembroActual(anterior);
  };


  return (
    <div className="app">

      <h1>Sistema de Turnos - Clinica</h1>

      {/* =====================================================
          1. PACIENTES
          ===================================================== */}
      <section className="card">
        <h2>1. Pacientes en espera (Lista Enlazada Simple)</h2>

        <div className="form-inline">
          <input
            placeholder="Nombre del paciente"
            value={nombrePaciente}
            onChange={(e) => setNombrePaciente(e.target.value)}
          />

          <input
            placeholder="Motivo de consulta"
            value={motivoPaciente}
            onChange={(e) => setMotivoPaciente(e.target.value)}
          />

          <button onClick={agregarPaciente}>
            Agregar paciente
          </button>

          <button onClick={atenderPaciente}>
            Atender paciente
          </button>
        </div>

        <ul>
          {pacientes.map((p) => (
            <li key={p.id}>
              {p.nombre} — {p.motivo}
            </li>
          ))}

          {pacientes.length === 0 && (
            <li className="vacio">
              No hay pacientes en espera
            </li>
          )}
        </ul>
      </section>

      {/* =====================================================
          2. HISTORIAL
          ===================================================== */}
      <section className="card">
        <h2>
          2. Historial de atencion (Lista Doblemente Enlazada)
        </h2>

        <div className="form-inline">
          <button onClick={mostrarHistorialSiguiente}>
            Recorrer hacia adelante
          </button>

          <button onClick={mostrarHistorialAnterior}>
            Recorrer hacia atrás
          </button>
        </div>

        <p className="hint">
          {historialInverso
            ? 'Mostrando historial desde el último paciente atendido.'
            : 'Mostrando historial desde el primer paciente atendido.'}
        </p>

        <ul>
          {historialLista.map((h, i) => (
            <li key={i}>
              {h.fecha} — {h.paciente} atendido por {h.medico}
            </li>
          ))}

          {historialLista.length === 0 && (
            <li className="vacio">
              Sin registros aún
            </li>
          )}
        </ul>
      </section>

      {/* =====================================================
          3. MEDICOS
          ===================================================== */}
      <section className="card">
        <h2>
          3. Rotacion de médicos (Lista Circular)
        </h2>

        <p>
          Medico de guardia actual:{' '}
          <strong>
            {medicoTurno ? medicoTurno.nombre : 'N/A'}
          </strong>
        </p>

        <button onClick={cambiarMedico}>
          Cambiar médico
        </button>

        <p className="hint">
          El medico de guardia cambiara  
          cada 10 segundos.
        </p>

        <ul>
          {medicosLista.map((m, i) => (
            <li key={i}>
              {m.nombre} — {m.especialidad}
            </li>
          ))}
        </ul>
      </section>

      {/* =====================================================
          4. COMITE ADMINISTRATIVO
          ===================================================== */}
      <section className="card">
        <h2>
          4. Comite administrativo
          (Lista Circular Doblemente Enlazada)
        </h2>

        <p>
          Miembro actual:{' '}
          <strong>
            {miembroActual
              ? miembroActual.nombre
              : 'N/A'}
          </strong>
        </p>

        <div className="form-inline">
          <button onClick={anteriorMiembro}>
            Anterior
          </button>

          <button onClick={siguienteMiembro}>
            Siguiente
          </button>
        </div>

        <ul>
          {comiteLista.map((c, i) => (
            <li key={i}>
              {c.nombre} — {c.cargo}
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

export default App;