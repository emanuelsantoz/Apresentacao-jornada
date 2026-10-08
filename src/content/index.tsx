/**
 * Registro dos slides. Ordem desta lista = ordem da apresentação.
 * Para adicionar um slide: crie src/content/slide-NN.ts (meta + data) e registre aqui.
 */
import type { SlideDef } from '../types/slide';
import { CoverLayout } from '../components/layouts/CoverLayout';
import { AgendaLayout } from '../components/layouts/AgendaLayout';
import { CompareLayout } from '../components/layouts/CompareLayout';
import { TabletDuoLayout } from '../components/layouts/TabletDuoLayout';
import { FlowLayout } from '../components/layouts/FlowLayout';
import { DeviceFocusLayout } from '../components/layouts/DeviceFocusLayout';
import { StepsLayout } from '../components/layouts/StepsLayout';
import { ModuleCoverLayout } from '../components/layouts/ModuleCoverLayout';
import { ConceptsLayout } from '../components/layouts/ConceptsLayout';
import { MetricsLayout } from '../components/layouts/MetricsLayout';
import { AnnotatedLayout } from '../components/layouts/AnnotatedLayout';
import { StatusLayout } from '../components/layouts/StatusLayout';
import { StatementLayout } from '../components/layouts/StatementLayout';
import { RulesLayout } from '../components/layouts/RulesLayout';

import * as s01 from './slide-01';
import * as s02 from './slide-02';
import * as s03 from './slide-03';
import * as s04 from './slide-04';
import * as s05 from './slide-05';
import * as s06 from './slide-06';
import * as s07 from './slide-07';
import * as s08 from './slide-08';
import * as s09 from './slide-09';
import * as s10 from './slide-10';
import * as s11 from './slide-11';
import * as s12 from './slide-12';
import * as s13 from './slide-13';
import * as s14 from './slide-14';
import * as s15 from './slide-15';
import * as s16 from './slide-16';
import * as s17 from './slide-17';
import * as s18 from './slide-18';
import * as s19 from './slide-19';
import * as s20 from './slide-20';
import * as s21 from './slide-21';

export const slides: SlideDef[] = [
  { ...s01.meta, Component: () => <CoverLayout d={s01.data} /> },
  { ...s02.meta, Component: () => <AgendaLayout d={s02.data} /> },
  { ...s03.meta, Component: () => <CompareLayout d={s03.data} /> },
  { ...s04.meta, Component: () => <TabletDuoLayout d={s04.data} /> },
  { ...s05.meta, Component: () => <TabletDuoLayout d={s05.data} /> },
  { ...s06.meta, Component: () => <TabletDuoLayout d={s06.data} /> },
  { ...s07.meta, Component: () => <FlowLayout d={s07.data} /> },
  { ...s08.meta, Component: () => <DeviceFocusLayout d={s08.data} /> },
  { ...s09.meta, Component: () => <StepsLayout d={s09.data} /> },
  { ...s10.meta, Component: () => <DeviceFocusLayout d={s10.data} /> },
  { ...s11.meta, Component: () => <ModuleCoverLayout d={s11.data} /> },
  { ...s12.meta, Component: () => <ConceptsLayout d={s12.data} /> },
  { ...s13.meta, Component: () => <MetricsLayout d={s13.data} /> },
  { ...s14.meta, Component: () => <AnnotatedLayout d={s14.data} /> },
  { ...s15.meta, Component: () => <AnnotatedLayout d={s15.data} /> },
  { ...s16.meta, Component: () => <DeviceFocusLayout d={s16.data} /> },
  { ...s17.meta, Component: () => <DeviceFocusLayout d={s17.data} /> },
  { ...s18.meta, Component: () => <StatusLayout d={s18.data} /> },
  { ...s19.meta, Component: () => <DeviceFocusLayout d={s19.data} /> },
  { ...s20.meta, Component: () => <StatementLayout d={s20.data} /> },
  { ...s21.meta, Component: () => <RulesLayout d={s21.data} /> },
];
