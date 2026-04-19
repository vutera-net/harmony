export type NguHanh = 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho';

export interface NapAmEntry {
  canChi1: string;
  canChi2: string;
  napAm: string;
  nguHanh: NguHanh;
}

export const NAP_AM_TABLE: NapAmEntry[] = [
  { canChi1: 'Giáp Tý', canChi2: 'Ất Sửu', napAm: 'Hải Trung Kim', nguHanh: 'Kim' },
  { canChi1: 'Bính Dần', canChi2: 'Đinh Mão', napAm: 'Lô Trung Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Mậu Thìn', canChi2: 'Kỷ Tỵ', napAm: 'Đại Lâm Mộc', nguHanh: 'Moc' },
  { canChi1: 'Canh Ngọ', canChi2: 'Tân Mùi', napAm: 'Lộ Bàng Thổ', nguHanh: 'Tho' },
  { canChi1: 'Nhâm Thân', canChi2: 'Quý Dậu', napAm: 'Kiếm Phong Kim', nguHanh: 'Kim' },
  { canChi1: 'Giáp Tuất', canChi2: 'Ất Hợi', napAm: 'Sơn Đầu Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Bính Tý', canChi2: 'Đinh Sửu', napAm: 'Giản Hạ Thủy', nguHanh: 'Thuy' },
  { canChi1: 'Mậu Dần', canChi2: 'Kỷ Mão', napAm: 'Thành Đầu Thổ', nguHanh: 'Tho' },
  { canChi1: 'Canh Thìn', canChi2: 'Tân Tỵ', napAm: 'Bạch Lạp Kim', nguHanh: 'Kim' },
  { canChi1: 'Nhâm Ngọ', canChi2: 'Quý Mùi', napAm: 'Dương Liễu Mộc', nguHanh: 'Moc' },
  { canChi1: 'Giáp Thân', canChi2: 'Ất Dậu', napAm: 'Tuyền Trung Thủy', nguHanh: 'Thuy' },
  { canChi1: 'Bính Tuất', canChi2: 'Đinh Hợi', napAm: 'Ốc Thượng Thổ', nguHanh: 'Tho' },
  { canChi1: 'Mậu Tý', canChi2: 'Kỷ Sửu', napAm: 'Tích Lịch Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Canh Dần', canChi2: 'Tân Mão', napAm: 'Tùng Bách Mộc', nguHanh: 'Moc' },
  { canChi1: 'Nhâm Thìn', canChi2: 'Quý Tỵ', napAm: 'Trường Lưu Thủy', nguHanh: 'Thuy' },
  { canChi1: 'Giáp Ngọ', canChi2: 'Ất Mùi', napAm: 'Sa Trung Kim', nguHanh: 'Kim' },
  { canChi1: 'Bính Thân', canChi2: 'Đinh Dậu', napAm: 'Sơn Hạ Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Mậu Tuất', canChi2: 'Kỷ Hợi', napAm: 'Bình Địa Mộc', nguHanh: 'Moc' },
  { canChi1: 'Canh Tý', canChi2: 'Tân Sửu', napAm: 'Bích Thượng Thổ', nguHanh: 'Tho' },
  { canChi1: 'Nhâm Dần', canChi2: 'Quý Mão', napAm: 'Kim Bạch Kim', nguHanh: 'Kim' },
  { canChi1: 'Giáp Thìn', canChi2: 'Ất Tỵ', napAm: 'Phú Đăng Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Bính Ngọ', canChi2: 'Đinh Mùi', napAm: 'Thiên Hà Thủy', nguHanh: 'Thuy' },
  { canChi1: 'Mậu Thân', canChi2: 'Kỷ Dậu', napAm: 'Đại Dịch Thổ', nguHanh: 'Tho' },
  { canChi1: 'Canh Tuất', canChi2: 'Tân Hợi', napAm: 'Thoa Xuyến Kim', nguHanh: 'Kim' },
  { canChi1: 'Nhâm Tý', canChi2: 'Quý Sửu', napAm: 'Tang Đố Mộc', nguHanh: 'Moc' },
  { canChi1: 'Giáp Dần', canChi2: 'Ất Mão', napAm: 'Đại Khê Thủy', nguHanh: 'Thuy' },
  { canChi1: 'Bính Thìn', canChi2: 'Đinh Tỵ', napAm: 'Sa Trung Thổ', nguHanh: 'Tho' },
  { canChi1: 'Mậu Ngọ', canChi2: 'Kỷ Mùi', napAm: 'Thiên Thượng Hỏa', nguHanh: 'Hoa' },
  { canChi1: 'Canh Thân', canChi2: 'Tân Dậu', napAm: 'Thạch Lựu Mộc', nguHanh: 'Moc' },
  { canChi1: 'Nhâm Tuất', canChi2: 'Quý Hợi', napAm: 'Đại Hải Thủy', nguHanh: 'Thuy' },
];

const CAN_NAMES: Record<string, number> = {
  Giáp: 0, Ất: 1, Bính: 2, Đinh: 3, Mậu: 4,
  Kỷ: 5, Canh: 6, Tân: 7, Nhâm: 8, Quý: 9,
};
const CHI_NAMES: Record<string, number> = {
  Tý: 0, Sửu: 1, Dần: 2, Mão: 3, Thìn: 4, Tỵ: 5,
  Ngọ: 6, Mùi: 7, Thân: 8, Dậu: 9, Tuất: 10, Hợi: 11,
};

function getCanIndexFromName(name: string): number {
  return CAN_NAMES[name] ?? 0;
}
function getChiIndexFromName(name: string): number {
  return CHI_NAMES[name] ?? 0;
}

export function getNapAmByYear(year: number): NapAmEntry {
  const canIndex = ((year - 4) % 10 + 10) % 10;
  const chiIndex = ((year - 4) % 12 + 12) % 12;

  for (let i = 0; i < NAP_AM_TABLE.length; i++) {
    const entry = NAP_AM_TABLE[i];
    const [can1, chi1] = entry.canChi1.split(' ');
    const [can2, chi2] = entry.canChi2.split(' ');
    const c1CanIdx = getCanIndexFromName(can1);
    const c1ChiIdx = getChiIndexFromName(chi1);
    const c2CanIdx = getCanIndexFromName(can2);
    const c2ChiIdx = getChiIndexFromName(chi2);
    if (
      (c1CanIdx === canIndex && c1ChiIdx === chiIndex) ||
      (c2CanIdx === canIndex && c2ChiIdx === chiIndex)
    ) {
      return entry;
    }
  }
  return NAP_AM_TABLE[0];
}
