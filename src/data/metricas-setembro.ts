/**
 * Métricas do BWS_HELP — referência: SETEMBRO/2026.
 *
 * Fonte: print do painel “Evolução e Tipos” do BWS (content-source/bws/evolucao-e-tipos-setembro.png).
 * Valores LIDOS DO GRÁFICO (escala de 6 em 6 / 9 em 9): confirme no BWS antes de apresentar.
 * Conferência: a soma da evolução (180) bate com a soma por tipo (180).
 * Rótulos com “…” estavam truncados no print: complete com o nome real.
 */
export const metricasSetembro = {
  placeholder: false,
  referencia: 'Setembro/2026',

  /** Chamados abertos por dia útil. */
  evolucao: [
    { dia: '01/09', total: 9 }, { dia: '02/09', total: 16 }, { dia: '04/09', total: 2 }, { dia: '08/09', total: 10 },
    { dia: '09/09', total: 8 }, { dia: '10/09', total: 5 }, { dia: '11/09', total: 10 }, { dia: '14/09', total: 3 },
    { dia: '15/09', total: 11 }, { dia: '16/09', total: 11 }, { dia: '17/09', total: 10 }, { dia: '18/09', total: 16 },
    { dia: '21/09', total: 10 }, { dia: '22/09', total: 6 }, { dia: '23/09', total: 3 }, { dia: '24/09', total: 8 },
    { dia: '25/09', total: 23 }, { dia: '28/09', total: 3 }, { dia: '29/09', total: 12 }, { dia: '30/09', total: 4 },
  ],

  /** Chamados por tipo (ordem do painel do BWS). */
  tipos: [
    { tipo: 'Contabilidade e D…', total: 26 },
    { tipo: 'App Barracred', total: 36 },
    { tipo: 'Configurações em…', total: 22 },
    { tipo: 'Extrações', total: 10 },
    { tipo: 'Infraestrutura', total: 17 },
    { tipo: 'Atualização cadas…', total: 14 },
    { tipo: 'Operações para o…', total: 25 },
    { tipo: 'Financeiro', total: 22 },
    { tipo: 'Acesso às aplicaç…', total: 6 },
    { tipo: 'Site institucional', total: 2 },
  ],
};

/** Derivados (calculados, nunca digitados à mão). */
export function resumoSetembro() {
  const { evolucao, tipos } = metricasSetembro;
  const total = evolucao.reduce((s, d) => s + d.total, 0);
  const pico = evolucao.reduce((a, b) => (b.total > a.total ? b : a));
  const topo = tipos.reduce((a, b) => (b.total > a.total ? b : a));
  const mediaDia = total / evolucao.length;
  return { total, pico, topo, mediaDia, topoPct: Math.round((topo.total / total) * 100) };
}
