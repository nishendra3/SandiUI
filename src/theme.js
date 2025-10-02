export const theme = {
  colors: {
    background: "#f8fafc",
    surface: "#ffffff",
    border: "#e2e8f0",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    textMuted: "#64748b",
    primary: "#2563eb",
    primaryLight: "#eef2ff",
    success: "#28a745",
    info: "#007BFF",
  },
  radii: { sm: 6, md: 8, lg: 12 },
  layout: { contentMaxWidth: 1200, breakpointSm: 480, breakpointMd: 768, breakpointLg: 1024 },
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Returns a responsive spacing unit (~1vw) clamped for stability
export const useUnit = (width) => clamp(Math.round(width * 0.01), 2, 16);

export const useResponsive = (width) => ({
  isXs: width < theme.layout.breakpointSm,
  isSm: width >= theme.layout.breakpointSm && width < theme.layout.breakpointMd,
  isMd: width >= theme.layout.breakpointMd && width < theme.layout.breakpointLg,
  isLg: width >= theme.layout.breakpointLg,
});


