import React from 'react';
import { Download, Library } from 'lucide-react';

export const ThuVien: React.FC = () => {
  const books = [
    { title: "Truyện Kiều (Bản Nôm Liễu Văn Đường 1871)", author: "Nguyễn Du", type: "Văn bản cổ", size: "28 MB" },
    { title: "Quốc Âm Thi Tập", author: "Nguyễn Trãi", type: "Thư tịch cổ", size: "15 MB" },
    { title: "Bạch Vân Quốc Ngữ Thi Tập", author: "Nguyễn Bỉnh Khiêm", type: "Thư tịch cổ", size: "12 MB" },
    { title: "Đường Thi Tuyển Dịch (Tam bách thủ)", author: "Nhiều tác giả", type: "Thi tập", size: "42 MB" },
    { title: "Đạo Đức Kinh (Bản dịch & Chú giải)", author: "Lão Tử", type: "Triết học", size: "18 MB" },
    { title: "Luận Ngữ Chính Nghĩa", author: "Khổng Tử", type: "Kinh điển", size: "35 MB" },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <Library className="w-3.5 h-3.5" /> Kho Lưu Trữ Số Hóa
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Thư Viện Tài Liệu & Thư Tịch Cổ
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Bộ sưu tập số hóa các trước tác kinh điển, bản dịch Nôm cổ và công trình nghiên cứu văn học có giá trị.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, idx) => (
          <div key={idx} className="bg-card border border-border p-6 rounded-lg flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
            <div>
              <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full mb-3 inline-block">
                {book.type}
              </span>
              <h3 className="font-serif font-bold text-xl text-foreground mb-1">{book.title}</h3>
              <p className="text-xs text-foreground/60 font-serif italic mb-4">— {book.author}</p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-foreground/50">{book.size}</span>
              <button
                onClick={() => alert(`Đang chuẩn bị tải tài liệu: ${book.title}`)}
                className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Tải về PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
