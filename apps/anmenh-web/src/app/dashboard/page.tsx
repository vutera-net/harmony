'use client';

import { trpc } from '@/trpc/Provider';

export default function Dashboard() {
  const { data: insight, isLoading } = trpc.profile.getTodayInsight.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-12">
        <div className="w-12 h-12 border-t-2 border-yellow-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Đang kết nối với vũ trụ...</p>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-12">
        <p className="text-gray-400 text-lg">Chưa có insight cho hôm nay. Vui lòng quay lại sau.</p>
      </div>
    );
  }

  const doList = (Array.isArray(insight.doList) ? insight.doList : []) as string[];
  const avoidList = (Array.isArray(insight.avoidList) ? insight.avoidList : []) as string[];

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 pt-12 animate-fade-in">
      <div className="text-center mb-12">
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-2">Thông Điệp Vũ Trụ Hành Ngày</p>
        <h1 className="text-4xl font-light text-yellow-500">Năng lượng của bạn hôm nay: {insight.energyScore}%</h1>
        <p className="text-gray-500 text-sm mt-2">Màu may mắn: <span className="text-yellow-500 font-bold">{insight.luckyColor}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* DO LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Nên Làm ✅</h2>
          <ul className="space-y-4 text-gray-300">
            {doList.map((item: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* AVOID LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Đừng Làm ❌</h2>
          <ul className="space-y-4 text-gray-400">
            {avoidList.map((item: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
