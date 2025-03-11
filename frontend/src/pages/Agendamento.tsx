import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [disponibilidade, setDisponibilidade] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [usuarioId, setUsuarioId] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:3000/profissionais").then((res) => {
      setProfissionais(res.data);
    });
  }, []);

  useEffect(() => {
    if (profissionalSelecionado && dataSelecionada) {
      axios
        .get("http://localhost:3000/horarios-ocupados", {
          params: { data_agendamento: dataSelecionada },
        })
        .then((res) => {
          setDisponibilidade(res.data);
        });
    }
  }, [profissionalSelecionado, dataSelecionada]);

  const agendarHorario = async () => {
    try {
      await axios.post("http://localhost:3000/calendario", {
        usuarios_id: usuarioId,
        data_agendamento: dataSelecionada,
        hora: horaSelecionada,
      });
      alert("Agendamento realizado com sucesso!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao agendar");
    }
  };

  return (
    <div>
      <h2>Agendamento</h2>
      <label>Profissional:</label>
      <select onChange={(e) => setProfissionalSelecionado(e.target.value)}>
        <option value="">Selecione</option>
        {profissionais.map((prof) => (
          <option key={prof.id} value={prof.id}>
            {prof.nome}
          </option>
        ))}
      </select>

      <label>Data:</label>
      <input
        type="date"
        value={dataSelecionada}
        onChange={(e) => setDataSelecionada(e.target.value)}
      />

      <label>Horário:</label>
      <select onChange={(e) => setHoraSelecionada(e.target.value)}>
        <option value="">Selecione</option>
        {disponibilidade.map((hora, index) => (
          <option key={index} value={hora}>
            {hora}
          </option>
        ))}
      </select>

      <button onClick={agendarHorario}>Agendar</button>
    </div>
  );
};

export default App;
