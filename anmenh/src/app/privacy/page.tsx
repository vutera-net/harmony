"use client";
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-8">Chính Sách Bảo Mật</h1>
      <div className="prose prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-300">
        <p className="mb-6">Tại <strong>An Mệnh</strong>, quyền riêng tư của bạn là ưu tiên hàng đầu. Xin vui lòng đọc kỹ để hiểu cách chúng tôi thu thập và xử lý dữ liệu của bạn.</p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">1. Dữ liệu lưu trữ Offline (Client-side)</h3>
        <p className="mb-4">Khác biệt với phần lớn các trang web khác, An Mệnh xử lý hầu hết dữ liệu cá nhân (Tên, Năm Sinh, Giới Tính) thông qua <code>LocalStorage</code> của trình duyệt. <strong>Dữ liệu của bạn được lưu trữ trên thiết bị của bạn, tuyệt đối không gửi về bất kỳ máy chủ nào.</strong></p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">2. Dữ liệu thu thập khi đăng ký ứng dụng Mobile</h3>
        <p className="mb-2">Khi bạn để lại Email trong form đăng ký trải nghiệm sớm (Waitlist/Closed Beta), email của bạn sẽ chỉ được sử dụng duy nhất cho mục đích:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Gửi lời mời tham gia test ứng dụng trên Google Play hoặc App Store.</li>
          <li>Gửi các cập nhật quan trọng về sản phẩm (tối đa 1 email/tháng).</li>
        </ul>
        <p className="mb-4">Chúng tôi cam kết <strong>không bán, cho thuê hoặc chia sẻ</strong> email của bạn với bất kỳ bên thứ ba nào vì mục đích quảng cáo.</p>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-6 mb-3">3. Cookie & Analytics</h3>
        <p className="mb-4">Chúng tôi có thể sử dụng các công cụ phân tích truy cập ẩn danh (như Google Analytics cơ bản) để biết tính năng nào được yêu thích nhằm cải thiện trải nghiệm người dùng, mà không định danh chính xác bạn là ai.</p>
      </div>
    </div>
  );
}
