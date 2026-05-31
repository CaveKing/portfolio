type ClassValue = string | number | bigint | boolean | null | undefined;

/**
 * Minimal className combiner — joins truthy values with a space.
 * Keeps the bundle lean without pulling in clsx/tailwind-merge.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
