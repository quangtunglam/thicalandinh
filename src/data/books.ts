export interface Book {
  id: string;
  slug?: string;
  title: string;
  author: string;
  type: string;
  size: string;
  img?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
}

export const BOOKS: Book[] = [
  {
    id: 'truyen-kieu-1871',
    slug: 'truyen-kieu-ban-nom-lieu-van-duong-1871',
    title: 'Truyện Kiều (Bản Nôm Liễu Văn Đường 1871)',
    author: 'Nguyễn Du',
    type: 'Văn bản cổ',
    size: '28 MB',
    img: '/assets/article_1-Bnc_y2PA.jpg',
    description: 'Bản khắc in chữ Nôm cổ của hiệu Liễu Văn Đường năm Tự Đức thứ 24 (1871), tài liệu quý giá đối chiếu văn bản Đoạn Trường Tân Thanh.',
    fileUrl: '',
    fileName: 'Truyen_Kieu_1871.pdf',
  },
  {
    id: 'quoc-am-thi-tap',
    slug: 'quoc-am-thi-tap',
    title: 'Quốc Âm Thi Tập',
    author: 'Nguyễn Trãi',
    type: 'Thư tịch cổ',
    size: '15 MB',
    img: '/assets/article_2-BZ59EA5G.jpg',
    description: 'Tập thơ chữ Nôm xưa nhất của Việt Nam còn lưu truyền với 254 bài thơ của Ức Trai Nguyễn Trãi, đặt nền móng cho thơ Nôm Đường luật.',
    fileUrl: '',
    fileName: 'Quoc_Am_Thi_Tap_Nguyen_Trai.pdf',
  },
  {
    id: 'bach-van-quoc-ngu-thi-tap',
    slug: 'bach-van-quoc-ngu-thi-tap',
    title: 'Bạch Vân Quốc Ngữ Thi Tập',
    author: 'Nguyễn Bỉnh Khiêm',
    type: 'Thư tịch cổ',
    size: '12 MB',
    img: '/assets/article_3-BoRX7oxL.jpg',
    description: 'Tuyển tập thơ Nôm của Trạng Trình Nguyễn Bỉnh Khiêm mang đậm triết lý nhân sinh, đạo lý làm người và tâm hồn thanh cao nơi am Bạch Vân.',
    fileUrl: '',
    fileName: 'Bach_Van_Quoc_Ngu_Thi_Tap.pdf',
  },
  {
    id: 'duong-thi-tuyen-dich',
    slug: 'duong-thi-tuyen-dich-tam-bach-thu',
    title: 'Đường Thi Tuyển Dịch (Tam bách thủ)',
    author: 'Nhiều tác giả',
    type: 'Thi tập',
    size: '42 MB',
    img: '/assets/story_scholars-CtpupIEr.jpg',
    description: 'Tuyển tập 300 bài thơ Đường kinh điển của Lý Bạch, Đỗ Phủ, Bạch Cư Dị, Vương Duy... kèm nguyên tác chữ Hán, phiên âm, dịch nghĩa và bản dịch thơ.',
    fileUrl: '',
    fileName: 'Duong_Thi_Tam_Bach_Thu.pdf',
  },
  {
    id: 'dao-duc-kinh',
    slug: 'dao-duc-kinh-ban-dich-va-chu-giai',
    title: 'Đạo Đức Kinh (Bản dịch & Chú giải)',
    author: 'Lão Tử',
    type: 'Triết học',
    size: '18 MB',
    img: '/assets/article_1-Bnc_y2PA.jpg',
    description: 'Tác phẩm triết học phương Đông kinh điển gồm 81 chương bàn về Đạo và Đức, nghệ thuật sống thuận theo tự nhiên và vô vi nhi trị.',
    fileUrl: '',
    fileName: 'Dao_Duc_Kinh_Lao_Tu.pdf',
  },
  {
    id: 'luan-ngu-chinh-nghia',
    slug: 'luan-ngu-chinh-nghia',
    title: 'Luận Ngữ Chính Nghĩa',
    author: 'Khổng Tử',
    type: 'Kinh điển',
    size: '35 MB',
    img: '/assets/article_2-BZ59EA5G.jpg',
    description: 'Bộ sách ghi chép lời dạy của Khổng Tử và các học trò về Nhân, Lễ, Nghĩa, Trí, Tín và đạo tu thân, tề gia, trị quốc.',
    fileUrl: '',
    fileName: 'Luan_Ngu_Chinh_Nghia.pdf',
  },
];
