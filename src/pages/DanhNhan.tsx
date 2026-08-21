import React, { useState } from 'react';
import { SCHOLARS, Scholar } from '@/data/scholars';
import { Award, Quote, X } from 'lucide-react';

export const DanhNhan: React.FC = () => {
  const [activeScholar, setActiveScholar] = useState<Scholar | null>(null);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <Award className="w-3.5 h-3.5" /> Bậc Hiền Tài Thiên Cổ
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Danh Nhân Tiêu Biểu
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Chiêm ngưỡng chân dung, cuộc đời và trước tác của các bậc hiền triết, danh nhân ngàn đời lưu danh sử sách.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SCHOLARS.map((scholar) => (
          <div
            key={scholar.slug}
            onClick={() => setActiveScholar(scholar)}
            className="bg-card border border-border/80 rounded-lg p-6 flex flex-col items-center text-center hover:border-primary/60 transition-all hover:shadow-lg cursor-pointer group"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden mb-5 border-2 border-border group-hover:border-primary p-1 transition-colors">
              <img
                src={scholar.img}
                alt={scholar.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <h3 className="font-serif font-bold text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
              {scholar.name}
            </h3>
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
              {scholar.era}
            </p>
            <p className="text-xs text-foreground/70 line-clamp-2 mb-4">
              {scholar.title}
            </p>
            <span className="mt-auto text-xs font-semibold text-primary uppercase tracking-widest group-hover:underline">
              Xem Tiểu Sử →
            </span>
          </div>
        ))}
      </div>

      {/* Scholar Detail Modal */}
      {activeScholar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-3">
                <img src={activeScholar.img} alt={activeScholar.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h2 className="font-serif font-bold text-xl text-foreground">{activeScholar.name}</h2>
                  <p className="text-xs text-foreground/60">{activeScholar.era}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveScholar(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 font-serif">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Danh xưng</h4>
                <p className="text-base text-foreground font-semibold">{activeScholar.title}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Tiểu sử & Cuộc đời</h4>
                <p className="text-foreground/80 leading-relaxed">{activeScholar.bio}</p>
              </div>

              <div className="bg-background/80 p-5 rounded border border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5" /> Câu nói bất hủ
                </h4>
                <p className="text-base italic text-foreground/90">"{activeScholar.famousQuote}"</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Tác phẩm / Đóng góp tiêu biểu</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                  {activeScholar.works.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-background/50 flex justify-end">
              <button
                onClick={() => setActiveScholar(null)}
                className="text-xs font-medium bg-primary text-primary-foreground px-5 py-2 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
