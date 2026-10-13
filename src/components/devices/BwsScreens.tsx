/**
 * Telas de EXEMPLO recriadas em código (tokens BWS do DESIGN.md).
 * Servem de placeholder até o print real ser enviado para a PrintSlot.
 * Não trazem dados reais: valores aparecem como barras neutras.
 */
import {
  AlertTriangle, Bell, CheckCircle2, ChevronRight, CreditCard, FileQuestion, FileText, Headset, History, Inbox,
  LayoutGrid, Mail, Paperclip, Plus, Route, Search, Send, Smartphone, Star, TicketPlus, User, UserX, Wallet,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { ScaledScreen } from './ScaledScreen';
import { ExpandButton } from '../ui/ExpandImage';
import { useSlideState } from '../../hooks/useSlideState';

export type ScreenKey =
  | 'inicio' | 'sessoes' | 'alerta' | 'sucesso' | 'sem-acesso' | 'sem-info' | 'chamado-modal'
  | 'email' | 'caixa-help' | 'novo-chamado' | 'acompanhamento' | 'avaliacao' | 'app';

const c = {
  chrome: 'var(--bws-chrome)', primary: 'var(--bws-primary)', action: 'var(--bws-action)', canvas: 'var(--bws-canvas)',
  text: 'var(--bws-text)', muted: 'var(--bws-muted)', border: 'var(--bws-border)', sel: 'var(--bws-selection)',
};

/* ---------- peças ---------- */
const Bar = ({ w, h = 12, o = 1, color = '#d6dcd9' }: { w: number | string; h?: number; o?: number; color?: string }) => (
  <span style={{ display: 'block', width: w, height: h, borderRadius: h, background: color, opacity: o }} />
);

const Badge = ({ tone, children }: { tone: 'ok' | 'alert' | 'danger' | 'info' | 'muted'; children: ReactNode }) => {
  const t = {
    ok: ['#E8F5E9', '#0B5D3B'], alert: ['#FEF3C7', '#B45309'], danger: ['#FEE2E2', '#B91C1C'], info: ['#DBEAFE', '#1D4ED8'], muted: ['#EEF0EF', '#4B5563'],
  }[tone];
  return <span style={{ background: t[0], color: t[1], borderRadius: 6, padding: '5px 12px', fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap' }}>{children}</span>;
};

const Btn = ({ children, ghost, style }: { children: ReactNode; ghost?: boolean; style?: CSSProperties }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 6, fontSize: 18, fontWeight: 600,
    background: ghost ? '#fff' : c.action, color: ghost ? c.primary : '#fff', border: ghost ? `1.5px solid ${c.border}` : 'none', ...style,
  }}>{children}</span>
);

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 6, ...style }}>{children}</div>
);

/** Largura do menu lateral na tela base (1280 px). */
const MENU_W = 86;

function SideMenu({ nav }: { nav: number }) {
  const items = [LayoutGrid, Headset, Wallet, CreditCard, FileText, Inbox];
  return (
    <aside style={{ width: MENU_W, height: '100%', background: c.chrome, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, gap: 14, flex: 'none' }}>
      <span style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--c-green-600)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 14 }}>b</span>
      {items.map((I, i) => (
        <span key={i} style={{ width: 52, height: 52, borderRadius: 10, display: 'grid', placeItems: 'center', background: i === nav ? 'rgba(255,255,255,0.12)' : 'transparent', color: i === nav ? '#fff' : 'rgba(255,255,255,0.5)' }}>
          <I size={26} strokeWidth={1.75} />
        </span>
      ))}
    </aside>
  );
}

/** Só o menu lateral do BWS (sem cabeçalho), na proporção da tela base; o print vai ao lado. */
export function MenuStrip({ nav = 5 }: { nav?: number }) {
  return (
    <div style={{ position: 'relative', width: `${(MENU_W / 1280) * 100}%`, flex: 'none', background: c.chrome }}>
      <ScaledScreen baseWidth={MENU_W} baseHeight={800}><SideMenu nav={nav} /></ScaledScreen>
    </div>
  );
}

