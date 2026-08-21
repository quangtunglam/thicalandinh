import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { VIRTUES } from '@/data/culture';
import { Poem } from '@/data/poems';
import { Story } from '@/data/stories';
import { Scholar } from '@/data/scholars';
import { apiService } from '@/services/api';

interface HomeProps {
  onSelectPoem: (poem: Poem) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectPoem }) => {
  const [featuredPoems, setFeaturedPoems] = useState<Poem[]>([]);
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);
  const [scholars, setScholars] = useState<Scholar[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [p, s, sc] = await Promise.all([
        apiService.getPoems(),
        apiService.getStories(),
        apiService.getScholars(),
      ]);
      setFeaturedPoems(p.slice(0, 3));
      setFeaturedStory(s[0] || null);
      setScholars(sc.slice(0, 8));
    }
    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/ChatGPT_Image_12_47_39_17_thg_8__2026_1786963672074-HdoORWX4.png"
            alt="Landscape"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        </div>

        <img
          src="/assets/ChatGPT_Image_12_47_39_17_thg_8__2026_1786963672074-HdoORWX4.png"
          alt=""
          className="w-full invisible"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex items-center px-8 md:px-32 lg:px-64">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[4.5rem] italic font-bold text-foreground mb-5 leading-tight whitespace-nowrap">
              Ôn cố nhi tri tân
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-primary/60" />
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                className="text-primary opacity-70"
              >
                <circle cx="8" cy="5" r="2" fill="currentColor" />
                <circle cx="2" cy="5" r="1.2" fill="currentColor" />
                <circle cx="14" cy="5" r="1.2" fill="currentColor" />
              </svg>
              <div className="h-px w-8 bg-primary/60" />
            </div>

            <p className="font-serif text-base md:text-lg text-foreground/80 mb-8 leading-relaxed">
              Tìm về những giá trị đẹp của quá khứ<br />
              để soi sáng hiện tại và hướng tới tương lai.
            </p>

            <Link
              href="/thi-ca"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3 rounded-sm font-medium tracking-widest text-sm uppercase hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              KHÁM PHÁ NGAY
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Five Categories Bar */}
      <section className="bg-card border-y border-border py-8 relative z-20 mx-4 md:mx-auto max-w-6xl rounded-lg shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border/40">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex items-center gap-4 px-5 py-5 group hover:bg-primary/5 transition-colors"
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-20 h-20 object-contain flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h3 className="font-serif font-bold text-sm tracking-widest mb-1 group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed whitespace-pre-line">
                    {cat.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Poems / Articles */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-[1px] w-16 md:w-32 bg-primary/30" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest uppercase">
            BÀI VIẾT NỔI BẬT
          </h2>
          <div className="h-[1px] w-16 md:w-32 bg-primary/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredPoems.map((poem) => (
            <article
              key={poem.id}
              onClick={() => onSelectPoem(poem)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm mb-6 relative bg-muted">
                <img
                  src={poem.img}
                  alt={poem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <div className="text-center px-4">
                <span className="text-xs font-bold tracking-widest text-primary uppercase mb-3 block">
                  {poem.category.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {poem.title}
                </h3>
                <p className="text-sm text-foreground/60 uppercase tracking-widest mb-4">
                  — {poem.author} —
                </p>
                <p className="font-serif text-foreground/80 italic mb-6 leading-relaxed line-clamp-3">
                  "{poem.featuredQuote || poem.verses[0]}"
                </p>
                <span className="text-primary font-medium text-sm tracking-widest uppercase flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                  ĐỌC TIẾP <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 max-w-7xl mx-auto" />

      {/* 4. Story of the Week & Ngũ Thường Theme */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Story of the Week */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <h2 className="font-serif text-xl font-bold tracking-widest uppercase text-primary">
                MỖI TUẦN MỘT CÂU CHUYỆN
              </h2>
            </div>

            {featuredStory && (
              <div className="bg-card p-8 md:p-10 border border-border/50 rounded-sm relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none transform rotate-12">
                  <span className="font-serif text-[200px]">知</span>
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="font-serif text-3xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                    {featuredStory.title}
                  </h3>
                  <p className="text-lg text-foreground/60 italic font-serif mb-6">
                    "{featuredStory.subtitle}"
                  </p>
                  <div className="aspect-video w-full mb-6 overflow-hidden rounded-sm border border-border">
                    <img
                      src={featuredStory.img}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <p className="font-serif text-foreground/80 leading-relaxed mb-8 text-justify">
                    {featuredStory.summary}
                  </p>
                  <Link
                    href={`/cau-chuyen/${featuredStory.slug}`}
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-sm font-medium tracking-widest text-sm uppercase hover:bg-primary/90 transition-colors w-max"
                  >
                    ĐỌC CÂU CHUYỆN <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: Explore by Topics (Ngũ Thường) */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m12 8 4 4-4 4" />
                <path d="M8 12h8" />
              </svg>
              <h2 className="font-serif text-xl font-bold tracking-widest uppercase text-primary">
                KHÁM PHÁ THEO CHỦ ĐỀ
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {VIRTUES.map((virtue) => (
                <Link
                  key={virtue.char}
                  href={`/van-hoa`}
                  className="group flex items-center gap-6 p-6 bg-card border border-border/50 hover:border-primary/50 transition-colors rounded-sm"
                >
                  <img
                    src={virtue.img}
                    alt={virtue.char}
                    className="shrink-0 w-16 h-16 object-contain transition-transform group-hover:scale-110 duration-300"
                  />
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {virtue.char}
                    </h3>
                    <p className="font-sans text-foreground/70">
                      {virtue.meaning}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/van-hoa"
              className="mt-8 inline-flex items-center gap-2 text-primary font-bold tracking-widest text-sm uppercase hover:text-primary/80 transition-colors group"
            >
              XEM TẤT CẢ CHỦ ĐỀ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-border/50 max-w-7xl mx-auto" />

      {/* 5. Figures & Quote of the Day */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 lg:gap-24 items-start">
          {/* Left: Scholars */}
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-widest uppercase mb-12 flex items-center gap-4">
              DANH NHÂN TIÊU BIỂU
              <div className="h-px flex-1 bg-border" />
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 gap-y-12">
              {scholars.map((scholar) => (
                <Link
                  key={scholar.slug}
                  href={`/danh-nhan`}
                  className="flex flex-col items-center group text-center"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 border-2 border-border group-hover:border-primary p-1 transition-colors relative">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={scholar.img}
                        alt={scholar.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0"
                      />
                    </div>
                  </div>
                  <span className="font-serif font-bold text-lg group-hover:text-primary transition-colors">
                    {scholar.name}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/danh-nhan"
              className="mt-12 inline-flex items-center gap-2 text-primary font-bold tracking-widest text-sm uppercase hover:text-primary/80 transition-colors group"
            >
              XEM THÊM DANH NHÂN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Quote of the Day */}
          <div className="relative">
            <h2 className="font-serif text-2xl font-bold tracking-widest uppercase mb-12 text-primary">
              CÂU THƠ HAY MỖI NGÀY
            </h2>

            <div className="bg-card p-10 md:p-12 border border-border/50 rounded-sm relative overflow-hidden flex flex-col justify-center min-h-[400px]">
              <span className="absolute top-6 left-6 text-[80px] font-serif leading-none text-primary/10 select-none">
                "
              </span>
              <div className="relative z-10">
                <p className="font-serif text-2xl md:text-3xl leading-relaxed italic text-foreground mb-8 text-center text-shadow-ink">
                  "Hoa gạo rụng xuống trời nghe<br />
                  Bằng khoảng mơ nửa nhớ ai, nửa đời."
                </p>
                <p className="text-right font-serif font-bold text-lg text-primary tracking-widest">
                  — Lưu Trọng Lư
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
