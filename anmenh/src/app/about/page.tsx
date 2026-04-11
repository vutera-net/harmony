"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">Về chúng tôi</h1>
      </div>
      <div className="prose prose-stone dark:prose-invert prose-amber max-w-none text-stone-600 dark:text-stone-300">
        <p className="mb-4">
          <strong>An Mệnh</strong> (tiền thân là Harmony TuVi) được sáng lập với khát vọng số hóa và chuẩn hóa các giá trị của thuật số phương Đông. Chúng tôi tin rằng, phong thủy và tử vi không phải là mê tín dị đoan, mà là một phép thống kê học, một công cụ hữu ích để thấu hiểu bản thân và sống hòa hợp hơn với tự nhiên.
        </p>
        <p className="mb-4">
          Đội ngũ của chúng tôi bao gồm những kỹ sư phần mềm yêu thích văn hóa Á Đông, cùng các chuyên gia tư vấn phong thủy giàu kinh nghiệm. Mọi thuật toán từ Lịch Vạn Niên (chuẩn Hồ Ngọc Đức), Cân Xương, Bát Trạch cho đến Tứ Trụ Bát Tự đều được chúng tôi lập trình với sự cẩn trọng và đối chiếu tỉ mỉ với nhiều nguồn tài liệu cổ uy tín.
        </p>
        <p className="mb-4">
          Sứ mệnh của An Mệnh là mang lại một trải nghiệm <strong>"Zen" (Thiền/An bình)</strong> – giao diện tối giản, sang trọng, loại bỏ những thông tin gây hoang mang, chỉ giữ lại những lời khuyên tích cực, giúp người dùng "đón lành, tránh dữ" và kiến tạo một cuộc sống bình an, thịnh vượng.
        </p>
      </div>
    </div>
  );
}
