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
  // Trật tự Ngũ hành tương sinh: Kim -> Thủy -> Mộc -> Hỏa -> Thổ -> Kim
  const elements = ["Kim", "Thủy", "Mộc", "Hỏa", "Thổ"];
  
  // maxDomain = 100 because we are using percentages
  const maxDomain = 100; 
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
    return {
      ...getPoint(value, angle),
      value
    };
  });
  
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z";
  
  const COLORS: Record<string, string> = {
    Kim: "text-zinc-400",
    Thủy: "text-blue-400",
    Mộc: "text-green-500",
    Hỏa: "text-red-500",
    Thổ: "text-amber-600"
  };

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Biểu đồ Radar Ngũ Hành: Kim, Thủy, Mộc, Hỏa, Thổ">
        {/* Lưới đa giác nền */}
        {[25, 50, 75, 100].map((scale, gridIdx) => {
          const gridPoints = elements.map((_, i) => getPoint(scale, (360 / 5) * i));
          const d = gridPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ") + " Z";
          return (
            <path key={`grid-${gridIdx}`} d={d} fill="none" stroke="rgba(120,120,120,0.15)" strokeWidth="1" />
          );
        })}
        
        {/* Các trục */}
        {elements.map((_, i) => {
          const p = getPoint(maxDomain, (360 / 5) * i);
          return <line key={`axis-${i}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(120,120,120,0.1)" strokeWidth="1" />;
        })}
        
        {/* Đa giác Dữ liệu */}
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, d: pathData }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          fill="rgba(217, 119, 6, 0.3)" // amber-600 with opacity
          stroke="rgb(217, 119, 6)"
          strokeWidth="3"
        />
        
        {/* Điểm Neo Dữ liệu */}
        {points.map((p, i) => (
          <motion.circle 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            key={`pt-${i}`} 
            cx={p.x} cy={p.y} r={p.value >= 25 ? 6 : 4} 
            fill={p.value >= 25 ? "rgb(217, 119, 6)" : "rgb(251, 191, 36)"} // Highlight Vượng
          />
        ))}
      </svg>
      
      {/* Cụm Label ngoài SVG */}
      {elements.map((el, i) => {
        const p = getPoint(maxDomain + 20, (360 / 5) * i);
        const value = data[el as keyof RadarData] || 0;
        return (
          <div 
            key={`label-${el}`}
            className={`absolute flex flex-col items-center ${COLORS[el]}`}
            style={{ 
              left: p.x, 
              top: p.y, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <span className="text-xs font-black uppercase tracking-tighter mb-1">{el}</span>
            <span className="text-[10px] opacity-80 font-medium">{value.toFixed(1)}%</span>
          </div>
        );
      })}
    </div>
  );
}
