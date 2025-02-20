import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        senha: senha,
      });

      if (response.status === 200) {
        setSucesso("Login realizado com sucesso!");
        localStorage.setItem("token", response.data.token);
        navigate("/menu");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.error || "Erro ao fazer login");
      } else {
        setErro("Erro inesperado");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      {erro && <p className={styles.error}>{erro}</p>}
      {sucesso && <p className={styles.success}>{sucesso}</p>}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha:</label>
          <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button type="submit" className={styles.submitButton}>Entrar</button>
      </form>
      <button onClick={() => navigate("/cadastro")} className={styles.registerButton}>Cadastrar</button>
    </div>
  );
};

export default Login;