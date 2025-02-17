import React, { useState } from "react";
import styles from "../styles/Calendario.module.css"; // Importando os estilos

const horariosDisponiveis = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];
const horariosOcupados = ["10:00", "14:00"]; // Exemplo de horários ocupados

const Calendario: React.FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const [mes, setMes] = useState<number>(new Date().getMonth()); // Mês atual
  const [ano, setAno] = useState<number>(new Date().getFullYear()); // Ano atual

  const diasDoMes = Array.from({ length: new Date(ano, mes + 1, 0).getDate() }, (_, i) => i + 1); // Dias do mês

  // Função para avançar para o próximo mês
  const proximoMes = () => {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  // Função para voltar para o mês anterior
  const mesAnterior = () => {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };

  // Verificar se o horário está ocupado
  const isHorarioOcupado = (hora: string) => horariosOcupados.includes(hora);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Agendamento</h1>
      <p className={styles.subtitle}>Selecione um dia para ver os horários disponíveis:</p>

      <div className={styles.nav}>
        <button onClick={mesAnterior} className={styles.navButton}>{"<"}</button>
        <h2 className={styles.monthTitle}>{new Date(ano, mes).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={proximoMes} className={styles.navButton}>{">"}</button>
      </div>

      {/* Exibe o calendário com os dias do mês */}
      <div className={styles.calendarGrid}>
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
              <button
                key={hora}
                className={`${styles.timeButton} ${isHorarioOcupado(hora) ? styles.occupied : ""}`}
                onClick={() => alert(`Você selecionou ${hora} no dia ${diaSelecionado}`)}
                disabled={isHorarioOcupado(hora)} // Desabilita o botão se o horário estiver ocupado
              >
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
