import type { ScreenSpec } from '../components/devices/Screen';

/**
 * Catálogo de prints (screenshots) usados nos mockups.
 * Para fixar um print no projeto, salve a imagem em public/prints/<printId>.png
 * (também aceita .jpg / .jpeg / .webp). Um mesmo print pode aparecer em vários slides.
 */
export const prints = {
  jornadaInicio: { printId: 'jornada-01-inicio', label: 'Tela 1 · Início', fallback: 'inicio' },
  jornadaSessoes: { printId: 'jornada-02-sessoes', label: 'Tela 2 · Últimas sessões', fallback: 'sessoes' },
  jornadaAlerta: { printId: 'jornada-03-alerta', label: 'Tela 3 · Alerta', fallback: 'alerta' },
  jornadaSucesso: { printId: 'jornada-04-sucesso', label: 'Tela 4 · Sucesso', fallback: 'sucesso' },
  jornadaSemAcesso: { printId: 'jornada-05-sem-acesso', label: 'Tela 5 · Sem acesso', fallback: 'sem-acesso' },
  jornadaSemInfo: { printId: 'jornada-06-sem-informacoes', label: 'Tela 6 · Sem informações', fallback: 'sem-info' },
  jornadaBotaoChamado: { printId: 'jornada-07-botao-abrir-chamado', label: 'Botão Abrir Chamado', fallback: 'sessoes' },
  jornadaFormChamado: { printId: 'jornada-08-observacao', label: 'Observação do chamado', fallback: 'chamado-modal' },
  jornadaEnviar: { printId: 'jornada-09-enviar', label: 'Enviar chamado', fallback: 'chamado-modal' },
  jornadaEmail: { printId: 'jornada-10-email-confirmacao', label: 'E-mail de confirmação', fallback: 'email', emailSubject: 'Chamado aberto via Jornada' },
  helpCaixa: { printId: 'help-01-caixa-do-help', label: 'Caixa do Help', fallback: 'caixa-help' },
  helpNovo: { printId: 'help-02-novo-chamado', label: 'Novo chamado', fallback: 'novo-chamado' },
  helpEmail: { printId: 'help-03-email-abertura', label: 'E-mail de abertura', fallback: 'email', emailSubject: 'Chamado aberto com sucesso' },
  helpAcompanhamento: { printId: 'help-04-acompanhamento', label: 'Acompanhamento', fallback: 'acompanhamento' },
  helpAvaliacao: { printId: 'help-05-avaliacao', label: 'Avaliação', fallback: 'avaliacao' },
} satisfies Record<string, ScreenSpec>;
