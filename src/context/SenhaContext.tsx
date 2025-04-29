import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { estaDentroDoHorario, calcularTempoMedio, jaPassouHorario } from "../utils/timeUtils";

export type TipoSenha = "SP" | "SE" | "SG";
export type StatusSenha = "emitida" | "atendida" | "descartada";
export type TipoAgente = "AS" | "AA" | "AC";

export interface ISenha {
  id: string;
  tipo: TipoSenha;
  status: StatusSenha;
  chamadas: number;
  horaEmissao: string;
  horaAtendimento: string | null;
  tempoAtendimento: number | null;
  guiche: string | null;
}

interface ISenhaContext {
  senhas: ISenha[];
  gerarSenha: (tipo: TipoSenha) => ISenha | null;
  chamarProximaSenha: (guiche: string, agente: TipoAgente) => ISenha | null;
  marcarAtendido: (id: string) => void;
  ultimasChamadas: ISenha[];
  tempoMedio: number;
}

const SenhaContext = createContext<ISenhaContext>({} as ISenhaContext);

export const SenhaProvider = ({ children }: { children: ReactNode }) => {
  const [senhas, setSenhas] = useState<ISenha[]>([]);
  const [ultimasChamadas, setUltimasChamadas] = useState<ISenha[]>([]);
  const [tempoMedio, setTempoMedio] = useState<number>(0);

  // Descarte automático de senhas emitidas após o horário
  useEffect(() => {
    if (jaPassouHorario()) {
      const atualizadas = senhas.map((s) =>
        s.status === "emitida" ? { ...s, status: "descartada" as StatusSenha } : s
      );
      setSenhas(atualizadas);
    }
  }, [senhas]); // ✅ Agora observa senhas
  

  const gerarSenha = (tipo: TipoSenha): ISenha | null => {
    if (!estaDentroDoHorario()) {
      alert("Fora do horário de atendimento (07h às 17h). Senha não pode ser emitida.");
      return null;
    }

    const hoje = new Date();
    const YY = String(hoje.getFullYear()).slice(2);
    const MM = String(hoje.getMonth() + 1).padStart(2, "0");
    const DD = String(hoje.getDate()).padStart(2, "0");

    const numero = String(
      senhas.filter((s) => s.tipo === tipo).length + 1
    ).padStart(3, "0");
    const senhaFormatada = `${YY}${MM}${DD}-${tipo}${numero}`;

    const novaSenha: ISenha = {
      id: senhaFormatada,
      tipo,
      status: "emitida",
      chamadas: 0,
      horaEmissao: new Date().toLocaleTimeString(),
      horaAtendimento: null,
      tempoAtendimento: null,
      guiche: null,
    };

    setSenhas((prev) => [...prev, novaSenha]);
    return novaSenha;
  };

  const chamarProximaSenha = (guiche: string, agente: TipoAgente): ISenha | null => {
    const emitidas = senhas.filter((s) => s.status === "emitida");

    if (emitidas.length === 0) return null;

    let prioridade: TipoSenha[] = [];

    if (agente === "AS") {
      prioridade = ["SG"];
    } else if (agente === "AA") {
      prioridade = ["SE", "SG"];
    } else if (agente === "AC") {
      prioridade = ["SP", "SE", "SG"];
    }

    const senhaSelecionada =
      emitidas.find((s) => prioridade.includes(s.tipo)) ||
      emitidas[0];

    let tempoAtendimentoGerado = parseFloat((Math.random() * 5 + 1).toFixed(2));
    // Para senhas de exame (SE), 95% chance de ser 1 min, 5% de ser 5 min
    if (senhaSelecionada.tipo === "SE") {
      tempoAtendimentoGerado = Math.random() < 0.95 ? 1 : 5;
    }

    const senhaAtualizada: ISenha = {
      ...senhaSelecionada,
      chamadas: senhaSelecionada.chamadas + 1,
      status: (senhaSelecionada.chamadas + 1 >= 2 ? "descartada" : "atendida") as StatusSenha,
      horaAtendimento: senhaSelecionada.horaAtendimento || new Date().toLocaleTimeString(),
      tempoAtendimento: senhaSelecionada.tempoAtendimento || tempoAtendimentoGerado,
      guiche,
    };

    const atualizado = senhas.map((s) =>
      s.id === senhaSelecionada.id ? senhaAtualizada : s
    );

    setSenhas(atualizado);

    if (senhaAtualizada.status !== "descartada") {
      setUltimasChamadas((prev) => [senhaAtualizada, ...prev.slice(0, 4)]);
    }

    return senhaAtualizada;
  };

  const marcarAtendido = (id: string) => {
    const atualizado = senhas.map((s) =>
      s.id === id
        ? { ...s, status: "atendida" as StatusSenha }
        : s
    );
    setSenhas(atualizado);
  };

  useEffect(() => {
    const armazenadas = localStorage.getItem("senhas");
    if (armazenadas) {
      const lista: ISenha[] = JSON.parse(armazenadas).map((s: any) => ({
        ...s,
        status: s.status as StatusSenha,
      }));
      setSenhas(lista);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("senhas", JSON.stringify(senhas));
    const atendidas = senhas.filter((s) => s.status === "atendida" && s.tempoAtendimento !== null);
    setTempoMedio(calcularTempoMedio(atendidas));
  }, [senhas]);

  return (
    <SenhaContext.Provider value={{ senhas, gerarSenha, chamarProximaSenha, marcarAtendido, ultimasChamadas, tempoMedio }}>
      {children}
    </SenhaContext.Provider>
  );
};

export const useSenha = () => useContext(SenhaContext);
