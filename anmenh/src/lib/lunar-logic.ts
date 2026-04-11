/**
 * An Mệnh - Core Astrology Logic
 * Implements the Hồ Ngọc Đức Solar-to-Lunar algorithm for Vietnamese dates.
 * https://www.informatik.uni-leipzig.de/~duc/amlich/calrules.html
 */

// ==========================================
// CAN CHI TABLES
// ==========================================
export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export function getYearCanChi(year: number): string {
  const canIndex = (year + 6) % 10;
  const chiIndex = (year + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

export function getYearCan(year: number): string { return CAN[(year + 6) % 10]; }
export function getYearChi(year: number): string { return CHI[(year + 8) % 12]; }

// ==========================================
// SOLAR → LUNAR CONVERSION (Hồ Ngọc Đức)
// ==========================================
function INT(d: number) { return Math.floor(d); }

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd: number): [number, number, number] {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  const L = L0 + DL;
  const theta = L - 0.00569 - 0.00478 * Math.sin(dr * (125.04 - 1934.136 * T));
  let omega = theta - 360 * INT(theta / 360);
  if (omega < 0) omega += 360;
  return omega;
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  return INT(sunLongitude(dayNumber - 0.5 - timeZone / 24) / 30);
}

function getNewMoonDay(k: number, timeZone: number): number {
  return INT(newMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChi: string;
}

export function solarToLunar(date: Date): LunarDate {
  const timeZone = 7; // Vietnam UTC+7
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

  const a11Initial = getLunarMonth11(yy, timeZone);
  let a11 = a11Initial;
  let b11 = a11Initial;
  const a11FromPrevYear = a11Initial >= monthStart;
  if (a11FromPrevYear) {
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;

  // Only use yy-1 when a11 came from the previous solar year (date is before current year's month 11)
  const lunarYear = (lunarMonth >= 11 && a11FromPrevYear) ? yy - 1 : yy;
  const canChi = getYearCanChi(lunarYear);

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap,
    canChi,
  };
}

// ==========================================
// CÂN XƯƠNG ĐOÁN SỐ
// ==========================================
const YEAR_WEIGHTS: Record<string, number> = {
  "Giáp Tý": 1.2, "Ất Sửu": 0.9, "Bính Dần": 0.6, "Đinh Mão": 0.7,
  "Mậu Thìn": 1.2, "Kỷ Tỵ": 0.5, "Canh Ngọ": 0.9, "Tân Mùi": 0.8,
  "Nhâm Thân": 0.7, "Quý Dậu": 0.8, "Giáp Tuất": 1.5, "Ất Hợi": 0.9,
  "Bính Tý": 1.6, "Đinh Sửu": 0.8, "Mậu Dần": 0.8, "Kỷ Mão": 1.9,
  "Canh Thìn": 1.2, "Tân Tỵ": 0.6, "Nhâm Ngọ": 0.8, "Quý Mùi": 0.7,
  "Giáp Thân": 1.7, "Ất Dậu": 0.9, "Bính Tuất": 0.6, "Đinh Hợi": 0.8,
  "Mậu Tý": 1.0, "Kỷ Sửu": 0.6, "Canh Dần": 1.7, "Tân Mão": 0.9,
  "Nhâm Thìn": 1.6, "Quý Tỵ": 0.5, "Giáp Ngọ": 1.1, "Ất Mùi": 0.7,
  "Bính Thân": 0.9, "Đinh Dậu": 0.6, "Mậu Tuất": 0.8, "Kỷ Hợi": 1.0,
  "Canh Tý": 1.5, "Tân Sửu": 0.8, "Nhâm Dần": 0.7, "Quý Mão": 0.9,
  "Giáp Thìn": 1.2, "Ất Tỵ": 0.5, "Bính Ngọ": 1.4, "Đinh Mùi": 0.7,
  "Mậu Thân": 1.1, "Kỷ Dậu": 0.8, "Canh Tuất": 1.1, "Tân Hợi": 0.8,
  "Nhâm Tý": 1.3, "Quý Sửu": 0.9, "Giáp Dần": 1.8, "Ất Mão": 1.0,
  "Bính Thìn": 1.3, "Đinh Tỵ": 0.6, "Mậu Ngọ": 0.9, "Kỷ Mùi": 0.7,
  "Canh Thân": 1.2, "Tân Dậu": 0.6, "Nhâm Tuất": 0.7, "Quý Hợi": 0.8,
};

const MONTH_WEIGHTS = [0.6, 0.7, 1.8, 0.9, 0.5, 1.6, 0.8, 1.5, 1.8, 0.8, 0.9, 0.5];
const DAY_WEIGHTS = [
  0.5, 1.0, 0.8, 1.5, 1.6, 1.5, 0.8, 1.6, 0.8, 1.6,
  0.9, 1.7, 0.8, 1.7, 1.0, 0.8, 0.9, 1.8, 0.5, 1.5,
  1.0, 0.9, 0.8, 0.9, 1.5, 1.8, 0.7, 0.8, 1.6, 0.6,
];
const HOUR_WEIGHTS = [1.6, 0.6, 0.7, 1.0, 0.9, 1.6, 1.0, 0.8, 0.8, 0.9, 0.6, 0.9];

export interface CanXuongResult {
  luong: number;
  chi: number;
  total: string;
  reading: string;
  interpretation: string;
  title: string;
  level: "excellent" | "good" | "neutral" | "challenging";
}

export function calculateCanXuong(
  year: number,
  month: number,
  day: number,
  hourIndex: number
): CanXuongResult {
  const yearName = getYearCanChi(year);
  const yW = YEAR_WEIGHTS[yearName] || 1.0;
  const mW = MONTH_WEIGHTS[Math.max(0, Math.min(11, month - 1))];
  const dW = DAY_WEIGHTS[Math.max(0, Math.min(29, day - 1))];
  const hW = HOUR_WEIGHTS[Math.max(0, Math.min(11, hourIndex))];

  const total = yW + mW + dW + hW;
  const luong = Math.floor(total);
  const chiVal = Math.round((total - luong) * 10);

  return {
    luong,
    chi: chiVal,
    total: total.toFixed(1),
    ...getCanXuongReading(total),
  };
}

function getCanXuongReading(weight: number): {
  reading: string;
  interpretation: string;
  title: string;
  level: "excellent" | "good" | "neutral" | "challenging";
} {
  if (weight >= 6.0) {
    return {
      title: "Đại Phú Quý Số",
      reading: "Vinh hoa phú quý, hậu vận rực rỡ.",
      interpretation:
        "Lượng Chỉ của bạn thuộc hàng đại phú quý. Tiền tài dồi dào, sự nghiệp thăng hoa như diều gặp gió. Phúc lộc song toàn, gia đình hòa thuận, con cháu hiếu thảo. Đây là mệnh cách nhận được nhiều ân huệ từ trời cao. Hậu vận ngày càng vẻ vang, tiếng thơm lưu truyền.",
      level: "excellent",
    };
  }
  if (weight >= 5.0) {
    return {
      title: "Thượng Thượng Số",
      reading: "Số phúc lộc dày, công danh sự nghiệp hanh thông.",
      interpretation:
        "Phúc đức tích luỹ từ nhiều đời, vận trình thông suốt. Bạn có khả năng xây dựng sự nghiệp vững chắc, được quý nhân phù trợ trong lúc khó khăn. Tài lộc phong phú, tình duyên trọn vẹn. Tuổi trung niên sẽ là giai đoạn cực thịnh trong cuộc đời.",
      level: "excellent",
    };
  }
  if (weight >= 4.5) {
    return {
      title: "Phúc Lộc Tề Lai",
      reading: "Vận đến như nước chảy, tài lộc an nhàn.",
      interpretation:
        "Cuộc đời bạn nhìn chung thuận lợi, tài lộc từ từ tích lũy theo năm tháng. Ở tuổi trung niên bắt đầu gặt hái thành quả. Tuy có lúc vất vả nhưng luôn có người tốt giúp đỡ. Gia đình ổn định, sức khỏe dồi dào, cuối đời an nhàn hưởng phúc.",
      level: "good",
    };
  }
  if (weight >= 4.0) {
    return {
      title: "Tự Thành Chí Phú",
      reading: "Tự lực cánh sinh, kiên trì ắt thành công.",
      interpretation:
        "Bạn thuộc típ người phải tự thân vận động, ít nhờ cậy người khác. Thuở thiếu thời có thể khó khăn, nhưng ý chí kiên cường sẽ giúp bạn vượt qua tất cả. Trung vận bắt đầu ổn định, hậu vận về cơ bản an lành. Cần biết tiết kiệm và đầu tư đúng hướng.",
      level: "good",
    };
  }
  if (weight >= 3.5) {
    return {
      title: "Bình Thường Số",
      reading: "Bình hòa, đủ ăn đủ mặc, cuộc đời ít biến động.",
      interpretation:
        "Vận mệnh theo hướng trung bình, không quá thăng hoa nhưng cũng không quá khó khăn. Cuộc sống bình lặng, giản dị. Tài lộc đủ chi tiêu nhưng không giàu có dư dả. Phúc lành ở chỗ ít phải tranh đấu căng thẳng, tâm hồn thanh thản. Nên trân trọng những điều nhỏ bé trong cuộc sống.",
      level: "neutral",
    };
  }
  if (weight >= 3.0) {
    return {
      title: "Tiểu Khổ Đại Sướng",
      reading: "Sớm gian khổ, muộn an nhàn, kiên trì là bí quyết.",
      interpretation:
        "Thuở đầu đời thường gặp nhiều gian truân thử thách, nhưng đây là quá trình tôi luyện để trưởng thành. Sau tuổi 40, vận khí bắt đầu chuyển tốt dần. Biết nhẫn nại, chăm chỉ và trung thực là chìa khóa giúp bạn vượt qua khó khăn và tiến đến thành công.",
      level: "neutral",
    };
  }
  return {
    title: "Thử Thách Số",
    reading: "Mệnh cách cần nỗ lực phi thường, phúc lộc đến sau gian khó.",
    interpretation:
      "Cuộc đời chứa đựng nhiều thử thách và biến cố. Tuy nhiên, đây không phải điều bất hạnh - đây là cơ hội để bạn rèn giũa bản thân trở nên phi thường. Những người có số này nếu kiên trì không buông bỏ, cuối cùng sẽ đạt được điều người khác không thể. Cần chú ý sức khỏe và tránh xa các quyết định liều lĩnh.",
    level: "challenging",
  };
}

// ==========================================
// BÁT TRẠCH / CUNG PHI CALCULATION
// ==========================================
export type CungPhi =
  | "Khảm" | "Khôn" | "Chấn" | "Tốn"
  | "Càn" | "Đoài" | "Cấn" | "Ly";

export interface BatTrachResult {
  cung: CungPhi;
  menh: "Đông Tứ Mệnh" | "Tây Tứ Mệnh";
  sinhKhi: string;
  thienY: string;
  dienNien: string;
  phucVi: string;
  tuyetMenh: string;
  nguQuy: string;
  lucSat: string;
  hoaHai: string;
  compassDeg: number;
  description: string;
}

const CUNG_DATA: Record<CungPhi, Omit<BatTrachResult, "cung">> = {
  Khảm: {
    menh: "Đông Tứ Mệnh",
    sinhKhi: "Đông Nam",
    thienY: "Đông",
    dienNien: "Nam",
    phucVi: "Bắc",
    tuyetMenh: "Tây",
    nguQuy: "Đông Bắc",
    lucSat: "Tây Bắc",
    hoaHai: "Tây Nam",
    compassDeg: 0,
    description: "Khảm thuộc Thủy, hành Thuỷ. Người mệnh Khảm thông minh, nhạy cảm, sâu sắc như dòng nước. Giỏi phân tích và thích sự yên tĩnh để tư duy.",
  },
  Khôn: {
    menh: "Tây Tứ Mệnh",
    sinhKhi: "Đông Bắc",
    thienY: "Tây",
    dienNien: "Tây Bắc",
    phucVi: "Tây Nam",
    tuyetMenh: "Đông",
    nguQuy: "Đông Nam",
    lucSat: "Nam",
    hoaHai: "Bắc",
    compassDeg: 225,
    description: "Khôn thuộc Địa, hành Thổ. Người mệnh Khôn kiên nhẫn, chịu khó, trung thực. Có tính bao dung và khả năng nuôi dưỡng điều tốt đẹp.",
  },
  Chấn: {
    menh: "Đông Tứ Mệnh",
    sinhKhi: "Nam",
    thienY: "Bắc",
    dienNien: "Đông Nam",
    phucVi: "Đông",
    tuyetMenh: "Tây Nam",
    nguQuy: "Tây",
    lucSat: "Đông Bắc",
    hoaHai: "Tây Bắc",
    compassDeg: 90,
    description: "Chấn thuộc Lôi, hành Mộc. Người mệnh Chấn năng động, mạnh mẽ, nhiệt huyết. Có khả năng lãnh đạo tự nhiên và tinh thần khởi nghiệp cao.",
  },
  Tốn: {
    menh: "Đông Tứ Mệnh",
    sinhKhi: "Bắc",
    thienY: "Nam",
    dienNien: "Đông",
    phucVi: "Đông Nam",
    tuyetMenh: "Tây Bắc",
    nguQuy: "Tây Nam",
    lucSat: "Tây",
    hoaHai: "Đông Bắc",
    compassDeg: 135,
    description: "Tốn thuộc Phong, hành Mộc. Người mệnh Tốn thông minh, linh hoạt, khéo léo trong giao tiếp. Nhạy cảm với cái đẹp và có tư duy nghệ thuật tinh tế.",
  },
  Càn: {
    menh: "Tây Tứ Mệnh",
    sinhKhi: "Tây",
    thienY: "Tây Bắc",
    dienNien: "Đông Bắc",
    phucVi: "Tây Nam",
    tuyetMenh: "Đông",
    nguQuy: "Đông Nam",
    lucSat: "Nam",
    hoaHai: "Bắc",
    compassDeg: 315,
    description: "Càn thuộc Thiên, hành Kim. Người mệnh Càn có chí khí mạnh mẽ, quyết đoán, ý chí kiên định. Thường có năng lực lãnh đạo xuất chúng.",
  },
  Đoài: {
    menh: "Tây Tứ Mệnh",
    sinhKhi: "Tây Bắc",
    thienY: "Tây Nam",
    dienNien: "Đông Bắc",
    phucVi: "Tây",
    tuyetMenh: "Đông Nam",
    nguQuy: "Nam",
    lucSat: "Đông",
    hoaHai: "Bắc",
    compassDeg: 270,
    description: "Đoài thuộc Trạch, hành Kim. Người mệnh Đoài vui vẻ, hoạt bát, duyên dáng. Thích giao tiếp và có khả năng thuyết phục người khác rất tốt.",
  },
  Cấn: {
    menh: "Tây Tứ Mệnh",
    sinhKhi: "Tây Nam",
    thienY: "Tây Bắc",
    dienNien: "Tây",
    phucVi: "Đông Bắc",
    tuyetMenh: "Nam",
    nguQuy: "Đông",
    lucSat: "Đông Nam",
    hoaHai: "Bắc",
    compassDeg: 45,
    description: "Cấn thuộc Sơn, hành Thổ. Người mệnh Cấn trầm tĩnh, kiên định, đáng tin cậy. Giỏi tích lũy và có khả năng xây dựng nền tảng vững chắc.",
  },
  Ly: {
    menh: "Đông Tứ Mệnh",
    sinhKhi: "Đông",
    thienY: "Đông Nam",
    dienNien: "Bắc",
    phucVi: "Nam",
    tuyetMenh: "Tây Nam",
    nguQuy: "Tây Bắc",
    lucSat: "Tây",
    hoaHai: "Đông Bắc",
    compassDeg: 180,
    description: "Ly thuộc Hỏa, hành Hỏa. Người mệnh Ly nhiệt tình, sáng tạo, có charisma tự nhiên. Nổi bật trong đám đông và thích các lĩnh vực nghệ thuật, thẩm mỹ.",
  },
};

export function calculateBatTrach(year: number, gender: "male" | "female"): BatTrachResult {
  let s = year % 9;
  if (s === 0) s = 9;

  let cungIndex: number;
  if (gender === "male") {
    cungIndex = 11 - s;
    if (cungIndex > 9) cungIndex -= 9;
    if (cungIndex === 0) cungIndex = 9;
  } else {
    cungIndex = 4 + s;
    if (cungIndex > 9) cungIndex -= 9;
    if (cungIndex === 0) cungIndex = 9;
  }

  // Map index to Cung Phi (based on Lo Shu square positions)
  const maleMap: Record<number, CungPhi> = {
    1: "Khảm", 2: "Khôn", 3: "Chấn", 4: "Tốn",
    5: "Khôn", 6: "Càn", 7: "Đoài", 8: "Cấn", 9: "Ly",
  };
  const femaleMap: Record<number, CungPhi> = {
    1: "Khảm", 2: "Khôn", 3: "Chấn", 4: "Tốn",
    5: "Cấn", 6: "Càn", 7: "Đoài", 8: "Cấn", 9: "Ly",
  };

  const map = gender === "male" ? maleMap : femaleMap;
  const cung = map[cungIndex] || "Khảm";

  return { cung, ...CUNG_DATA[cung] };
}

// ==========================================
// DAILY LUCK (TỬ VI HÀNG NGÀY)
// ==========================================
const LUCKY_COLORS: Record<string, string[]> = {
  "Giáp": ["Xanh lá", "Xanh lam"],
  "Ất": ["Xanh lá", "Trắng"],
  "Bính": ["Đỏ", "Cam"],
  "Đinh": ["Đỏ", "Hồng"],
  "Mậu": ["Vàng", "Nâu"],
  "Kỷ": ["Vàng", "Cam"],
  "Canh": ["Trắng", "Bạc"],
  "Tân": ["Trắng", "Vàng"],
  "Nhâm": ["Đen", "Xanh lam"],
  "Quý": ["Đen", "Tím"],
};

const DAILY_MESSAGES = [
  "Năng lượng hôm nay tích cực — hãy tận dụng buổi sáng sớm để khởi động những dự án quan trọng.",
  "Quý nhân xuất hiện hôm nay. Đừng ngại ngùng khi cần sự giúp đỡ từ bạn bè và đồng nghiệp.",
  "Tâm trí cần được nghỉ ngơi. Hôm nay phù hợp để suy nghĩ, lập kế hoạch hơn là hành động vội vàng.",
  "Tài lộc có dấu hiệu khởi sắc. Nắm bắt cơ hội nhưng hãy cẩn thận với những quyết định tài chính lớn.",
  "Hôm nay cát khí bao phủ. Mọi việc bạn làm với tâm thế tích cực đều dễ dàng thành công.",
  "Tránh tranh luận và mâu thuẫn hôm nay. Hòa khí sinh tài, nhường nhịn là thắng.",
  "Sáng tạo đang ở đỉnh cao. Đây là thời điểm tuyệt vời để thực hiện các ý tưởng nghệ thuật.",
  "Sức khỏe cần được chú ý. Uống đủ nước, nghỉ ngơi đúng giờ và tránh thức khuya.",
  "Mối quan hệ được ưu ái hôm nay. Kết nối với người thân và bạn bè sẽ mang lại năng lượng tốt.",
  "Kiên nhẫn là chìa khóa của ngày hôm nay. Những việc đang tiến hành sẽ có kết quả tốt nếu bạn không nóng vội.",
  "Hôm nay thích hợp để học hỏi và tiếp thu kiến thức mới. Tư duy mở sẽ đem lại nhiều điều thú vị.",
  "Trực giác của bạn đang rất nhạy bén. Hãy lắng nghe tiếng lòng khi đưa ra các quyết định quan trọng.",
];

export interface DailyLuck {
  message: string;
  luckyNumbers: number[];
  luckyColor: string;
  luckyDirection: string;
  luckyHour: string;
  energy: number; // 1-5
}

export function getDailyLuck(birthYear: number, date: Date): DailyLuck {
  const can = getYearCan(birthYear);
  const colors = LUCKY_COLORS[can] || ["Vàng", "Trắng"];

  const dayOfYear =
    Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = (birthYear + dayOfYear + date.getDate()) % 100;

  const messageIdx = (seed + birthYear) % DAILY_MESSAGES.length;
  const message = DAILY_MESSAGES[messageIdx];

  const luckyNumbers = [
    ((seed * 3 + 7) % 9) + 1,
    ((seed * 7 + 13) % 9) + 1,
    ((birthYear + dayOfYear) % 9) + 1,
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const directions = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Đông Bắc", "Tây Nam", "Tây Bắc"];
  const luckyDirection = directions[seed % directions.length];

  const gioChi = CHI;
  const luckyHour = gioChi[(seed * 3) % 12];

  const energy = Math.max(1, Math.min(5, Math.floor(((seed % 5) + 1))));

  return {
    message,
    luckyNumbers,
    luckyColor: colors[dayOfYear % colors.length],
    luckyDirection,
    luckyHour: `Giờ ${luckyHour}`,
    energy,
  };
}

// ==========================================
// HOÀNG ĐẠO / HẮC ĐẠO CALENDAR
// ==========================================
// Simplified but realistic: based on lunar day patterns
const HOANG_DAO_DAYS = [1, 7, 8, 14, 15, 20, 21, 27, 28]; // Lunar days considered auspicious

export interface DayInfo {
  lunarDay: number;
  lunarMonth: number;
  isHoangDao: boolean;
  isHacDao: boolean;
  gioHoangDao: string[];
  canChi: string;
}

export function getDayInfo(date: Date): DayInfo {
  const lunar = solarToLunar(date);
  const isHoangDao = HOANG_DAO_DAYS.includes(lunar.day);
  const isHacDao = [4, 10, 11, 17, 18, 24, 25].includes(lunar.day);

  // Giờ Hoàng Đạo varies by day's can chi - simplified table
  const gioMap = [
    ["Tý", "Sửu", "Mão", "Ngọ", "Mùi", "Dậu"],
    ["Dần", "Mão", "Tỵ", "Thân", "Dậu", "Hợi"],
    ["Tý", "Dần", "Mão", "Tỵ", "Ngọ", "Thân"],
    ["Sửu", "Dần", "Thìn", "Mùi", "Thân", "Tuất"],
    ["Tý", "Thìn", "Tỵ", "Mùi", "Tuất", "Hợi"],
  ];
  const dayHashIdx = (date.getDate() + date.getMonth()) % 5;

  return {
    lunarDay: lunar.day,
    lunarMonth: lunar.month,
    isHoangDao,
    isHacDao,
    gioHoangDao: gioMap[dayHashIdx],
    canChi: lunar.canChi,
  };
}
