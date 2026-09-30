import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors, fonts } from "../theme";
import { Background, Card, Eyebrow, Words, ease, useSpring, IconBuilding, IconWave, IconCrane, IconCheck } from "../components/ui";

/* 4 — Three business lines */
const metiers = [
  {
    n: "01",
    icon: IconBuilding,
    title: "Contrôle technique bâtiment & génie civil",
    items: ["Hypothèses et notes de calcul", "Visa des plans de béton armé", "Assistance à la réception"],
    accent: colors.blue,
  },
  {
    n: "02",
    icon: IconWave,
    title: "Contrôles non destructifs (CND)",
    items: ["Ultrasons — certifié niveau 2", "Soudures de charpentes métalliques", "Épaisseur et discontinuités"],
    accent: colors.orange,
  },
  {
    n: "03",
    icon: IconCrane,
    title: "Contrôles réglementaires des équipements",
    items: ["Grues, palans, ponts roulants", "Ascenseurs et monte-charges", "Électricité, plomberie, machines"],
    accent: colors.navy,
  },
];

export const Metiers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background tint="blue" />
      <AbsoluteFill style={{ padding: "110px 120px", flexDirection: "column", gap: 70 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <Eyebrow>01 — Nos métiers</Eyebrow>
          <Words text="Trois expertises, un seul interlocuteur." size={84} align="left" delay={4} stagger={3} highlight={["interlocuteur"]} />
        </div>
        <div style={{ display: "flex", gap: 44, flex: 1, perspective: 1600 }}>
          {metiers.map((m, i) => {
            const d = 30 + i * 12;
            const p = spring({ frame: frame - d, fps, config: { damping: 16, stiffness: 90 } });
            const Icon = m.icon;
            const float = Math.sin((frame + i * 20) / 30) * 6;
            return (
              <Card
                key={i}
                style={{
                  flex: 1,
                  padding: 52,
                  display: "flex",
                  flexDirection: "column",
                  gap: 30,
                  opacity: Math.min(1, p * 1.6),
                  transform: `translateY(${(1 - p) * 260 + float}px) rotateX(${(1 - p) * 30}deg)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${p * 100}%`, background: m.accent }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 26,
                      background: m.accent === colors.orange ? "#FFF3DE" : colors.blueSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={54} color={m.accent === colors.orange ? colors.orangeDeep : m.accent} />
                  </div>
                  <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 88, color: colors.line }}>{m.n}</div>
                </div>
                <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 42, lineHeight: 1.12, color: colors.navy, letterSpacing: "-0.02em" }}>
                  {m.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: "auto" }}>
                  {m.items.map((it, j) => {
                    const q = interpolate(frame, [d + 25 + j * 7, d + 40 + j * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
                    return (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          fontFamily: fonts.body,
                          fontSize: 30,
                          color: colors.ink,
                          opacity: q,
                          transform: `translateX(${(1 - q) * -30}px)`,
                        }}
                      >
                        <IconCheck size={30} color={m.accent === colors.navy ? colors.blue : m.accent} stroke={3} />
                        {it}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 5 — Product-style "fiche de contrôle" UI */
const rows = [
  { t: "Ferraillage semelles S1 → S12", s: "Contrôle dimensionnel avant coulage", st: "Conforme" },
  { t: "Enrobage voile V4 — 22 mm relevés", s: "Attendu 30 mm · reprise demandée", st: "Réserve" },
  { t: "Soudure charpente · ultrasons US-07", s: "Recherche de discontinuités internes", st: "Conforme" },
  { t: "Étanchéité toiture-terrasse", s: "Épreuve de mise en eau · 24 h", st: "En cours" },
  { t: "Armoire TGBT — mesure d'isolement", s: "Protections et mise à la terre vérifiées", st: "Conforme" },
];
const statusStyle = (st: string) =>
  st === "Conforme"
    ? { bg: "#E3F4EC", fg: colors.green }
    : st === "Réserve"
      ? { bg: "#FBE6E2", fg: colors.red }
      : { bg: "#FFF3DE", fg: colors.orangeDeep };

export const Fiche: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useSpring(0, { damping: 20, stiffness: 80 });
  const push = interpolate(frame, [0, 240], [1, 1.06]);
  const stamp = spring({ frame: frame - 170, fps, config: { damping: 9, stiffness: 160 } });
  const caption = useSpring(8);
  return (
    <AbsoluteFill>
      <Background tint="orange" />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 120px", gap: 90 }}>
        <div style={{ flex: 0.8, display: "flex", flexDirection: "column", gap: 34, opacity: caption, transform: `translateX(${(1 - caption) * -60}px)` }}>
          <Eyebrow delay={4}>Des rapports exploitables</Eyebrow>
          <Words text="Chaque point contrôlé, tracé et hiérarchisé." size={78} align="left" delay={10} stagger={3} highlight={["tracé"]} />
          <div style={{ fontFamily: fonts.body, fontSize: 32, color: colors.muted, lineHeight: 1.4 }}>
            Fiches d'observation détaillées, photos des points contrôlés et suivi jusqu'à la levée des réserves.
          </div>
        </div>
        <div style={{ flex: 1.2, transform: `scale(${push})`, position: "relative" }}>
          <Card
            style={{
              padding: 0,
              overflow: "hidden",
              opacity: card,
              transform: `translateY(${(1 - card) * 120}px) rotateY(${(1 - card) * -18}deg)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 34px", borderBottom: `1.5px solid ${colors.line}`, background: "#FAFBFD" }}>
              {["#F26B5B", "#F8C028", "#3CC47C"].map((c) => (
                <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
              ))}
              <span style={{ marginLeft: 18, fontFamily: fonts.mono, fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.muted }}>
                Fiche de contrôle · extrait
              </span>
            </div>
            <div style={{ padding: "12px 34px 26px" }}>
              {rows.map((r, i) => {
                const d = 22 + i * 22;
                const q = spring({ frame: frame - d, fps, config: { damping: 18, stiffness: 120 } });
                const resolved = frame > d + 16;
                const ss = statusStyle(r.st);
                const chip = spring({ frame: frame - d - 16, fps, config: { damping: 11, stiffness: 180 } });
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "22px 0",
                      borderBottom: i < rows.length - 1 ? `1.5px dashed ${colors.line}` : "none",
                      opacity: q,
                      transform: `translateY(${(1 - q) * 30}px)`,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: colors.navy }}>{r.t}</div>
                      <div style={{ fontFamily: fonts.body, fontSize: 24, color: colors.muted, marginTop: 4 }}>{r.s}</div>
                    </div>
                    {resolved ? (
                      <div
                        style={{
                          padding: "10px 22px",
                          borderRadius: 999,
                          background: ss.bg,
                          color: ss.fg,
                          fontFamily: fonts.body,
                          fontWeight: 600,
                          fontSize: 24,
                          transform: `scale(${chip})`,
                        }}
                      >
                        {r.st}
                      </div>
                    ) : (
                      <svg width={36} height={36} viewBox="0 0 36 36" style={{ transform: `rotate(${frame * 12}deg)` }}>
                        <circle cx={18} cy={18} r={14} fill="none" stroke={colors.line} strokeWidth={4} />
                        <path d="M18 4 a14 14 0 0 1 14 14" fill="none" stroke={colors.blue} strokeWidth={4} strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                height: 96,
                padding: "0 34px",
                display: "flex",
                alignItems: "center",
                background: "#FAFBFD",
                borderTop: `1.5px solid ${colors.line}`,
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.muted,
              }}
            >
              Observations hiérarchisées · Photos · Suivi des levées de réserves
            </div>
          </Card>
          {/* Visa stamp */}
          <div
            style={{
              position: "absolute",
              right: -50,
              bottom: -70,
              width: 210,
              height: 210,
              borderRadius: "50%",
              border: `6px solid ${colors.orange}`,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 900,
              color: colors.orangeDeep,
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: Math.min(1, stamp * 2),
              transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-14deg)`,
              boxShadow: "0 20px 40px rgba(217,132,19,0.25)",
            }}
          >
            <span style={{ fontSize: 26, letterSpacing: "0.2em" }}>Visa</span>
            <span style={{ fontSize: 38, margin: "6px 0" }}>Fabra</span>
            <span style={{ fontSize: 22, letterSpacing: "0.12em" }}>Contrôle</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 6 — Regulatory checks orbit */
const equipements = [
  "Grues",
  "Palans",
  "Nacelles",
  "Ponts roulants",
  "Chariots élévateurs",
  "Ascenseurs",
  "Monte-charges",
  "Élingues & câbles",
  "Installations électriques",
  "Mise à la terre",
  "Plomberie & réseaux",
  "Machines",
];

export const Reglementaire: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const center = useSpring(0, { damping: 16, stiffness: 90 });
  return (
    <AbsoluteFill>
      <Background tint="mix" />
      {/* orbit rings */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {[1, 0.72].map((k, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1600 * k * center,
              height: 760 * k * center,
              borderRadius: "50%",
              border: `2px dashed ${i === 0 ? colors.blueSoft : "#F6D7A4"}`,
            }}
          />
        ))}
      </AbsoluteFill>
      {equipements.map((e, i) => {
        const angle = (i / equipements.length) * Math.PI * 2 + frame * 0.004;
        const ring = i % 2 === 0 ? 1 : 0.72;
        const x = Math.cos(angle) * 800 * ring;
        const y = Math.sin(angle) * 380 * ring;
        const p = spring({ frame: frame - 18 - i * 4, fps, config: { damping: 13, stiffness: 120 } });
        const accent = i % 3 === 0 ? colors.orange : colors.blue;
        return (
          <div
            key={e}
            style={{
              position: "absolute",
              left: 960 + x * p,
              top: 540 + y * p,
              transform: `translate(-50%, -50%) scale(${p})`,
              opacity: p,
              padding: "16px 28px",
              borderRadius: 999,
              background: colors.white,
              border: `1.5px solid ${colors.line}`,
              boxShadow: "0 14px 30px rgba(22,48,92,0.12)",
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 28,
              color: colors.navy,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 6, background: accent }} />
            {e}
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
        <div style={{ transform: `scale(${center})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Eyebrow delay={6}>Contrôles réglementaires</Eyebrow>
          <Words text="La conformité au service de la sécurité." size={70} delay={10} stagger={3} maxWidth={900} highlight={["sécurité"]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
