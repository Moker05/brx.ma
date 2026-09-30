import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import {
  Background,
  Eyebrow,
  LogoMark,
  Pill,
  Words,
  ease,
  useSpring,
  IconShield,
  IconWave,
  IconScale,
  IconBolt,
  IconDoc,
} from "../components/ui";

/* 1 — Logo reveal */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [45, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const title = "FABRA CONTROLE".split("");
  const sub = useSpring(80);
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 70 * slide }}>
          <LogoMark size={320} delay={5} />
          <div style={{ width: 1020 * slide, overflow: "hidden" }}>
            <div style={{ width: 1020 }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 112, color: colors.navy, letterSpacing: "0.02em", display: "flex" }}>
                {title.map((c, i) => {
                  const o = interpolate(frame, [55 + i * 2, 70 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
                  return (
                    <span key={i} style={{ opacity: o, transform: `translateY(${(1 - o) * 60}px)`, display: "inline-block", whiteSpace: "pre", color: i > 5 ? colors.blue : colors.navy }}>
                      {c}
                    </span>
                  );
                })}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 28,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: colors.muted,
                  marginTop: 14,
                  whiteSpace: "nowrap",
                  opacity: sub,
                  transform: `translateY(${(1 - sub) * 20}px)`,
                }}
              >
                Contrôle technique <span style={{ color: colors.orange }}>&</span> garantie décennale
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 2 — Hook */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [55, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill>
      <Background tint="blue" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 50 }}>
        <Eyebrow delay={0}>Bâtiment · Génie civil · Industrie · Maroc</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Words text="Contrôler aujourd'hui," size={140} delay={8} stagger={5} />
          <div style={{ position: "relative" }}>
            <Words text="éviter le sinistre demain." size={140} delay={26} stagger={5} highlight={["sinistre"]} color={colors.blue} />
            <svg width={1500} height={60} style={{ position: "absolute", left: "50%", marginLeft: -750, bottom: -40 }} viewBox="0 0 1500 60">
              <path
                d="M120 40 C 500 10, 1000 10, 1380 34"
                fill="none"
                stroke={colors.orange}
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={`${underline} 1`}
                opacity={underline > 0.01 ? 1 : 0}
              />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 3 — Who we are */
export const About: React.FC = () => {
  const frame = useCurrentFrame();
  const body = useSpring(40);
  const pills = [
    { t: "Agréé Garantie décennale", i: <IconShield size={36} color={colors.orange} /> },
    { t: "Ultrasons certifié niveau 2", i: <IconWave size={36} color={colors.blue} /> },
    { t: "Indépendance & impartialité", i: <IconScale size={36} color={colors.blue} /> },
    { t: "Réactivité", i: <IconBolt size={36} color={colors.orange} /> },
    { t: "Traçabilité des interventions", i: <IconDoc size={36} color={colors.blue} /> },
  ];
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ padding: "0 140px", flexDirection: "row", alignItems: "center", gap: 80 }}>
        <div style={{ flex: 1.15, display: "flex", flexDirection: "column", gap: 40 }}>
          <Eyebrow>Qui sommes-nous</Eyebrow>
          <Words
            text="Un bureau de contrôle technique agréé par l'État."
            size={92}
            align="left"
            delay={6}
            stagger={3}
            highlight={["agréé", "l'État"]}
            highlightColor={colors.blue}
          />
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 38,
              lineHeight: 1.4,
              color: colors.muted,
              opacity: body,
              transform: `translateY(${(1 - body) * 30}px)`,
              maxWidth: 900,
            }}
          >
            Fondé par des ingénieurs expérimentés, FABRA CONTROLE intervient <b style={{ color: colors.navy }}>dans tout le Royaume</b> sur les
            projets qui exigent technicité et expertise poussées.
          </div>
        </div>
        <div style={{ flex: 0.85, display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
          {pills.map((p, i) => (
            <div key={i} style={{ transform: `translate(${(i % 2) * 70}px, ${Math.sin(frame / 22 + i) * 6}px)` }}>
              <Pill delay={30 + i * 9} icon={p.i}>
                {p.t}
              </Pill>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
