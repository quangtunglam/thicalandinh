export interface VirtueTopic {
  char: string;
  name: string;
  img: string;
  meaning: string;
  fullMeaning: string;
  quote: string;
  content: string;
}

export const VIRTUES: VirtueTopic[] = [
  {
    char: "Nhân",
    name: "Lòng Nhân Ái",
    img: "/assets/calligraphy_nhan-D-M4bke2.png",
    meaning: "Lòng nhân ái là gốc rễ",
    fullMeaning: "Nhân là lòng thương người, yêu thương vạn vật, lấy lòng trắc ẩn và sự bao dung làm gốc cho mọi hành xử.",
    quote: "Nhân giả ái nhân — Người có lòng nhân thì yêu thương mọi người.",
    content: "Trong triết lý Nho gia và truyền thống dân tộc, 'Nhân' luôn là đức tính đứng đầu trong Ngũ thường. Nhân không chỉ là tình thương giữa người với người, mà còn là tâm thế sống hòa hợp với vũ trụ và cộng đồng."
  },
  {
    char: "Nghĩa",
    name: "Trách Nhiệm & Lẽ Phải",
    img: "/assets/calligraphy_nghia-B6oEgIPR.png",
    meaning: "Đặt lợi ích chung lên trên",
    fullMeaning: "Nghĩa là làm điều đúng đắn, hợp lẽ công bằng, gánh vác trách nhiệm đối với gia đình, tổ quốc và đồng bào.",
    quote: "Quân tử dụ ư nghĩa, tiểu nhân dụ ư lợi — Người quân tử hiểu việc nghĩa, kẻ tiểu nhân chỉ nghĩ đến điều lợi.",
    content: "Chữ 'Nghĩa' trong văn hóa Việt Nam gắn liền với nghĩa đồng bào, đạo lý 'uống nước nhớ nguồn', 'ăn quả nhớ kẻ trồng cây'. Nghĩa là ngọn hải đăng soi sáng cho những quyết định đạo đức trước cám dỗ lợi ích."
  },
  {
    char: "Lễ",
    name: "Sự Chu Chuẩn & Tôn Trọng",
    img: "/assets/calligraphy_le-BGHQyrY9.png",
    meaning: "Cách đối xử hài hòa",
    fullMeaning: "Lễ là trật tự chuẩn mực trong giao tiếp và ứng xử, thể hiện sự khiêm nhường, kính trên nhường dưới.",
    quote: "Tiên học lễ, hậu học văn — Trước học cách làm người, sau mới học tri thức.",
    content: "Lễ không phải là sự câu nệ hình thức giả tạo, mà là biểu hiện tự nhiên của một tâm hồn có giáo dưỡng, biết tôn trọng không gian và phẩm giá của người khác."
  },
  {
    char: "Trí",
    name: "Trí Tuệ & Sáng Suốt",
    img: "/assets/calligraphy_tri-DDXw6fOs.png",
    meaning: "Hiểu biết rộng, suy xét kỹ",
    fullMeaning: "Trí là sự thấu hiểu chân lý, khả năng phân biệt thiện ác, thị phi và nhìn thấu bản chất sự việc.",
    quote: "Tri chi vi tri chi, bất tri vi bất tri, thị tri dã — Biết thì nói là biết, không biết nói là không biết, ấy mới là người thực biết.",
    content: "Trí tuệ chân chính không chỉ là tích lũy kiến thức sách vở, mà là năng lực quán chiếu tâm mình, thấu hiểu đạo lý nhân quả để hành động sáng suốt trong đời sống."
  },
  {
    char: "Tín",
    name: "Uy Tín & Lời Hứa",
    img: "/assets/calligraphy_tin-Cyqm0JOO.png",
    meaning: "Giữ lời hứa, tin cậy vững bền",
    fullMeaning: "Tín là sự thành thật, giữ trọn lời hứa và tạo dựng niềm tin cậy vững chắc trong lòng mọi người.",
    quote: "Nhân vô tín bất lập — Người không có chữ tín thì khó mà đứng vững ở đời.",
    content: "Chữ Tín là nền tảng của mọi mối quan hệ tốt đẹp trong xã hội. Một lời đã hứa nặng tựa ngàn vàng. Giữ chữ tín chính là trân trọng danh dự và phẩm giá của chính mình."
  }
];
