
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (loading) return <p className="loading">Comprobando sesión...</p>;
  if (user) return <Navigate to="/pila" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      await login(email, password);
      navigate("/pila", { replace: true });
    } catch (error) {
      setError(
        error.code === "auth/invalid-credential"
          ? "Correo o contraseña incorrectos."
          : error.code === "auth/too-many-requests"
          ? "Demasiados intentos. Intenta más tarde."
          : "No se pudo iniciar sesión. Verifica tus datos."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Challenge 08</h1>
        <h2>Iniciar sesión</h2>
        <p>Ingresa a tu cuenta</p>

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={sending}>
          {sending ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
