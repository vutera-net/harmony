import TuongHop from "@/components/pages/TuongHop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem Tuổi Tương Hợp - Luân Giải Hôn Nhân & Đối Tác | An Mệnh",
  description: "Trình diễn xem tuổi tương hợp qua Thiên Can, Địa Chi và Cung Phi bát trạch.",
};

export default function Page() {
  return <TuongHop />;
}
