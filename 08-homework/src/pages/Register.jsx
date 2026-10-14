
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (loading) return <p className="loading">Comprobando sesión...</p>;
  if (user) return <Navigate to="/pila" replace />;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      await register(email, password);
      navigate("/pila", { replace: true });
    } catch (error) {
      setError(
        error.code === "auth/email-already-in-use"
          ? "Este correo ya está registrado."
          : error.code === "auth/weak-password"
          ? "La contraseña debe tener al menos 6 caracteres."
          : error.code === "auth/invalid-email"
          ? "El correo electrónico no es válido."
          : "No se pudo crear la cuenta. Intenta de nuevo."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h1>Challenge 08</h1>
        <h2>Crear cuenta</h2>
        <p>Regístrate para continuar</p>

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
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={sending}>
          {sending ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
