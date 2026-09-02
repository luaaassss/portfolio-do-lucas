/**
 * WCAG 2.2 AA Contrast & Color Utilities
 * Calculates relative luminance and contrast ratio according to W3C guidelines.
 */

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Calculate relative luminance
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [sR, sG, sB] = [r, g, b].map((val) => {
    const channel = val / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

// Calculate contrast ratio between two hex colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastAudit {
  ratio: number;
  formattedRatio: string;
  passesAABody: boolean; // >= 4.5:1
  passesAALarge: boolean; // >= 3.0:1
  passesAAA: boolean; // >= 7.0:1
  statusText: string;
  rating: 'error' | 'warning' | 'success';
}

export function auditContrast(foregroundHex: string, backgroundHex: string): ContrastAudit {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  const formattedRatio = `${ratio.toFixed(2)}:1`;
  const passesAABody = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;
  const passesAAA = ratio >= 7.0;

  let statusText = 'Excelente (WCAG AAA)';
  let rating: 'error' | 'warning' | 'success' = 'success';

  if (passesAAA) {
    statusText = 'Excelente (Conforme WCAG AAA)';
    rating = 'success';
  } else if (passesAABody) {
    statusText = 'Aprovado (Conforme WCAG AA para textos)';
    rating = 'success';
  } else if (passesAALarge) {
    statusText = 'Alerta: Apenas texto grande (>=18pt) ou elementos gráficos';
    rating = 'warning';
  } else {
    statusText = 'Reprovado: Contraste insuficiente para leitura acessível';
    rating = 'error';
  }

  return {
    ratio,
    formattedRatio,
    passesAABody,
    passesAALarge,
    passesAAA,
    statusText,
    rating,
  };
}
