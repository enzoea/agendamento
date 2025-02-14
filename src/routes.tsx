import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Calendario from "./pages/Calendario";
import Cadastro from "./pages/Cadastro";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendario" element={<Calendario/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
      </Routes>
    </Router>
  );
}
