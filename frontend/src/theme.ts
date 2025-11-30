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
  gradients: {
    aurora: 'linear-gradient(120deg, rgba(99,102,241,0.22), rgba(124,58,237,0.18), rgba(34,211,238,0.18))',
    nav: 'linear-gradient(120deg, rgba(8, 47, 73, 0.9), rgba(67, 56, 202, 0.82), rgba(76, 29, 149, 0.85))'
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
