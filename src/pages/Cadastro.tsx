import React, { useState } from "react";
import styles from "../styles/Cadastro.module.css";

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    // Simulação de cadastro (em um sistema real, aqui você faria o envio ao backend)
    alert("Cadastro realizado com sucesso!");
    // Redirecionamento ou ações após cadastro
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      {erro && <p className={styles.error}>{erro}</p>}
      <form onSubmit={handleCadastro} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmarSenha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
