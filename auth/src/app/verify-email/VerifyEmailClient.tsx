"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmailAction } from "@/lib/actions/verify-email";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token || !email) {
        setStatus("error");
        setMessage("Thiếu thông tin xác nhận.");
        return;
      }

      const result = await verifyEmailAction(token, email);

      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Xác nhận email thành công!");
      } else {
        setStatus("error");
        setMessage(result.error || "Đã xảy ra lỗi khi xác nhận email.");
      }
    }

    verify();
  }, [token, email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Xác nhận Email</h1>
        
        {status === "loading" && (
          <p className="text-gray-600">Đang xác nhận email của bạn, vui lòng đợi...</p>
        )}
        
        {status === "success" && (
          <div className="text-green-600">
            <p className="mb-4">{message}</p>
            <a 
              href="/login" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Đăng nhập ngay
            </a>
          </div>
        )}
        
        {status === "error" && (
          <div className="text-red-600">
            <p className="mb-4">{message}</p>
            <p className="text-sm text-gray-500">Nếu bạn không yêu cầu xác nhận này, vui lòng bỏ qua email.</p>
          </div>
        )}
      </div>
    </div>
  );
}
