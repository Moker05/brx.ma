import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { colors, fonts } from "../theme";

/** Spring helper: progress 0 → 1 starting at `delay` frames. */
export const useSpring = (delay = 0, config: Partial<{ damping: number; mass: number; stiffness: number }> = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.9, stiffness: 120, ...config } });
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Soft light background with drifting blurred color blobs (Copilot-like). */
export const Background: React.FC<{ dark?: boolean; tint?: "blue" | "orange" | "mix" }> = ({ dark = false, tint = "mix" }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blobs = [
    { c: colors.blue, x: 20 + Math.sin(t * 0.5) * 8, y: 25 + Math.cos(t * 0.4) * 10, s: 900, o: tint === "orange" ? 0.18 : 0.32 },
    { c: colors.orange, x: 80 + Math.cos(t * 0.45) * 8, y: 75 + Math.sin(t * 0.5) * 8, s: 800, o: tint === "blue" ? 0.14 : 0.34 },
    { c: "#7FA6E3", x: 70 + Math.sin(t * 0.3) * 12, y: 15 + Math.cos(t * 0.35) * 8, s: 700, o: 0.25 },
  ];
  return (
    <AbsoluteFill style={{ background: dark ? colors.navy : colors.bg, overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.s,
            height: b.s,
            marginLeft: -b.s / 2,
            marginTop: -b.s / 2,
            borderRadius: "50%",
            background: b.c,
            opacity: dark ? b.o * 1.2 : b.o,
            filter: "blur(140px)",
          }}
        />
      ))}
      {/* fine dotted grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.10)" : "rgba(22,48,92,0.10)"} 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Word-by-word reveal with blur + rise. */
export const Words: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  color?: string;
  weight?: number;
  highlight?: string[];
  highlightColor?: string;
  align?: "left" | "center";
  lineHeight?: number;
  maxWidth?: number;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  size = 96,
  color = colors.navy,
  weight = 800,
  highlight = [],
  highlightColor = colors.orange,
  align = "center",
  lineHeight = 1.08,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.03em",
        color,
        textAlign: align,
        maxWidth,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 16, stiffness: 110 } });
        const hl = highlight.includes(w.replace(/[,.]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.6}px) scale(${0.92 + p * 0.08})`,
              filter: `blur(${(1 - p) * 12}px)`,
              color: hl ? highlightColor : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 0, color = colors.blue }) => {
  const p = useSpring(delay);
  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 24,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ width: 48 * p, height: 3, background: colors.orange, borderRadius: 2 }} />
      {children}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; delay?: number; icon?: React.ReactNode; dark?: boolean; size?: number }> = ({
  children,
  delay = 0,
  icon,
  dark = false,
  size = 30,
}) => {
  const p = useSpring(delay, { damping: 13, stiffness: 140 });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: `${size * 0.5}px ${size * 0.9}px`,
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.85)",
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.2)" : colors.line}`,
        boxShadow: dark ? "none" : "0 12px 32px rgba(22,48,92,0.10)",
        backdropFilter: "blur(10px)",
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: size,
        color: dark ? colors.white : colors.navy,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.6 + p * 0.4}) translateY(${(1 - p) * 30}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {children}
    </div>
  );
};

/** Glassy white card with soft shadow. */
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.92)",
      borderRadius: 32,
      border: `1.5px solid rgba(213,220,230,0.9)`,
      boxShadow: "0 40px 80px rgba(22,48,92,0.14), 0 8px 20px rgba(22,48,92,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const LogoMark: React.FC<{ size: number; delay?: number; ring?: boolean }> = ({ size, delay = 0, ring = true }) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, { damping: 14, stiffness: 90 });
  const draw = interpolate(frame - delay, [0, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const r = size / 2 + 22;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {ring && (
        <svg
          width={size + 60}
          height={size + 60}
          style={{ position: "absolute", left: -30, top: -30, transform: `rotate(${-90 + frame * 0.6}deg)` }}
        >
          <circle
            cx={(size + 60) / 2}
            cy={(size + 60) / 2}
            r={r}
            fill="none"
            stroke={colors.orange}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.28 * draw} ${circ}`}
          />
          <circle
            cx={(size + 60) / 2}
            cy={(size + 60) / 2}
            r={r}
            fill="none"
            stroke={colors.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.45 * draw} ${circ}`}
            strokeDashoffset={-circ * 0.5}
          />
        </svg>
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: colors.white,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(22,48,92,0.22)",
          transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`,
          opacity: Math.min(1, p * 2),
        }}
      >
        <Img src={staticFile("logo-square.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

/* ---------- Icons (stroke, 24 grid) ---------- */
type IconProps = { size?: number; color?: string; stroke?: number };
const I: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 32, color = colors.blue, stroke = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IconBuilding: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-5h6v5" />
    <path d="M9 9h.01M15 9h.01M9 12.5h.01M15 12.5h.01" />
  </I>
);
export const IconWave: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5" />
  </I>
);
export const IconCrane: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M6 21V4" />
    <path d="M3 21h8" />
    <path d="M6 4h14l-4 4" />
    <path d="M6 8h10" />
    <path d="M17 8v5" />
    <path d="M15.5 15a1.5 1.5 0 1 0 3 0v-2h-3" />
  </I>
);
export const IconShield: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </I>
);
export const IconCheck: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </I>
);
export const IconScale: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M12 3v18M5 21h14" />
    <path d="M4 7h16" />
    <path d="M6 7l-3 7a3 3 0 0 0 6 0L6 7zM18 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
  </I>
);
export const IconBolt: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </I>
);
export const IconDoc: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M14 3H6v18h12V7l-4-4z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </I>
);
export const IconSearch: React.FC<IconProps> = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l5 5" />
  </I>
);
export const IconClipboard: React.FC<IconProps> = (p) => (
  <I {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4h6v3H9z" />
    <path d="M9 12l2 2 4-4" />
  </I>
);
export const IconHelmet: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M3 17h18" />
    <path d="M5 17a7 7 0 0 1 14 0" />
    <path d="M10 10V6h4v4" />
  </I>
);
export const IconChart: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 15l4-4 3 3 5-6" />
  </I>
);
export const IconPin: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </I>
);
export const IconPhone: React.FC<IconProps> = (p) => (
  <I {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </I>
);
export const IconGlobe: React.FC<IconProps> = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </I>
);
