export const PEN_TOOLS = {
  ballpoint: {
    size: 2.5,
    thinning: 0.1,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: false,
    opacity: 1.0,
    compositeOp: "source-over",
    label: "Ballpoint",
  },
  fountain: {
    size: 4,
    thinning: 0.8,
    smoothing: 0.6,
    streamline: 0.4,
    simulatePressure: false,
    opacity: 1.0,
    compositeOp: "source-over",
    label: "Fountain",
  },
  marker: {
    size: 10,
    thinning: 0,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: false,
    opacity: 0.7,
    compositeOp: "source-over",
    label: "Marker",
  },
  pencil: {
    size: 2,
    thinning: 0.3,
    smoothing: 0.2,
    streamline: 0.3,
    simulatePressure: false,
    opacity: 0.6,
    compositeOp: "source-over",
    label: "Pencil",
    textured: true,
  },
  highlighter: {
    size: 18,
    thinning: 0,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: false,
    opacity: 0.3,
    compositeOp: "multiply",
    label: "Highlighter",
  },
  eraser: {
    size: 16,
    thinning: 0,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: false,
    opacity: 1.0,
    compositeOp: "destination-out",
    label: "Eraser",
  },
};

export const TOOL_ORDER = ["ballpoint", "fountain", "marker", "pencil", "highlighter", "eraser"];

// Each color has a light-theme and dark-theme variant so strokes stay visible
// regardless of which theme they were drawn in.
export const COLORS = [
  { light: "#111111", dark: "#ffffff",  label: "Black"  },
  { light: "#7c3aed", dark: "#c084fc",  label: "Purple" },
  { light: "#e11d48", dark: "#fb7185",  label: "Red"    },
  { light: "#059669", dark: "#34d399",  label: "Green"  },
  { light: "#d97706", dark: "#fbbf24",  label: "Amber"  },
  { light: "#be185d", dark: "#f472b6",  label: "Pink"   },
  { light: "#6b7280", dark: "#9ca3af",  label: "Grey"   },
  { light: "#0d9488", dark: "#2dd4bf",  label: "Teal"   },
];

// Bidirectional map: any stored hex → its counterpart in the opposite theme
export const THEME_COLOR_OPPOSITE = {};
COLORS.forEach(({ light, dark }) => {
  THEME_COLOR_OPPOSITE[light] = dark;
  THEME_COLOR_OPPOSITE[dark]  = light;
});

// Returns the stored color adapted for the current theme.
// Unknown / custom colors are returned unchanged.
export function adaptColorForTheme(color, darkMode) {
  const isLightVariant = COLORS.some((c) => c.light === color);
  const isDarkVariant  = COLORS.some((c) => c.dark  === color);
  if (darkMode  && isLightVariant) return THEME_COLOR_OPPOSITE[color];
  if (!darkMode && isDarkVariant)  return THEME_COLOR_OPPOSITE[color];
  return color;
}
