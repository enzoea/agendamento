import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🏥 Bem-vindo ao Sistema de Agendamento!</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
        Sair
      </button>
    </div>
  );
}
