import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import {
  Background,
  Eyebrow,
  LogoMark,
  Words,
  ease,
  useSpring,
  IconSearch,
  IconDoc,
  IconClipboard,
  IconHelmet,
  IconChart,
  IconCheck,
  IconShield,
  IconBuilding,
  IconPhone,
  IconGlobe,
  IconPin,
} from "../components/ui";

/* 7 — Methodology timeline */
const steps = [
  { t: "Analyse du besoin et du périmètre", i: IconSearch },
  { t: "Examen des documents techniques", i: IconDoc },
  { t: "Préparation du plan d'intervention", i: IconClipboard },
  { t: "Inspection, contrôle ou essais sur site", i: IconHelmet },
  { t: "Classement des observations", i: IconChart },
  { t: "Rapport et suivi des actions correctives", i: IconCheck },
];

export const Methode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = interpolate(frame, [30, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const W = 1560;
  return (
    <AbsoluteFill>
      <Background tint="blue" />
      <AbsoluteFill style={{ padding: "120px 180px", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Eyebrow>Méthodologie d'intervention</Eyebrow>
        <Words text="Une méthode structurée, de l'analyse à la levée des réserves." size={70} delay={6} stagger={2} maxWidth={1400} highlight={["structurée,"]} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: 640, width: W }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 6, borderRadius: 3, background: colors.line }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W * line,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${colors.blue}, ${colors.orange})`,
          }}
        />
        {steps.map((s, i) => {
          const x = (i / (steps.length - 1)) * W;
          const reach = i / (steps.length - 1);
          const at = 30 + reach * 140;
          const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 150 } });
          const Icon = s.i;
          const up = i % 2 === 0;
          const done = line >= reach - 0.001;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 3 }}>
              <div
                style={{
                  position: "absolute",
                  width: 104,
                  height: 104,
                  left: -52,
                  top: -52,
                  borderRadius: "50%",
                  background: colors.white,
                  border: `4px solid ${done ? (i % 2 ? colors.orange : colors.blue) : colors.line}`,
                  boxShadow: "0 16px 36px rgba(22,48,92,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.4 + p * 0.6})`,
                }}
              >
                <Icon size={48} color={i % 2 ? colors.orangeDeep : colors.blue} />
              </div>
              <div
                style={{
                  position: "absolute",
                  width: 270,
                  left: -135,
                  top: up ? -210 : 80,
                  textAlign: "center",
                  opacity: p,
                  transform: `translateY(${(1 - p) * (up ? 30 : -30)}px)`,
                }}
              >
                <div style={{ fontFamily: fonts.mono, fontSize: 22, color: colors.orangeDeep, letterSpacing: "0.15em" }}>ÉTAPE {String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 28, color: colors.navy, lineHeight: 1.2, marginTop: 8 }}>{s.t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 8 — Benefits (dark) */
const benefits = [
  { t: "Risques techniques réduits", i: IconShield },
  { t: "Coûts maîtrisés, moins de reprises", i: IconChart },
  { t: "Réception des ouvrages sécurisée", i: IconBuilding },
  { t: "Conformité réglementaire assurée", i: IconCheck },
];

export const Benefices: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background dark />
      <AbsoluteFill style={{ padding: "150px 140px", flexDirection: "column", gap: 90 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <Eyebrow color={colors.orange}>02 — Ce que vous y gagnez</Eyebrow>
          <Words
            text="Un contrôle coûte moins cher qu'une reprise."
            size={112}
            align="left"
            color={colors.white}
            delay={6}
            stagger={4}
            highlight={["moins", "cher"]}
            maxWidth={1500}
          />
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {benefits.map((b, i) => {
            const p = spring({ frame: frame - 60 - i * 8, fps, config: { damping: 15, stiffness: 120 } });
            const Icon = b.i;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "38px 36px",
                  borderRadius: 28,
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.16)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 26,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 80}px)`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    background: i % 2 ? colors.orange : colors.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={42} color={colors.white} stroke={2.4} />
                </div>
                <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 34, lineHeight: 1.18, color: colors.white }}>{b.t}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 9 — References marquee */
const refs = ["ABENGOA", "Générale Routière", "ONE Khouribga", "Ateliers Verts Travaux", "Commune de Tit Mellil"];

const Marquee: React.FC<{ dir: 1 | -1; outline?: boolean; speed: number; offset: number }> = ({ dir, outline, speed, offset }) => {
  const frame = useCurrentFrame();
  const list = [...refs, ...refs, ...refs];
  const x = -offset + dir * frame * speed;
  return (
    <div style={{ display: "flex", gap: 90, transform: `translateX(${x}px)`, whiteSpace: "nowrap" }}>
      {list.map((r, i) => (
        <span
          key={i}
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 120,
            letterSpacing: "-0.02em",
            color: outline ? "transparent" : colors.navy,
            WebkitTextStroke: outline ? `2.5px ${colors.blue}` : undefined,
            display: "flex",
            alignItems: "center",
            gap: 90,
          }}
        >
          {r}
          <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.orange, display: "inline-block" }} />
        </span>
      ))}
    </div>
  );
};

export const References: React.FC = () => {
  const p = useSpring(0);
  return (
    <AbsoluteFill>
      <Background tint="orange" />
      <AbsoluteFill style={{ justifyContent: "center", gap: 50, opacity: p }}>
        <div style={{ paddingLeft: 140, marginBottom: 20 }}>
          <Eyebrow delay={4}>Projets réalisés ou en cours</Eyebrow>
        </div>
        <Marquee dir={-1} speed={7} offset={200} />
        <Marquee dir={1} speed={7} outline offset={2600} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 10 — Outro / CTA */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useSpring(20);
  const cta = useSpring(50, { damping: 12, stiffness: 140 });
  const pulse = 1 + Math.max(0, Math.sin((frame - 80) / 8)) * 0.03 * (frame > 80 ? 1 : 0);
  const info = useSpring(70);
  const contacts = [
    { i: IconGlobe, t: "www.fabracontrole.com" },
    { i: IconPhone, t: "+212 (0) 522 630 830" },
    { i: IconPin, t: "Partout au Maroc" },
  ];
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44 }}>
        <LogoMark size={230} delay={0} />
        <div style={{ textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 40}px)`, marginTop: 20 }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 84, color: colors.navy, letterSpacing: "0.01em" }}>
            FABRA <span style={{ color: colors.blue }}>CONTROLE</span>
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 38, color: colors.muted, marginTop: 10 }}>
            Sécuriser, contrôler et <span style={{ color: colors.orangeDeep, fontWeight: 600 }}>optimiser</span> vos projets.
          </div>
        </div>
        <div
          style={{
            padding: "26px 56px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${colors.blue}, ${colors.navy})`,
            color: colors.white,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 36,
            boxShadow: "0 24px 50px rgba(47,96,176,0.35)",
            transform: `scale(${cta * pulse})`,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          Demander un devis <span style={{ color: colors.orange }}>→</span>
        </div>
        <div style={{ display: "flex", gap: 60, opacity: info, transform: `translateY(${(1 - info) * 20}px)` }}>
          {contacts.map((c) => {
            const Icon = c.i;
            return (
              <div key={c.t} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: colors.navy }}>
                <Icon size={32} color={colors.orangeDeep} />
                {c.t}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
