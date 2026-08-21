import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const NAV_LINKS = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/thi-ca', label: 'Thi Ca' },
  { href: '/van-hoa', label: 'Văn Hóa' },
  { href: '/danh-nhan', label: 'Danh Nhân' },
  { href: '/co-tich', label: 'Cổ Tích & Điển Cổ' },
  { href: '/thu-vien', label: 'Thư Viện' },
  { href: '/gioi-thieu', label: 'Giới Thiệu' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = apiService.isAdminLoggedIn();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/assets/LOGO_PNG_1-500_500_1786962282661-DCgqGFGg.png"
            alt="Thi Ca Lan Đình"
            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif font-bold text-lg md:text-xl tracking-wide text-foreground">
            THI CA LAN ĐÌNH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  isActive ? "text-primary font-semibold" : "text-foreground/80"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Search + Admin Link + Mobile Hamburger) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Admin / Post Article Button */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all shadow-xs"
            title="Đăng bài & Quản trị"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Quản Trị' : 'Đăng Bài'}</span>
          </Link>

          <button
            onClick={onOpenSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
            aria-label="Tìm kiếm"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground/80"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-base py-2 font-serif transition-colors",
                  isActive ? "text-primary font-bold pl-2 border-l-2 border-primary" : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-primary font-semibold py-2 text-sm"
            >
              <PenTool className="w-4 h-4" /> Đăng Bài & Quản Trị Hệ Thống
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