function Shell({ title, crumb, children, nav = 1 }: { title: string; crumb: string; children: ReactNode; nav?: number }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: c.canvas, color: c.text, fontFamily: 'var(--font-brand)' }}>
      <SideMenu nav={nav} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 72, background: '#fff', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 15, color: c.muted }}>{crumb}</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{title}</span>
          </div>
          <span style={{ flex: 1 }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${c.border}`, borderRadius: 6, padding: '9px 14px', width: 240, color: c.muted, fontSize: 16 }}><Search size={18} /> Buscar</span>
          <Bell size={22} color={c.muted} />
          <span style={{ width: 40, height: 40, borderRadius: 40, background: c.sel, display: 'grid', placeItems: 'center', color: c.primary }}><User size={20} /></span>
        </header>
        <main style={{ flex: 1, padding: 28, minHeight: 0, position: 'relative' }}>{children}</main>
      </div>
    </div>
  );
}

const Tag = () => (
  <span style={{ position: 'absolute', right: 14, bottom: 12, fontSize: 14, color: c.muted, background: 'rgba(255,255,255,0.85)', padding: '4px 10px', borderRadius: 6, border: `1px dashed ${c.border}`, zIndex: 9 }}>
    Tela de exemplo · envie o print real
  </span>
);

const CooperadoBar = () => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', marginBottom: 20 }}>
    <span style={{ width: 52, height: 52, borderRadius: 52, background: c.sel, display: 'grid', placeItems: 'center', color: c.primary }}><User size={26} /></span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontWeight: 700, fontSize: 20 }}>Cooperado em atendimento</span>
      <Bar w={220} h={10} />
    </div>
    <span style={{ flex: 1 }} />
    <Badge tone="ok">Atendimento iniciado</Badge>
  </Card>
);

/* ---------- Jornada: sessões ---------- */
type SessionStatus = 'ok' | 'alert' | 'danger';
const statusText = { ok: 'Sucesso', alert: 'Alerta', danger: 'Erro' };
const statusColor = { ok: '#12864F', alert: '#B45309', danger: '#B91C1C' };

function SessionRow({ n, status, focus, expanded }: { n: number; status: SessionStatus; focus?: boolean; expanded?: boolean }) {
  return (
    <Card style={{
      padding: '18px 22px', borderLeft: `6px solid ${statusColor[status]}`,
      boxShadow: focus ? `0 0 0 3px ${statusColor[status]}55` : 'none', background: expanded ? '#FFFBEB' : '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: 10, background: `${statusColor[status]}1f`, color: statusColor[status], display: 'grid', placeItems: 'center' }}>
          {status === 'ok' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 19 }}>Sessão {n} · App Barracred</span>
          <span style={{ display: 'flex', gap: 10, alignItems: 'center', color: c.muted, fontSize: 15 }}><Smartphone size={16} /> <Bar w={160} h={9} /></span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 34, height: 8, borderRadius: 8, background: status !== 'ok' && i === 3 ? statusColor[status] : '#12864F', opacity: status !== 'ok' && i === 3 ? 1 : 0.55 }} />
          ))}
        </div>
        <Badge tone={status === 'ok' ? 'ok' : status === 'alert' ? 'alert' : 'danger'}>{statusText[status]}</Badge>
        <ChevronRight size={22} color={c.muted} />
      </div>
    </Card>
  );
}

function JornadaHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <span style={{ width: 44, height: 44, borderRadius: 10, background: c.sel, color: c.primary, display: 'grid', placeItems: 'center' }}><Route size={24} /></span>
      <span style={{ fontSize: 24, fontWeight: 700 }}>Jornada do Cooperado</span>
      <span style={{ flex: 1 }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.muted, fontSize: 16 }}><History size={18} /> Últimas 3 sessões</span>
    </div>
  );
}

const EmptyState = ({ icon: I, title, text, cta }: { icon: typeof UserX; title: string; text: string; cta?: boolean }) => (
  <Card style={{ height: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, textAlign: 'center' }}>
    <span style={{ width: 110, height: 110, borderRadius: 30, background: cta ? '#FEF3C7' : c.sel, color: cta ? '#B45309' : c.primary, display: 'grid', placeItems: 'center' }}><I size={56} strokeWidth={1.5} /></span>
    <span style={{ fontSize: 30, fontWeight: 700 }}>{title}</span>
    <span style={{ fontSize: 20, color: c.muted, maxWidth: 560 }}>{text}</span>
    {cta && <Btn><TicketPlus size={20} /> Abrir Chamado</Btn>}
  </Card>
);

/* ---------- telas ---------- */
function Inicio() {
  const cards = [
    { t: 'Dados cadastrais', i: User }, { t: 'Conta corrente', i: Wallet }, { t: 'Cartões', i: CreditCard },
    { t: 'Jornada do Cooperado', i: Route, hl: true }, { t: 'Crédito', i: FileText }, { t: 'Histórico', i: History },
  ];
  return (
    <Shell title="Atendimento" crumb="BWS_365 / Atendimento">
      <CooperadoBar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {cards.map(({ t, i: I, hl }) => (
          <Card key={t} style={{
            padding: 22, height: 170, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            border: hl ? '2.5px solid #12864F' : `1px solid ${c.border}`, background: hl ? c.sel : '#fff', position: 'relative',
          }}>
            <span style={{ width: 52, height: 52, borderRadius: 12, background: hl ? '#12864F' : c.canvas, color: hl ? '#fff' : c.primary, display: 'grid', placeItems: 'center' }}><I size={26} /></span>
            <span style={{ fontSize: 21, fontWeight: 700 }}>{t}</span>
            {hl ? <span style={{ position: 'absolute', top: 18, right: 18 }}><Badge tone="ok">Novo</Badge></span> : <Bar w="55%" h={9} />}
          </Card>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
        <Card style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}><Bar w="40%" /><Bar w="85%" h={9} /><Bar w="70%" h={9} /></Card>
        <Card style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}><Bar w="35%" /><Bar w="80%" h={9} /><Bar w="60%" h={9} /></Card>
      </div>
    </Shell>
  );
}

function Sessoes({ mode }: { mode: 'sessoes' | 'alerta' | 'sucesso' | 'chamado-modal' }) {
  const rows: SessionStatus[] = mode === 'sucesso' ? ['ok', 'ok', 'ok'] : ['ok', 'alert', 'ok'];
  const expanded = mode === 'alerta';
  return (
    <Shell title="Jornada do Cooperado" crumb="BWS_365 / Atendimento / Jornada">
      <JornadaHeader />
      {mode === 'sucesso' && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', marginBottom: 16, background: '#E8F5E9', borderColor: '#C6E6CC' }}>
          <CheckCircle2 size={26} color="#12864F" /><span style={{ fontWeight: 700, fontSize: 20, color: '#0B5D3B' }}>Tudo certo nas últimas sessões</span>
        </Card>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: expanded ? '1fr 1fr' : '1fr', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map((s, i) => <SessionRow key={i} n={i + 1} status={s} focus={expanded && s === 'alert'} expanded={expanded && s === 'alert'} />)}
          {!expanded && (
            <Card style={{ padding: 22, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Bar w={180} /><Bar w={120} h={9} /><span style={{ flex: 1 }} /><Btn ghost><TicketPlus size={18} /> Abrir Chamado</Btn>
            </Card>
          )}
        </div>
        {expanded && (
          <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, borderTop: '5px solid #B45309' }}>
            <span style={{ fontWeight: 700, fontSize: 21, display: 'flex', alignItems: 'center', gap: 10 }}><AlertTriangle size={22} color="#B45309" /> Sessão 2 · Alerta</span>
            <div style={{ background: '#FEF3C7', borderRadius: 6, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 700, color: '#B45309', fontSize: 17 }}>DIAGNÓSTICO</span>
              <Bar w="92%" h={10} color="#F5D9A0" /><Bar w="70%" h={10} color="#F5D9A0" />
            </div>
            <div style={{ background: c.sel, borderRadius: 6, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontWeight: 700, color: c.primary, fontSize: 17 }}>RECOMENDAÇÃO</span>
              <Bar w="88%" h={10} color="#C6E6CC" /><Bar w="60%" h={10} color="#C6E6CC" />
            </div>
            <span style={{ flex: 1 }} />
            <Btn ghost style={{ alignSelf: 'flex-start' }}><TicketPlus size={18} /> Abrir Chamado</Btn>
          </Card>
        )}
      </div>
      {mode === 'chamado-modal' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,46,31,0.45)', display: 'grid', placeItems: 'center' }}>
          <Card style={{ width: 640, padding: 30, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 30px 60px -20px rgba(0,0,0,.4)' }}>
            <span style={{ fontSize: 24, fontWeight: 700, display: 'flex', gap: 12, alignItems: 'center' }}><TicketPlus size={26} color="#12864F" /> Abrir Chamado</span>
            <span style={{ fontSize: 16, color: c.muted }}>A sessão selecionada será anexada automaticamente.</span>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Observação</span>
            <div style={{ height: 150, border: '2px solid #12864F', borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 17, color: c.text }}>Cooperado relata que, ao tentar…</span><Bar w="70%" h={9} /><Bar w="45%" h={9} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}><Btn ghost>Cancelar</Btn><Btn><Send size={18} /> Enviar</Btn></div>
          </Card>
        </div>
      )}
    </Shell>
  );
}

function SemDados({ kind }: { kind: 'sem-acesso' | 'sem-info' }) {
  return (
    <Shell title="Jornada do Cooperado" crumb="BWS_365 / Atendimento / Jornada">
      <JornadaHeader />
      {kind === 'sem-acesso' ? (
        <EmptyState icon={UserX} title="Nenhum acesso encontrado" text="Este cooperado ainda não acessou o app Barracred." />
      ) : (
        <EmptyState icon={FileQuestion} title="Sem informações suficientes" text="Não há dados para um diagnóstico. Registre o caso para a TI." cta />
      )}
    </Shell>
  );
}

function Email({ subject = 'Chamado aberto com sucesso', body, bodyFull }: { subject?: string; body?: string; bodyFull?: string }) {
  const { print } = useSlideState();
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', fontFamily: 'var(--font-brand)', color: c.text }}>
      <aside style={{ width: 380, borderRight: `1px solid ${c.border}`, background: c.canvas, boxShadow: body ? `0 60px 0 ${c.canvas}` : undefined }}>
        <div style={{ height: 70, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', fontWeight: 700, fontSize: 22 }}><Mail size={24} /> Caixa de entrada</div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '18px 22px', borderTop: `1px solid ${c.border}`, background: i === 0 ? '#fff' : 'transparent', borderLeft: i === 0 ? '5px solid #12864F' : '5px solid transparent', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {i === 0 ? <><span style={{ fontWeight: 700, fontSize: 18 }}>BWS_HELP</span><span style={{ fontSize: 16 }}>{subject}</span></> : <><Bar w="45%" /><Bar w="80%" h={9} /></>}
          </div>
        ))}
      </aside>
      {body ? (
        <div style={{ position: 'relative', flex: 1, minWidth: 0, background: '#fff', boxShadow: '0 60px 0 #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          {!print && <ExpandButton src={`${import.meta.env.BASE_URL}${bodyFull ?? body}`} alt={subject} size={64} style={{ top: 20, right: 20 }} />}
          <img src={`${import.meta.env.BASE_URL}${body}`} alt={subject} style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain', display: 'block', background: '#fff' }} />
        </div>
      ) : (
      <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <span style={{ fontSize: 30, fontWeight: 700 }}>{subject}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 50, height: 50, borderRadius: 50, background: 'var(--c-green-900)', color: 'var(--ws-selection)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>B</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontWeight: 600, fontSize: 18 }}>BWS_HELP</span><Bar w={200} h={9} /></div>
        </div>
        <Card style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16, borderTop: '5px solid #12864F' }}>
          <span style={{ display: 'flex', gap: 12, alignItems: 'center', fontWeight: 700, fontSize: 21 }}><CheckCircle2 color="#12864F" /> Seu chamado foi registrado</span>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 14, fontSize: 18 }}>
            <span style={{ color: c.muted }}>Nº do chamado</span><span style={{ fontWeight: 700, color: '#12864F' }}>#000000</span>
            <span style={{ color: c.muted }}>Categoria</span><Bar w={180} />
            <span style={{ color: c.muted }}>Abertura</span><Bar w={140} />
          </div>
        </Card>
        <Bar w="85%" h={10} /><Bar w="65%" h={10} />
      </div>
      )}
    </div>
  );
}

function HelpShell({ children, title = 'Caixa do Help' }: { children: ReactNode; title?: string }) {
  return <Shell title={title} crumb="BWS_365 / BWS_HELP" nav={5}>{children}</Shell>;
}

function CaixaHelp() {
  const kpi = ['Abertos', 'Em atendimento', 'Aguardando você', 'Resolvidos'];
  const kc = ['#1D4ED8', '#12864F', '#B45309', '#0B5D3B'];
  const prio: Array<['danger' | 'alert' | 'info' | 'muted', string]> = [['danger', 'Alta'], ['alert', 'Média'], ['info', 'Baixa'], ['alert', 'Média'], ['muted', 'Baixa']];
  return (
    <HelpShell>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 14 }}>
        <span style={{ fontSize: 24, fontWeight: 700 }}>Meus chamados</span><span style={{ flex: 1 }} />
        <Btn ghost><Search size={18} /> Filtrar</Btn><Btn><Plus size={18} /> Novo chamado</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 18 }}>
        {kpi.map((k, i) => (
          <Card key={k} style={{ padding: '18px 20px', borderLeft: `5px solid ${kc[i]}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 15, color: c.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>{k}</span>
            <Bar w={70} h={22} color="#cfd8d3" />
          </Card>
        ))}
      </div>
      <Card>
        {prio.map(([t, l], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '17px 22px', borderTop: i ? `1px solid ${c.border}` : 'none' }}>
            <span style={{ fontWeight: 700, color: c.primary, fontSize: 17, width: 90 }}>#0000{i + 1}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}><Bar w={`${60 - i * 6}%`} h={11} /><Bar w="30%" h={8} /></div>
            <Badge tone={t}>{l}</Badge>
            <Badge tone={i === 2 ? 'alert' : i === 4 ? 'ok' : 'info'}>{i === 2 ? 'Aguardando você' : i === 4 ? 'Resolvido' : 'Em atendimento'}</Badge>
          </div>
        ))}
      </Card>
    </HelpShell>
  );
}

