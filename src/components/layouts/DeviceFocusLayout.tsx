import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Laptop, Tablet } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { Aurora } from '../stage/Shapes';
import { BulletList, type Bullet } from '../ui/BulletList';
import { Chip } from '../ui/Chip';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';
import { motionTokens } from '../../theme/tokens';

type Tone = 'green' | 'alert' | 'success' | 'danger' | 'info' | 'lime';

export interface FloatCard {
  icon: LucideIcon;
  title: string;
  text?: string;
  tone: Tone;
  /** posição no palco (px) */
  x: number;
  y: number;
  w?: number;
  at?: number;
  /** cai de cima (efeito notificação) */
  drop?: boolean;
}

export interface DeviceFocusData {
  eyebrow: string;
  title: [string, string?];
  bullets: Bullet[];
  device: 'laptop' | 'tablet';
  screen: ScreenSpec;
  floats?: FloatCard[];
  chip?: { text: string; icon?: LucideIcon };
  /** onde fica o rótulo “Onde” (breadcrumb), opcional */
  where?: string[];
}

const toneColor: Record<Tone, string> = {
  green: 'var(--c-green-600)', success: 'var(--c-success)', alert: 'var(--c-alert)', danger: 'var(--c-danger)', info: 'var(--c-info)', lime: 'var(--c-lime)',
};
const badgeTone = (t: Tone) => (t === 'lime' ? 'lime' : t);

/**
 * Texto à esquerda + dispositivo grande num painel escuro à direita (ref. 2),
 * com cartões flutuantes sobrepostos (z-20) que destacam a informação.
 */
export function DeviceFocusLayout({ d }: { d: DeviceFocusData }) {
  const { print } = useSlideState();
  const laptop = d.device === 'laptop';
  return (
    <>
      <div style={{ position: 'absolute', left: 820, top: 0, right: 0, bottom: 0, borderRadius: '56px 0 0 56px', overflow: 'hidden', background: 'var(--c-green-950)' }}>
        <Aurora variant={0} />
      </div>

      <div style={{ position: 'absolute', left: 96, top: 170, width: 640 }}>
        <Title eyebrow={d.eyebrow} size={66}>{d.title[0]}{d.title[1] && <> <Hl>{d.title[1]}</Hl></>}</Title>
        {d.where && (
          <Reveal delay={0.15}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 34 }}>
              {d.where.map((w, i) => <Chip key={w} tone={i === d.where!.length - 1 ? 'green' : 'outline'}>{w}</Chip>)}
            </div>
          </Reveal>
        )}
        <div style={{ marginTop: 46 }}>
          <BulletList items={d.bullets} />
        </div>
        {d.chip && (
          <Reveal delay={0.5} style={{ marginTop: 44 }}>
            <Chip tone="lime">{d.chip.icon && <d.chip.icon size={24} />}{d.chip.text}</Chip>
          </Reveal>
        )}
      </div>

      <motion.div
        style={{ position: 'absolute', left: laptop ? 880 : 960, top: laptop ? 250 : 220, zIndex: 2 }}
        initial={print ? false : { opacity: 0, x: 90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: motionTokens.ease, delay: 0.1 }}
      >
        {laptop ? (
          <Laptop width={980}><Screen spec={d.screen} /></Laptop>
        ) : (
          <Tablet width={820}><Screen spec={d.screen} /></Tablet>
        )}
      </motion.div>

      {d.floats?.map((f, i) => (
        <Reveal key={i} at={f.at ?? 0} delay={0.45 + i * 0.12} from={f.drop ? 'down' : 'scale'} style={{ position: 'absolute', left: f.x, top: f.y, width: f.w ?? 420, zIndex: 20 }}>
          <div style={{
            display: 'flex', alignItems: f.text ? 'flex-start' : 'center', gap: 18, padding: '20px 24px', borderRadius: 'var(--radius-md)', background: '#fff',
            boxShadow: '0 30px 60px -18px rgba(5,20,12,0.55)', borderLeft: `8px solid ${toneColor[f.tone]}`,
          }}>
            <IconBadge icon={f.icon} tone={badgeTone(f.tone)} size={54} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--c-green-900)', lineHeight: 1.2 }}>{f.title}</div>
              {f.text && <div style={{ fontSize: 23, color: 'var(--c-ink-soft)', marginTop: 6, lineHeight: 1.3 }}>{f.text}</div>}
            </div>
          </div>
        </Reveal>
      ))}
    </>
  );
}
