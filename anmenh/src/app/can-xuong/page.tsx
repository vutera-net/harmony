import CanXuong from "@/components/pages/CanXuong";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cân Xương Đoán Số - Luận Giải Sang Hèn Qua Lượng Chỉ | An Mệnh",
  description: "Dựa vào ngày giờ sinh để tính toán lượng chỉ, dự đoán tài lộc và hậu vận cuộc đời.",
};

export default function Page() {
  return <CanXuong />;
}
