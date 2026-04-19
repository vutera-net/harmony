export const PERSONAL_DOUBT_TRIGGERS: Record<string, string> = {
  tuvi: 'Kết quả này chỉ dựa trên ngày sinh — chưa xét giờ sinh. Độ chính xác có thể thay đổi đáng kể theo giờ sinh của bạn.',
  phongthuy: 'Kết quả Bát Trạch mang tính tổng quan. Để biết hướng bố trí cụ thể theo từng phòng và căn nhà thực tế của bạn, cần thêm thông tin tại AnMenh.',
  ngaytot: 'Danh sách ngày tốt này chưa lọc theo tuổi của bạn. Kết quả thực tế có thể khác nếu xét Tam Nương và Sát Chủ theo tuổi.',
  horoscope: 'Dự báo này áp dụng chung cho tất cả người sinh năm đó. Dự báo cá nhân theo mệnh và giờ sinh có thể khác đáng kể.',
  
  // Specialized contexts for ContentLock
  daily_horoscope: 'Dự báo hôm nay áp dụng chung cho tất cả người sinh năm đó. Kết quả cá nhân hóa theo giờ sinh có thể mang lại góc nhìn chính xác hơn.',
  annual_horoscope: 'Luận giải năm áp dụng chung cho năm sinh. Để biết chính xác vận hạn từng tháng của riêng bạn, cần kết hợp với giờ sinh.',
  age_profile: 'Tử vi trọn đời mang tính định hướng chung. Những biến cố và cơ hội cụ thể phụ thuộc rất nhiều vào giờ sinh và cung mệnh cá nhân.',
  tuvi_library: 'Kiến thức này là lý thuyết chung. Việc áp dụng vào lá số thực tế của bạn cần sự phân tích chi tiết dựa trên giờ sinh chính xác.',
  horoscope_daily: 'Dự báo này áp dụng cho nhóm tuổi. Để biết ngày hôm nay thực sự ảnh hưởng thế nào đến bạn, hãy xem luận giải cá nhân.',
  ngaytot_age_filter: 'Ngày tốt cho nhiều người chưa chắc đã tốt cho bạn. Hãy lọc chính xác theo tuổi và giờ sinh để tránh ngày xung khắc.',
  ngaytot_more_results: 'Để không bỏ lỡ những ngày đại cát thực sự dành riêng cho tuổi của bạn, cần phân tích chi tiết hơn tại AnMenh.',
  phongthuy_cuucung: 'Phân tích Cửu Cung mang tính lý thuyết. Vị trí đặt vật phẩm phong thủy thực tế cần căn cứ vào tọa độ nhà và giờ sinh.',
  
  default: 'Kết quả này mang tính tổng quan theo năm sinh. Để chính xác hơn, cần thêm giờ sinh và thông tin cá nhân của bạn.',
}

export function getTriggerText(context: string): string {
  return PERSONAL_DOUBT_TRIGGERS[context] || PERSONAL_DOUBT_TRIGGERS.default;
}
