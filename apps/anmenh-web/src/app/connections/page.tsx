"use client";

import { useState } from "react";
import { trpc } from "@/trpc/Provider";
import { useSession } from "next-auth/react";

export default function ConnectionsPage() {
  const { data: session } = useSession();
  const [emailQuery, setEmailQuery] = useState("");

  // Hàm Query Search tRPC
  const { data: searchResult, refetch } = trpc.connection.searchUser.useQuery(
    { email: emailQuery }, 
    { enabled: false }
  );
  
  const addMutation = trpc.connection.addConnection.useMutation({
    onSuccess: () => {
      listConnectionsQuery.refetch(); 
      alert("Kết nối Vận Mệnh Thành Công!");
    }
  });

  const listConnectionsQuery = trpc.connection.listConnections.useQuery(undefined, {
    enabled: !!session,
  });

  const handleSearch = () => {
    if (emailQuery) refetch();
  };

  const handleConnect = (friendUserId: string) => {
    addMutation.mutate({ friendUserId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-20 h-full w-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Vòng Tròn Sinh Khắc</h1>
        <p className="text-zinc-500 dark:text-zinc-400 italic">Có những người sinh ra để kéo bạn lên, và có những người là bài học xương máu.</p>
      </div>

      {/* --- PHÂN KHU TÌM BẠN --- */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-12 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Thêm Mối Ràng Buộc</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input 
            type="email" 
            placeholder="Nhập Email để luận giải tương hợp..." 
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500/30 transition-all text-black dark:text-white"
          />
          <button 
            onClick={handleSearch}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:text-white dark:hover:text-white transition-colors"
          >
            Tìm Bản Đồ
          </button>
        </div>

        {/* Kết quả Search */}
        {searchResult && (
          <div className="flex items-center justify-between p-4 border border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-xl animate-fade-in">
            <div>
              <p className="text-yellow-600 dark:text-yellow-500 font-bold">{searchResult.name || searchResult.email}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{searchResult.hasProfile ? "Đã nhập Vận Mệnh" : "Thẻ trắng chưa khai phá"}</p>
            </div>
            <button 
              onClick={() => handleConnect(searchResult.id)}
              className="px-6 py-2 border border-yellow-600 dark:border-yellow-500 text-yellow-600 dark:text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-white transition-all font-medium"
            >
              Chạm Để Kết Nối
            </button>
          </div>
        )}
      </div>

      {/* --- PHÂN KHU DANH SÁCH BẠN + ĐIỂM SỐ --- */}
      <div>
        <h2 className="text-2xl font-light mb-6">Mạng Lưới Tương Hợp Của Bạn</h2>
        
        {listConnectionsQuery.isLoading ? (
          <p className="text-zinc-400 animate-pulse">Đang quay đĩa bát quái...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {listConnectionsQuery.data?.map((conn) => (
              <div key={conn.connectionId} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:border-yellow-500/50 transition-colors shadow-sm">
                <div>
                  <h3 className="text-xl font-bold">{conn.friendInfo.name}</h3>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Định Mệnh: <span className="text-yellow-600 dark:text-yellow-500 font-medium">{conn.friendInfo.element} ({conn.friendInfo.zodiac})</span>
                  </div>
                </div>

                {/* Khối Điểm Độ Hợp */}
                {conn.compatibility ? (
                  <div className="text-right">
                    <div className="text-3xl font-light">{conn.compatibility.score}%</div>
                    <div className={`text-sm mt-1 font-bold ${
                      conn.compatibility.type === 'Tương Sinh' ? 'text-green-600 dark:text-green-500' : 
                      conn.compatibility.type === 'Tương Khắc' ? 'text-red-600 dark:text-red-500' : 'text-blue-600 dark:text-blue-500'
                    }`}>
                      {conn.compatibility.type}
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-zinc-400 text-sm italic">Đang Ẩn Số</div>
                )}
              </div>
            ))}
            
            {/* Lưới ảo hiển thị trạng thái Trống */}
            {listConnectionsQuery.data?.length === 0 && (
              <div className="col-span-2 text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-zinc-400">
                Lá số trống rỗng. Hãy nối dây một người nào đó.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
