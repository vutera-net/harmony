import { CAN, CHI, jdFromDate, solarToLunar } from "./lunar-logic";

export type NguHanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

export interface Pillar {
  can: string;
  chi: string;
  canHanh: NguHanh;
  chiHanh: NguHanh;
}

export interface BatTuResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  nguHanhCount: Record<NguHanh, number>;
  nguHanhPercent: Record<NguHanh, number>;
  khuyet: NguHanh[];
  vuong: NguHanh[];
}

const CAN_HANH: Record<string, NguHanh> = {
  "Giáp": "Mộc", "Ất": "Mộc",
  "Bính": "Hỏa", "Đinh": "Hỏa",
  "Mậu": "Thổ", "Kỷ": "Thổ",
  "Canh": "Kim", "Tân": "Kim",
  "Nhâm": "Thủy", "Quý": "Thủy",
};

const CHI_HANH: Record<string, NguHanh> = {
  "Dần": "Mộc", "Mão": "Mộc",
  "Tỵ": "Hỏa", "Ngọ": "Hỏa",
  "Thân": "Kim", "Dậu": "Kim",
  "Hợi": "Thủy", "Tý": "Thủy",
  "Thìn": "Thổ", "Tuất": "Thổ", "Sửu": "Thổ", "Mùi": "Thổ",
};

export function calculateBatTu(date: Date): BatTuResult {
  let d = new Date(date);
  let hr = d.getHours();
  
  // Trụ Giờ thay đổi lúc 23:00 (chuyển sang giờ Tý của ngày hôm sau)
  if (hr >= 23) {
    d.setDate(d.getDate() + 1);
  }
  
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yy = d.getFullYear();
  
  const lunar = solarToLunar(d);
  
  // 1. Trụ Năm
  const yearCanIdx = (lunar.year + 6) % 10;
  const yearChiIdx = (lunar.year + 8) % 12;
  const yearCan = CAN[yearCanIdx];
  const yearChi = CHI[yearChiIdx];
  
  // 2. Trụ Tháng
  const monthChiIdx = (lunar.month + 1) % 12;
  const monthChi = CHI[monthChiIdx];
  const monthCanIdx = (((yearCanIdx % 5) * 2) + lunar.month + 1) % 10;
  const monthCan = CAN[monthCanIdx];
  
  // 3. Trụ Ngày
  const jd = jdFromDate(dd, mm, yy);
  const dayCanIdx = (jd + 9) % 10;
  const dayChiIdx = (jd + 9) % 12;
  const dayCan = CAN[dayCanIdx];
  const dayChi = CHI[dayChiIdx];
  
  // 4. Trụ Giờ
  let rawHour = hr;
  if (hr >= 23) rawHour = hr - 24; 
  const hourChiIdx = Math.floor((rawHour + 1) / 2) % 12; 
  const normHourChiIdx = hourChiIdx < 0 ? hourChiIdx + 12 : hourChiIdx;
  const hourChi = CHI[normHourChiIdx];
  
  const hourCanIdx = ((dayCanIdx % 5) * 2 + normHourChiIdx) % 10;
  const hourCan = CAN[hourCanIdx];
  
  const yearPillar: Pillar = { can: yearCan, chi: yearChi, canHanh: CAN_HANH[yearCan], chiHanh: CHI_HANH[yearChi] };
  const monthPillar: Pillar = { can: monthCan, chi: monthChi, canHanh: CAN_HANH[monthCan], chiHanh: CHI_HANH[monthChi] };
  const dayPillar: Pillar = { can: dayCan, chi: dayChi, canHanh: CAN_HANH[dayCan], chiHanh: CHI_HANH[dayChi] };
  const hourPillar: Pillar = { can: hourCan, chi: hourChi, canHanh: CAN_HANH[hourCan], chiHanh: CHI_HANH[hourChi] };
  
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const count: Record<NguHanh, number> = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  
  for (const p of pillars) {
    count[p.canHanh]++;
    count[p.chiHanh]++;
  }
  
  const percent: Record<NguHanh, number> = {
    Kim: (count.Kim / 8) * 100,
    Mộc: (count.Mộc / 8) * 100,
    Thủy: (count.Thủy / 8) * 100,
    Hỏa: (count.Hỏa / 8) * 100,
    Thổ: (count.Thổ / 8) * 100,
  };
  
  const khuyet: NguHanh[] = [];
  const vuong: NguHanh[] = [];
  
  for (const hanh in count) {
    const h = hanh as NguHanh;
    if (count[h] === 0) khuyet.push(h);
    if (count[h] >= 2) vuong.push(h); // >= 25% (2 out of 8 words)
  }
  
  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    nguHanhCount: count,
    nguHanhPercent: percent,
    khuyet,
    vuong
  };
}
