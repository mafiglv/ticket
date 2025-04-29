import { ISenha } from "../context/SenhaContext";

export function exportarRelatorioCSV(senhas: ISenha[]) {
  if (senhas.length === 0) {
    alert("Nenhuma senha atendida para exportar!");
    return;
  }

  const cabecalho = ["Senha", "Tipo", "Emissão", "Atendimento", "Guichê", "Tempo (min)"];
  const linhas = senhas.map(s => [
    s.id,
    s.tipo,
    s.horaEmissao,
    s.horaAtendimento ?? "-",
    s.guiche ?? "-",
    s.tempoAtendimento ?? "-"
  ]);

  const csvContent =
    [cabecalho, ...linhas]
      .map(e => e.join(","))
      .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "relatorio_atendimentos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
