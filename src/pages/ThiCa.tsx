import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Poem } from '@/data/poems';
import { apiService } from '@/services/api';
import { extractYoutubeEmbedUrl } from '@/lib/utils';
import { BookOpen, Search, Filter, Feather, Plus, Youtube } from 'lucide-react';

interface ThiCaProps {
  onSelectPoem: (poem: Poem) => void;
}

export const ThiCa: React.FC<ThiCaProps> = ({ onSelectPoem }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = apiService.isAdminLoggedIn();

  useEffect(() => {
    apiService.getPoems().then(setPoems);
  }, []);

  const categories = ['Tất cả', 'Có Video Ngâm Thơ', 'Đường luật', 'Lục bát', 'Song thất lục bát', 'Thơ cổ phong', 'Thơ hiện đại'];

  const filteredPoems = poems.filter((p) => {
    const matchCat =
      selectedCategory === 'Tất cả'
        ? true
        : selectedCategory === 'Có Video Ngâm Thơ'
        ? !!extractYoutubeEmbedUrl(p.youtubeUrl)
        : p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.verses.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 md:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
          <Feather className="w-3.5 h-3.5" /> Kho Tàng Thi Ca & Ngâm Thơ
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Tuyển Tập Thi Ca Kinh Điển
        </h1>
        <p className="font-serif text-foreground/70 text-lg leading-relaxed">
          Nơi hội tụ những vần thơ bất hủ và các bản ngâm thơ truyền cảm thấm đượm tình người, hồn sông núi.
        </p>

        {isAdmin && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" /> Đăng bài thơ / Nhúng video ngâm thơ
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
              {cat === 'Có Video Ngâm Thơ' && <Youtube className="w-3.5 h-3.5" />}
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
            placeholder="Tìm theo tên bài hoặc tác giả..."
            className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Poems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPoems.map((poem) => {
          const embedUrl = extractYoutubeEmbedUrl(poem.youtubeUrl);
          return (
            <div
              key={poem.id}
              onClick={() => onSelectPoem(poem)}
              className="bg-card border border-border/70 rounded-lg overflow-hidden flex flex-col hover:border-primary/60 transition-all hover:shadow-lg cursor-pointer group"
            >
              {embedUrl ? (
                <div
                  className="aspect-video w-full relative bg-black border-b border-border/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    src={embedUrl}
                    title={`Ngâm thơ: ${poem.title}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-52 overflow-hidden relative bg-muted">
                  <img
                    src={poem.img}
                    alt={poem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-serif font-semibold text-primary">
                    {poem.category}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-foreground/50 uppercase tracking-wider">
                      {poem.period}
                    </span>
                    {embedUrl && (
                      <span className="text-[11px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                        <Youtube className="w-3 h-3" /> Ngâm thơ
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {poem.title}
                  </h3>
                  <p className="text-sm font-serif italic text-foreground/70 mb-4">
                    — {poem.author}
                  </p>
                  <p className="font-serif text-foreground/80 italic text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-3 bg-background/50 p-3.5 rounded border border-border/40">
                    "{poem.verses?.length ? poem.verses.slice(0, 3).join('\n') : poem.featuredQuote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <BookOpen className="w-3.5 h-3.5" /> {embedUrl ? 'Nghe ngâm thơ & Đọc bài' : 'Đọc & Bình phẩm'}
                  </span>
                  <span className="text-foreground/50">{poem.verses.length} câu</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
