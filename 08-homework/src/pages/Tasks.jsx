
import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function Tasks() {
  const {
    tasks,
    ready,
    addTask,
    editTask,
    deleteTask,
    toggleTask
  } = useTasks();

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Escribe el nombre de la tarea.");
      return;
    }

    if (editingId) {
      editTask(editingId, cleanTitle);
      setEditingId(null);
    } else {
      addTask(cleanTitle);
    }

    setTitle("");
    setError("");
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle("");
    setError("");
  };

  if (!ready) return <p>Cargando tareas...</p>;

  return (
    <section className="exercise tasks-page">
      <div className="exercise-title">
        <h2>Mis tareas</h2>
        <span>{tasks.filter((task) => !task.done).length} pendientes</span>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          aria-label="Nombre de la tarea"
        />

        <button type="submit">
          {editingId ? "Guardar cambios" : "Agregar tarea"}
        </button>

        {editingId && (
          <button
            type="button"
            className="secondary-button"
            onClick={cancelEditing}
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>Aún no tienes tareas. ¡Agrega la primera!</p>
        ) : (
          tasks.map((task) => (
            <article className="task-item" key={task.id}>
              <label className={task.done ? "task-done" : ""}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>

              <div className="task-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => startEditing(task)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => {
                    deleteTask(task.id);
                    if (editingId === task.id) cancelEditing();
                  }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
