import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Calendario.module.css";

interface Profissional {
  id: number;
  nome: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Agendamento {
  id: number;
  profissional_id: number;
  data: string;
  hora: string;
}

const horariosDisponiveis = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const Calendario: React.FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mes, setMes] = useState<number>(new Date().getMonth());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profissionais");
        setProfissionais(response.data);
      } catch (error) {
        console.error("Erro ao buscar profissionais", error);
      }
    };
    fetchProfissionais();
  }, []);

  const diasDoMes = Array.from({ length: new Date(ano, mes + 1, 0).getDate() }, (_, i) => i + 1);

  const obterHorariosOcupados = async (data: string, profissionalId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/horarios-ocupados?data=${data}&profissionalId=${profissionalId}`);
      setHorariosOcupados(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários ocupados", error);
    }
  };

  const isHorarioOcupado = (hora: string) => horariosOcupados.includes(hora);

  const agendar = async () => {
    if (!horaSelecionada || !diaSelecionado || !profissionalSelecionado) {
      setMessage("Selecione um profissional, dia e horário para agendar.");
      return;
    }

    try {
      const dia_mes = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaSelecionado).padStart(2, '0')}`;

      await axios.post("http://localhost:3000/calendario", {
        profissional_id: profissionalSelecionado,
        dia_mes,
        hora: horaSelecionada,
        descricao: `Agendamento com o profissional ${profissionalSelecionado} no dia ${diaSelecionado} às ${horaSelecionada}`,
      });

      setMessage("Agendamento realizado com sucesso!");
      obterHorariosOcupados(dia_mes, profissionalSelecionado);
    } catch {
      setMessage("Erro ao agendar. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Agendamento</h1>
      <select onChange={(e) => setProfissionalSelecionado(e.target.value)} className={styles.select}>
        <option value="">Selecione um profissional</option>
        {profissionais.map((profissional) => (
          <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
        ))}
      </select>
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
      {diaSelecionado && profissionalSelecionado && (
        <div>
          <h2>Horários disponíveis</h2>
          <div>
            {horariosDisponiveis.map((hora) => (
              <button
                key={hora}
                className={isHorarioOcupado(hora) ? styles.occupied : styles.timeButton}
                onClick={() => setHoraSelecionada(hora)}
                disabled={isHorarioOcupado(hora)}
              >
                {hora}
              </button>
            ))}
          </div>
          {horaSelecionada && (
            <button onClick={agendar} className={styles.scheduleButton}>Agendar</button>
          )}
        </div>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Calendario;