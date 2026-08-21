import React from 'react';
import { VIRTUES } from '@/data/culture';
import { Feather, Sparkles, BookOpen } from 'lucide-react';

export const VanHoa: React.FC = () => {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Tinh Hoa Phương Đông
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Văn Hóa & Đạo Học Truyền Thống
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Gìn giữ và trao truyền các giá trị nhân bản, đạo lý làm người và cốt cách thanh cao của văn hóa dân tộc.
        </p>
      </div>

      {/* Ngũ Thường Detailed Section */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-6 w-1.5 bg-primary rounded-full" />
          <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-foreground">
            Đạo Đức Ngũ Thường — Nhân • Nghĩa • Lễ • Trí • Tín
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VIRTUES.map((v) => (
            <div
              key={v.char}
              className="bg-card border border-border/70 p-8 rounded-lg flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <img src={v.img} alt={v.char} className="w-16 h-16 object-contain" />
                  <span className="font-serif font-bold text-3xl text-primary">{v.char}</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-foreground">{v.name}</h3>
                <p className="text-xs text-primary font-serif font-medium italic mb-4">"{v.quote}"</p>
                <p className="font-serif text-sm text-foreground/80 leading-relaxed mb-4">{v.fullMeaning}</p>
                <p className="text-xs text-foreground/60 leading-relaxed">{v.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Cultural Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-8 rounded-lg flex gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl mb-2">Thư Họa & Nghệ Thuật Chữ Nôm</h3>
            <p className="font-serif text-foreground/75 leading-relaxed text-sm">
              Nghệ thuật thư pháp không đơn thuần là kỹ thuật cầm bút, mà là tâm thức của người cầm cọ. Từng nét mực gửi gắm khí phách, tâm tình và triết lý sống an nhiên tự tại.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-lg flex gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl mb-2">Văn Hóa Trà Đạo & Thi Viện</h3>
            <p className="font-serif text-foreground/75 leading-relaxed text-sm">
              Thưởng trà ngâm thơ — một nét sinh hoạt tao nhã của tiền nhân, nơi tâm hồn lắng đọng gạn đục khơi trong, kết giao bằng hữu tri âm trong tĩnh lặng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
