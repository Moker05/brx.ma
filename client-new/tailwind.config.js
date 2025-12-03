/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#27e0a3',
          secondary: '#7cf4cf',
          accent: '#f7b733',
          dark: '#0c1118',
          surface: '#121926',
          muted: '#6b7a90',
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "brx-onyx": {
          "primary": "#4ade80",
          "secondary": "#60a5fa",
          "accent": "#f59e0b",
          "neutral": "#020617",
          "base-100": "#050505",
          "base-200": "#0b0b0b",
          "base-300": "#121212",
          "base-content": "#f8fafc",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      {
        "brx-light": {
          "primary": "#18d7a5",
          "secondary": "#5ad1ff",
          "accent": "#ffbe3c",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#1f2937",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      {
        "brx-night": {
          "primary": "#18d7a5",
          "secondary": "#5ad1ff",
          "accent": "#ffbe3c",
          "neutral": "#0b0f16",
          "base-100": "#0a1018",
          "base-200": "#0f1724",
          "base-300": "#161f2c",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      {
        "brx-terminal": {
          "primary": "#3ee399",
          "secondary": "#7cddff",
          "accent": "#ff9f1c",
          "neutral": "#0b0b0f",
          "base-100": "#0d0f14",
          "base-200": "#11151d",
          "base-300": "#1a1f2a",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}
