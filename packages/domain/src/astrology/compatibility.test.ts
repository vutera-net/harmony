import { describe, it, expect } from 'vitest';
import { calculateCompatibility } from './compatibility';

describe('Compatibility Logic', () => {
  it('should return high score for Tương Sinh (Thủy -> Mộc)', () => {
    const result = calculateCompatibility('Thủy', 'Mộc');
    expect(result.type).toBe('Tương Sinh');
    expect(result.score).toBe(95);
  });

  it('should return low score for Tương Khắc (Hỏa -> Thủy)', () => {
    const result = calculateCompatibility('Hỏa', 'Thủy');
    expect(result.type).toBe('Tương Khắc');
    expect(result.score).toBe(35);
  });

  it('should return 75 for same elements (Bình Hòa)', () => {
    const result = calculateCompatibility('Kim', 'Kim');
    expect(result.type).toBe('Bình Hòa');
    expect(result.score).toBe(75);
  });

  it('should handle undefined or unknown elements gracefully', () => {
    const result = calculateCompatibility('', 'Mộc');
    expect(result.score).toBe(50);
  });
});
