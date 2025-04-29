import React, { createContext, useContext, useState, ReactNode } from "react";

type TipoSenha = "SP" | "SE" | "SG";
type StatusSenha = "emitida" | "atendida" | "descartada";

interface ISenha {
  id: string;
  tipo: TipoSenha;
  status: StatusSenha;
  chamadas: number;
  horaEmissao: string;
  horaAtendimento: string | null;
  tempoAtendimento: string | null;
  guiche: string | null;
}

interface ISenhaContext {
  senhas: ISenha[];
  gerarSenha: (tipo: TipoSenha) => void;
  chamarProximaSenha: (guiche: string) => ISenha | null;
  marcarAtendido: (id: string) => void;
}

const SenhaContext = createContext<ISenhaContext>({} as ISenhaContext);

export const SenhaProvider = ({ children }: { children: ReactNode }) => {
  const [senhas, setSenhas] = useState<ISenha[]>([]);

  const gerarSenha = (tipo: TipoSenha) => {
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

  const chamarProximaSenha = (guiche: string): ISenha | null => {
    const proxima = senhas.find((s) => s.status === "emitida");
  
    if (proxima) {
      const atualizado = senhas.map((s) =>
        s.id === proxima.id
          ? {
              ...s,
              chamadas: s.chamadas + 1,
              status: (s.chamadas + 1 >= 2 ? "descartada" : "emitida") as StatusSenha,
              horaAtendimento: s.chamadas === 0 ? new Date().toLocaleTimeString() : s.horaAtendimento,
              tempoAtendimento: s.chamadas === 0 ? (Math.random() * 5 + 1).toFixed(2) : s.tempoAtendimento,
              guiche: s.chamadas === 0 ? guiche : s.guiche,
            }
          : s
      );
  
      setSenhas(atualizado);
      return proxima;
    }
  
    return null;
  };

  const marcarAtendido = (id: string) => {
    const atualizado = senhas.map((s) =>
      s.id === id
        ? { ...s, status: "atendida" as StatusSenha }
        : s
    );
    setSenhas(atualizado);
  };

  return (
    <SenhaContext.Provider
      value={{ senhas, gerarSenha, chamarProximaSenha, marcarAtendido }}
    >
      {children}
    </SenhaContext.Provider>
  );
};

export const useSenha = () => useContext(SenhaContext);
