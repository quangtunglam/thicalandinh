import React, { useState } from 'react';
import { Send, Check, Mail, MapPin, Phone } from 'lucide-react';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  return (
    <div className="py-12 max-w-3xl mx-auto px-4 md:px-8">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-center">Liên Hệ Thi Ca Lan Đình</h1>
      <p className="font-serif text-center text-foreground/70 mb-12">Chúng tôi luôn hân hạnh đón nhận đóng góp và giao lưu từ quý độc giả.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card p-6 rounded border border-border text-center">
          <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
          <h4 className="font-serif font-bold mb-1">Địa Chỉ</h4>
          <p className="text-xs text-foreground/70">Lan Đình Các, Hà Nội</p>
        </div>
        <div className="bg-card p-6 rounded border border-border text-center">
          <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
          <h4 className="font-serif font-bold mb-1">Email</h4>
          <p className="text-xs text-foreground/70">lienhe@thicalandinh.vn</p>
        </div>
        <div className="bg-card p-6 rounded border border-border text-center">
          <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
          <h4 className="font-serif font-bold mb-1">Hotline</h4>
          <p className="text-xs text-foreground/70">0988 123 456</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-card p-8 rounded-lg border border-border space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Họ và tên</label>
          <input required type="text" className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
          <input required type="email" className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Nội dung liên hệ</label>
          <textarea required rows={4} className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-3 rounded hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2">
          {sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {sent ? 'Đã gửi lời nhắn thành công!' : 'Gửi lời nhắn'}
        </button>
      </form>
    </div>
  );
};
