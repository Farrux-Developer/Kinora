/**
 * Stagger helper for scroll-reveal cards: 60ms per item, capped so long
 * grids don't wait forever. Plain module — callable from Server Components.
 */
export function staggerDelay(index: number, step = 0.06, max = 0.42) {
  return Math.min(index * step, max);
}
