export function camelize(value: string) {
  return value.replace(/-./g, x => x[1].toUpperCase())
}