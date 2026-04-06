"use client";

import { trpc } from "@/trpc/Provider";
import { useMemo } from "react";

export default function Dashboard() {
  const myUserId = "user-id-mock-for-demo";
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { data: insight, isLoading } = trpc.profile.getDailyInsight.useQuery({
    userId: myUserId,
    date: today,
  });

  // Helper to safely parse stringified JSON lists from SQLite
  const parseList = (jsonString: string | undefined): string[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [jsonString];
    }
  };

  const doList = useMemo(() => parseList(insight?.doList as any), [insight?.doList]);
  const avoidList = useMemo(() => parseList(insight?.avoidList as any), [insight?.avoidList]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-zinc-500 animate-pulse">
        Đang giải mã tần số vũ trụ...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 pt-12 animate-fade-in">
      <div className="text-center mb-12">
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-2">Thông Điệp Vũ Trụ Hành Ngày</p>
        <h1 className="text-4xl font-light text-yellow-500">
          {insight ? `Năng lượng của bạn hôm nay: ${insight.energyScore}%` : "Chưa có dữ liệu vận mệnh cho hôm nay"}
        </h1>
        {insight?.luckyColor && (
          <p className="mt-2 text-zinc-500 italic">Màu sắc may mắn: <span className="text-white not-italic font-bold">{insight.luckyColor}</span></p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* DO LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-green-500/30 transition-colors">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Nên Làm ✅
          </h2>
          <ul className="space-y-4 text-gray-300">
            {doList.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {item}
              </li>
            ))}
            {doList.length === 0 && <li className="text-zinc-600">Hôm nay hãy tùy duyên...</li>}
          </ul>
        </div>

        {/* AVOID LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-red-500/30 transition-colors">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Đừng Làm ❌
          </h2>
          <ul className="space-y-4 text-gray-400">
            {avoidList.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {item}
              </li>
            ))}
            {avoidList.length === 0 && <li className="text-zinc-600">Không có kiêng kỵ đặc biệt.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