function NovoChamado() {
  const cats = ['Sistemas', 'Acessos', 'Equipamentos', 'App Barracred', 'Outros'];
  return (
    <HelpShell title="Novo chamado">
      <Card style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 }}>
        <span style={{ fontSize: 18, fontWeight: 600 }}>1. Categoria</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {cats.map((x, i) => <span key={x} style={{ padding: '10px 18px', borderRadius: 6, fontSize: 17, fontWeight: 600, border: i === 0 ? '2px solid #12864F' : `1.5px solid ${c.border}`, background: i === 0 ? c.sel : '#fff', color: i === 0 ? c.primary : c.text }}>{x}</span>)}
        </div>
        <span style={{ fontSize: 18, fontWeight: 600 }}>2. Descrição</span>
        <div style={{ height: 130, border: `1.5px solid ${c.border}`, borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}><Bar w="80%" h={10} /><Bar w="65%" h={10} /><Bar w="40%" h={10} /></div>
        <span style={{ fontSize: 18, fontWeight: 600 }}>3. Anexos</span>
        <div style={{ border: `2px dashed ${c.border}`, borderRadius: 6, padding: 18, display: 'flex', gap: 12, alignItems: 'center', color: c.muted, fontSize: 17 }}><Paperclip size={20} /> Arraste prints ou arquivos</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Btn><Send size={18} /> Enviar chamado</Btn></div>
      </Card>
    </HelpShell>
  );
}

