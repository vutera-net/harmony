import Link from 'next/link';

// Mock database tĩnh cho SSG
const articles = [
  { slug: "sao-thai-duong-trong-tu-vi", title: "Khám phá sức mạnh của Sao Thái Dương trong Bản đồ Tử Vi", excerpt: "Một vầng dương lấp lánh mang lại công danh, nhưng nó ảnh hưởng đến hạnh phúc gia đình ra sao?" },
  { slug: "thuy-kim-tuong-sinh", title: "Kim sinh Thủy: Hiểu rõ nguyên lý Tương Sinh trong Bát Tự", excerpt: "Cách hai ngũ hành phổ biến này kết hợp để tạo ra những nhân tài xuất chúng." },
  { slug: "12-con-giap-2026", title: "Luận giải Cục diện 12 Con giáp năm 2026", excerpt: "Năm Bính Ngọ đang đến gần, hãy xem những con giáp nào sẽ tỏa sáng." }
];

export default function BlogHome() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-bold mb-4">Bài viết mới nhất</h2>
        <p className="text-gray-600 text-lg">Những góc nhìn sâu sắc được phân tích từ dữ liệu huyền học cổ đại.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Link href={`/bai-viet/${article.slug}`} key={article.slug} className="group flex flex-col border bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold font-serif mb-3 group-hover:text-tuviPrimary transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
            <span className="mt-6 text-sm font-medium text-tuviPrimary uppercase tracking-wider">Đọc tiếp →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
