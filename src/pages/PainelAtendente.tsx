import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSenha } from "../context/SenhaContext";
import { Button } from "../components/Button";
import logo from "../assets/logo.webp";

const PainelAtendente: React.FC = () => {
  const navigate = useNavigate();
  const { senhas, chamarProximaSenha, marcarAtendido } = useSenha();
  const [senhaAtual, setSenhaAtual] = useState<string | null>(null);

  const handleChamar = () => {
    const proxima = chamarProximaSenha(`Guichê ${Math.floor(Math.random() * 5 + 1)}`);
    if (proxima) setSenhaAtual(proxima.id);
  };

  const handleAtendido = () => {
    if (senhaAtual) {
      marcarAtendido(senhaAtual);
      setSenhaAtual(null);
    }
  };

  const atendidas = senhas.filter((s) => s.status === "atendida");

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="titulo">Painel do Atendente</h1>
      {senhaAtual ? (
        <>
          <div className="mensagem">
            Chamando senha {senhaAtual}
          </div>
          <div className="botoes">
            <Button onClick={handleAtendido} className="botao-cliente">Cliente Atendido</Button>
            <Button onClick={handleChamar} className="botao-voltar">Cliente Não Compareceu</Button>
          </div>
        </>
      ) : (
        <Button onClick={handleChamar} className="botao-cliente">
          Chamar Próxima Senha
        </Button>
      )}
      <h2 className="subtitulo">Relatório de Atendimentos</h2>
      <div className="relatorio">
        <table className="tabela">
          <thead>
            <tr>
              <th>Senha</th>
              <th>Tipo</th>
              <th>Emissão</th>
              <th>Atendimento</th>
              <th>Guichê</th>
              <th>Tempo (min)</th>
            </tr>
          </thead>
          <tbody>
            {atendidas.map((s, idx) => (
              <tr key={idx}>
                <td>{s.id}</td>
                <td>{s.tipo}</td>
                <td>{s.horaEmissao}</td>
                <td>{s.horaAtendimento || "-"}</td>
                <td>{s.guiche || "-"}</td>
                <td>{s.tempoAtendimento || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={() => navigate("/")} className="botao-voltar">Voltar</Button>
    </div>
  );
};

export default PainelAtendente;
