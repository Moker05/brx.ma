import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadSource } from "@remotion/google-fonts/SourceSans3";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

const archivo = loadArchivo("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
const source = loadSource("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", { weights: ["500"], subsets: ["latin", "latin-ext"] });

export const fonts = {
  display: archivo.fontFamily,
  body: source.fontFamily,
  mono: mono.fontFamily,
};

export const colors = {
  navy: "#16305C",
  blue: "#2F60B0",
  blueSoft: "#D5E0F2",
  orange: "#F8A828",
  orangeDeep: "#D98413",
  ink: "#1E2A3D",
  muted: "#63708A",
  line: "#D5DCE6",
  bg: "#F6F8FC",
  white: "#FFFFFF",
  green: "#2E9E6A",
  red: "#D0503C",
};

export const FPS = 30;