function Acompanhamento() {
  const steps = [['Aberto', true], ['Em atendimento', true], ['Aguardando você', false], ['Resolvido', false]] as const;
  return (
    <HelpShell title="Chamado #000001">
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <Card style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ fontWeight: 700, fontSize: 22 }}>Histórico</span><span style={{ flex: 1 }} /><Badge tone="info">Em atendimento</Badge></div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <span style={{ width: 42, height: 42, borderRadius: 42, background: i === 1 ? c.sel : c.canvas, display: 'grid', placeItems: 'center', color: c.primary }}>{i === 1 ? <Headset size={20} /> : <User size={20} />}</span>
              <div style={{ flex: 1, background: c.canvas, borderRadius: 6, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}><Bar w="35%" h={10} color="#c3ccc7" /><Bar w="90%" h={9} /><Bar w="60%" h={9} /></div>
            </div>
          ))}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 20 }}>Status</span>
            {steps.map(([s, done], i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 22, height: 22, borderRadius: 22, background: done ? '#12864F' : '#fff', border: `3px solid ${done ? '#12864F' : c.border}`, boxShadow: i === 1 ? '0 0 0 6px #12864F33' : 'none' }} />
                <span style={{ fontSize: 18, fontWeight: i === 1 ? 700 : 500, color: done ? c.text : c.muted }}>{s}</span>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 20 }}>Prazo (SLA)</span>
            <div style={{ height: 14, borderRadius: 14, background: c.canvas, overflow: 'hidden' }}><div style={{ width: '45%', height: '100%', background: '#12864F' }} /></div>
            <Bar w="50%" h={9} />
          </Card>
        </div>
      </div>
    </HelpShell>
  );
}

