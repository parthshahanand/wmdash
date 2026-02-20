export function parseMetricValue(value: string | undefined): number | null {
  if (!value) return null;

  // Strip zero-width spaces, currency symbols, and comparison operators, then trim
  const clean = value.replace(/\u200B/g, '').replace(/[$€£¥<>]/g, '').trim();

  if (clean === '' || clean === '—' || clean === '-') return null;

  // Handle percentages
  if (clean.endsWith('%')) {
    const val = parseFloat(clean.replace('%', ''));
    return isNaN(val) ? null : val;
  }

  // Handle K, M, B suffixes (case-insensitive)
  const lastChar = clean.slice(-1).toUpperCase();
  const numericPart = clean.slice(0, -1);

  if (lastChar === 'K') {
    const val = parseFloat(numericPart);
    return isNaN(val) ? null : val * 1000;
  }

  if (lastChar === 'M') {
    const val = parseFloat(numericPart);
    return isNaN(val) ? null : val * 1000000;
  }

  if (lastChar === 'B') {
    const val = parseFloat(numericPart);
    return isNaN(val) ? null : val * 1000000000;
  }

  // Handle plain numbers
  const val = parseFloat(clean.replace(/,/g, ''));
  return isNaN(val) ? null : val;
}
