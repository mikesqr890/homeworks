import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/files" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/files");
    } catch (error) {
      console.error(error);

      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Gestor de archivos</h1>

        <h2>Iniciar sesión</h2>

        <p>
          Ingresa para administrar tus carpetas y archivos.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Correo electrónico</label>

          <input
            type="email"
            value={email}
            placeholder="correo@ejemplo.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        <p>
          ¿No tienes una cuenta?{" "}
          <Link to="/register">
            Registrarse
          </Link>
        </p>

      </div>
    </div>
  );
}