export function generateId(base: number) {
  return Math.random().toString(base).substr(2, 9).toUpperCase();
}
