import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-24 px-6 border-t border-white/5 bg-stone-900/20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold tracking-tight">Công nghệ khai sáng <br /> Phụng sự con người</h2>
          <p className="text-stone-400 text-lg leading-relaxed">
            Tại Harmony, chúng tôi tin rằng tri thức cổ xưa về vận mệnh không nên là những điều bí ẩn khó tiếp cận, mà nên là kim chỉ nam giúp mỗi cá nhân tự chủ cuộc đời.
          </p>
          <p className="text-stone-500 leading-relaxed">
            Chúng tôi không xây dựng những công cụ bói toán hời hợt. Harmony là một "người bạn đồng hành" tinh thức, giúp bạn hiểu rõ bản thân, cân bằng năng lượng và sống hài hòa với vũ trụ.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950 border border-white/10 flex items-center justify-center p-12"
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 text-center space-y-4">
            <div className="text-6xl font-serif italic text-stone-600">Harmony</div>
            <div className="h-px w-24 bg-amber-500/50 mx-auto" />
            <div className="text-sm tracking-[0.3em] text-stone-500 uppercase">Sanctuary of Peace</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
