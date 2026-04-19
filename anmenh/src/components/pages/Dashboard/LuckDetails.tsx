import React from "react";
import { LucideClock, LucideHash, LucidePalette } from "lucide-react";

interface LuckDetailsProps {
  luckyHour: string;
  luckyNumbers: string[];
  luckyColors: string[];
}

export default function LuckDetails({ luckyHour, luckyNumbers, luckyColors }: LuckDetailsProps) {
  if (!luckyHour || luckyNumbers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 glass rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
          <LucideClock size={24} />
        </div>
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Giờ xuất hành</p>
          <p className="text-white font-semibold">{luckyHour}</p>
        </div>
      </div>

      <div className="p-4 glass rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
          <LucideHash size={24} />
        </div>
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Số may mắn</p>
          <p className="text-white font-semibold">{luckyNumbers.join(", ")}</p>
        </div>
      </div>

      <div className="p-4 glass rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500">
          <LucidePalette size={24} />
        </div>
        <div>
          <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">Màu tương sinh</p>
          <p className="text-white font-semibold">{luckyColors.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
