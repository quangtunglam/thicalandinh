export interface Scholar {
  id: number;
  slug: string;
  name: string;
  title: string;
  era: string;
  img: string;
  bio: string;
  legacy: string;
  famousQuote: string;
  works: string[];
}

export const SCHOLARS: Scholar[] = [
  {
    id: 0,
    slug: "nguyen-du",
    name: "Nguyễn Du",
    title: "Đại thi hào dân tộc — Danh nhân văn hóa thế giới",
    era: "1765 – 1820 (Thời Lê mạt - Nguyễn sơ)",
    img: "/assets/avatar_1-DuNlxL1Y.jpg",
    bio: "Nguyễn Du (tự Tố Như, hiệu Thanh Hiên) sinh tại Thăng Long, quê gốc ở Tiên Điền, Nghi Xuân, Hà Tĩnh. Ông là đại thi hào kiệt xuất của nền văn học Việt Nam, tác giả của kiệt tác Đoạn Trường Tân Thanh (Truyện Kiều).",
    legacy: "Tác phẩm của ông thể hiện tấm lòng nhân đạo bao la, nỗi đau trước thân phận con người và đỉnh cao của ngôn ngữ thi ca tiếng Việt.",
    famousQuote: "Bất tri tam bách dư niên hậu / Thiên hạ hà nhân khấp Tố Như?",
    works: ["Đoạn Trường Tân Thanh (Truyện Kiều)", "Thanh Hiên thi tập", "Nam trung tạp ngâm", "Bắc hành tạp lục", "Văn tế thập loại chúng sinh"]
  },
  {
    id: 1,
    slug: "nguyen-trai",
    name: "Nguyễn Trãi",
    title: "Anh hùng dân tộc — Danh nhân văn hóa thế giới",
    era: "1380 – 1442 (Thời Hồ - Hậu Lê)",
    img: "/assets/avatar_2-DKL5DwlD.jpg",
    bio: "Nguyễn Trãi (hiệu Ức Trai) là nhà chính trị, quân sự lỗi lạc, bậc đại thần khai quốc triều Hậu Lê và là nhà văn, nhà thơ lớn của dân tộc.",
    legacy: "Tư tưởng 'Việc nhân nghĩa cốt ở yên dân' của ông trở thành tuyên ngôn độc lập, nhân bản vĩ đại của muôn đời.",
    famousQuote: "Việc nhân nghĩa cốt ở yên dân / Quân điếu phạt trước lo trừ bạo.",
    works: ["Bình Ngô đại cáo", "Ức Trai thi tập", "Quốc âm thi tập", "Lam Sơn thực lục", "Dư địa chí"]
  },
  {
    id: 2,
    slug: "chu-van-an",
    name: "Chu Văn An",
    title: "Vạn thế sư biểu Việt Nam",
    era: "1292 – 1370 (Thời Trần)",
    img: "/assets/avatar_3-B1nxDJsQ.jpg",
    bio: "Chu Văn An (tên chữ Tiều Ẩn) là một nhà giáo mẫu mực, danh thần tiết tháo thời Trần. Ông từng làm Tư nghiệp Quốc Tử Giám, dâng Thất trảm sớ xin chém 7 tên gian thần rồi lui về ở ẩn.",
    legacy: "Biểu tượng mẫu mực cho tinh thần liêm chính, khí tiết của người thầy giáo Việt Nam muôn đời.",
    famousQuote: "Ta chưa từng nghe người thầy uốn mình dạy đạo mà có thể sửa trị được thiên hạ bao giờ.",
    works: ["Tiều Ẩn thi tập", "Quốc ngữ thi tập", "Y học yếu giải"]
  },
  {
    id: 3,
    slug: "tran-hung-dao",
    name: "Trần Hưng Đạo",
    title: "Hưng Đạo Đại Vương — Quốc công Tiết chế",
    era: "1228 – 1300 (Thời Trần)",
    img: "/assets/avatar_4-DSZZv6NY.jpg",
    bio: "Trần Quốc Tuấn là vị tướng soái kiệt xuất, đã lãnh đạo quân dân Đại Việt 3 lần đánh bại quân xâm lược Nguyên Mông hùng mạnh bậc nhất thế giới đương thời.",
    legacy: "Tấm gương sáng ngời về lòng trung quân ái quốc, tài thao lược quân sự và tinh thần đoàn kết toàn dân 'vua tôi đồng lòng, anh em hòa mục'.",
    famousQuote: "Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước.",
    works: ["Hịch tướng sĩ", "Binh thư yếu lược", "Vạn Kiếp tông bí truyền thư"]
  },
  {
    id: 4,
    slug: "nguyen-binh-khiem",
    name: "Nguyễn Bỉnh Khiêm",
    title: "Trạng Trình — Tuyết Giang Phu Tử",
    era: "1491 – 1585 (Thời Lê - Mạc)",
    img: "/assets/avatar_5-M7ps3r8e.jpg",
    bio: "Nguyễn Bỉnh Khiêm đỗ Trạng nguyên năm 1535, là nhà tư tưởng, nhà triết học, nhà thơ lớn và bậc túc nho thông kim bác cổ được người đời xưng tụng là bậc hiền triết.",
    legacy: "Triết lý xử thế 'Thuận theo tự nhiên, lánh đục tìm trong, giữ trọn thanh bạch' cùng những lời sấm truyền sâu sắc.",
    famousQuote: "Ta dại, ta tìm nơi vắng vẻ / Người khôn, người đến chốn lao xao.",
    works: ["Bạch Vân am thi tập", "Bạch Vân quốc ngữ thi", "Sấm Trạng Trình"]
  },
  {
    id: 5,
    slug: "khong-tu",
    name: "Khổng Tử",
    title: "Vạn thế sư biểu — Người sáng lập Nho gia",
    era: "551 TCN – 479 TCN (Thời Xuân Thu)",
    img: "/assets/avatar_6-CS9kr0tQ.jpg",
    bio: "Khổng Tử (tên Khâu, tự Trọng Ni) sinh tại nước Lỗ. Ông là nhà tư tưởng, nhà giáo dục vĩ đại đặt nền móng cho hệ tư tưởng Nho giáo ảnh hưởng sâu rộng đến văn hóa Á Đông suốt hơn 2.500 năm.",
    legacy: "Học thuyết 'Nhân - Lễ - Chính danh' và tư tưởng 'Hữu giáo vô loại' (giáo dục bình đẳng cho mọi người).",
    famousQuote: "Kỷ sở bất dục, vật thi ư nhân (Điều gì mình không muốn, đừng làm cho người khác).",
    works: ["Luận Ngữ (do học trò ghi chép)", "Kinh Thi (san định)", "Kinh Thư", "Kinh Lễ", "Kinh Dịch"]
  },
  {
    id: 6,
    slug: "manh-tu",
    name: "Mạnh Tử",
    title: "Á Thánh — Nhà tư tưởng Nho gia kiệt xuất",
    era: "372 TCN – 289 TCN (Thời Chiến Quốc)",
    img: "/assets/avatar_7-C4tLwOgG.jpg",
    bio: "Mạnh Tử (tên Kha, tự Tử Dư) là người kế thừa và phát triển xuất sắc nhất tư tưởng của Khổng Tử, chủ trương thuyết 'Tính thiện' và tư tưởng 'Dân vi quý'.",
    legacy: "Đề cao giá trị của người dân trong nền chính trị: Dân vi quý, xã tắc thứ chi, quân vi khinh.",
    famousQuote: "Dân vi quý, xã tắc thứ chi, quân vi khinh (Dân là quý nhất, kế đến là đất nước, vua xem nhẹ hơn).",
    works: ["Mạnh Tử (7 thiên)"]
  },
  {
    id: 7,
    slug: "lao-tu",
    name: "Lão Tử",
    title: "Đạo Tổ — Người sáng lập Đạo gia",
    era: "Thế kỷ VI TCN (Thời Xuân Thu)",
    img: "/assets/avatar_8-BEEm2JPJ.jpg",
    bio: "Lão Tử (tên Lý Nhĩ, tự Đam) là nhà triết học cổ đại trứ danh của phương Đông, tác giả cuốn Đạo Đức Kinh bất hủ với triết lý Vô vi thanh tĩnh.",
    legacy: "Tư tưởng thuận theo tự nhiên, nhu nhược thắng cương cường, lấy sự tĩnh tại để ứng biến vạn vật.",
    famousQuote: "Hành trình vạn dặm bắt đầu từ một bước chân.",
    works: ["Đạo Đức Kinh (81 chương)"]
  }
];
