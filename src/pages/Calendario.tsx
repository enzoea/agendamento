import React, { useState } from "react";
import styles from "../styles/Calendario.module.css"; // Importando os estilos

const horariosDisponiveis = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const Calendario: React.FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const diasDoMes = Array.from({ length: 30 }, (_, i) => i + 1); // Criando 30 dias para o mês

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Agendamento</h1>
      <p className={styles.subtitle}>Selecione um dia para ver os horários disponíveis:</p>

      {/* Exibe os dias do mês */}
      <div className={styles.daysGrid}>
        {diasDoMes.map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaSelecionado(dia)}
            className={`${styles.dayButton} ${diaSelecionado === dia ? styles.selected : ""}`}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Exibe os horários disponíveis quando um dia for selecionado */}
      {diaSelecionado && (
        <div>
          <h2 className={styles.subtitle}>Horários disponíveis para o dia {diaSelecionado}</h2>
          <div className={styles.timeList}>
            {horariosDisponiveis.map((hora) => (
              <button key={hora} className={styles.timeButton} onClick={() => alert(`Você selecionou ${hora} no dia ${diaSelecionado}`)}>
                {hora}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
