export interface Poem {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: "Đường luật" | "Lục bát" | "Song thất lục bát" | "Thơ cổ phong" | "Thơ hiện đại";
  period: string;
  img: string;
  featuredQuote: string;
  verses: string[];
  originalText?: string[];
  pinyinTrans?: string[];
  translation?: string[];
  explanation: string;
  tags: string[];
}

export const POEMS: Poem[] = [
  {
    id: "truyen-kieu",
    slug: "truyen-kieu",
    title: "Truyện Kiều (Đoạn Trường Tân Thanh)",
    author: "Nguyễn Du",
    category: "Lục bát",
    period: "Thế kỷ XVIII – XIX",
    img: "/assets/article_1-Bnc_y2PA.jpg",
    featuredQuote: "Trăm năm trong cõi người ta,\nChữ tài chữ mệnh khéo là ghét nhau...",
    verses: [
      "Trăm năm trong cõi người ta,",
      "Chữ tài chữ mệnh khéo là ghét nhau.",
      "Trải qua một cuộc bể dâu,",
      "Những điều trông thấy mà đau đớn lòng.",
      "Lạ gì bỉ sắc tư phong,",
      "Trời xanh quen thói má hồng đánh ghen.",
      "...",
      "Cảo thơm lần giở trước đèn,",
      "Phong tình có lục còn truyền sử xanh."
    ],
    explanation: "Kiệt tác truyện thơ Nôm gồm 3.254 câu lục bát của Đại thi hào Nguyễn Du. Tác phẩm không chỉ phản ánh hiện thực xã hội phong kiến bất công mà còn là khúc ca nhân đạo vĩ đại về tình yêu, số phận con người và khát vọng tự do.",
    tags: ["Kinh điển", "Lục bát", "Nguyễn Du", "Nhân đạo", "Thế kỷ 19"]
  },
  {
    id: "qua-deo-ngang",
    slug: "qua-deo-ngang",
    title: "Qua Đèo Ngang",
    author: "Bà Huyện Thanh Quan",
    category: "Đường luật",
    period: "Thế kỷ XIX",
    img: "/assets/article_2-BZ59EA5G.jpg",
    featuredQuote: "Bước tới Đèo Ngang bóng xế tà,\nCỏ cây chen đá, lá chen hoa...",
    verses: [
      "Bước tới Đèo Ngang bóng xế tà,",
      "Cỏ cây chen đá, lá chen hoa.",
      "Lom khom dưới núi, tiều vài chú,",
      "Lác đác bên sông, chợ mấy nhà.",
      "Nhớ nước đau lòng, con quốc quốc,",
      "Thương nhà mỏi miệng, cái gia gia.",
      "Dừng chân đứng lại: trời, non, nước,",
      "Một mảnh tình riêng, ta với ta."
    ],
    explanation: "Bài thơ thất ngôn bát cú Đường luật chuẩn mực về niêm luật, đối ngẫu và nghệ thuật chơi chữ 'quốc quốc - gia gia', diễn tả nỗi buồn hoài cổ, cô đơn của lữ khách trước thiên nhiên hoang sơ hùng vĩ.",
    tags: ["Thất ngôn bát cú", "Bà Huyện Thanh Quan", "Hoài cổ", "Đèo Ngang"]
  },
  {
    id: "nam-quoc-son-ha",
    slug: "nam-quoc-son-ha",
    title: "Nam quốc sơn hà",
    author: "Lý Thường Kiệt",
    category: "Đường luật",
    period: "Thế kỷ XI (Thời Lý)",
    img: "/assets/article_3-BoRX7oxL.jpg",
    featuredQuote: "Nam quốc sơn hà Nam đế cư,\nTiệt nhiên định phận tại thiên thư...",
    originalText: [
      "南國山河南帝居",
      "截然定分在天書",
      "如何逆虜來侵犯",
      "汝等行看取敗虛"
    ],
    pinyinTrans: [
      "Nam quốc sơn hà Nam đế cư,",
      "Tiệt nhiên định phận tại thiên thư.",
      "Như hà nghịch lỗ lai xâm phạm,",
      "Nhữ đẳng hành khan thủ bại hư."
    ],
    translation: [
      "Sông núi nước Nam vua Nam ở,",
      "Vành vạnh tuyền ghi định sách trời.",
      "Cớ sao lũ giặc sang xâm phạm,",
      "Chúng bay rồi xem sẽ tơi bời."
    ],
    verses: [
      "Nam quốc sơn hà Nam đế cư,",
      "Tiệt nhiên định phận tại thiên thư.",
      "Như hà nghịch lỗ lai xâm phạm,",
      "Nhữ đẳng hành khan thủ bại hư."
    ],
    explanation: "Được xem như bản 'Tuyên ngôn Độc lập đầu tiên' của dân tộc Việt Nam, khẳng định chủ quyền lãnh thổ thiêng liêng bất khả xâm phạm bằng ý chí sắt đá của quân dân thời Lý.",
    tags: ["Tuyên ngôn", "Thơ chữ Hán", "Lý Thường Kiệt", "Hào khí Đông A"]
  },
  {
    id: "canh-ngay-he",
    slug: "canh-ngay-he",
    title: "Cảnh ngày hè (Bảo kính cảnh giới - Bài 43)",
    author: "Nguyễn Trãi",
    category: "Thơ cổ phong",
    period: "Thế kỷ XV (Thời Hậu Lê)",
    img: "/assets/ChatGPT_Image_12_47_39_17_thg_8__2026_1786963672074-HdoORWX4.png",
    featuredQuote: "Dẽ có Ngu cầm đàn một tiếng,\nDân giàu đủ khắp đòi phương...",
    verses: [
      "Rồi hóng mát thuở ngày trường,",
      "Hoè lục đùn đùn tán rợp giương.",
      "Thạch lựu hiên còn phun thức đỏ,",
      "Hồng liên trì đã tiễn mùi hương.",
      "Lao xao chợ cá làng ngư phủ,",
      "Dắng dỏi cầm ve lầu tịch dương.",
      "Dẽ có Ngu cầm đàn một tiếng,",
      "Dân giàu đủ khắp đòi phương."
    ],
    explanation: "Bức tranh mùa hè tràn đầy sức sống và âm thanh nơi thôn dã, qua đó bộc lộ tấm lòng son sắt ưu ái vì dân vì nước của Ức Trai Nguyễn Trãi.",
    tags: ["Nguyễn Trãi", "Quốc âm thi tập", "Yêu nước thương dân"]
  },
  {
    id: "ban-den-choi-nha",
    slug: "ban-den-choi-nha",
    title: "Bạn đến chơi nhà",
    author: "Nguyễn Khuyến",
    category: "Đường luật",
    period: "Cuối thế kỷ XIX",
    img: "/assets/story_scholars-CtpupIEr.jpg",
    featuredQuote: "Bác đến chơi đây ta với ta...",
    verses: [
      "Đã bấy lâu nay bác tới nhà,",
      "Trẻ thời đi vắng, chợ thời xa.",
      "Ao sâu nước cả, khôn chài cá,",
      "Vườn rộng rào thưa, khó đuổi gà.",
      "Cải chửa ra cây, cà mới nụ,",
      "Bầu vừa rụng rốn, mướp đương hoa.",
      "Đầu trò tiếp khách, trầu không có,",
      "Bác đến chơi đây, ta với ta!"
    ],
    explanation: "Nụ cười hóm hỉnh, hồn nhiên của Tam nguyên Yên Đổ về hoàn cảnh thiếu thốn vật chất nhưng tràn đầy tình bạn thanh cao, chân thành hiếm có.",
    tags: ["Nguyễn Khuyến", "Tình bạn", "Thất ngôn bát cú"]
  },
  {
    id: "hoang-hac-lau",
    slug: "hoang-hac-lau",
    title: "Hoàng Hạc Lâu",
    author: "Thôi Hiệu",
    category: "Đường luật",
    period: "Thời Đường (Trung Hoa)",
    img: "/assets/ChatGPT_Image_12_47_39_17_thg_8__2026_1786963672074-HdoORWX4.png",
    featuredQuote: "Nhật mộ hương quan hà xứ thị?\nYên ba giang thượng sử nhân sầu.",
    verses: [
      "Tích nhân dĩ thừa hoàng hạc khứ,",
      "Thử địa không dư Hoàng Hạc lâu.",
      "Hoàng hạc nhất khứ bất phục phản,",
      "Bạch vân thiên tải không du du.",
      "Tình xuyên lịch lịch Hán Dương thụ,",
      "Phương thảo thê thê Anh Vũ châu.",
      "Nhật mộ hương quan hà xứ thị?",
      "Yên ba giang thượng sử nhân sầu."
    ],
    explanation: "Thi phẩm Đường thi tuyệt tác ngàn đời khiến thi tiên Lý Bạch từng phải gác bút chịu thua. Nỗi sầu hoài hương trên dòng khói sóng.",
    tags: ["Đường thi", "Thôi Hiệu", "Hoàng Hạc Lâu"]
  }
];
