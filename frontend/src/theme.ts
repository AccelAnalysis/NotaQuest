export const theme = {
  palette: {
    primary: 'var(--color-primary)',
    primaryStrong: 'var(--color-primary-strong)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    surface: 'var(--color-surface)',
    text: 'var(--text-primary)',
    textMuted: 'var(--text-secondary)'
  },
  surfaces: {
    page: 'var(--color-page)',
    overlay: 'var(--surface-overlay)',
    overlayStrong: 'var(--surface-overlay-strong)',
    card: 'var(--surface-card)',
    contrast: 'var(--surface-contrast)'
  },
  borders: {
    subtle: 'var(--border-subtle)',
    strong: 'var(--border-strong)',
    contrast: 'var(--border-contrast)'
  },
  gradients: {
    aurora: 'var(--gradient-aurora)',
    auroraStrong: 'var(--gradient-aurora-strong)',
    nav: 'var(--gradient-nav)',
    pageOverlay: 'var(--gradient-page-overlay)'
  },
  shadows: {
    soft: 'var(--shadow-soft)',
    glow: 'var(--shadow-glow)'
  },
  glass: {
    surface: 'rgba(255,255,255,0.03)',
    blur: 'var(--glass-blur)'
  }
};

export type Theme = typeof theme;
