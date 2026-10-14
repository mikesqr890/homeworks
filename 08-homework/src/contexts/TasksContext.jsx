
import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);

    if (!user) {
      setTasks([]);
      setReady(true);
      return;
    }

    try {
      const saved = localStorage.getItem(`tasks-${user.uid}`);
      setTasks(saved ? JSON.parse(saved) : []);
    } catch {
      setTasks([]);
    }

    setReady(true);
  }, [user?.uid]);

  useEffect(() => {
    if (!ready || !user) return;

    localStorage.setItem(
      `tasks-${user.uid}`,
      JSON.stringify(tasks)
    );
  }, [tasks, user?.uid, ready]);

  const addTask = (title) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      done: false
    };

    setTasks((current) => [...current, newTask]);
  };

  const editTask = (id, title) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, title } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        ready,
        addTask,
        editTask,
        deleteTask,
        toggleTask
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
