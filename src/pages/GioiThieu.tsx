import React from 'react';
import { Feather, Heart, Compass } from 'lucide-react';

export const GioiThieu: React.FC = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 md:px-8 font-serif">
      <div className="text-center mb-16">
        <img
          src="/assets/LOGO_PNG_1-500_500_1786962282661-DCgqGFGg.png"
          alt="Logo Thi Ca Lan Đình"
          className="h-24 w-auto mx-auto mb-6 object-contain"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Giới Thiệu Thi Ca Lan Đình
        </h1>
        <p className="text-lg text-primary italic">
          "Lưu giữ hồn cốt xưa — Soi sáng bước đường nay"
        </p>
      </div>

      <div className="space-y-8 text-foreground/85 text-lg leading-relaxed text-justify">
        <p>
          Lấy cảm hứng từ điển tích <strong>Lan Đình Tập Tự</strong> nổi tiếng của Vương Hy Chi cùng các bậc tao nhân mặc khách năm xưa hội tụ bên dòng suối uốn khúc ngâm thơ thưởng trà, <strong>Thi Ca Lan Đình</strong> được sáng lập với tâm nguyện tạo dựng một không gian văn hóa thanh nhã giữa thời đại số.
        </p>
        <p>
          Trong nhịp sống hiện đại hối hả, chúng tôi tin rằng những vần thơ cổ, những câu chuyện đạo lý và tấm gương danh nhân tiền bối vẫn là ngọn đèn ấm áp xoa dịu tâm hồn, vun đắp nhân cách và nhắc nhở chúng ta về cội nguồn sâu xa của bản sắc dân tộc.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center not-italic font-sans">
          <div className="p-6 bg-card border border-border rounded-lg">
            <Compass className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg mb-2">Sứ Mệnh</h3>
            <p className="text-xs text-foreground/70">Bảo tồn và lan tỏa các giá trị thi ca, văn hóa Á Đông kinh điển.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <Feather className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg mb-2">Tôn Chỉ</h3>
            <p className="text-xs text-foreground/70">Tôn trọng nguyên tác, chuẩn xác trong chú giải và thẩm mỹ trong trình bày.</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg mb-2">Cộng Đồng</h3>
            <p className="text-xs text-foreground/70">Không gian tao nhã cho những tâm hồn đồng điệu yêu chuộng cái đẹp.</p>
          </div>
        </div>

        <p>
          Kính mời quý độc giả gần xa cùng bước vào Lan Đình, nhấp chén trà thơm, thưởng thức thi phẩm và cùng chúng tôi gìn giữ mạch nguồn văn hiến ngàn năm bất tuyệt!
        </p>
      </div>
    </div>
  );
};
