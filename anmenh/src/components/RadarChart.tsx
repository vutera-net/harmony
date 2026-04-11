"use client";
import React from "react";
import { motion } from "framer-motion";

export interface RadarData {
  Kim: number;
  Mộc: number;
  Thủy: number;
  Hỏa: number;
  Thổ: number;
}

export default function RadarChart({ data }: { data: RadarData }) {
  // Trật tự Ngũ hành tương sinh: Kim sinh Thủy sinh Mộc sinh Hỏa sinh Thổ sinh Kim.
  // Để biểu đồ hiển thị đều, ta xếp theo vòng này
  const elements = ["Kim", "Thủy", "Mộc", "Hỏa", "Thổ"];
  
  // 50% trong Bát tự đã là rất Vượng (4/8 từ)
  const maxDomain = 50; 
  const size = 320;
  const center = size / 2;
  const radius = size * 0.35;
  
  const getPoint = (value: number, angleDeg: number) => {
    const r = (Math.min(value, maxDomain) / maxDomain) * radius;
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return { x, y };
  };

  const points = elements.map((el, i) => {
    const angle = (360 / 5) * i;
    const value = data[el as keyof RadarData] || 0;
    return getPoint(value, angle);
  });
  
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z";
  
  const COLORS: Record<string, string> = {
    Kim: "text-zinc-300",
    Thủy: "text-blue-400",
    Mộc: "text-green-500",
    Hỏa: "text-red-500",
    Thổ: "text-amber-600"
  };

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Biểu đồ Radar Ngũ Hành: Kim, Thủy, Mộc, Hỏa, Thổ">
        {/* Lưới đa giác nền */}
        {[0.25, 0.5, 0.75, 1].map((scale, gridIdx) => {
          const gridPoints = elements.map((_, i) => getPoint(maxDomain * scale, (360 / 5) * i));
          const d = gridPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z";
          return (
            <path key={`grid-${gridIdx}`} d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          );
        })}
        
        {/* Các trục */}
        {elements.map((_, i) => {
          const p = getPoint(maxDomain, (360 / 5) * i);
          return <line key={`axis-${i}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
        })}
        
        {/* Đa giác Dữ liệu */}
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, d: pathData }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          fill="rgba(217, 119, 6, 0.25)" // amber-600
          stroke="rgb(217, 119, 6)"
          strokeWidth="2"
        />
        
        {/* Điểm Neo Dữ liệu */}
        {points.map((p, i) => (
          <motion.circle 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            key={`pt-${i}`} 
            cx={p.x} cy={p.y} r={4} 
            fill="rgb(251, 191, 36)" // amber-400
          />
        ))}
      </svg>
      
      {/* Cụm Label ngoài SVG để dễ style màu */}
      {elements.map((el, i) => {
        const p = getPoint(maxDomain + 20, (360 / 5) * i);
        return (
          <div 
            key={`label-${el}`}
            className={`absolute text-sm font-bold ${COLORS[el]} glass px-2 py-0.5 rounded-md`}
            style={{ 
              left: p.x, 
              top: p.y, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {el}
          </div>
        );
      })}
    </div>
  );
}
