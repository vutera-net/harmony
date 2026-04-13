import { ZodiacSign } from '@/types'

export interface DailyHoroscopeTemplate {
  id: string
  scoreRange: [number, number] // [min, max]
  tongQuan: string[]
  tinhCam: string[]
  suNghiep: string[]
  taiChinh: string[]
  sucKhoe: string[]
}

export const DAILY_TEMPLATES: DailyHoroscopeTemplate[] = [
  {
    id: 'excellent',
    scoreRange: [9, 10],
    tongQuan: [
      'Hôm nay là một ngày tuyệt vời đối với tuổi {{zodiac}}. Mọi sự hanh thông, quý nhân phù trợ.',
      'Vận trình rực rỡ, tuổi {{zodiac}} đón nhận nhiều tin vui bất ngờ trong ngày hôm nay.',
    ],
    tinhCam: [
      'Tình duyên thăng hoa, các cặp đôi có những giây phút ngọt ngào bên nhau.',
      'Người độc thân có cơ hội gặp gỡ đối tượng ưng ý thông qua các hoạt động xã hội.',
    ],
    suNghiep: [
      'Công việc tiến triển thuận lợi, sự sáng tạo của bạn được cấp trên đánh giá cao.',
      'Cơ hội thăng tiến đang mở ra, hãy tự tin thể hiện năng lực của mình.',
    ],
    taiChinh: [
      'Tài lộc dồi dào, có thể có khoản thu nhập bất ngờ từ đầu tư hoặc thưởng.',
      'Kế hoạch tài chính diễn ra đúng như mong đợi, tiền bạc rủng rỉnh.',
    ],
    sucKhoe: [
      'Năng lượng tràn đầy, tinh thần sảng khoái suốt cả ngày.',
      'Sức khỏe ổn định, nên duy trì thói quen tập luyện nhẹ nhàng.',
    ],
  },
  {
    id: 'good',
    scoreRange: [7, 8],
    tongQuan: [
      'Một ngày khá ổn định với tuổi {{zodiac}}. Bản mệnh có nhiều cơ hội để khẳng định mình.',
      'Vận trình bình ổn, tuổi {{zodiac}} có thể thư thả tận hưởng thành quả công việc.',
    ],
    tinhCam: [
      'Mối quan hệ tiến triển tốt đẹp, sự thấu hiểu là chìa khóa cho hạnh phúc.',
      'Tình cảm gia đình ấm áp, là chỗ dựa vững chắc cho bạn.',
    ],
    suNghiep: [
      'Công việc đều đặn, không có biến động lớn. Tập trung hoàn thành các mục tiêu nhỏ.',
      'Khả năng làm việc nhóm hiệu quả giúp bạn giải quyết các vấn đề nhanh chóng.',
    ],
    taiChinh: [
      'Tiền bạc ổn định, thu chi cân bằng. Đây là thời điểm tốt để tích lũy.',
      'Có khả năng nhận được một khoản lợi nhuận nhỏ từ công việc tay trái.',
    ],
    sucKhoe: [
      'Sức khỏe tốt, tuy nhiên đừng quá chủ quan với những thay đổi thời tiết.',
      'Chú ý chế độ ăn uống và nghỉ ngơi hợp lý để duy trì vóc dáng.',
    ],
  },
  {
    id: 'average',
    scoreRange: [4, 6],
    tongQuan: [
      'Tuổi {{zodiac}} cần thận trọng hơn trong hôm nay. Tránh các quyết định nóng vội.',
      'Mọi việc diễn ra ở mức trung bình, bản mệnh nên kiên trì theo đuổi kế hoạch đã định.',
    ],
    tinhCam: [
      'Có một chút hiểu lầm nhỏ với người thân, cần bình tĩnh để giải quyết.',
      'Người độc thân chưa có nhiều khởi sắc, hãy tập trung yêu thương bản thân nhiều hơn.',
    ],
    suNghiep: [
      'Khối lượng công việc hơi nhiều, dễ gây áp lực. Hãy phân bổ thời gian hợp lý.',
      'Cần chú ý giao tiếp với đồng nghiệp để tránh những mâu thuẫn không đáng có.',
    ],
    taiChinh: [
      'Tình hình tài chính ở mức ổn định, không nên đầu tư mạo hiểm vào lúc này.',
      'Cần cân nhắc kỹ trước khi chi tiêu cho những món đồ xa xỉ.',
    ],
    sucKhoe: [
      'Cảm thấy hơi mệt mỏi, cần nghỉ ngơi và thư giãn nhiều hơn.',
      'Nên đi ngủ sớm và tránh thức khuya làm việc quá sức.',
    ],
  },
  {
    id: 'bad',
    scoreRange: [1, 3],
    tongQuan: [
      'Một ngày khá thử thách đối với tuổi {{zodiac}}. Cần giữ tinh thần lạc quan.',
      'Vận trình có phần trầm lắng, bản mệnh nên lùi lại một bước để quan sát kỹ hơn.',
    ],
    tinhCam: [
      'Tình cảm có dấu hiệu rạn nứt, cần sự chia sẻ và cảm thông từ hai phía.',
      'Tránh tranh cãi về những vấn đề vụn vặt trong cuộc sống hàng ngày.',
    ],
    suNghiep: [
      'Công việc gặp vài trở ngại bất ngờ, đòi hỏi sự kiên nhẫn và bình tĩnh xử lý.',
      'Thận trọng trong các giao dịch ký kết hợp đồng hoặc văn bản quan trọng.',
    ],
    taiChinh: [
      'Tài chính có dấu hiệu hao hụt, cần thắt chặt chi tiêu hơn nữa.',
      'Hạn chế cho vay mượn hoặc đầu tư lớn trong thời điểm nhạy cảm này.',
    ],
    sucKhoe: [
      'Chú ý các vấn đề về tiêu hóa hoặc hô hấp. Nên thăm khám nếu thấy không ổn.',
      'Dễ bị căng thẳng, hãy tìm đến các bài tập thiền hoặc yoga để cân bằng.',
    ],
  },
]
