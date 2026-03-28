export default function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 pt-12 animate-fade-in">
      <div className="text-center mb-12">
        <p className="text-gray-400 text-sm tracking-widest uppercase mb-2">Thông Điệp Vũ Trụ Hành Ngày</p>
        <h1 className="text-4xl font-light text-yellow-500">Năng lượng của bạn hôm nay: 85%</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* DO LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Nên Làm ✅</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Tập trung hoàn thành các dự án đang dở dang. Góc làm việc cần được dọn dẹp.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Uống một ly cà phê vào 9h sáng và liên lạc với một người Mệnh Thủy.
            </li>
          </ul>
        </div>

        {/* AVOID LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Đừng Làm ❌</h2>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Tuyệt đối tránh các cuộc cãi vã vô bổ với sếp vào buổi chiều. Năng lượng Hỏa đang cao.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Hạn chế mặc đồ màu đỏ máu hoặc cam chói.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
