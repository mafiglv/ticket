import { ISenha } from "../context/SenhaContext";

export const estaDentroDoHorario = () => {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 7 && hora < 17;
};

export const calcularTempoMedio = (senhas: ISenha[]) => {
  if (senhas.length === 0) return 0;
  const total = senhas.reduce((acc, curr) => acc + (curr.tempoAtendimento || 0), 0);
  return total / senhas.length;
};
