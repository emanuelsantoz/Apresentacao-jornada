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
  jornadaSemAcesso: { printId: 'jornada-05-sem-acesso', label: 'Tela 5 · Sem acesso', fallback: 'sem-acesso', fit: 'contain', position: 'center', bg: '#757575' },
  jornadaSemInfo: { printId: 'jornada-06-sem-informacoes', label: 'Tela 6 · Sem informações', fallback: 'sem-info' },
  jornadaBotaoChamado: { printId: 'jornada-07-botao-abrir-chamado', label: 'Botão Abrir Chamado', fallback: 'sessoes' },
  jornadaFormChamado: { printId: 'jornada-08-observacao', label: 'Observação do chamado', fallback: 'chamado-modal' },
  jornadaEnviar: { printId: 'jornada-09-enviar', label: 'Enviar chamado', fallback: 'chamado-modal' },
  jornadaEmail: { printId: 'jornada-10-email-confirmacao', label: 'E-mail de confirmação', fallback: 'email', emailSubject: 'Chamado criado com sucesso', emailBody: 'prints/help-03-email-corpo.png', emailBodyFull: 'prints/help-03-email-completo.png' },
  helpCaixa: { printId: 'help-01-caixa-do-help', label: 'Caixa do Help', fallback: 'caixa-help' },
  helpDashboard: { printId: 'help-01-dashboard', label: 'Dashboard do Help', fallback: 'caixa-help', fit: 'contain', position: 'top', bg: '#f3f6f5', menu: true },
  helpNovo: { printId: 'help-02-novo-chamado', label: 'Novo chamado', fallback: 'novo-chamado', fit: 'contain', position: 'top', bg: '#f3f6f5', menu: true },
  helpEmail: { printId: 'help-03-email-abertura', label: 'E-mail de abertura', fallback: 'email', emailSubject: 'Chamado criado com sucesso', emailBody: 'prints/help-03-email-corpo.png', emailBodyFull: 'prints/help-03-email-completo.png' },
  helpAcompanhamento: { printId: 'help-04-acompanhamento', label: 'Acompanhamento', fallback: 'acompanhamento', fit: 'contain', position: 'top', bg: '#f3f6f5', menu: true },
  helpAvaliacao: { printId: 'help-05-avaliacao', label: 'Avaliação', fallback: 'avaliacao' },
} satisfies Record<string, ScreenSpec>;
