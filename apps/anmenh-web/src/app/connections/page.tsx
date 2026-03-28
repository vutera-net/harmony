"use client";

import { useState } from "react";
import { trpc } from "@/trpc/Provider";

export default function ConnectionsPage() {
  const [emailQuery, setEmailQuery] = useState("");
  // Mock session ID để test (Khớp với Prisma Schema). Sau này thay bằng ID người đang đăng nhập thực.
  const myUserId = "user-id-mock-for-demo"; 

  // Hàm Query Search tRPC (Sửa dụng trpc trực tiếp, type safe 100%)
  const { data: searchResult, refetch } = trpc.connection.searchUser.useQuery(
    { email: emailQuery }, 
    { enabled: false } // Chỉ chạy khi bấm nút
  );
  
  const addMutation = trpc.connection.addConnection.useMutation({
    onSuccess: () => {
      // Bắn trigger load lại danh sách bạn bè
      listConnectionsQuery.refetch(); 
      alert("Kết nối Vận Mệnh Thành Công!");
    }
  });

  const listConnectionsQuery = trpc.connection.listConnections.useQuery({ userId: myUserId });

  const handleSearch = () => {
    if (emailQuery) refetch();
  };

  const handleConnect = (targetId: string) => {
    addMutation.mutate({ requesterId: myUserId, targetId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-20 h-full w-full">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Vòng Tròn Sinh Khắc</h1>
        <p className="text-zinc-400">Có những người sinh ra để kéo bạn lên, và có những người là bài học xương máu.</p>
      </div>

      {/* --- PHÂN KHU TÌM BẠN --- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Thêm Mối Ràng Buộc</h2>
        <div className="flex gap-4 mb-4">
          <input 
            type="email" 
            placeholder="Nhập Email để luận giải tương hợp..." 
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 px-6 py-3 rounded-full text-white focus:outline-none focus:border-tuviPrimary transition-colors"
          />
          <button 
            onClick={handleSearch}
            className="bg-white text-zinc-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition-colors"
          >
            Tìm Bản Đồ
          </button>
        </div>

        {/* Kết quả Search */}
        {searchResult && (
          <div className="flex items-center justify-between p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl animate-fade-in">
            <div>
              <p className="text-yellow-500 font-bold">{searchResult.name}</p>
              <p className="text-sm text-zinc-400">{searchResult.hasProfile ? "Đã nhập Vận Mệnh" : "Thẻ trắng chưa khai phá"}</p>
            </div>
            <button 
              onClick={() => handleConnect(searchResult.id)}
              className="px-6 py-2 border border-yellow-500 text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-black transition-all"
            >
              Chạm Để Kết Nối
            </button>
          </div>
        )}
      </div>

      {/* --- PHÂN KHU DANH SÁCH BẠN + ĐIỂM SỐ --- */}
      <div>
        <h2 className="text-2xl font-light text-white mb-6">Mạng Lưới Tương Hợp Của Bạn</h2>
        
        {listConnectionsQuery.isLoading ? (
          <p className="text-zinc-500">Đang quay đĩa bát quái...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {listConnectionsQuery.data?.map((conn: any) => (
              <div key={conn.connectionId} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-white font-bold">{conn.friendInfo.name}</h3>
                  <div className="text-sm text-zinc-400 mt-1">
                    Định Mệnh: <span className="text-yellow-500">{conn.friendInfo.element} ({conn.friendInfo.zodiac})</span>
                  </div>
                </div>

                {/* Khối Điểm Độ Hợp */}
                {conn.compatibility ? (
                  <div className="text-right">
                    <div className="text-3xl font-light text-white">{conn.compatibility.score}%</div>
                    <div className={`text-sm mt-1 font-bold ${
                      conn.compatibility.type === 'Tương Sinh' ? 'text-green-500' : 
                      conn.compatibility.type === 'Tương Khắc' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {conn.compatibility.type}
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-zinc-600 text-sm">Đang Ẩn Số</div>
                )}
              </div>
            ))}
            
            {/* Lưới ảo hiển thị trạng thái Trống */}
            {listConnectionsQuery.data?.length === 0 && (
              <div className="col-span-2 text-center py-10 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                Lá số trống rỗng. Hãy nối dây một người nào đó.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
