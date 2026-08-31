import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Facebook, Youtube, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-card mt-24 border-t border-border pt-16 pb-8 relative overflow-hidden">
      {/* Traditional Lotus Stamp Emblem */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-background flex items-center justify-center rounded-b-full border-b border-x border-border">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 2C12 2 8 8 8 12C8 16 12 22 12 22C12 22 16 16 16 12C16 8 12 2 12 2Z" />
          <path d="M12 22C12 22 4 18 4 12C4 8 8 2 8 2" />
          <path d="M12 22C12 22 20 18 20 12C20 8 16 2 16 2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          {/* Col 1: About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/assets/LOGO_PNG_1-500_500_1786962282661-DCgqGFGg.png"
                alt="Thi Ca Lan Đình"
                className="h-14 w-auto object-contain"
              />
              <span className="font-serif font-bold text-xl tracking-wide text-foreground">
                THI CA LAN ĐÌNH
              </span>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-6 font-serif">
              Thi Ca Lan Đình là không gian lưu giữ và lan tỏa những giá trị thi ca và văn hóa truyền thống của dân tộc và nhân loại.
            </p>
            <Link
              href="/gioi-thieu"
              className="text-primary font-medium hover:text-primary/80 flex items-center gap-2 text-sm tracking-widest transition-colors uppercase"
            >
              TÌM HIỂU THÊM <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Col 2: Social Connect */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-serif font-bold text-lg mb-6 tracking-wider">
              KẾT NỐI CÙNG CHÚNG TÔI
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors bg-background"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors bg-background"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors bg-background"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-8 text-xs text-foreground/60 leading-relaxed">
              <p>📍 Địa chỉ thi quán: Lan Đình Các, Thăng Long Kính Ký</p>
              <p className="mt-1">✉️ Email: info@thicalandinh.com</p>
            </div>
          </div>

          {/* Col 3: Newsletter */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-serif font-bold text-lg mb-6 tracking-wider">
              ĐĂNG KÝ NHẬN BẢN TIN
            </h3>
            <p className="text-foreground/80 mb-6 font-serif">
              Nhận những bài viết hay nhất mỗi tuần qua email.
            </p>
            <form className="w-full relative" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ email của bạn"
                required
                className="w-full bg-background border border-border rounded-full px-5 py-3 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow font-sans"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Đăng ký"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-primary font-medium mt-2 animate-in fade-in">
                ✓ Cảm ơn bạn đã đăng ký nhận tin từ Thi Ca Lan Đình!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
          <p>© 2024 Thi Ca Lan Đình. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
