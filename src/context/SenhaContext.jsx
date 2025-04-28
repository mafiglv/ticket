import React, { createContext, useContext, useState } from 'react';

const SenhaContext = createContext();

export const SenhaProvider = ({ children }) => {
  const [senhas, setSenhas] = useState([]);
  const [contador, setContador] = useState({ SP: 0, SE: 0, SG: 0 });

  const gerarSenha = (tipo) => {
    const hoje = new Date();
    const YY = String(hoje.getFullYear()).slice(2);
    const MM = String(hoje.getMonth() + 1).padStart(2, '0');
    const DD = String(hoje.getDate()).padStart(2, '0');

    setContador((prev) => {
      const novoContador = { ...prev, [tipo]: prev[tipo] + 1 };
      const numero = String(novoContador[tipo]).padStart(3, '0');
      const senhaFormatada = `${YY}${MM}${DD}-${tipo}${numero}`;

      const novaSenha = {
        id: senhaFormatada,
        tipo,
        status: 'emitida',
        chamadas: 0,
        horaEmissao: new Date().toLocaleTimeString(),
        horaAtendimento: null,
        tempoAtendimento: null,
        guiche: null,
      };

      setSenhas((prevSenhas) => [...prevSenhas, novaSenha]);
      return novoContador;
    });
  };

  const chamarProximaSenha = (guiche) => {
    const proxima = senhas.find((s) => s.status === 'emitida' && s.chamadas < 2);

    if (proxima) {
      const atualizado = senhas.map((s) =>
        s.id === proxima.id
          ? {
              ...s,
              chamadas: s.chamadas + 1,
              status: s.chamadas + 1 === 2 ? 'atendida' : 'emitida',
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

  return (
    <SenhaContext.Provider value={{ senhas, gerarSenha, chamarProximaSenha }}>
      {children}
    </SenhaContext.Provider>
  );
};

export const useSenha = () => useContext(SenhaContext);
