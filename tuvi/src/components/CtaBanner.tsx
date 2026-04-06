export default function CtaBanner() {
  return (
    <div className="my-10 p-8 rounded-2xl bg-zinc-900 text-white shadow-xl relative overflow-hidden not-prose">
      {/* Hiệu ứng mờ */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tuviPrimary rounded-full mix-blend-multiply filter blur-[80px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-serif font-bold mb-3 text-yellow-500">
          Bạn và người ấy có đang thu hút nhau?
        </h3>
        <p className="text-zinc-300 mb-6 text-lg max-w-lg">
          Lý thuyết là một chuyện. Nhưng Bát Tự và Ngũ Hành của bạn trong thực tế sẽ tương hợp với những ai? Hãy để AI tính toán chính xác tần số của riêng bạn.
        </p>
        <a 
          href="https://anmenh.vutera.net/onboarding" 
          className="inline-block px-8 py-3 bg-white text-zinc-900 font-bold rounded-full hover:bg-yellow-500 transition-colors"
        >
          Lập Bản Đồ An Mệnh Ngay
        </a>
      </div>
    </div>
  );
}
