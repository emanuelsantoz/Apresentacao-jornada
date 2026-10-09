import { Inbox, Smartphone, TrendingUp } from 'lucide-react';
import type { MetricsData } from '../components/layouts/MetricsLayout';
import { metricasSetembro as m, resumoSetembro } from '../data/metricas-setembro';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

const r = resumoSetembro();

export const meta: SlideMeta = {
  id: 'slide-13', title: 'Métricas e evolução', section: M2, theme: 'light', steps: 1, shapes: 'none',
  notes: `Setembro: ${r.total} chamados. Pico em ${r.pico.dia} (${r.pico.total}). App Barracred lidera os tipos (${r.topo.total}, ${r.topoPct}%). Valores lidos do painel Evolução e Tipos do BWS; confirmar.`,
};

export const data: MetricsData = {
  eyebrow: 'Métricas e evolução',
  title: ['Setembro', 'em números'],
  referencia: m.referencia,
  placeholder: m.placeholder,
  kpis: [
    { label: 'Chamados no mês', value: r.total, hint: 'abertos em setembro', icon: Inbox },
    { label: 'Pico diário', value: r.pico.total, hint: `em ${r.pico.dia}`, icon: TrendingUp },
    { label: 'Tipo nº 1', value: r.topo.total, hint: `${r.topo.tipo} · ${r.topoPct}%`, icon: Smartphone },
  ],
  evolucao: { title: 'Evolução de chamados', data: m.evolucao.map((e) => ({ label: e.dia, value: e.total })) },
  tipos: { title: 'Chamados por tipo', data: m.tipos.map((t) => ({ label: t.tipo, value: t.total })) },
  insight: '',
};
