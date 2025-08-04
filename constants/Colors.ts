/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#6366F1';
const tintColorDark = '#8B5CF6';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    primary: '#6366F1',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    card: '#FFFFFF',
    border: '#E5E7EB',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    primary: '#8B5CF6',
    secondary: '#A855F7',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#0891B2',
    card: '#1F2937',
    border: '#374151',
  },
};
