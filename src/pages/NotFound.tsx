import React from 'react';
import { Link } from 'wouter';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-8 text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">404 - Không Tìm Thấy Trang</h1>
        <p className="text-sm text-foreground/70 font-serif mb-6">
          Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển dời trong thi viện.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded font-medium text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" /> Về Trang Chủ
        </Link>
      </div>
    </div>
  );
};
