import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Importando o CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@admin" && password === "1234") {
      navigate("/home");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Acesse</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <button  className="cadastro-button">
            Ainda não tenho uma conta
        </button>

      </div>
    {/* Rodapé */}
        <footer className="footer">
            <a href="https://enzomartinsdev.com" target="_blank" rel="noopener noreferrer">
            Desenvolvido por Enzo Martins
            </a>
        </footer>
    </div>
  );
}
