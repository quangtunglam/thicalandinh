import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { Story } from '@/data/stories';
import { apiService } from '@/services/api';
import { audioStorage } from '@/services/audioStorage';
import { ArrowLeft, Sparkles, Headphones, Volume2 } from 'lucide-react';

export const StoryDetail: React.FC = () => {
  const params = useParams();
  const rawSlug = params.slug || 'quan-trong-bao-thuc-nha';
  const [story, setStory] = useState<Story | null>(null);
  const [activeAudioLang, setActiveAudioLang] = useState<'vi' | 'cs'>('vi');
  const [audioViUrl, setAudioViUrl] = useState<string | null>(null);
  const [audioCsUrl, setAudioCsUrl] = useState<string | null>(null);

  useEffect(() => {
    apiService.getStories().then(async (list) => {
      let decoded = rawSlug;
      try {
        decoded = decodeURIComponent(rawSlug);
      } catch {}

      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]/g, '');

      const normTarget = normalize(decoded);

      const found =
        list.find((s) => {
          if (!s) return false;
          if (s.slug === rawSlug || s.slug === decoded || s.id === rawSlug || s.id === decoded) {
            return true;
          }
          if (normalize(s.slug) === normTarget || normalize(s.id) === normTarget) {
            return true;
          }
          if (normalize(s.title) === normTarget) {
            return true;
          }
          return false;
        }) || list[0] || null;

      setStory(found);

      if (found) {
        if (found.audioVi) {
          const vi = await audioStorage.getAudio(found.audioVi);
          setAudioViUrl(vi);
        } else {
          setAudioViUrl(null);
        }

        if (found.audioCs) {
          const cs = await audioStorage.getAudio(found.audioCs);
          setAudioCsUrl(cs);
        } else {
          setAudioCsUrl(null);
        }

        // Default to whichever language is available
        if (found.audioVi) {
          setActiveAudioLang('vi');
        } else if (found.audioCs) {
          setActiveAudioLang('cs');
        }
      }
    });
  }, [rawSlug]);

  if (!story) return null;

  const currentAudioUrl = activeAudioLang === 'vi' ? audioViUrl : audioCsUrl;
  const hasAudio = !!(audioViUrl || audioCsUrl);

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 md:px-8">
      {/* Back button */}
      <Link
        href="/co-tich"
        className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Cổ Tích & Điển Cố
      </Link>

      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
          {story.theme}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {story.title}
        </h1>
        <p className="text-xl text-foreground/70 italic font-serif">
          "{story.subtitle}"
        </p>
      </div>

      {/* Banner image */}
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border mb-10 shadow-sm">
        <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
      </div>

      {/* Audio Reading Player */}
      {hasAudio && (
        <div className="mb-12 p-5 md:p-6 bg-card border border-primary/20 rounded-xl shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base md:text-lg text-foreground flex items-center gap-2">
                  Nghe Bản Đọc Truyện Truyền Cảm
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </h3>
                <p className="text-xs text-foreground/60">
                  Lắng nghe diễn đọc câu chuyện bằng Tiếng Việt hoặc Tiếng Séc
                </p>
              </div>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border self-start sm:self-auto">
              {audioViUrl && (
                <button
                  type="button"
                  onClick={() => setActiveAudioLang('vi')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeAudioLang === 'vi'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="text-sm">🇻🇳</span> Tiếng Việt
                </button>
              )}
              {audioCsUrl && (
                <button
                  type="button"
                  onClick={() => setActiveAudioLang('cs')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeAudioLang === 'cs'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="text-sm">🇨🇿</span> Tiếng Séc (Čeština)
                </button>
              )}
            </div>
          </div>

          {/* Current Audio Player */}
          {currentAudioUrl && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs text-foreground/70 mb-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-primary" />
                  Đang phát: <strong className="text-foreground">{activeAudioLang === 'vi' ? 'Bản đọc Tiếng Việt 🇻🇳' : 'Bản đọc Tiếng Séc 🇨🇿'}</strong>
                </span>
                <span className="text-[11px] text-foreground/50 italic">Định dạng âm thanh MP3</span>
              </div>
              <audio
                key={`${story.slug}-${activeAudioLang}-${currentAudioUrl}`}
                controls
                src={currentAudioUrl}
                className="w-full h-11 rounded-lg focus:outline-none"
              >
                Trình duyệt của bạn không hỗ trợ phát âm thanh.
              </audio>
            </div>
          )}
        </div>
      )}

      {/* Story Content */}
      <article className="font-serif text-lg text-foreground/90 leading-relaxed space-y-6 text-justify">
        {story.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph.trim()}
          </p>
        ))}
      </article>

      {/* Moral lesson box */}
      {story.moral && (
        <div className="mt-12 p-8 bg-card border-l-4 border-primary rounded-r-lg shadow-sm">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-2">
            <Sparkles className="w-4 h-4" /> Bài học nhân sinh
          </div>
          <p className="font-serif text-base italic text-foreground/90 leading-relaxed">
            {story.moral}
          </p>
        </div>
      )}
    </div>
  );
};
