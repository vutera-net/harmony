import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Heart, Moon, Sun } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Hiểu rõ bản thân',
    desc: 'Khám phá những tiềm năng ẩn giấu và đặc điểm tính cách thông qua lá số tử vi.',
    icon: Heart,
    color: 'text-red-400'
  },
  {
    title: 'Cân bằng năng lượng',
    desc: 'Điều chỉnh cuộc sống hài hòa với Ngũ Hành để thu hút may mắn và bình an.',
    icon: Sun,
    color: 'text-amber-400'
  },
  {
    title: 'Đón lành tránh dữ',
    desc: 'Lựa chọn thời điểm vàng cho những sự kiện quan trọng trong đời.',
    icon: Moon,
    color: 'text-indigo-400'
  },
  {
    title: 'Phong thủy cá nhân',
    desc: 'Sắp xếp không gian sống tối ưu theo mệnh cách để tăng cường sinh khí.',
    icon: Compass,
    color: 'text-emerald-400'
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 px-6 bg-stone-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Giá trị bạn nhận được</h2>
          <p className="text-stone-400">Hành trình thấu hiểu để kiến tạo cuộc sống cân bằng.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${benefit.color}`}>
                <benefit.icon size={20} />
              </div>
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
