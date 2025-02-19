import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Cadastro.module.css";

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name: nome,
        email: email,
        password: senha,
      });

      console.log(response);  // Log para verificar a resposta do servidor
      if (response.status === 201) {
        setSucesso("Cadastro realizado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);  // Log para verificar o erro completo
        setErro(error.response?.data?.error || "Erro ao fazer o cadastro");
      } else {
        setErro("Erro inesperado");
      }
    }
};


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      {erro && <p className={styles.error}>{erro}</p>}
      {sucesso && <p className={styles.success}>{sucesso}</p>}
      <form onSubmit={handleCadastro} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha:</label>
          <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Senha:</label>
          <input type="password" id="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
        </div>
        <button type="submit" className={styles.submitButton}>Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
