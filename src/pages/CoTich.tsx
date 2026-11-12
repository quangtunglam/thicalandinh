import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Story } from '@/data/stories';
import { apiService } from '@/services/api';
import { BookMarked, ArrowRight, Plus, Filter, Search } from 'lucide-react';

export const CoTich: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isAdmin = apiService.isAdminLoggedIn();

  useEffect(() => {
    apiService.getStories().then(setStories);
  }, []);

  const categories = ['Tất cả', 'Điển Cố', 'Cổ Tích'];

  const filteredStories = stories.filter((story) => {
    const normTheme = (story.theme || '').toLowerCase();
    const isCoTich = normTheme.includes('cổ tích');
    const matchCat =
      selectedCategory === 'Tất cả'
        ? true
        : selectedCategory === 'Cổ Tích'
        ? isCoTich
        : !isCoTich;

    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      story.title.toLowerCase().includes(q) ||
      (story.subtitle || '').toLowerCase().includes(q) ||
      (story.summary || '').toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <BookMarked className="w-3.5 h-3.5" /> Điển Cố & Truyện Xưa
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Kho Tàng Cổ Tích & Điển Cố
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Những câu chuyện xưa tích cũ ẩn chứa đạo lý làm người, tinh thần trượng nghĩa và bài học nhân sinh sâu sắc.
        </p>

        {isAdmin && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" /> Đăng câu chuyện / điển cố mới
            </Link>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card p-6 rounded-lg border border-border mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-foreground/60 uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Thể loại:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-background hover:bg-muted text-foreground/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên truyện hoặc nội dung..."
            className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredStories.map((story) => (
          <Link
            key={story.slug}
            href={`/cau-chuyen/${story.slug}`}
            className="bg-card border border-border/80 rounded-lg overflow-hidden flex flex-col hover:border-primary/60 transition-all hover:shadow-lg group cursor-pointer"
          >
            <div className="aspect-video overflow-hidden bg-muted relative">
              <img
                src={story.img}
                alt={story.title}
                className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded text-xs font-semibold text-primary uppercase tracking-wider">
                {story.theme}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-base text-foreground/60 italic font-serif mb-4">
                  "{story.subtitle}"
                </p>
                <p className="font-serif text-foreground/80 leading-relaxed text-sm mb-6 text-justify">
                  {story.summary}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest group-hover:gap-3 transition-all">
                ĐỌC TOÀN VĂN <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
