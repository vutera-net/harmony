export interface CompatibilityResult {
  score: number;
  message: string;
  type: "Tương Sinh" | "Bình Hòa" | "Tương Khắc";
}

// Bảng luật sinh khắc Ngũ hành: Mộc -> Hỏa -> Thổ -> Kim -> Thủy -> Mộc
export function calculateCompatibility(elementA: string, elementB: string): CompatibilityResult {
  if (!elementA || !elementB) {
    return { score: 50, message: "Không đủ dữ liệu bản đồ sao", type: "Bình Hòa" };
  }

  const e1 = elementA.trim();
  const e2 = elementB.trim();

  // Cùng bản mệnh
  if (e1 === e2) {
    return { score: 75, message: "Mây tầng nào gặp mây tầng đó. Tần số bình ổn.", type: "Bình Hòa" };
  }

  // Bảng rule cứng cho Sinh/Khắc
  const rules = {
    "Kim": { sinh: "Thủy", khac: "Mộc", duocSinh: "Thổ", biKhac: "Hỏa" },
    "Mộc": { sinh: "Hỏa", khac: "Thổ", duocSinh: "Thủy", biKhac: "Kim" },
    "Thủy": { sinh: "Mộc", khac: "Hỏa", duocSinh: "Kim", biKhac: "Thổ" },
    "Hỏa": { sinh: "Thổ", khac: "Kim", duocSinh: "Mộc", biKhac: "Thủy" },
    "Thổ": { sinh: "Kim", khac: "Thủy", duocSinh: "Hỏa", biKhac: "Mộc" },
  };

  const aRules = (rules as any)[e1];
  
  if (!aRules) return { score: 50, message: "Không xác định", type: "Bình Hòa" };

  if (aRules.sinh === e2 || aRules.duocSinh === e2) {
    return { score: 95, message: "Đồng thanh tương ứng. Năng lượng hai bạn sinh ra bổ trợ hoàn hảo cho nhau.", type: "Tương Sinh" };
  }

  if (aRules.khac === e2 || aRules.biKhac === e2) {
    return { score: 35, message: "Sự đối kháng rực lửa. Khắc nhau không có nghĩa là buông bỏ, mà là để học cách dung hoà.", type: "Tương Khắc" };
  }

  return { score: 60, message: "Mỗi người một nhịp. Tuyệt đối tôn trọng khoảng trời riêng của nhau.", type: "Bình Hòa" };
}
