import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSenha } from "../context/SenhaContext";
import { Button } from "../components/Button";
import logo from "../assets/logo.webp";

const EmissaoSenha = () => {
  const navigate = useNavigate();
  const { gerarSenha } = useSenha();
  const [ultimaSenha, setUltimaSenha] = useState(null);

  const handleEmitir = (tipo) => {
    gerarSenha(tipo);
    setUltimaSenha(tipo);
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />

      <h1 className="titulo">Emissão de Senha</h1>
      <p className="subtitulo">Escolha o tipo de atendimento:</p>

      <div className="botoes">
        <Button onClick={() => handleEmitir("SP")} className="botao-cliente">
          Prioritária
        </Button>
        <Button onClick={() => handleEmitir("SE")} className="botao-cliente">
          Exames
        </Button>
        <Button onClick={() => handleEmitir("SG")} className="botao-cliente">
          Geral
        </Button>
      </div>

      {ultimaSenha && (
        <div className="mensagem">
          🎟️ Senha de {ultimaSenha} emitida com sucesso!
        </div>
      )}

      <Button onClick={() => navigate("/")} className="botao-voltar">
        Voltar
      </Button>
    </div>
  );
};

export default EmissaoSenha;
