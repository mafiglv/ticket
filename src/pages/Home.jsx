import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import logo from "../assets/logo.webp";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Logo */}
      <img src={logo} alt="Logo" className="logo" />

      {/* Título */}
      <h1 className="titulo">
        Sistema de Atendimento
      </h1>
      <p className="subtitulo">
        Escolha uma opção para continuar
      </p>

      {/* Botões */}
      <div className="botoes">
        <Button onClick={() => navigate("/emissao")} className="botao-cliente">
          Sou Cliente
        </Button>
        <Button onClick={() => navigate("/painel")} className="botao-atendente">
          Sou Atendente
        </Button>
      </div>
    </div>
  );
};

export default Home;
