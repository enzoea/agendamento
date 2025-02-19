import React from "react";
import styles from "../styles/Menu.module.css";
import { useNavigate } from "react-router-dom";

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Menu</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
    </div>
  );
};

export default Menu;
