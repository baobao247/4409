/**
 * CONFIG.JS - FILE CẤU HÌNH TRUNG TÂM
 * Birthday Countdown Web App - Dành tặng Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 * Sinh nhật: 04/04/2009
 * Chuẩn hóa 100% đường dẫn tương đối (./) cho GitHub Pages
 */

const CONFIG = {
  // Thông tin nhân vật chính
  profile: {
    fullName: "Nguyễn Thị Tường Vy",
    nickname: "Bun",
    sweetName: "Kim Phụng",
    birthYear: 2009,
    birthMonth: 4,  // Tháng 4 (1-indexed)
    birthDay: 4,
    birthDateStr: "2009-04-04",
    heartRatePerMin: 78 // Nhịp tim trung bình
  },

  // Danh xưng xoay vòng trên Name Badge
  typewriterTitles: [
    "Công chúa Nguyễn Thị Tường Vy ✨",
    "Em bé Bun đáng yêu nhất hệ mặt trời 🐰",
    "Nàng thơ Kim Phụng xinh xắn 🌷",
    "Thiên thần nhỏ sinh ngày 04/04/2009 💖",
    "Mặt trời nhỏ của riêng anh ☀️"
  ],

  // Danh sách Avatar của Tường Vy (đường dẫn tương đối ./)
  avatarList: [
    {
      src: "./assets/avatar/tuongvy-01.jpg",
      fallback: "./assets/avatar/IMG_20261116_181639.jpg",
      caption: "Nụ cười tỏa nắng của Tường Vy 🌸"
    },
    {
      src: "./assets/avatar/tuongvy-02.jpg",
      fallback: "./assets/avatar/IMG_20261116_181806.jpg",
      caption: "Em bé Bun siêu cấp đáng yêu 🐰"
    },
    {
      src: "./assets/avatar/tuongvy-03.jpg",
      fallback: "./assets/avatar/IMG_20261116_181822.jpg",
      caption: "Nàng thơ Kim Phụng dịu dàng 🌷"
    },
    {
      src: "./assets/avatar/tuongvy-04.jpg",
      fallback: "./assets/avatar/IMG_20261116_181839.jpg",
      caption: "Góc nghiêng thần thánh xinh ngất ngây ✨"
    },
    {
      src: "./assets/avatar/tuongvy-05.jpg",
      fallback: "./assets/avatar/IMG_20261116_181931.jpg",
      caption: "Đôi mắt long lanh chứa cả dải ngân hà 🌌"
    },
    {
      src: "./assets/avatar/tuongvy-06.jpg",
      fallback: "./assets/avatar/IMG_20261116_182003.jpg",
      caption: "Khoảnh khắc ngọt ngào của bé Bun 🍓"
    },
    {
      src: "./assets/avatar/tuongvy-07.jpg",
      fallback: "./assets/avatar/IMG_20261116_182038.jpg",
      caption: "Công chúa nhỏ 04/04/2009 luôn hạnh phúc nhé 💖"
    }
  ],

  // 5 Khung viền Avatar Kawaii
  avatarFrames: [
    { id: "bunny", name: "Tai Thỏ Bun Hồng", icon: "🐰" },
    { id: "sakura", name: "Vòng Hoa Anh Đào", icon: "🌸" },
    { id: "crown", name: "Vương Miện Công Chúa", icon: "👑" },
    { id: "rainbow", name: "Cầu Vồng Kẹo Ngọt", icon: "🌈" },
    { id: "heart-neon", name: "Hào Quang Trái Tim", icon: "💖" }
  ],

  // 3 Kiểu hiệu ứng chuyển cảnh Avatar
  transitionStyles: [
    { id: "fade-zoom", name: "Mờ Dần & Zoom Nhẹ ✨" },
    { id: "flip-3d", name: "Lật Thẻ 3D Mềm Mại 🃏" },
    { id: "bubble-slide", name: "Trượt Bong Bóng 💖" }
  ],

  // 4 Kiểu hoa văn nền sắc nét, có chiều sâu
  bgPatterns: [
    { id: "sakura-heart", name: "Hoa Anh Đào & Trái Tim Rơi 🌸", icon: "🌸" },
    { id: "gingham", name: "Caro Gingham Pastel Dễ Thương 🧺", icon: "🧺" },
    { id: "stars-clouds", name: "Đám Mây Nhỏ & Ngôi Sao Lấp Lánh ☁️", icon: "☁️" },
    { id: "polka-dots", name: "Chấm Bi Kẹo Ngọt & Nơ Xinh 🍬", icon: "🍬" }
  ],

  // Playlist nhạc phong phú phân loại 2 danh mục: Ngày thường & Sinh nhật
  // Hỗ trợ hàm format tên bài hát tự động & encodeURI an toàn
  playlist: [
    // Giai Điệu Ngọt Ngào (Ngày thường)
    {
      id: "sweet-1",
      title: "Sao Cũng Được",
      artist: "Binz",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/binz-sao-cung-duoc.mp3",
      durationHint: "3:15"
    },
    {
      id: "sweet-2",
      title: "Mơ",
      artist: "Vũ Cát Tường",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/vu-cat-tuong-mo.mp3",
      durationHint: "3:40"
    },
    {
      id: "sweet-3",
      title: "Em (feat. SOOBIN)",
      artist: "Binz ft. SOOBIN",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/em-binz-soobin.mp3",
      durationHint: "3:30"
    },
    {
      id: "sweet-4",
      title: "Em",
      artist: "Binz Da Poet",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/em-binz-da-poet.mp3",
      durationHint: "2:45"
    },
    {
      id: "sweet-5",
      title: "Sao Em Lại Tắt Máy",
      artist: "Phạm Nguyên Ngọc",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/sao-em-lai-tat-may.mp3",
      durationHint: "3:20"
    },
    {
      id: "sweet-6",
      title: "Trong Mắt Em",
      artist: "Raay",
      category: "daily",
      categoryName: "Ngọt Ngào Thường Ngày 🍯",
      src: "./assets/music/trong-mat-em-raay.mp3",
      durationHint: "2:55"
    },

    // Sinh Nhật Rực Rỡ (04/04)
    {
      id: "bday-1",
      title: "Happy Birthday To You",
      artist: "AMEE",
      category: "birthday",
      categoryName: "Sinh Nhật Rực Rỡ 🎉",
      src: "./assets/music/happy-birthday-amee.mp3",
      durationHint: "3:10"
    },
    {
      id: "bday-2",
      title: "Khúc Hát Mừng Sinh Nhật",
      artist: "Phan Đinh Tùng",
      category: "birthday",
      categoryName: "Sinh Nhật Rực Rỡ 🎉",
      src: "./assets/music/khuc-hat-mung-sinh-nhat.mp3",
      durationHint: "4:00"
    },
    {
      id: "bday-3",
      title: "SINH NHAT",
      artist: "HIEUTHUHAI",
      category: "birthday",
      categoryName: "Sinh Nhật Rực Rỡ 🎉",
      src: "./assets/music/sinh-nhat-hieuthuhai.mp3",
      durationHint: "3:05"
    }
  ],

  // 5 Giao diện giấy viết thư (Letter Themes)
  letterThemes: [
    { id: "sakura-pink", name: "🌸 Sakura Pastel Pink", desc: "Giấy hồng phấn ren hoa anh đào" },
    { id: "vintage-love", name: "📜 Vintage Love Letter", desc: "Giấy kem cổ điển viền tem sáp đỏ" },
    { id: "bunny-diary", name: "🐰 Kawaii Bunny Diary", desc: "Trang sổ caro bé Bun sticker thỏ" },
    { id: "starry-night", name: "🌌 Starry Midnight Dream", desc: "Nền tím than mộng mơ trăng sao" },
    { id: "strawberry-milk", name: "🍓 Strawberry Milk Postcard", desc: "Bưu thiếp sữa dâu viền răng cưa" }
  ],

  // Gợi ý Sticker / Tem lời chúc
  wishStickers: [
    { id: "stk-1", label: "Thương bé Bun nhất 💖", icon: "💖" },
    { id: "stk-2", label: "Chúc Vy tuổi mới rực rỡ 🎂", icon: "🎂" },
    { id: "stk-3", label: "Mãi bên nhau nhé 🐰", icon: "🐰" },
    { id: "stk-4", label: "Gửi ngàn cái ôm 🫂", icon: "🫂" },
    { id: "stk-5", label: "Kim Phụng luôn cười tươi nha 🌷", icon: "🌷" },
    { id: "stk-6", label: "Bình an & Hạnh phúc ✨", icon: "✨" }
  ],

  // 6 Hộp Quà Gacha / Voucher Yêu Thương
  gachaVouchers: [
    {
      id: 1,
      title: "Voucher Trà Sữa Thơm Ngon 🧋",
      desc: "1 ly trà sữa full topping bất kỳ lúc nào Tường Vy thèm, ship tận nơi liền!",
      code: "BUN-BOBA-0404"
    },
    {
      id: 2,
      title: "Voucher Bữa Tiệc Yêu Thích 🍲",
      desc: "1 buổi đi ăn bất kỳ món ngon nào em thích, anh bao trọn gói từ A-Z!",
      code: "VY-YUMMY-0404"
    },
    {
      id: 3,
      title: "Voucher 1000 Cái Ôm Ấm Áp 🫂",
      desc: "Có giá trị sử dụng trọn đời, ôm bất cứ lúc nào Tường Vy cần sưởi ấm!",
      code: "KIMPHUNG-HUG-INF"
    },
    {
      id: 4,
      title: "Voucher Hẹn Hò Xem Phim 🎬",
      desc: "1 buổi hẹn xem phim rạp ghế đôi, kèm bắp caramen khổng lồ và nước ngọt!",
      code: "BUN-CINEMA-VIP"
    },
    {
      id: 5,
      title: "Voucher Cưng Chiều 100% 💆",
      desc: "1 ngày làm 'boss': được đấm lưng, bóp vai, dỗ dành và không bị giận dỗi!",
      code: "QUEEN-VY-SPA"
    },
    {
      id: 6,
      title: "Voucher Điều Ước Vô Điều Kiện 👑",
      desc: "Đặc quyền tối thượng: Yêu cầu anh thực hiện 1 điều ước bất kỳ!",
      code: "WISH-SUPER-0404"
    }
  ],

  // Bong bóng thoại Mascot Thỏ Bun khi click/chạm (Bổ sung 3 câu thoại ngọt ngào mới)
  mascotQuotes: [
    "Hôm nay Tường Vy của tụi mình đã cười thật tươi chưa nè? Nụ cười của Vy làm cả thế giới pastel này bừng sáng luôn đó! 🌸✨",
    "Bé Bun ơi, nhớ uống đủ nước và giữ gìn sức khỏe nha, có người đang đếm từng giây để chúc mừng sinh nhật em đó! 🐰💖",
    "Dù là Tường Vy, bé Bun hay nàng thơ Kim Phụng thì em vẫn luôn là cô gái đáng yêu và đặc biệt nhất! 🌷👑",
    "Tường Vy ơi, hôm nay em có thấy mình siêu xinh đẹp không? 🌸",
    "Gửi một cái thơm má ngọt ngào tới nàng thơ Kim Phụng nè! 🌷",
    "04/04/2009 là ngày mà một thiên thần siêu đáng yêu đã đến thế giới! ✨",
    "Hôm nay Tường Vy có vui không? Anh và bé thỏ luôn ở đây bên em! 💖",
    "Bun ơi Bun à, cười lên một cái cho đời bừng sáng nào! 🍓",
    "Đếm từng giây từng phút để tới ngày sinh nhật của công chúa Vy! 🎂"
  ],

  // Hàm tiện ích chuẩn hóa tên bài hát (bỏ đuôi mở rộng, thay - / _ thành khoảng trắng)
  formatSongTitle: function (fileName) {
    if (!fileName) return "";
    return fileName
      .replace(/\.(mp3|m4a|wav|ogg)$/i, "")
      .replace(/[\-_]/g, " ")
      .replace(/\(SPOTISAVER\)/gi, "")
      .trim();
  }
};

// Bí danh để tương thích tuyệt đối
CONFIG.MUSIC_PLAYLIST = CONFIG.playlist;

// Đóng băng config tránh bị ghi đè ngoài ý muốn
Object.freeze(CONFIG);
