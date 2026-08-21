import React, { useState } from 'react';
import { Poem } from '@/data/poems';
import { X, BookOpen, Copy, Check, Sparkles } from 'lucide-react';

interface PoemModalProps {
  poem: Poem | null;
  onClose: () => void;
}

export const PoemModal: React.FC<PoemModalProps> = ({ poem, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'original' | 'analysis'>('text');

  if (!poem) return null;

  const handleCopy = () => {
    const textToCopy = `${poem.title} - ${poem.author}\n\n${poem.verses.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">{poem.title}</h2>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">{poem.author} • {poem.period}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-6 gap-6 text-sm bg-background/30">
          <button
            onClick={() => setActiveTab('text')}
            className={`py-3 font-serif font-semibold border-b-2 transition-colors ${
              activeTab === 'text' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            Văn bản thơ
          </button>
          {poem.originalText && (
            <button
              onClick={() => setActiveTab('original')}
              className={`py-3 font-serif font-semibold border-b-2 transition-colors ${
                activeTab === 'original' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Chữ Hán & Dịch
            </button>
          )}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3 font-serif font-semibold border-b-2 transition-colors ${
              activeTab === 'analysis' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            Bình giảng
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 text-center bg-card/60">
          {activeTab === 'text' && (
            <div className="max-w-md mx-auto py-4">
              <div className="space-y-2 font-serif text-lg md:text-xl leading-relaxed text-foreground italic">
                {poem.verses.map((line, idx) => (
                  <p key={idx} className="hover:text-primary transition-colors cursor-default">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'original' && poem.originalText && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left py-4 font-serif">
              <div className="bg-background/80 p-5 rounded border border-border/60">
                <h4 className="font-bold text-xs uppercase tracking-widest text-primary mb-3">Nguyên tác Hán tự</h4>
                <div className="text-xl space-y-2 font-serif text-foreground/90">
                  {poem.originalText.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
              <div className="bg-background/80 p-5 rounded border border-border/60">
                <h4 className="font-bold text-xs uppercase tracking-widest text-primary mb-3">Dịch thơ</h4>
                <div className="text-base space-y-2 italic text-foreground/90">
                  {(poem.translation || poem.verses).map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="text-left bg-background/80 p-6 rounded border border-border/60 font-serif leading-relaxed">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm tracking-wider uppercase">Ý nghĩa & Giá trị nghệ thuật</span>
              </div>
              <p className="text-foreground/85 whitespace-pre-line text-base">{poem.explanation}</p>
              
              <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-2">
                {poem.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-background/50 flex items-center justify-between">
          <span className="text-xs text-foreground/60 font-serif">Thể loại: {poem.category}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã sao chép' : 'Sao chép thơ'}
            </button>
            <button
              onClick={onClose}
              className="text-xs font-medium bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
