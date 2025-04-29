import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { estaDentroDoHorario, calcularTempoMedio } from "../utils/timeUtils";

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
  gerarSenha: (tipo: TipoSenha) => void;
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

  const gerarSenha = (tipo: TipoSenha) => {
    if (!estaDentroDoHorario()) {
      alert("Fora do horário de atendimento (07h às 17h). Senha não pode ser emitida.");
      return;
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

    const atualizado = senhas.map((s) =>
      s.id === senhaSelecionada.id
        ? {
            ...s,
            chamadas: s.chamadas + 1,
            status: (s.chamadas + 1 >= 2 ? "descartada" : "atendida") as StatusSenha,
            horaAtendimento: s.horaAtendimento || new Date().toLocaleTimeString(),
            tempoAtendimento: s.tempoAtendimento || parseFloat((Math.random() * 5 + 1).toFixed(2)),
            guiche,
          }
        : s
    );

    setSenhas(atualizado);

    if (senhaSelecionada.status !== "descartada") {
      setUltimasChamadas((prev) => [senhaSelecionada, ...prev.slice(0, 4)]);
    }

    return senhaSelecionada;
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
        status: s.status as StatusSenha, // <-- força o tipo StatusSenha
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
