import React, { useState,  } from "react";
import axios from "axios"; // Importando axios para chamadas HTTP
import styles from "../styles/Calendario.module.css"; // Importando os estilos

const horariosDisponiveis = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const Calendario: React.FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const [mes, setMes] = useState<number>(new Date().getMonth()); // Mês atual
  const [ano, setAno] = useState<number>(new Date().getFullYear()); // Ano atual
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null); // Estado para armazenar a hora selecionada
  const [message, setMessage] = useState<string>(""); // Mensagem de sucesso ou erro ao agendar
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]); // Horários ocupados

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

  // Função para obter os horários ocupados para o dia selecionado
  const obterHorariosOcupados = async (data: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/horarios-ocupados?data=${data}`);
      setHorariosOcupados(response.data);
    } catch (error) {
      console.error('Erro ao buscar horários ocupados', error);
    }
  };

  // Verificar se o horário está ocupado
  const isHorarioOcupado = (hora: string) => horariosOcupados.includes(hora);

  // Função para fazer o agendamento
  const agendar = async () => {
    if (!horaSelecionada || !diaSelecionado) {
      setMessage("Selecione um horário para agendar.");
      return;
    }

    try {
      const usuario_id = 1; // Exemplo, você pode pegar o ID do usuário logado aqui
      const dia_mes = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaSelecionado).padStart(2, '0')}`;

      await axios.post("http://localhost:3000/calendario", {
        usuario_id,
        dia_mes,
        hora: horaSelecionada,
        descricao: `Agendamento para o dia ${diaSelecionado} às ${horaSelecionada}`,
      });

      setMessage(`Agendamento realizado com sucesso!`);
    } catch {
      setMessage("Erro ao agendar. Tente novamente.");
    }
  };

  // Função para lidar com o dia selecionado
  const handleDiaSelecionado = (dia: number) => {
    setDiaSelecionado(dia);
    const data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    obterHorariosOcupados(data);
  };

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
            onClick={() => handleDiaSelecionado(dia)}
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
                onClick={() => setHoraSelecionada(hora)}
                disabled={isHorarioOcupado(hora)} // Desabilita o botão se o horário estiver ocupado
              >
                {hora}
              </button>
            ))}
          </div>

          {/* Exibe o botão para agendar */}
          {horaSelecionada && (
            <div>
              <button onClick={agendar} className={styles.scheduleButton}>
                Agendar para {horaSelecionada}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Exibe a mensagem de sucesso ou erro */}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Calendario;
