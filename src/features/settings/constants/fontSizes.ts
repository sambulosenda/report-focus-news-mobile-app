import type { FontSize } from '../stores/settingsStore';

export interface FontSizeConfig {
  label: string;
  baseSize: number;
  lineHeight: number;
  h2Size: number;
  h3Size: number;
}

export const FONT_SIZE_CONFIG: Record<FontSize, FontSizeConfig> = {
  small: {
    label: 'Small',
    baseSize: 15,
    lineHeight: 25,
    h2Size: 20,
    h3Size: 17,
  },
  medium: {
    label: 'Medium',
    baseSize: 18,
    lineHeight: 30,
    h2Size: 24,
    h3Size: 20,
  },
  large: {
    label: 'Large',
    baseSize: 21,
    lineHeight: 35,
    h2Size: 28,
    h3Size: 24,
  },
  'extra-large': {
    label: 'Extra Large',
    baseSize: 24,
    lineHeight: 40,
    h2Size: 32,
    h3Size: 28,
  },
};

export const FONT_SIZE_OPTIONS: FontSize[] = ['small', 'medium', 'large', 'extra-large'];
