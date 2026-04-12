// ─────────────────────────────────────────────
// Luna Wellness — Master Design System
// ─────────────────────────────────────────────

export const Colors = {
  primary: '#7C3AED',
  accent: '#EC4899',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#8f6f74',
  success: '#10B981',
  successLight: 'rgba(16,185,129,0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245,158,11,0.1)',
  error: '#EF4444',
  errorLight: 'rgba(239,68,68,0.1)',
  info: '#3B82F6',
  infoLight: 'rgba(59,130,246,0.1)',
  primaryLight: 'rgba(124,58,237,0.1)',
  rose: '#b7004e',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Gradient presets (for expo-linear-gradient)
  gradPrimary: ['#7C3AED', '#EC4899'] as const,
  gradSunrise: ['#EC4899', '#F59E0B'] as const,
  gradOcean: ['#10B981', '#7C3AED'] as const,
  gradForest: ['#6B7280', '#111827'] as const,
  gradNight: ['#111827', '#6B7280'] as const,
  gradCard: ['#F9FAFB', '#FFFFFF'] as const,
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
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7C3AED',
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
