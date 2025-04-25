import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import logo from "./assets/logo.webp";
import "./index.css";

const tiposSenha = {
  SP: { nome: "Prioritária", prefixo: "SP", tmBase: 15, variacao: 5 },
  SG: { nome: "Geral", prefixo: "SG", tmBase: 5, variacao: 3 },
  SE: { nome: "Exames", prefixo: "SE", tmBase: 1, variacao: 4 },
};

let contadorSenhas = { SP: 0, SG: 0, SE: 0 };
let historico = [];

const gerarSenha = (tipo) => {
  const hoje = new Date();
  const YY = String(hoje.getFullYear()).slice(-2);
  const MM = String(hoje.getMonth() + 1).padStart(2, "0");
  const DD = String(hoje.getDate()).padStart(2, "0");
  contadorSenhas[tipo]++;
  const SQ = String(contadorSenhas[tipo]).padStart(3, "0");
  return `${YY}${MM}${DD}-${tiposSenha[tipo].prefixo}${SQ}`;
};

const horarioPermitido = () => {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 7 && hora < 17;
};

const App = () => {
  const [filaSP, setFilaSP] = useState([]);
  const [filaSG, setFilaSG] = useState([]);
  const [filaSE, setFilaSE] = useState([]);
  const [ultimasChamadas, setUltimasChamadas] = useState([]);
  const [ultimaSenhaTipo, setUltimaSenhaTipo] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [relatorio, setRelatorio] = useState([]);

  const emitirSenha = (tipo) => {
    if (!horarioPermitido()) {
      setMensagem("Fora do horário de atendimento (7h às 17h)");
      return;
    }
    if (Math.random() < 0.05) {
      setMensagem("Senha descartada (não compareceu)");
      return;
    }
    const novaSenha = gerarSenha(tipo);
    const data = new Date();
    const registro = {
      senha: novaSenha,
      tipo,
      emitida: data.toLocaleTimeString(),
      atendida: "",
      guiche: "",
    };
    historico.push(registro);

    if (tipo === "SP") setFilaSP((prev) => [...prev, novaSenha]);
    if (tipo === "SG") setFilaSG((prev) => [...prev, novaSenha]);
    if (tipo === "SE") setFilaSE((prev) => [...prev, novaSenha]);
    setMensagem(`Senha ${novaSenha} emitida para ${tiposSenha[tipo].nome}`);
  };

  const chamarProximo = () => {
    if (!horarioPermitido()) {
      setMensagem("Fora do horário de atendimento (7h às 17h)");
      return;
    }

    let senhaChamada = null;
    let tipo = "";

    if (ultimaSenhaTipo !== "SP" && filaSP.length > 0) {
      senhaChamada = filaSP.shift();
      setFilaSP([...filaSP]);
      tipo = "SP";
    } else if ((filaSE.length > 0 || filaSG.length > 0)) {
      if (filaSE.length > 0) {
        senhaChamada = filaSE.shift();
        setFilaSE([...filaSE]);
        tipo = "SE";
      } else {
        senhaChamada = filaSG.shift();
        setFilaSG([...filaSG]);
        tipo = "SG";
      }
    } else {
      setMensagem("Nenhuma senha disponível na fila.");
      return;
    }

    const atendimento = historico.find((s) => s.senha === senhaChamada);
    if (atendimento) {
      atendimento.atendida = new Date().toLocaleTimeString();
      atendimento.guiche = `Guichê ${Math.floor(Math.random() * 5 + 1)}`;
    }

    setUltimasChamadas((prev) => {
      const atualizadas = [senhaChamada, ...prev];
      return atualizadas.slice(0, 5);
    });
    setUltimaSenhaTipo(tipo);
    setRelatorio([...historico]);
    setMensagem(`Chamando ${senhaChamada}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 text-gray-800 p-6 space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex justify-center">
        <img src={logo} alt="logo" className="h-20 mb-4" />
      </div>
      <h1 className="text-3xl font-bold text-center text-blue-800">Sistema de Atendimento</h1>
      <p className="text-center text-sm text-gray-600">Priorize, atenda e acompanhe.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button onClick={() => emitirSenha("SP")} className="bg-red-600 hover:bg-red-700">Prioritária</Button>
        <Button onClick={() => emitirSenha("SE")} className="bg-blue-600 hover:bg-blue-700">Exames</Button>
        <Button onClick={() => emitirSenha("SG")} className="bg-gray-700 hover:bg-gray-800">Geral</Button>
      </div>

      <Button onClick={chamarProximo} className="w-full bg-blue-800 hover:bg-blue-900">Chamar Próximo</Button>

      {mensagem && <p className="text-center text-blue-700 font-medium">{mensagem}</p>}

      <Card>
        <CardContent className="pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Últimas Senhas Chamadas</h2>
          <ul className="space-y-1 text-lg">
            {ultimasChamadas.map((senha, idx) => (
              <li key={idx}>
              <span role="img" aria-label="ticket">🎟️</span> {senha}
            </li>            
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Relatório Diário (simulado)</h2>
          <ul className="text-sm max-h-64 overflow-y-auto space-y-1">
            {relatorio.map((item, idx) => (
              <li key={idx} className="border-b pb-1">
                <strong>{item.senha}</strong> ({item.tipo}) - Emitida: {item.emitida} {item.atendida && `| Atendida: ${item.atendida} | ${item.guiche}`}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
