import { calculateBatTu } from '../battu-logic';

describe('Bát Tự Logic - calculateBatTu', () => {
  it('should correctly calculate pillars and ngũ hành for a known date', () => {
    // Test date: 2024-01-01 10:00:00
    const date = new Date('2024-01-01T10:00:00');
    const result = calculateBatTu(date);

    expect(result).toHaveProperty('year');
    expect(result).toHaveProperty('month');
    expect(result).toHaveProperty('day');
    expect(result).toHaveProperty('hour');
    expect(result).toHaveProperty('nguHanhCount');
    expect(result).toHaveProperty('nguHanhPercent');
    expect(result).toHaveProperty('khuyet');
    expect(result).toHaveProperty('vuong');

    // Total elements should be 8 (4 pillars * 2 elements per pillar)
    const totalElements = Object.values(result.nguHanhCount).reduce((a, b) => a + b, 0);
    expect(totalElements).toBe(8);

    // Check percentages
    Object.entries(result.nguHanhCount).forEach(([element, count]) => {
      expect(result.nguHanhPercent[element as any]).toBe((count / 8) * 100);
    });
  });

  it('should handle the 23:00 hour transition (next day)', () => {
    const date1 = new Date('2024-01-01T22:59:59');
    const date2 = new Date('2024-01-01T23:00:01');
    
    const result1 = calculateBatTu(date1);
    const result2 = calculateBatTu(date2);

    // Result 2 should have the same day pillar as 2024-01-02
    const dateNextDay = new Date('2024-01-02T10:00:00');
    const resultNextDay = calculateBatTu(dateNextDay);

    expect(result2.day).toEqual(resultNextDay.day);
    expect(result1.day).not.toEqual(result2.day);
  });

  it('should correctly identify khuyet and vuong elements', () => {
    const date = new Date('2024-01-01T10:00:00');
    const result = calculateBatTu(date);

    Object.entries(result.nguHanhCount).forEach(([element, count]) => {
      if (count === 0) {
        expect(result.khuyet).toContain(element as any);
      }
      if (count >= 2) {
        expect(result.vuong).toContain(element as any);
      }
    });
  });
});
