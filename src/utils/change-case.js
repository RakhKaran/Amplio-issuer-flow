export function paramCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function snakeCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}


export function formatNumberIN(value) {
  if (value === null || value === undefined || value === '') return '';
  const number = Number(value);
  if (Number.isNaN(number)) return '';
  return new Intl.NumberFormat('en-IN').format(number);
}


export function parseNumberIN(value) {
  if (!value) return '';
  return Number(String(value).replace(/,/g, ''));
}