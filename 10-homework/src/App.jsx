
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [tareas, setTareas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    obtenerUsuario()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const usuario = session?.user ?? null
        setUser(usuario)

        if (usuario) {
          cargarTareas()
        } else {
          setTareas([])
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function obtenerUsuario() {
    const { data } = await supabase.auth.getUser()

    setUser(data.user)

    if (data.user) {
      cargarTareas()
    }
  }

  async function registrarse() {
    setMensaje('')

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMensaje(error.message)
      return
    }

    setMensaje('Registro realizado correctamente. Revisa tu correo si es necesario.')
  }

  async function iniciarSesion() {
    setMensaje('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMensaje(error.message)
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    setUser(null)
    setTareas([])
  }

  async function cargarTareas() {
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMensaje(error.message)
      return
    }

    setTareas(data)
  }

  // CREAR TAREA
  async function crearTarea() {
    if (!titulo.trim()) {
      setMensaje('Escribe un título para la tarea.')
      return
    }

    const { error } = await supabase
      .from('tareas')
      .insert({
        titulo: titulo.trim(),
        user_id: user.id
      })

    if (error) {
      setMensaje(error.message)
      return
    }

    setTitulo('')
    setMensaje('')
    cargarTareas()
  }

  // COMPLETAR O MARCAR COMO PENDIENTE
  async function cambiarEstado(tarea) {
    const { data, error } = await supabase
      .from('tareas')
      .update({
        completada: !tarea.completada
      })
      .eq('id', tarea.id)
      .select()

    if (error) {
      setMensaje(error.message)
      return
    }

    if (!data || data.length === 0) {
      setMensaje('No se pudo actualizar la tarea. Revisa los permisos RLS.')
      return
    }

    setMensaje('')
    cargarTareas()
  }

  // EDITAR TAREA
  async function editarTarea(tarea) {
    const nuevoTitulo = prompt(
      'Escribe el nuevo título:',
      tarea.titulo
    )

    if (nuevoTitulo === null || !nuevoTitulo.trim()) {
      return
    }

    const { data, error } = await supabase
      .from('tareas')
      .update({
        titulo: nuevoTitulo.trim()
      })
      .eq('id', tarea.id)
      .select()

    if (error) {
      setMensaje(error.message)
      return
    }

    if (!data || data.length === 0) {
      setMensaje('No se pudo editar la tarea. Revisa los permisos RLS.')
      return
    }

    setMensaje('')
    cargarTareas()
  }

  // ELIMINAR TAREA
  async function eliminarTarea(id) {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar esta tarea?'
    )

    if (!confirmar) {
      return
    }

    const { data, error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      setMensaje(error.message)
      return
    }

    if (!data || data.length === 0) {
      setMensaje('No se pudo eliminar la tarea. Revisa los permisos RLS.')
      return
    }

    setMensaje('')
    cargarTareas()
  }

  // PANTALLA DE INICIO DE SESIÓN
  if (!user) {
    return (
      <div>
        <h1>Supabase Auth</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={registrarse}>
          Registrarse
        </button>

        <button onClick={iniciarSesion}>
          Iniciar sesión
        </button>

        {mensaje && <p>{mensaje}</p>}
      </div>
    )
  }

  // PANTALLA DE TAREAS
  return (
    <div>
      <h1>Mis tareas</h1>

      <p>Usuario: {user.email}</p>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>

      <hr />

      <input
        type="text"
        placeholder="Nueva tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <button onClick={crearTarea}>
        Agregar tarea
      </button>

      {mensaje && <p>{mensaje}</p>}

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            <span
              style={{
                textDecoration: tarea.completada
                  ? 'line-through'
                  : 'none'
              }}
            >
              {tarea.titulo}
            </span>

            <button onClick={() => cambiarEstado(tarea)}>
              {tarea.completada ? 'Pendiente' : 'Completar'}
            </button>

            <button onClick={() => editarTarea(tarea)}>
              Editar
            </button>

            <button onClick={() => eliminarTarea(tarea.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
