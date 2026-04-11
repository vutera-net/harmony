import BatTrach from "@/components/pages/BatTrach";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bát Trạch Phong Thủy - Xem Hướng Nhà, Hướng Bếp | An Mệnh",
  description: "Xác định cung phi mệnh quái, tư vấn hướng nhà sinh khí, thiên y giúp gia chủ đón tài lộc.",
};

export default function Page() {
  return <BatTrach />;
}
