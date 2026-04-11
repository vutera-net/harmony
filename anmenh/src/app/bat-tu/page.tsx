import BatTu from "@/components/pages/BatTu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bát Tự Tứ Trụ - Luận Giải Ngũ Hành & Vận Mệnh | An Mệnh",
  description: "Trình bày lá số Bát Tự, phân tích ngũ hành khuyết vượng với bản đồ radar.",
};

export default function Page() {
  return <BatTu />;
}
