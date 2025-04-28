import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSenha } from "../context/SenhaContext";
import { Button } from "../components/Button";
import logo from "../assets/logo.webp";

const PainelAtendente = () => {
  const navigate = useNavigate();
  const { senhas, chamarProximaSenha } = useSenha();
  const [ultimaChamada, setUltimaChamada] = useState(null);

  const handleChamar = () => {
    const proxima = chamarProximaSenha(`Guichê ${Math.floor(Math.random() * 5 + 1)}`);
    if (proxima) setUltimaChamada(proxima);
  };

  const atendidas = senhas.filter((s) => s.status === 'atendida' || s.chamadas >= 2);

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />

      <h1 className="titulo">Painel do Atendente</h1>

      <Button onClick={handleChamar} className="botao-cliente">
        Chamar Próxima Senha
      </Button>

      {ultimaChamada && (
        <div className="mensagem">
          📢 Chamando {ultimaChamada.id} no {ultimaChamada.guiche}
        </div>
      )}

      <h2 className="subtitulo">Relatório de Atendimentos</h2>

      <div className="relatorio">
        {atendidas.length > 0 ? (
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
                  <td>{s.horaAtendimento || '-'}</td>
                  <td>{s.guiche || '-'}</td>
                  <td>{s.tempoAtendimento || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="subtitulo">Nenhuma senha atendida ainda.</p>
        )}
      </div>

      <Button onClick={() => navigate("/")} className="botao-voltar">
        Voltar
      </Button>
    </div>
  );
};

export default PainelAtendente;
