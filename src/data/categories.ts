export interface Category {
  id: string;
  href: string;
  label: string;
  sub: string;
  img: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "thi-ca",
    href: "/thi-ca",
    label: "THI CA",
    sub: "Thơ ca Việt Nam\nvà thế giới",
    img: "/assets/cat_thi_ca-D6LM03Id.png",
    description: "Kho tàng các áng thơ bất hủ từ cổ phong, Đường luật đến thơ ca hiện đại đậm chất nhân văn và mỹ cảm."
  },
  {
    id: "van-hoa",
    href: "/van-hoa",
    label: "VĂN HÓA",
    sub: "Giá trị truyền thống\nmuôn đời",
    img: "/assets/cat_van_hoa-B2AfqdwR.png",
    description: "Khám phá nét đẹp thuần phong mỹ tục, nghệ thuật thư họa, trà đạo và các triết lý nhân sinh phương Đông."
  },
  {
    id: "danh-nhan",
    href: "/danh-nhan",
    label: "DANH NHÂN",
    sub: "Những bậc hiền tài\nlưu danh sử sách",
    img: "/assets/cat_danh_nhan-BHV_Ilj5.png",
    description: "Tôn vinh cuộc đời, nhân cách và trước tác của các bậc hiền triết, danh nhân ngàn năm rạng rỡ."
  },
  {
    id: "co-tich",
    href: "/co-tich",
    label: "CỔ TÍCH & ĐIỂN CỔ",
    sub: "Kho tàng truyện xưa\nđiển cổ",
    img: "/assets/cat_co_tich-B5jJYxkR.png",
    description: "Lắng nghe những câu chuyện xưa tích cũ, những điển cố văn học ẩn chứa bài học sâu sắc của tiền nhân."
  },
  {
    id: "thu-vien",
    href: "/thu-vien",
    label: "THƯ VIỆN",
    sub: "Sách, tài liệu\nvà tư liệu quý",
    img: "/assets/cat_thu_vien-DX5VJbzF.png",
    description: "Nơi lưu trữ các bản dịch, thư tịch cổ, văn bản nghiên cứu và tài liệu số hóa giá trị."
  }
];
