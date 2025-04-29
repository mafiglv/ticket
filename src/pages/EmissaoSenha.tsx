import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSenha } from "../context/SenhaContext";
import { Button } from "../components/Button";
import logo from "../assets/logo.webp";

const EmissaoSenha: React.FC = () => {
  const navigate = useNavigate();
  const { gerarSenha } = useSenha();
  const [ultimaSenha, setUltimaSenha] = useState<string | null>(null);
  const [tipoUltimaSenha, setTipoUltimaSenha] = useState<string | null>(null);

  const handleEmitir = (tipo: "SP" | "SE" | "SG") => {
    const novaSenha = gerarSenha(tipo);
    if (novaSenha) {
      setUltimaSenha(novaSenha.id);         
      setTipoUltimaSenha(tipo);             
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="titulo">Emitir Senha</h1>
      <p className="subtitulo">Escolha o tipo de atendimento:</p>

      <div className="botoes">
        <Button onClick={() => handleEmitir("SP")} className="botao-cliente">Prioritária</Button>
        <Button onClick={() => handleEmitir("SE")} className="botao-cliente">Exames</Button>
        <Button onClick={() => handleEmitir("SG")} className="botao-cliente">Geral</Button>
      </div>

      {ultimaSenha && tipoUltimaSenha && (
        <div className="mensagem">
          🎟️ Senha <strong>{ultimaSenha}</strong> de tipo <strong>{tipoUltimaSenha}</strong> emitida com sucesso!
        </div>
      )}

      <Button onClick={() => navigate("/")} className="botao-voltar">Voltar</Button>
    </div>
  );
};

export default EmissaoSenha;
