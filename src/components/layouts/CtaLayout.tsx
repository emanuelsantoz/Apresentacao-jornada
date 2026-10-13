import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Laptop } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { BrandMark } from '../stage/BrandMark';
import { Reveal } from '../ui/Reveal';
import { useSlideState } from '../../hooks/useSlideState';

export interface CtaData {
  eyebrow: string;
  titleA: string;
  titleB: string;
  text: string;
  /** botão de ação: abre `url` em outra aba (também funciona como link no PDF) */
  cta: { label: string; url: string };
  /** endereço mostrado abaixo do botão (padrão: a própria URL, sem https://) */
  address?: string;
  screen: ScreenSpec;
}

const shortUrl = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Encerramento com chamada para ação: título display + botão grande à esquerda, notebook com a tela à direita. */
export function CtaLayout({ d }: { d: CtaData }) {
  const { print } = useSlideState();
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 110 }}>
        <Reveal><BrandMark dark height={56} /></Reveal>
      </div>

      <div style={{ position: 'absolute', left: 120, top: 300, width: 900 }}>
        <Reveal>
          <div style={{ fontSize: 'var(--fs-label)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--c-lime)', marginBottom: 34 }}>{d.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 style={{ margin: 0, fontSize: 124, lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.035em' }}>
            {d.titleA}
            <br />
            <span style={{ color: 'var(--c-lime)' }}>{d.titleB}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p style={{ margin: '40px 0 0', fontSize: 38, lineHeight: 1.3, color: 'rgba(255,255,255,0.82)', fontWeight: 400 }}>{d.text}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ marginTop: 60 }}>
            <motion.a
              href={d.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // o clique nas laterais do palco troca de slide; aqui só abre o link
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 28, padding: '20px 22px 20px 44px', borderRadius: 12, textDecoration: 'none',
                background: 'var(--ws-action)', color: '#fff', fontSize: 44, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer',
              }}
              animate={print ? undefined : { boxShadow: ['0 0 0 0 rgba(18,134,79,0.55)', '0 0 0 22px rgba(18,134,79,0)'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
            >
              {d.cta.label}
              <span style={{ width: 72, height: 72, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
                <ArrowUpRight size={44} strokeWidth={2.2} />
              </span>
            </motion.a>
            <div style={{ marginTop: 30, fontSize: 'var(--fs-caption)', color: 'rgba(255,255,255,0.65)', letterSpacing: '.01em' }}>
              {d.address ?? shortUrl(d.cta.url)}
            </div>
          </div>
        </Reveal>
      </div>

      <motion.div
        style={{ position: 'absolute', left: 1020, top: 250 }}
        initial={print ? false : { opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <Laptop width={860}><Screen spec={d.screen} expandAt="none" /></Laptop>
      </motion.div>
    </>
  );
}
