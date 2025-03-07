import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Calendario.module.css";

const horariosDisponiveis = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const Calendario: React.FC = () => {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const [mes, setMes] = useState<number>(new Date().getMonth());
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [profissionais, setProfissionais] = useState<{ id: number; nome: string }[]>([]);
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

  const proximoMes = () => {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  const mesAnterior = () => {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };

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

  const handleDiaSelecionado = (dia: number) => {
    setDiaSelecionado(dia);
    if (profissionalSelecionado) {
      const data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      obterHorariosOcupados(data, profissionalSelecionado);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Agendamento</h1>
      <p className={styles.subtitle}>Selecione um profissional e um dia para ver os horários disponíveis:</p>

      <select onChange={(e) => setProfissionalSelecionado(e.target.value)} className={styles.select}>
        <option value="">Selecione um profissional</option>
        {profissionais.map((profissional) => (
          <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
        ))}
      </select>

      <div className={styles.nav}>
        <button onClick={mesAnterior} className={styles.navButton}>{"<"}</button>
        <h2 className={styles.monthTitle}>{new Date(ano, mes).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={proximoMes} className={styles.navButton}>{">"}</button>
      </div>

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

      {diaSelecionado && profissionalSelecionado && (
        <div>
          <h2 className={styles.subtitle}>Horários disponíveis para o dia {diaSelecionado}</h2>
          <div className={styles.timeList}>
            {horariosDisponiveis.map((hora) => (
              <button
                key={hora}
                className={`${styles.timeButton} ${isHorarioOcupado(hora) ? styles.occupied : ""}`}
                onClick={() => setHoraSelecionada(hora)}
                disabled={isHorarioOcupado(hora)}
              >
                {hora}
              </button>
            ))}
          </div>

          {horaSelecionada && (
            <div>
              <button onClick={agendar} className={styles.scheduleButton}>
                Agendar para {horaSelecionada}
              </button>
            </div>
          )}
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Calendario;
