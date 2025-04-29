import { ISenha } from "../context/SenhaContext";

export const estaDentroDoHorario = (): boolean => {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 7 && hora < 17;
};

export const jaPassouHorario = (): boolean => {
  const agora = new Date();
  return agora.getHours() >= 17; // Depois das 17h já passou o horário
};

export const calcularTempoMedio = (senhas: ISenha[]): number => {
  if (senhas.length === 0) return 0;
  const total = senhas.reduce((acc, curr) => acc + (curr.tempoAtendimento || 0), 0);
  return parseFloat((total / senhas.length).toFixed(2));
};
