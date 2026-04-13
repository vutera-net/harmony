export interface AnnualHoroscopeTemplate {
  id: string
  category: 'general' | 'money' | 'love' | 'health' | 'career'
  zodiacAspects: Record<string, string[]> // branch name -> list of variations
}

/**
 * Templates for annual predictions based on Branch interactions
 * e.g. Year of Snake (Ti) meeting Year of Pig (Hoi) - Conflict Tuat-Hoi
 */
export const ANNUAL_TERMS = {
  tamHop: 'Tam Hợp',
  lucHop: 'Lục Hợp',
  tuHanhXung: 'Tứ Hành Xung',
  lucHai: 'Lục Hại',
  tuongPhu: 'Tương Phá',
}

export const ANNUAL_TEMPLATES = {
  general: [
    'Năm {{year}} mang đến vận trình {{rating}} cho người tuổi {{zodiac}}. Nhìn chung, đây là năm để {{action}}.',
    'Bước sang năm mới {{year}}, bản mệnh tuổi {{zodiac}} sẽ gặp nhiều {{luck}} nhưng cũng cần lưu ý {{risk}}.',
  ],
  career: [
    'Trên phương diện sự nghiệp, tuổi {{zodiac}} có cơ hội thăng tiến nhờ sự hỗ trợ của sao {{star}}.',
    'Công việc trong năm nay có nhiều đổi mới, đòi hỏi bạn phải thích nghi nhanh chóng với môi trường mới.',
  ],
  money: [
    'Tài lộc năm {{year}} có nhiều khởi sắc, đặc biệt là vào các tháng {{luckyMonths}}.',
    'Cần quản lý tài chính chặt chẽ, tránh đầu tư dàn trải không hiệu quả.',
  ],
  love: [
    'Chuyện tình cảm có nhiều cung bậc cảm xúc, người độc thân có cơ hội tìm thấy ý trung nhân.',
    'Gia đạo êm ấm, vợ chồng đồng thuận giúp vượt qua mọi khó khăn trong cuộc sống.',
  ],
  health: [
    'Sức khỏe ổn định, tuy nhiên bản mệnh cần chú ý các bệnh về {{weakness}}.',
    'Duy trì lối sống lành mạnh và thường xuyên rèn luyện thể thao để tăng cường sức đề kháng.',
  ],
}
