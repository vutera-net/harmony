import CtaBanner from "@/components/CtaBanner";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dữ liệu mock phục vụ SSG (Thường gọi từ CMS/Sanity/Wordpress)
const GET_ARTICLE = (slug: string) => {
  const db: Record<string, { title: string, content: string }> = {
    "sao-thai-duong-trong-tu-vi": {
      title: "Sao Thái Dương: Vầng Lửa Quyền Lực Trong Bát Tự",
      content: "Thái Dương, biểu tượng cho ánh sáng mặt trời, đại diện cho nam giới, người cha, chồng và hình tượng lãnh đạo trong Tử Vi đẩu số. Người được sao Thái Dương chiếu mệnh luôn có xu hướng rực rỡ và tỏa sáng...\n\nNhưng bóng tối dưới chân ngọn cỏ là thứ duy nhất Thái Dương có thể chạm tới nhưng chẳng thể nào soi sáng trọn vẹn. Hãy coi chừng nếu Thái Dương rơi vào hãm địa."
    },
    // ...
  };
  return db[slug] || null;
}

// 1. Tối ưu SEO: Báo Next.js biết trước các danh sách bài để BUILD SSG tĩnh 100%
export async function generateStaticParams() {
  return [
    { slug: "sao-thai-duong-trong-tu-vi" },
    { slug: "thuy-kim-tuong-sinh" },
    { slug: "12-con-giap-2026" }
  ];
}

// 2. Chèn tự động thẻ Metadata (SEO - Title, Meta Description)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = GET_ARTICLE(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | Harmony Tử Vi`,
    description: article.content.substring(0, 160) + "...",
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = GET_ARTICLE(params.slug);
  
  if (!article) return notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/" className="text-sm font-medium text-gray-500 mb-8 inline-block hover:text-tuviPrimary transition-colors">
        ← Trở Về Tạp Chí
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Tác giả: Harmony AI</span>
          <span className="mx-2">•</span>
          <time dateTime="2026-03-28">Xuất bản: 28/03/2026</time>
        </div>
      </header>

      {/* Áp dụng chuẩn Typography (Tailwind Prose) cho bài đọc dài dễ nhìn */}
      <div className="prose prose-lg prose-headings:font-serif prose-a:text-tuviPrimary max-w-none">
        
        {/* Render đoạn trích */}
        <p className="lead text-xl text-gray-600 font-light italic border-l-4 border-tuviPrimary pl-6 mb-8">
          Người mệnh Thái Dương sinh ra đã định sẵn làm mặt trời của người khác...
        </p>

        {/* Nội dung bài báo mock */}
        <p>{article.content.split('\n\n')[0]}</p>
        
        {/* Móc câu chiến lược CTA Banner (Chèn vào giữa bài) */}
        <CtaBanner />

        {/* Tiếp tục nội dung */}
        <p>{article.content.split('\n\n')[1] || "Kiến thức vô biên, vạn sự tùy duyên."}</p>

      </div>
    </article>
  );
}
