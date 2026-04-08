// ─────────────────────────────────────────────
// Luna Wellness — Master Design System
// ─────────────────────────────────────────────

export const Colors = {
  // Brand
  primary: '#b7004e',
  primaryDark: '#90003c',
  primaryLight: '#ffd9df',
  primaryMid: '#e21364',

  // Accent
  rose: '#fc695d',
  roseLight: '#ffdad6',

  // Semantic
  success: '#2e7d32',
  successLight: '#d9f7dd',
  warning: '#6e5d00',
  warningLight: '#ffe25f',
  error: '#ba1a1a',
  errorLight: '#ffdad6',
  info: '#ae302a',
  infoLight: '#ffd9df',

  // Neutrals
  background: '#faf8ff',
  card: '#ffffff',
  border: '#e4bdc3',
  borderLight: '#ebedfe',

  // Text
  text: '#181b27',
  textSecondary: '#5b3f44',
  textMuted: '#8f6f74',
  textInverse: '#FFFFFF',

  // Gradient presets (for expo-linear-gradient)
  gradPrimary: ['#b7004e', '#e21364'] as const,
  gradSunrise: ['#fc695d', '#e21364'] as const,
  gradOcean: ['#ae302a', '#fc695d'] as const,
  gradForest: ['#6e5d00', '#c7aa00'] as const,
  gradNight: ['#2d303d', '#5b3f44'] as const,
  gradCard: ['#ffd9df', '#ffdad6'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#b7004e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const Typography = {
  xs: { fontSize: 11, lineHeight: 16 },
  sm: { fontSize: 13, lineHeight: 20 },
  base: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 17, lineHeight: 26 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 38 },
  '4xl': { fontSize: 36, lineHeight: 44 },
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
