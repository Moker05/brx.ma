import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type Props = Record<string, never>;

/** Zoom-through transition: outgoing scene pushes toward the camera and blurs, incoming settles in. */
const ZoomPresentation: React.FC<TransitionPresentationComponentProps<Props>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  const scale = entering ? interpolate(p, [0, 1], [0.88, 1]) : interpolate(p, [0, 1], [1, 1.18]);
  const opacity = entering ? interpolate(p, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }) : interpolate(p, [0.2, 1], [1, 0], { extrapolateLeft: "clamp" });
  const blur = entering ? (1 - p) * 16 : p * 20;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
  );
};

export const zoom = (): TransitionPresentation<Props> => ({ component: ZoomPresentation, props: {} });
