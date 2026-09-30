import React from "react";
import { Composition } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { FPS } from "./theme";
import { zoom } from "./components/zoom";
import { Intro, Hook, About } from "./scenes/Opening";
import { Metiers, Fiche, Reglementaire } from "./scenes/Services";
import { Methode, Benefices, References, Outro } from "./scenes/Closing";

const T = 20; // transition length (frames)

const scenes: { c: React.FC; d: number }[] = [
  { c: Intro, d: 130 },
  { c: Hook, d: 150 },
  { c: About, d: 190 },
  { c: Metiers, d: 230 },
  { c: Fiche, d: 250 },
  { c: Reglementaire, d: 190 },
  { c: Methode, d: 230 },
  { c: Benefices, d: 180 },
  { c: References, d: 150 },
  { c: Outro, d: 200 },
];

// Alternate zoom-through and slide transitions
const transitionFor = (i: number) => (i === 3 || i === 6 ? slide({ direction: "from-right" }) : zoom());

export const TOTAL = scenes.reduce((a, s) => a + s.d, 0) - T * (scenes.length - 1);

const Main: React.FC = () => (
  <TransitionSeries>
    {scenes.flatMap((s, i) => {
      const seq = (
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
          <s.c />
        </TransitionSeries.Sequence>
      );
      if (i === 0) return [seq];
      return [
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={transitionFor(i) as ReturnType<typeof zoom>}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />,
        seq,
      ];
    })}
  </TransitionSeries>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FabraControle" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
  </>
);
