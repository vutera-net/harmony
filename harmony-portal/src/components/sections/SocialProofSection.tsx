import React from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Minh Anh',
    role: 'Kinh doanh',
    text: 'Harmony giúp tôi tìm thấy sự bình an trong tâm hồn và biết cách điều chỉnh công việc theo đúng năng lượng của mình.',
    avatar: 'MA'
  },
  {
    name: 'Hoàng Nam',
    role: 'Kỹ sư phần mềm',
    text: 'Sự kết hợp giữa AI và kiến thức cổ truyền trong AnMenh thực sự gây ấn tượng. Những phân tích rất sâu sắc và chính xác.',
    avatar: 'HN'
  },
  {
    name: 'Thu Thủy',
    role: 'Thiết kế',
    text: 'Tôi yêu cách Harmony tiếp cận tâm linh một cách hiện đại, không mê tín mà tập trung vào việc thấu hiểu bản thân.',
    avatar: 'TT'
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 px-6 bg-stone-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Câu chuyện từ người dùng</h2>
          <p className="text-stone-400">Hàng nghìn người đã tìm thấy sự cân bằng cùng Harmony.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 relative"
            >
              <div className="absolute -top-4 left-8 text-6xl text-amber-500/20 font-serif">“</div>
              <p className="text-stone-300 italic mb-8 relative z-10 leading-relaxed">
                {t.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-stone-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
