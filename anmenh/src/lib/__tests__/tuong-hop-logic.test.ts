import { calculateTuongHop } from '../tuong-hop-logic';

describe('Tương Hợp Logic - calculateTuongHop', () => {
  it('should correctly calculate scores for a highly compatible couple', () => {
    // Couple: 
    // Person 1: Giáp Tý (1984), Male -> Cung Đoài
    // Person 2: Kỷ Mão (1999), Female -> Cung Cấn
    
    // Can: Giáp - Kỷ (Tương Hợp) => 20 pts
    // Chi: Tý - Mão (Bình Hòa) => 15 pts
    // Cung: Đoài - Cấn (Diên Niên) => 30 pts
    // Total = 20 + 15 + 30 = 65
    
    const result = calculateTuongHop(1984, 'male', 1999, 'female');
    
    expect(result.canScore).toBe(20);
    expect(result.canText).toBe('Tương Hợp');
    expect(result.chiScore).toBe(15);
    expect(result.chiText).toBe('Bình Hòa');
    expect(result.cungScore).toBe(30);
    expect(result.cungText).toBe('Diên Niên');
    expect(result.totalScore).toBe(65);
    expect(result.interpretation).toContain('Tương hợp rất tốt');
  });

  it('should correctly calculate scores for a conflicting couple', () => {
    // Couple: 
    // Person 1: Giáp Tý (1984), Male -> Cung Đoài
    // Person 2: Bính Ngọ (1966), Female -> Cung Cấn
    
    // Can: Giáp - Bính (Bình Hòa) => 10 pts
    // Chi: Tý - Ngọ (Lục Xung) => 0 pts
    // Cung: Đoài - Cấn (Diên Niên) => 30 pts
    // Total = 10 + 0 + 30 = 40
    
    const result = calculateTuongHop(1984, 'male', 1966, 'female');
    
    expect(result.chiScore).toBe(0);
    expect(result.chiText).toBe('Lục Xung');
    expect(result.totalScore).toBe(40);
    expect(result.interpretation).toContain('Mức độ tương hợp trung bình');
  });

  it('should correctly handle Tam Hợp in Địa Chi', () => {
    // Couple: 
    // Person 1: Tý (1984)
    // Person 2: Thìn (1988)
    // Tý - Thìn is Tam Hợp => 40 pts
    
    const result = calculateTuongHop(1984, 'male', 1988, 'female');
    expect(result.chiScore).toBe(40);
    expect(result.chiText).toBe('Tam Hợp');
  });

  it('should correctly handle Lục Hợp in Địa Chi', () => {
    // Couple:
    // Person 1: Tý (1984)
    // Person 2: Sửu (1985)
    // Tý - Sửu is Lục Hợp => 40 pts
    
    const result = calculateTuongHop(1984, 'male', 1985, 'female');
    expect(result.chiScore).toBe(40);
    expect(result.chiText).toBe('Lục Hợp');
  });

  it('should return a high total score for an ideal match', () => {
    const result = calculateTuongHop(1984, 'male', 1988, 'female');
    const sum = result.canScore + result.chiScore + result.cungScore;
    expect(result.totalScore).toBe(sum);
  });
});
