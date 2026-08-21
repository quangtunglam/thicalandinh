export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  theme: string;
  img: string;
  summary: string;
  content: string[];
  moral: string;
}

export const STORIES: Story[] = [
  {
    id: "quan-trong-bao-thuc-nha",
    slug: "quan-trong-bao-thuc-nha",
    title: "Quản Trọng và Bào Thúc Nha",
    subtitle: "Thế nào là một người thực sự hiểu bạn?",
    theme: "Tình Tri Kỷ Vượt Thời Gian",
    img: "/assets/story_scholars-CtpupIEr.jpg",
    summary: "Hơn hai nghìn năm trước, tình bạn giữa Bào Thúc Nha và Quản Trọng đã trở thành một trong những điển cố nổi tiếng nhất về chữ 'Tri Kỷ'. Bào Thúc Nha không chỉ tha thứ cho những lỗi lầm của Quản Trọng mà còn tiến cử bạn mình lên ngôi vị Tể tướng.",
    content: [
      "Vào thời Xuân Thu, Quản Trọng và Bào Thúc Nha là đôi bạn thân thiết từ thuở hàn vi. Quản Trọng nhà nghèo, khi hai người cùng nhau buôn bán, khi chia lời Quản Trọng thường lấy phần nhiều hơn. Người ngoài thấy vậy chê trách Quản Trọng tham lam, nhưng Bào Thúc Nha lại bênh vực: 'Không phải Quản Trọng tham đâu, là vì nhà anh ấy nghèo, mẹ già túng thiếu nên tôi tự nguyện nhường đó'.",
      "Quản Trọng từng ra làm quan ba lần nhưng cả ba lần đều bị bãi chức vì không hợp thời thế. Thiên hạ cười chê ông bất tài, Bào Thúc Nha nói: 'Không phải Quản Trọng bất tài, mà là chưa gặp được thời cơ xứng đáng'.",
      "Khi ra chiến trường, Quản Trọng ba lần xung trận thì cả ba lần đều rút lui trước. Quân sĩ mỉa mai ông hèn nhát, Bào Thúc Nha lại nói: 'Quản Trọng không sợ chết đâu, chỉ vì nhà còn mẹ già không ai phụng dưỡng'.",
      "Đến khi nước Tề xảy ra nội loạn, Quản Trọng phò trợ Công tử Củ, còn Bào Thúc Nha phò trợ Công tử Tiểu Bạch. Trong một trận giao tranh, Quản Trọng từng bắn một mũi tên suýt trúng tim Tiểu Bạch.",
      "Sau này Tiểu Bạch lên ngôi tức Tề Hoàn Công, muốn phong Bào Thúc Nha làm Tướng quốc. Bào Thúc Nha lập tức từ chối và khuyên vua: 'Nếu chúa công chỉ muốn trị vì nước Tề thì dùng thần cũng đủ. Nhưng nếu chúa công muốn xưng bá thiên hạ, thống nhất chư hầu thì phi Quản Trọng không ai làm nổi!'",
      "Tề Hoàn Công nghe theo, bỏ qua thù xưa bắn tên, dùng Quản Trọng làm Tể tướng. Quản Trọng dốc lòng cải cách, giúp nước Tề trở thành bá chủ chư hầu đầu tiên thời Xuân Thu.",
      "Nhớ lại ân tình của bạn, Quản Trọng ngậm ngùi than rằng: 'Sinh ra ta là cha mẹ, nhưng người thực sự hiểu ta trên đời duy chỉ có Bào Thúc Nha mà thôi!'"
    ],
    moral: "Tình tri kỷ chân chính không xây đắp trên sự tính toán hơn thua, mà trên sự thấu hiểu tận đáy lòng và sẵn sàng nâng đỡ tài năng của bạn mình vì đại nghĩa."
  },
  {
    id: "ba-nha-tu-ky",
    slug: "ba-nha-tu-ky",
    title: "Bá Nha và Tử Kỳ",
    subtitle: "Tiếng đàn tìm bạn tri âm",
    theme: "Tri Âm Tuyệt Nghệ",
    img: "/assets/article_1-Bnc_y2PA.jpg",
    summary: "Điển tích về tiếng đàn cao sơn lưu thủy của Du Bá Nha và người tiều phu Chung Tử Kỳ — biểu tượng ngàn năm cho sự đồng điệu tâm hồn.",
    content: [
      "Du Bá Nha là bậc danh cầm nước Tấn. Một đêm rằm trăng thanh gió mát, ông đậu thuyền bên bờ sông gảy khúc đàn lòng. Khi ông hướng tâm nghĩ về núi cao, Chung Tử Kỳ nghe xong liền khen: 'Hùng vĩ thay, ngút ngàn như núi Thái Sơn!'.",
      "Khi Bá Nha hướng tâm nghĩ về dòng nước xiết, Tử Kỳ lại tấm tắc: 'Mênh mông thay, cuồn cuộn tựa dòng Trường Giang!'.",
      "Bá Nha kinh ngạc buông đàn nói: 'Tâm ý ta nghĩ gì, tiếng đàn đều được ngươi thấu tỏ. Ngươi quả là bậc tri âm của ta!'. Hai người hẹn ước mùa trăng năm sau sẽ hội ngộ.",
      "Năm sau trở lại, hay tin Tử Kỳ đã qua đời vì bạo bệnh, Bá Nha đau đớn khôn cùng đến trước mộ bạn đàn khúc tiễn biệt rồi vung tay đập vỡ cây đàn Dao cầm, thề trọn đời không bao giờ gảy đàn nữa vì trần gian không còn ai nghe hiểu tiếng đàn của mình."
    ],
    moral: "Nghệ thuật đỉnh cao cần có tâm hồn đồng điệu đón nhận. Gặp được tri âm trong đời là phúc duyên lớn nhất của người nghệ sĩ."
  }
];
