/**
 * Thuật toán tính Ngũ Hành theo năm sinh (Âm Lịch)
 * Trọng tâm cho prototype: Lấy số cuối của năm + Can Chi (ước lượng)
 */

export const ZODIAC_ANIMALS = [
  "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", 
  "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"
];

export const ELEMENTS = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];

/**
 * Tính tuổi con giáp (Zodiac) theo năm Dương lịch (Giả định năm Âm lịch tương đương)
 */
export function calculateZodiac(year: number): string {
  // Năm 1992 mod 12 = 0 -> Thân
  return ZODIAC_ANIMALS[year % 12];
}

/**
 * Tính Can Chi và quy ra Cục Mệnh Ngũ Hành cơ bản
 */
export function calculateElement(year: number): string {
  const can = year % 10;
  // Bảng mapping Can (Giáp, Ất...) + Chi -> Ngũ Hành nạp âm
  // Mock logic cho Demo: Tính mảng dư
  const mockElementIndex = (year + can) % 5;
  return ELEMENTS[mockElementIndex];
}

/**
 * Hàm phân giải sinh nhật đầu vào thành Đối tượng Vận Mệnh ban đầu
 */
export function generateDestinyCore(birthDateISO: string, time?: string) {
  const date = new Date(birthDateISO);
  const year = date.getFullYear();

  return {
    zodiac: calculateZodiac(year),
    element: calculateElement(year),
    bazi: `Trụ Năm ${year}`, // Sẽ mở rộng sau với Thiên Can, Địa Chi 4 Trụ
  };
}
