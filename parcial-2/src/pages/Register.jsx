import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(email, password);

      navigate("/files");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo no es válido.");
      } else {
        setError("No se pudo crear la cuenta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Gestor de archivos</h1>

        <h2>Crear cuenta</h2>

        <p>
          Regístrate para comenzar a utilizar el sistema.
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
            placeholder="Mínimo 6 caracteres"
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
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
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

        </form>

        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/">
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
}