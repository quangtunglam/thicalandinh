import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { Story } from '@/data/stories';
import { apiService } from '@/services/api';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const StoryDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug || 'quan-trong-bao-thuc-nha';
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    apiService.getStories().then((list) => {
      const found = list.find((s) => s.slug === slug) || list[0] || null;
      setStory(found);
    });
  }, [slug]);

  if (!story) return null;

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
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border mb-12 shadow-sm">
        <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
      </div>

      {/* Story Content */}
      <article className="font-serif text-lg text-foreground/90 leading-relaxed space-y-6 text-justify">
        {story.content.map((paragraph, index) => (
          <p key={index} className="indent-8 first:indent-0">
            {paragraph}
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
