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
  audioVi?: string; // Link URL hoặc Base64 file MP3 bản đọc Tiếng Việt
  audioCs?: string; // Link URL hoặc Base64 file MP3 bản đọc Tiếng Séc (Čeština)
}

export const STORIES: Story[] = [
  {
    id: "story-1793023338639",
    slug: "tấm-và-cám",
    title: "Tấm và Cám",
    subtitle: "Truyện nêu lên lý nhân quả, làm thiện, nói thiện và nghĩ thiện sẽ có quả thiện lành ngay trong kiếp sống này.",
    theme: "Cổ tích",
    img: "/assets/story_tam_cam.jpg",
    summary: "Tấm Cám kể về cô gái hiền lành tên Tấm, trải qua nhiều bất công và sự hãm hại của mẹ con dì ghẻ, cuối cùng giành lại hạnh phúc và trừng phạt những kẻ độc ác.",
    content: [
      "Ngày xưa, có hai chị em cùng cha khác mẹ là Tấm và Cám. Mẹ Tấm mất sớm, cha Tấm cưới mẹ Cám, rồi không lâu sau cha Tấm cũng qua đời. Tấm phải sống cùng dì ghẻ (mẹ của Cám). Dì ghẻ ác nghiệt, bắt Tấm phải làm hết mọi công việc nặng nhọc trong nhà, trong khi Cám thì được nuông chiều, chỉ việc ăn chơi.",
      "Một hôm, dì ghẻ bảo Tấm và Cám ra đồng bắt cá. Bà hứa đứa nào bắt được nhiều cá hơn sẽ được thưởng. Tấm chăm chỉ bắt cá, chẳng mấy chốc giỏ đã đầy. Cám mải chơi nên chẳng bắt được con nào. Thấy giỏ cá của chị đầy ắp, Cám nảy ra ý xấu. Nó gọi Tấm, \"Chị Tấm ơi, đầu chị lấm lem rồi, chị xuống ao gội cho sạch đi, kẻo về mẹ mắng.\"",
      "Tấm tin lời em, để giỏ cá nhờ Cám coi rồi lội xuống ao gội đầu. Lợi dụng lúc đó, Cám đã trút hết cá từ giỏ Tấm sang giỏ mình rồi vội vàng chạy về nhà.",
      "Tấm lên bờ thấy giỏ trống rỗng, liền ngồi khóc nức nở. Bỗng, ông Bụt hiện lên và hỏi, \"Tại sao con khóc?\"",
      "Tấm kể lại sự tình. Bụt bảo Tấm nhìn vào giỏ xem còn gì không. Tấm nhìn vào thì thấy còn sót lại một con cá bống nhỏ. Bụt dặn Tấm đem cá bống về thả xuống giếng nuôi, mỗi bữa ăn bớt lại một bát cơm đem cho bống ăn và dặn câu thần chú: 'Bống bống bang bang, lên ăn cơm vàng cơm bạc nhà ta, chớ ăn cơm hẩm cháo hoa nhà người'.",
      "Mẹ con Cám rình biết chuyện, lừa Tấm đi chăn trâu đồng xa rồi ở nhà bắt bống làm thịt. Tấm về không thấy bống đâu, lại ngồi khóc. Bụt hiện lên bảo Tấm tìm xương bống bỏ vào bốn chiếc lọ rồi chôn dưới bốn chân giường.",
      "Đến ngày hội làng mở hội, mẹ con Cám sắm sửa quần áo đẹp đi trẩy hội, còn bắt Tấm ở nhà nhặt một đấu thóc trộn lẫn với một đấu gạo. Tấm khóc, Bụt sai đàn chim sẻ xuống nhặt giúp, rồi bảo Tấm đào bốn chiếc lọ dưới chân giường lên. Lọ thứ nhất biến ra bộ quần áo dạ hội lộng lẫy, lọ thứ hai biến ra đôi giày thêu tinh xảo, lọ thứ ba biến ra con ngựa hồng có yên cương chắc chắn.",
      "Tấm mừng rỡ thay đồ, cưỡi ngựa tiến về kinh thành. Trên đường đi qua chỗ lội, Tấm vô tình đánh rơi một chiếc giày thêu mà không kịp nhặt.",
      "Đoàn quân hộ tống nhà Vua đi ngang qua chỗ lầy đó. Hai con voi ngự đầu đàn bỗng dưng cứ cắm đầu xuống đất, không chịu đi tiếp. Vua sai lính kiểm tra, tìm thấy chiếc giày thêu tinh xảo. Vua ngắm nghía và phán, \"Giày đẹp thế này, hẳn người đi nó cũng rất đẹp.\"",
      "Nhà Vua liền hạ lệnh cho tất cả các cô gái đi trẩy hội ướm thử giày, ai đi vừa sẽ được lấy làm Hoàng hậu. Bao nhiêu người chen chúc thử giày đều không vừa, kể cả Cám. Đến lượt Tấm bước lên ướm thử, chân nàng vừa như in, lại rút thêm chiếc giày thứ hai từ trong bọc ra. Nhà Vua mừng rỡ, lập tức rước Tấm về cung làm Hoàng hậu.",
      "Dù sau này trải qua bao kiếp nạn do mẹ con Cám hãm hại, Tấm lần lượt hóa thân thành chim vàng anh, cây xoan đào, khung cửi và quả thị để bảo vệ lẽ phải, cuối cùng nàng trở lại làm người, đoàn tụ hạnh phúc bên nhà Vua. Mẹ con Cám độc ác phải chịu quả báo thích đáng."
    ],
    moral: "Ở hiền gặp lành, cái thiện luôn chiến thắng cái ác. Lòng nhân hậu, sự kiên trì vượt qua nghịch cảnh sẽ luôn được đền đáp xứng đáng."
  },
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
