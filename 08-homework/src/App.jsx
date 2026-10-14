
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useNavigate
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import { TasksProvider } from "./contexts/TasksContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import { StackPage, QueuePage } from "./pages/Exercises";

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p className="loading">Cargando...</p>;

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

function PrivateLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      alert("No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1>Challenge 08</h1>
          <p>Ejercicios de React</p>
        </div>

        <div className="user-section">
          <span>
            Usuario: <strong>{user?.email}</strong>
          </span>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="navbar">
        <Link to="/pila">Pila de libros</Link>
        <Link to="/cola">Cola ATM</Link>
        <Link to="/tasks">Mis tareas</Link>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route
            element={
              <TasksProvider>
                <PrivateLayout />
              </TasksProvider>
            }
          >
            <Route path="/pila" element={<StackPage />} />
            <Route path="/cola" element={<QueuePage />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