function Avaliacao() {
  return (
    <HelpShell title="Chamado #000001">
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,46,31,0.4)', display: 'grid', placeItems: 'center' }}>
        <Card style={{ width: 660, padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
          <span style={{ width: 80, height: 80, borderRadius: 24, background: '#E8F5E9', color: '#12864F', display: 'grid', placeItems: 'center' }}><CheckCircle2 size={44} /></span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>Chamado resolvido!</span>
          <span style={{ fontSize: 19, color: c.muted }}>Como foi o atendimento?</span>
          <div style={{ display: 'flex', gap: 14 }}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={50} fill={i <= 4 ? '#DCA349' : 'none'} color="#DCA349" strokeWidth={1.5} />)}</div>
          <div style={{ width: '100%', height: 90, border: `1.5px solid ${c.border}`, borderRadius: 6, padding: 14, textAlign: 'left', color: c.muted, fontSize: 17 }}>Deixe um comentário (opcional)</div>
          <Btn style={{ alignSelf: 'stretch', justifyContent: 'center' }}>Enviar avaliação</Btn>
        </Card>
      </div>
    </HelpShell>
  );
}

function App() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #104726 0%, #0B5D3B 38%, #F5F7F6 38%)', padding: '90px 30px 30px', fontFamily: 'var(--font-brand)', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <span style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>Olá, cooperado</span>
      <Bar w="60%" h={14} color="rgba(255,255,255,.4)" />
      <Card style={{ padding: 22, borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 30 }}><Bar w="40%" /><Bar w="70%" h={20} color="#cfd8d3" /></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Card key={i} style={{ height: 110, borderRadius: 16, display: 'grid', placeItems: 'center' }}><span style={{ width: 44, height: 44, borderRadius: 12, background: i === 1 ? '#12864F' : c.sel }} /></Card>)}
      </div>
    </div>
  );
}

