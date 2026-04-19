import { UserProfile } from "../context/UserContext";
import { RadarData } from "../components/RadarChart";
import { calculateBatTu, NguHanh } from "./battu-logic";

export interface DailyEnergy {
  score: number;
  status: string;
  advice: string;
  elementBalance: RadarData;
  luckyHour: string;
  luckyNumbers: string[];
  luckyColors: string[];
}

const NGU_HANH_SINH: Record<NguHanh, NguHanh> = {
  Thủy: "Mộc",
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim",
  Kim: "Thủy",
};

const NGU_HANH_KHAC: Record<NguHanh, NguHanh> = {
  Thủy: "Hỏa",
  Hỏa: "Kim",
  Kim: "Mộc",
  Mộc: "Thổ",
  Thổ: "Thủy",
};

const LUCKY_NUMBERS: Record<NguHanh, string[]> = {
  Kim: ["4", "9"],
  Mộc: ["3", "8"],
  Thủy: ["1", "6"],
  Hỏa: ["2", "7"],
  Thổ: ["0", "5"],
};

const LUCKY_COLORS: Record<NguHanh, string[]> = {
  Kim: ["Trắng", "Bạc", "Vàng"],
  Mộc: ["Xanh lá", "Xanh dương"],
  Thủy: ["Xanh dương", "Đen"],
  Hỏa: ["Đỏ", "Tím", "Xanh lá"],
  Thổ: ["Vàng", "Nâu", "Đỏ"],
};

const HOUR_MAP: Record<string, string[]> = {
  "Tý": ["7-9h (Thìn)", "11-13h (Ngọ)", "15-17h (Thân)"],
  "Sửu": ["9-11h (Tỵ)", "13-15h (Mùi)", "17-19h (Dậu)"],
  "Dần": ["11-13h (Ngọ)", "15-17h (Thân)", "19-21h (Tuất)"],
  "Mão": ["13-15h (Mùi)", "17-19h (Dậu)", "21-23h (Hợi)"],
  "Thìn": ["15-17h (Thân)", "19-21h (Tuất)", "23-1h (Tý)"],
  "Tỵ": ["17-19h (Dậu)", "21-23h (Hợi)", "1-3h (Sửu)"],
  "Ngọ": ["19-21h (Tuất)", "23-1h (Tý)", "3-5h (Dần)"],
  "Mùi": ["21-23h (Hợi)", "1-3h (Sửu)", "5-7h (Mão)"],
  "Thân": ["23-1h (Tý)", "3-5h (Dần)", "7-9h (Thìn)"],
  "Dậu": ["1-3h (Sửu)", "5-7h (Mão)", "9-11h (Tỵ)"],
  "Tuất": ["3-5h (Dần)", "7-9h (Thìn)", "11-13h (Ngọ)"],
  "Hợi": ["5-7h (Mão)", "9-11h (Tỵ)", "13-15h (Mùi)"],
};

export function getDailyEnergy(profile: UserProfile | null): DailyEnergy {
  if (!profile) {
    return {
      score: 50,
      status: "Trung bình",
      advice: "Hãy cập nhật hồ sơ để nhận phân tích năng lượng cá nhân hóa.",
      elementBalance: { Kim: 25, Mộc: 25, Thủy: 25, Hỏa: 25, Thổ: 25 },
      luckyHour: "N/A",
      luckyNumbers: [],
      luckyColors: [],
    };
  }

  const birthDate = new Date(profile.birthDate);
  const userBatTu = calculateBatTu(birthDate);
  const today = new Date();
  const dayBatTu = calculateBatTu(today);

  const dayMaster = userBatTu.day.canHanh;
  const todayElement = dayBatTu.day.canHanh;

  let score = 50;

  if (NGU_HANH_SINH[todayElement] === dayMaster) {
    score += 20;
  } else if (todayElement === dayMaster) {
    score += 10;
  } else if (NGU_HANH_SINH[dayMaster] === todayElement) {
    score -= 10;
  } else if (NGU_HANH_KHAC[todayElement] === dayMaster) {
    score -= 20;
  } else if (NGU_HANH_KHAC[dayMaster] === todayElement) {
    score -= 10;
  }

  const deficientElements = userBatTu.khuyet;
  if (deficientElements.includes(todayElement)) {
    score += 15;
  }

  score = Math.max(0, Math.min(100, score));

  let status = "Ổn định";
  let advice = "Hôm nay là một ngày bình thường, hãy duy trì nhịp sống cân bằng.";

  if (score > 80) {
    status = "Hưng thịnh";
    advice = "Năng lượng của bạn đang ở mức rất cao. Đây là thời điểm tuyệt vời để bắt đầu những dự án mới hoặc đưa ra quyết định quan trọng.";
  } else if (score > 60) {
    status = "Tích cực";
    advice = "Bạn đang có tâm trạng tốt và năng lượng dồi dào. Hãy tận dụng điều này để kết nối với mọi người xung quanh.";
  } else if (score > 40) {
    status = "Điềm tĩnh";
    advice = "Một ngày thích hợp để chiêm nghiệm, đọc sách và chăm sóc bản thân. Đừng quá vội vàng trong công việc.";
  } else if (score > 20) {
    status = "Suy giảm";
    advice = "Bạn có thể cảm thấy hơi mệt mỏi. Hãy dành thời gian nghỉ ngơi, uống nhiều nước và tránh những xung đột không cần thiết.";
  } else {
    status = "Kiệt sức";
    advice = "Năng lượng hôm nay rất thấp. Hãy cho phép bản thân được nghỉ ngơi hoàn toàn. Một giấc ngủ sâu sẽ giúp bạn phục hồi.";
  }

  const elementBalance: RadarData = {
    Kim: userBatTu.nguHanhPercent.Kim,
    Mộc: userBatTu.nguHanhPercent.Mộc,
    Thủy: userBatTu.nguHanhPercent.Thủy,
    Hỏa: userBatTu.nguHanhPercent.Hỏa,
    Thổ: userBatTu.nguHanhPercent.Thổ,
  };

  const todayChi = dayBatTu.day.chi;
  const luckyHours = HOUR_MAP[todayChi] || ["N/A"];
  const luckyHour = luckyHours[0];

  const supportingElement = Object.keys(NGU_HANH_SINH).find(
    (el) => NGU_HANH_SINH[el as NguHanh] === dayMaster
  ) as NguHanh;

  return {
    score,
    status,
    advice,
    elementBalance,
    luckyHour,
    luckyNumbers: LUCKY_NUMBERS[supportingElement],
    luckyColors: LUCKY_COLORS[supportingElement],
  };
}
