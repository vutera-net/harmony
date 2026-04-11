import { calculateBatTrach, CungPhi, getYearCan, getYearChi, solarToLunar } from "./lunar-logic";

export interface TuongHopResult {
  canScore: number;
  canText: string;
  canDesc: string;
  chiScore: number;
  chiText: string;
  chiDesc: string;
  cungScore: number;
  cungText: string;
  cungDesc: string;
  totalScore: number;
  interpretation: string;
}

export function calculateTuongHop(
  year1: number, gender1: "male" | "female",
  year2: number, gender2: "male" | "female"
): TuongHopResult {
  
  // Lấy Can Chi năm
  const can1 = getYearCan(year1);
  const can2 = getYearCan(year2);
  const chi1 = getYearChi(year1);
  const chi2 = getYearChi(year2);
  
  // 1. Xét Thiên Can (Max: 2, Bình: 1, Khắc: 0) -> Convert to 20 điểm
  let canScore = 10;
  let canText = "Bình Hòa";
  let canDesc = "Thiên can của hai người không sinh không khắc, ở mức độ bình hòa, dễ sống chung.";

  const canHop: Record<string, string> = {
    "Giáp": "Kỷ", "Kỷ": "Giáp",
    "Ất": "Canh", "Canh": "Ất",
    "Bính": "Tân", "Tân": "Bính",
    "Đinh": "Nhâm", "Nhâm": "Đinh",
    "Mậu": "Quý", "Quý": "Mậu"
  };

  const canKhac: Record<string, string[]> = {
    "Giáp": ["Mậu", "Canh"], "Ất": ["Kỷ", "Tân"], "Bính": ["Canh", "Nhâm"],
    "Đinh": ["Tân", "Quý"], "Mậu": ["Nhâm", "Giáp"], "Kỷ": ["Quý", "Ất"],
    "Canh": ["Giáp", "Bính"], "Tân": ["Ất", "Đinh"], "Nhâm": ["Bính", "Mậu"],
    "Quý": ["Đinh", "Kỷ"]
  };

  if (canHop[can1] === can2) {
    canScore = 20;
    canText = "Tương Hợp";
    canDesc = `Thiên can ${can1} và ${can2} tương hợp, rất tốt. Vợ chồng tâm đầu ý hợp, dễ ăn nên làm ra.`;
  } else if (canKhac[can1]?.includes(can2) || canKhac[can2]?.includes(can1)) {
    canScore = 2; // Cực thấp
    canText = "Tương Khắc";
    canDesc = `Thiên can ${can1} và ${can2} mang tính xung khắc. Đôi khi dễ bất đồng quan điểm, cần sự nhường nhịn lớn từ cả hai phía.`;
  }

  // 2. Xét Địa Chi (Max: 40 điểm)
  let chiScore = 15;
  let chiText = "Bình Hòa";
  let chiDesc = "Địa chi của hai vợ chồng không hình khắc cũng không hợp, gia đạo bình yên.";

  const tamHop = [
    ["Dần", "Ngọ", "Tuất"],
    ["Hợi", "Mão", "Mùi"],
    ["Thân", "Tý", "Thìn"],
    ["Tỵ", "Dậu", "Sửu"]
  ];
  
  const lucHop = [
    ["Tý", "Sửu"], ["Dần", "Hợi"], ["Mão", "Tuất"],
    ["Thìn", "Dậu"], ["Tỵ", "Thân"], ["Ngọ", "Mùi"]
  ];

  const lucXung = [
    ["Tý", "Ngọ"], ["Sửu", "Mùi"], ["Dần", "Thân"],
    ["Mão", "Dậu"], ["Thìn", "Tuất"], ["Tỵ", "Hợi"]
  ];

  const isTamHop = tamHop.some(group => group.includes(chi1) && group.includes(chi2));
  const isLucHop = lucHop.some(pair => pair.includes(chi1) && pair.includes(chi2));
  const isLucXung = lucXung.some(pair => pair.includes(chi1) && pair.includes(chi2));

  if (isTamHop || isLucHop) {
    chiScore = 40;
    chiText = isTamHop ? "Tam Hợp" : "Lục Hợp";
    chiDesc = `Địa chi ${chi1} và ${chi2} thuộc ${chiText}. Sự kết hợp này mang lại may mắn, gia đình đầm ấm, hậu thuẫn vững chắc cho nhau.`;
  } else if (isLucXung) {
    chiScore = 0;
    chiText = "Lục Xung";
    chiDesc = `Địa chi ${chi1} và ${chi2} nằm trong bộ Lục Xung. Tính cách có nhiều điểm đối lập, dễ xảy ra cãi vã. Cần lấy tình yêu thương và sự thấu hiểu làm trọng.`;
  }

  // 3. Xét Cung Phi (Max: 40 điểm)
  const cung1 = calculateBatTrach(year1, gender1).cung;
  const cung2 = calculateBatTrach(year2, gender2).cung;

  let cungScore = 0;
  let cungText = "";
  let cungDesc = "";

  // Bảng kết hợp Cung Phi Bát Trạch (Hôn nhân)
  const cungMatrix: Record<CungPhi, Record<CungPhi, { text: string; score: number }>> = {
    "Càn": { "Càn": { text: "Phục Vị", score: 25 }, "Khảm": { text: "Lục Sát", score: 5 }, "Cấn": { text: "Thiên Y", score: 35 }, "Chấn": { text: "Ngũ Quỷ", score: 2 }, "Tốn": { text: "Họa Hại", score: 10 }, "Ly": { text: "Tuyệt Mệnh", score: 0 }, "Khôn": { text: "Diên Niên", score: 30 }, "Đoài": { text: "Sinh Khí", score: 40 } },
    "Khảm": { "Càn": { text: "Lục Sát", score: 5 }, "Khảm": { text: "Phục Vị", score: 25 }, "Cấn": { text: "Ngũ Quỷ", score: 2 }, "Chấn": { text: "Thiên Y", score: 35 }, "Tốn": { text: "Sinh Khí", score: 40 }, "Ly": { text: "Diên Niên", score: 30 }, "Khôn": { text: "Tuyệt Mệnh", score: 0 }, "Đoài": { text: "Họa Hại", score: 10 } },
    "Cấn": { "Càn": { text: "Thiên Y", score: 35 }, "Khảm": { text: "Ngũ Quỷ", score: 2 }, "Cấn": { text: "Phục Vị", score: 25 }, "Chấn": { text: "Lục Sát", score: 5 }, "Tốn": { text: "Tuyệt Mệnh", score: 0 }, "Ly": { text: "Họa Hại", score: 10 }, "Khôn": { text: "Sinh Khí", score: 40 }, "Đoài": { text: "Diên Niên", score: 30 } },
    "Chấn": { "Càn": { text: "Ngũ Quỷ", score: 2 }, "Khảm": { text: "Thiên Y", score: 35 }, "Cấn": { text: "Lục Sát", score: 5 }, "Chấn": { text: "Phục Vị", score: 25 }, "Tốn": { text: "Diên Niên", score: 30 }, "Ly": { text: "Sinh Khí", score: 40 }, "Khôn": { text: "Họa Hại", score: 10 }, "Đoài": { text: "Tuyệt Mệnh", score: 0 } },
    "Tốn": { "Càn": { text: "Họa Hại", score: 10 }, "Khảm": { text: "Sinh Khí", score: 40 }, "Cấn": { text: "Tuyệt Mệnh", score: 0 }, "Chấn": { text: "Diên Niên", score: 30 }, "Tốn": { text: "Phục Vị", score: 25 }, "Ly": { text: "Thiên Y", score: 35 }, "Khôn": { text: "Ngũ Quỷ", score: 2 }, "Đoài": { text: "Lục Sát", score: 5 } },
    "Ly": { "Càn": { text: "Tuyệt Mệnh", score: 0 }, "Khảm": { text: "Diên Niên", score: 30 }, "Cấn": { text: "Họa Hại", score: 10 }, "Chấn": { text: "Sinh Khí", score: 40 }, "Tốn": { text: "Thiên Y", score: 35 }, "Ly": { text: "Phục Vị", score: 25 }, "Khôn": { text: "Lục Sát", score: 5 }, "Đoài": { text: "Ngũ Quỷ", score: 2 } },
    "Khôn": { "Càn": { text: "Diên Niên", score: 30 }, "Khảm": { text: "Tuyệt Mệnh", score: 0 }, "Cấn": { text: "Sinh Khí", score: 40 }, "Chấn": { text: "Họa Hại", score: 10 }, "Tốn": { text: "Ngũ Quỷ", score: 2 }, "Ly": { text: "Lục Sát", score: 5 }, "Khôn": { text: "Phục Vị", score: 25 }, "Đoài": { text: "Thiên Y", score: 35 } },
    "Đoài": { "Càn": { text: "Sinh Khí", score: 40 }, "Khảm": { text: "Họa Hại", score: 10 }, "Cấn": { text: "Diên Niên", score: 30 }, "Chấn": { text: "Tuyệt Mệnh", score: 0 }, "Tốn": { text: "Lục Sát", score: 5 }, "Ly": { text: "Ngũ Quỷ", score: 2 }, "Khôn": { text: "Thiên Y", score: 35 }, "Đoài": { text: "Phục Vị", score: 25 } },
  };

  const cungResult = cungMatrix[cung1][cung2];
  cungScore = cungResult.score;
  cungText = cungResult.text;

  if (cungScore >= 30) {
    cungDesc = `Hai cung ${cung1} và ${cung2} kết hợp ra sao ${cungText}. Đây là cung đại cát, mang lại sức khỏe, tài lộc nhà cửa hưng vượng, con cái cái thành đạt.`;
  } else if (cungScore >= 20) {
    cungDesc = `Hai cung ${cung1} và ${cung2} kết hợp ra sao ${cungText}. Gia đạo yên vui, vợ chồng hòa thuận, cuộc sống no đủ vững bền.`;
  } else if (cungScore >= 10) {
    cungDesc = `Hai cung ${cung1} và ${cung2} gặp sao ${cungText}. Dễ có thị phi hoặc trắc trở nhỏ trong gia đình. Cần tu dưỡng tính tình, khoan dung độ lượng.`;
  } else {
    cungDesc = `Hai cung ${cung1} và ${cung2} phạm sao ${cungText}. Mang ý nghĩa xung khắc mạnh, hao tài tốn của hoặc bệnh tật. Nên hóa giải bằng phong thủy nhà ở (hướng bếp, hướng luân) và đặc biệt là sự chân thành tha thứ cho nhau.`;
  }

  const totalScore = canScore + chiScore + cungScore;
  let interpretation = "";

  if (totalScore >= 80) {
    interpretation = "Trời Sinh Một Cặp! Mức độ tương hợp cực kỳ cao, hai bạn sinh ra là để dành cho nhau. Cuộc sống hôn nhân sẽ ngập tràn hạnh phúc và tài lộc dồi dào.";
  } else if (totalScore >= 60) {
    interpretation = "Tương hợp rất tốt. Dù có đôi lúc mâu thuẫn nhưng hai bạn luôn biết cách dung hòa và xây dựng gia đình êm ấm.";
  } else if (totalScore >= 40) {
    interpretation = "Mức độ tương hợp trung bình. Cần nhiều sự cố gắng thấu hiểu và nhường nhịn từ cả hai phía để vượt qua các khúc mắc trong cuộc sống.";
  } else {
    interpretation = "Có nhiều điểm xung khắc trong bản mệnh. Tuy nhiên, mệnh do trời định nhưng phận do người tạo. Cả hai cần sự nhẫn nại phi thường và tình yêu lớn lao để hóa giải những khác biệt.";
  }

  return {
    canScore, canText, canDesc,
    chiScore, chiText, chiDesc,
    cungScore, cungText, cungDesc,
    totalScore, interpretation
  };
}
