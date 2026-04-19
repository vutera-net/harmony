import { UserProfile } from "../context/UserContext";
import { RadarData } from "../components/RadarChart";

export interface DailyEnergy {
  score: number;
  status: string;
  advice: string;
  elementBalance: RadarData;
}

export function getDailyEnergy(profile: UserProfile | null): DailyEnergy {
  // If no profile, return neutral data
  if (!profile) {
    return {
      score: 50,
      status: "Trung bình",
      advice: "Hãy cập nhật hồ sơ để nhận phân tích năng lượng cá nhân hóa.",
      elementBalance: { Kim: 25, Mộc: 25, Thủy: 25, Hỏa: 25, Thổ: 25 },
    };
  }

  // Use birthYear and today's date to generate deterministic "personalized" data
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const userSeed = profile.birthYear + (profile.gender === "male" ? 1 : 0);
  const seed = dateSeed + userSeed;

  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const score = Math.floor(pseudoRandom(1) * 100);
  
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
    Kim: Math.floor(pseudoRandom(2) * 50),
    Mộc: Math.floor(pseudoRandom(3) * 50),
    Thủy: Math.floor(pseudoRandom(4) * 50),
    Hỏa: Math.floor(pseudoRandom(5) * 50),
    Thổ: Math.floor(pseudoRandom(6) * 50),
  };

  return {
    score,
    status,
    advice,
    elementBalance,
  };
}
