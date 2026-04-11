"use client";
import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-8">Điều Khoản Sử Dụng</h1>
      <div className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-300">
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">1. Chấp nhận điều khoản</h3>
        <p className="mb-4">Bằng việc truy cập và sử dụng dịch vụ của <strong>An Mệnh</strong>, bạn đồng ý chịu sự ràng buộc bởi các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng ứng dụng.</p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">2. Tính chất thông tin tham khảo</h3>
        <p className="mb-4">Tất cả các kết quả phân tích tử vi, phong thủy, xem ngày, cân xương, bát tự... trên An Mệnh chỉ mang tính chất <strong>tham khảo và giải trí trí tuệ</strong>. Chúng tôi không chịu trách nhiệm pháp lý hoặc vật chất cho bất kỳ quyết định cá nhân, doanh nghiệp nào của bạn dựa trên các thông tin này.</p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">3. Quyền sở hữu trí tuệ</h3>
        <p className="mb-4">Toàn bộ thiết kế (UI/UX), mã nguồn, đồ họa, biểu đồ Radar, La Bàn ảo và nội dung luận giải thuộc bản quyền của An Mệnh. Nghiêm cấm mọi hành vi sao chép, tái bản khi chưa có sự cho phép.</p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">4. Sửa đổi dịch vụ</h3>
        <p className="mb-4">Chúng tôi có quyền tạm ngừng hoặc dừng vĩnh viễn dịch vụ vào bất kỳ lúc nào mà không cần báo trước, cũng như liên tục cập nhật/sửa đổi thuật toán tính toán để đáp ứng độ chính xác cao hơn.</p>
      </div>
    </div>
  );
}
