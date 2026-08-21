import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, X, BookOpen, User, BookMarked, ArrowRight } from 'lucide-react';
import { POEMS, Poem } from '@/data/poems';
import { SCHOLARS } from '@/data/scholars';
import { STORIES } from '@/data/stories';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoem: (poem: Poem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectPoem }) => {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPoems = query.trim()
    ? POEMS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.author.toLowerCase().includes(query.toLowerCase()) ||
          p.verses.some((v) => v.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredScholars = query.trim()
    ? SCHOLARS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.famousQuote.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredStories = query.trim()
    ? STORIES.filter(
        (st) =>
          st.title.toLowerCase().includes(query.toLowerCase()) ||
          st.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-background">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài thơ, tác giả, danh nhân, câu chuyện điển cố..."
            autoFocus
            className="w-full bg-transparent text-foreground placeholder:text-foreground/40 text-base focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-muted rounded">
              <X className="w-4 h-4 text-foreground/60" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-muted hover:bg-muted/80 text-foreground px-2.5 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-foreground/50 font-serif">
              <p>Nhập từ khóa để tra cứu kho tàng Thi Ca & Văn Hóa</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                <span onClick={() => setQuery('Nguyễn Du')} className="cursor-pointer bg-muted/60 hover:bg-muted px-2.5 py-1 rounded">Nguyễn Du</span>
                <span onClick={() => setQuery('Truyện Kiều')} className="cursor-pointer bg-muted/60 hover:bg-muted px-2.5 py-1 rounded">Truyện Kiều</span>
                <span onClick={() => setQuery('Qua Đèo Ngang')} className="cursor-pointer bg-muted/60 hover:bg-muted px-2.5 py-1 rounded">Qua Đèo Ngang</span>
                <span onClick={() => setQuery('Quản Trọng')} className="cursor-pointer bg-muted/60 hover:bg-muted px-2.5 py-1 rounded">Quản Trọng</span>
                <span onClick={() => setQuery('Nhân')} className="cursor-pointer bg-muted/60 hover:bg-muted px-2.5 py-1 rounded">Chữ Nhân</span>
              </div>
            </div>
          )}

          {query.trim() && filteredPoems.length === 0 && filteredScholars.length === 0 && filteredStories.length === 0 && (
            <div className="py-8 text-center text-foreground/50 font-serif">
              Không tìm thấy kết quả phù hợp với "{query}"
            </div>
          )}

          {/* Poems */}
          {filteredPoems.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Thi Ca ({filteredPoems.length})
              </h3>
              <div className="space-y-1">
                {filteredPoems.map((poem) => (
                  <div
                    key={poem.id}
                    onClick={() => {
                      onSelectPoem(poem);
                      onClose();
                    }}
                    className="p-3 bg-background/50 hover:bg-primary/10 rounded border border-border/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                        {poem.title}
                      </h4>
                      <p className="text-xs text-foreground/60 font-serif">— {poem.author} ({poem.category})</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scholars */}
          {filteredScholars.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Danh Nhân ({filteredScholars.length})
              </h3>
              <div className="space-y-1">
                {filteredScholars.map((scholar) => (
                  <div
                    key={scholar.slug}
                    onClick={() => {
                      setLocation(`/danh-nhan`);
                      onClose();
                    }}
                    className="p-3 bg-background/50 hover:bg-primary/10 rounded border border-border/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={scholar.img} alt={scholar.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                          {scholar.name}
                        </h4>
                        <p className="text-xs text-foreground/60">{scholar.title}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stories */}
          {filteredStories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5" /> Cổ Tích & Điển Cố ({filteredStories.length})
              </h3>
              <div className="space-y-1">
                {filteredStories.map((story) => (
                  <div
                    key={story.slug}
                    onClick={() => {
                      setLocation(`/cau-chuyen/${story.slug}`);
                      onClose();
                    }}
                    className="p-3 bg-background/50 hover:bg-primary/10 rounded border border-border/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-xs text-foreground/60 font-serif italic">"{story.subtitle}"</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
