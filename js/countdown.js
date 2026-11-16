/**
 * COUNTDOWN.JS - LOGIC ĐẾM NGƯỢC THÔNG MINH & CHẾ ĐỘ SINH NHẬT 04/04 ĐẶC BIỆT
 * Dành riêng cho Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 * Ngày sinh: 04/04/2009
 */

const CountdownModule = (function () {
  let timerInterval = null;
  let isBirthdayPreview = false;
  let balloonsInterval = null;

  // Lấy mốc thời gian sinh nhật tiếp theo (04/04)
  function getNextBirthdayDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Tháng trong JS là 0-indexed (tháng 4 là index 3)
    let nextBday = new Date(currentYear, CONFIG.profile.birthMonth - 1, CONFIG.profile.birthDay, 0, 0, 0);

    // Nếu ngày 04/04 năm nay đã qua thì đếm tới 04/04 năm sau
    if (now.getTime() > nextBday.getTime()) {
      nextBday = new Date(currentYear + 1, CONFIG.profile.birthMonth - 1, CONFIG.profile.birthDay, 0, 0, 0);
    }
    return nextBday;
  }

  // Khởi động đếm ngược thời gian thực
  function startCountdown() {
    updateCountdownValues();
    updateJourneyStats();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      updateCountdownValues();
    }, 1000);

    // Cập nhật thống kê mỗi 10 giây
    setInterval(updateJourneyStats, 10000);
  }

  function updateCountdownValues() {
    const now = new Date();
    const target = getNextBirthdayDate();
    const diff = target.getTime() - now.getTime();

    // Các phần tử hiển thị
    const daysEl = document.getElementById("count-days");
    const hoursEl = document.getElementById("count-hours");
    const minsEl = document.getElementById("count-mins");
    const secsEl = document.getElementById("count-secs");
    const progressFill = document.getElementById("bday-progress-fill");
    const progressText = document.getElementById("bday-progress-text");

    // Kiểm tra xem hôm nay có đúng là ngày 04/04 không
    const isTodayBirthday = (now.getMonth() + 1 === CONFIG.profile.birthMonth && now.getDate() === CONFIG.profile.birthDay);

    if (diff <= 0 || isBirthdayPreview || isTodayBirthday) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      if (progressFill) progressFill.style.width = "100%";
      if (progressText) progressText.textContent = "100% - Hôm nay là ngày của công chúa Vy! 🎂";

      // Nếu đúng ngày sinh nhật tự động kích hoạt mode sinh nhật
      if (isTodayBirthday && !isBirthdayPreview) {
        enableBirthdayModeVisuals();
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");

    // Tính phần trăm tiến trình trong chu kỳ 365 ngày
    const totalCycle = 365 * 24 * 60 * 60 * 1000;
    const elapsed = Math.max(0, totalCycle - diff);
    const pct = Math.min(100, Math.max(0, ((elapsed / totalCycle) * 100))).toFixed(1);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${pct}% - Cột mốc tuổi ${target.getFullYear() - CONFIG.profile.birthYear} rực rỡ ✨`;
  }

  // Thống kê hành trình từ 04/04/2009
  function updateJourneyStats() {
    const now = new Date();
    const birthDate = new Date(CONFIG.profile.birthYear, CONFIG.profile.birthMonth - 1, CONFIG.profile.birthDay, 0, 0, 0);
    const diff = now.getTime() - birthDate.getTime();

    if (diff > 0) {
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      // Ước tính số nhịp tim (~78 bpm)
      const heartBeats = Math.floor(diff / (1000 * 60)) * CONFIG.profile.heartRatePerMin;
      // Số mùa trăng tròn (chu kỳ tuần trăng ~29.53059 ngày)
      const moons = (totalDays / 29.53059).toFixed(1);

      const daysEl = document.getElementById("stat-days");
      const hoursEl = document.getElementById("stat-hours");
      const beatsEl = document.getElementById("stat-beats");
      const moonsEl = document.getElementById("stat-moons");

      if (daysEl) daysEl.textContent = totalDays.toLocaleString("vi-VN");
      if (hoursEl) hoursEl.textContent = totalHours.toLocaleString("vi-VN");
      if (beatsEl) beatsEl.textContent = heartBeats.toLocaleString("vi-VN");
      if (moonsEl) moonsEl.textContent = moons.toLocaleString("vi-VN");
    }
  }

  // =========================================================================
  // NÂNG CẤP CHẾ ĐỘ SINH NHẬT 04/04 ĐẶC BIỆT & HOÀNH TRÁNG
  // =========================================================================
  function toggleBirthdayPreview() {
    isBirthdayPreview = !isBirthdayPreview;
    const btn = document.getElementById("bday-preview-btn");
    const titleEl = document.getElementById("hero-main-title");

    if (isBirthdayPreview) {
      if (btn) {
        btn.classList.add("active");
        btn.innerHTML = "<span>🎈</span> Đang bật tiệc 04/04!";
      }
      if (titleEl) {
        if (!titleEl.dataset.original) titleEl.dataset.original = titleEl.innerHTML;
        titleEl.innerHTML = `🎉 Happy Birthday Công Chúa <span class="highlight-name">Tường Vy</span> <span class="highlight-nickname">Bun</span> 🎂`;
      }

      enableBirthdayModeVisuals();

      if (window.AvatarThemeModule) {
        window.AvatarThemeModule.showToast("Đã kích hoạt Chế Độ Sinh Nhật 04/04 Rực Rỡ! 🎂🎉");
      }

      // Thông báo mascot
      if (window.InteractiveFunModule) {
        window.InteractiveFunModule.showMascotSpeech("Chúc mừng sinh nhật công chúa Tường Vy (Bun)! Em là điều tuyệt vời nhất! 💖🎂");
      }

      // Chuyển sang playlist nhạc sinh nhật
      if (window.MusicPlayerModule) {
        window.MusicPlayerModule.switchCategory("birthday");
        window.MusicPlayerModule.play();
      }
    } else {
      if (btn) {
        btn.classList.remove("active");
        btn.innerHTML = "<span>🎉</span> Xem thử tiệc 04/04";
      }
      if (titleEl && titleEl.dataset.original) {
        titleEl.innerHTML = titleEl.dataset.original;
      }

      disableBirthdayModeVisuals();

      if (window.AvatarThemeModule) {
        window.AvatarThemeModule.showToast("Đã trở về chế độ đếm ngược ngày thường 🌸");
      }
    }
    updateCountdownValues();
  }

  // Kích hoạt Dây cờ bunting, Bóng bay tương tác, Thẻ tuổi mới & Pháo hoa đa đợt
  function enableBirthdayModeVisuals() {
    // 1. Dây cờ bunting
    const bunting = document.getElementById("birthday-bunting-banner");
    if (bunting) bunting.classList.add("active");

    // 2. Thẻ Bí Mật Tuổi Mới
    const specialCard = document.getElementById("birthday-special-card");
    if (specialCard) specialCard.classList.add("active");

    // 3. Bóng bay tương tác
    const balloonsWrap = document.getElementById("birthday-balloons-container");
    if (balloonsWrap) {
      balloonsWrap.classList.add("active");
      startBalloonsSpawner();
    }

    // 4. Màn pháo hoa chúc mừng đa đợt
    triggerMultiWaveConfetti();
  }

  function disableBirthdayModeVisuals() {
    const bunting = document.getElementById("birthday-bunting-banner");
    if (bunting) bunting.classList.remove("active");

    const specialCard = document.getElementById("birthday-special-card");
    if (specialCard) specialCard.classList.remove("active");

    const balloonsWrap = document.getElementById("birthday-balloons-container");
    if (balloonsWrap) {
      balloonsWrap.classList.remove("active");
      balloonsWrap.innerHTML = "";
    }
    if (balloonsInterval) {
      clearInterval(balloonsInterval);
      balloonsInterval = null;
    }
  }

  // Sinh bóng bay pastel trôi từ dưới lên
  function startBalloonsSpawner() {
    const balloonsWrap = document.getElementById("birthday-balloons-container");
    if (!balloonsWrap) return;

    if (balloonsInterval) clearInterval(balloonsInterval);

    const colors = ["#FFB7C5", "#FF8FA3", "#E2D1F9", "#CDB4DB", "#FFF3B0", "#C7F9CC"];

    function spawnBalloon() {
      if (!isBirthdayPreview && balloonsWrap.children.length > 15) return;

      const balloon = document.createElement("div");
      balloon.className = "floating-balloon";
      const color = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.backgroundColor = color;
      balloon.style.left = `${Math.random() * 88 + 5}%`;
      const duration = Math.random() * 4 + 9; // 9s - 13s
      balloon.style.setProperty("--duration", `${duration}s`);
      balloon.style.setProperty("--wobble-x", `${(Math.random() - 0.5) * 50}px`);
      balloon.style.setProperty("--wobble-x2", `${(Math.random() - 0.5) * 50}px`);

      // Bấm vào bóng bay để nổ "bụp" vui tai
      balloon.addEventListener("click", (e) => {
        e.stopPropagation();
        popBalloon(balloon);
      });

      balloonsWrap.appendChild(balloon);

      // Tự hủy sau khi bay khỏi màn hình
      setTimeout(() => {
        if (balloon.parentNode) balloon.remove();
      }, duration * 1000 + 500);
    }

    // Sinh ngay vài quả ban đầu
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnBalloon, i * 600);
    }
    balloonsInterval = setInterval(spawnBalloon, 2200);
  }

  function popBalloon(balloon) {
    balloon.classList.add("burst");
    if (window.InteractiveFunModule) {
      window.InteractiveFunModule.triggerSparkleAtElement(balloon);
      window.InteractiveFunModule.playPopSound();
    }
    setTimeout(() => {
      if (balloon.parentNode) balloon.remove();
    }, 300);
  }

  // Bắn pháo hoa Confetti theo nhiều đợt
  function triggerMultiWaveConfetti() {
    if (typeof confetti !== "function") return;

    const colors = ['#FF5D8F', '#FFB7C5', '#FFF3B0', '#C7F9CC', '#E2D1F9', '#FFCAD4'];

    // Đợt 1: Hai bên góc bắn chéo vào tâm
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });

    // Đợt 2: Pháo hoa bùng nổ ở giữa sau 800ms
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: colors
      });
    }, 800);

    // Đợt 3: Mưa sao rơi từ đỉnh sau 1600ms
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.1 },
        colors: colors
      });
    }, 1600);
  }

  return {
    init: function () {
      startCountdown();
      const btn = document.getElementById("bday-preview-btn");
      if (btn) {
        btn.addEventListener("click", toggleBirthdayPreview);
      }
    },
    triggerConfetti: triggerMultiWaveConfetti,
    popBalloon: popBalloon,
    isBirthdayPreview: () => isBirthdayPreview
  };
})();