const base: Record<ScreenKey, [number, number]> = {
  inicio: [1200, 900], sessoes: [1200, 900], alerta: [1200, 900], sucesso: [1200, 900], 'sem-acesso': [1200, 900],
  'sem-info': [1200, 900], 'chamado-modal': [1200, 900], email: [1280, 800], 'caixa-help': [1280, 800],
  'novo-chamado': [1280, 800], acompanhamento: [1280, 800], avaliacao: [1280, 800], app: [430, 880],
};

/** Tela de exemplo por chave, já escalada para o container. */
export function BwsScreen({ screen, emailSubject, emailBody, emailBodyFull }: { screen: ScreenKey; emailSubject?: string; emailBody?: string; emailBodyFull?: string }) {
  const [w, h] = base[screen];
  const content = (() => {
    switch (screen) {
      case 'inicio': return <Inicio />;
      case 'sessoes': case 'alerta': case 'sucesso': case 'chamado-modal': return <Sessoes mode={screen} />;
      case 'sem-acesso': case 'sem-info': return <SemDados kind={screen} />;
      case 'email': return <Email subject={emailSubject} body={emailBody} bodyFull={emailBodyFull} />;
      case 'caixa-help': return <CaixaHelp />;
      case 'novo-chamado': return <NovoChamado />;
      case 'acompanhamento': return <Acompanhamento />;
      case 'avaliacao': return <Avaliacao />;
      case 'app': return <App />;
    }
  })();
  return (
    <ScaledScreen baseWidth={w} baseHeight={h}>
      <div style={{ position: 'relative', width: w, height: h }}>{content}{screen !== 'app' && !emailBody && <Tag />}</div>
    </ScaledScreen>
  );
}
