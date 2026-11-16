/**
 * INTERACTIVE-FUN.JS - BÁNH KEM THỔI NẾN, GACHA VOUCHER, MASCOT THỎ BUN & HIỆU ỨNG PHÉP THUẬT
 * Dành riêng cho Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 * Bổ sung âm thanh phép thuật Web Audio API, khói uốn lượn, hào quang bánh kem & 3 câu thoại mới
 */

const InteractiveFunModule = (function () {
  let isCandleBlown = false;
  let mascotSpeechTimer = null;
  let particlesEnabled = true;
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animFrameId = null;

  // Web Audio Context cho hiệu ứng âm thanh phép thuật & tiếng bóng nổ
  let sfxCtx = null;

  function initSFXContext() {
    if (!sfxCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) sfxCtx = new AudioContextClass();
    }
    if (sfxCtx && sfxCtx.state === "suspended") {
      sfxCtx.resume();
    }
  }

  // Tiếng chuông phép thuật lung linh khi thổi tắt nến
  function playMagicChimeSound() {
    initSFXContext();
    if (!sfxCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!sfxCtx) return;
          const osc = sfxCtx.createOscillator();
          const gain = sfxCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, sfxCtx.currentTime);

          gain.gain.setValueAtTime(0.2, sfxCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, sfxCtx.currentTime + 0.8);

          osc.connect(gain);
          gain.connect(sfxCtx.destination);

          osc.start();
          osc.stop(sfxCtx.currentTime + 0.8);
        }, idx * 110);
      });
    } catch (e) {
      console.warn("SFX error:", e);
    }
  }

  // Tiếng "bụp" vui tai khi chạm nổ bóng bay
  function playPopSound() {
    initSFXContext();
    if (!sfxCtx) return;

    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, sfxCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, sfxCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(sfxCtx.destination);

      osc.start();
      osc.stop(sfxCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Pop sound error:", e);
    }
  }

  function init() {
    setupCakeCandle();
    setupGachaBoxes();
    setupMascotBunny();
    setupSparkleTrail();
    initPetalsCanvas();
    setupParticlesToggle();
  }

  // =========================================================================
  // 1. BÁNH KEM 2 TẦNG & HIỆU ỨNG THỔI TẮT NẾN PHÉP THUẬT
  // =========================================================================
  function setupCakeCandle() {
    const candle = document.getElementById("interactive-cake-candle");
    const visualWrap = document.getElementById("cake-visual-wrap");
    const hintText = document.getElementById("cake-hint-text");
    const relightBtn = document.getElementById("relight-candle-btn");
    const auraEl = document.getElementById("cake-halo-aura");

    if (!candle || !visualWrap) return;

    // Thổi nến
    const handleBlowCandle = (e) => {
      e.stopPropagation();
      if (!isCandleBlown) {
        isCandleBlown = true;
        candle.classList.add("blown");

        // Bật hào quang sóng ánh sáng
        if (auraEl) {
          auraEl.classList.remove("active");
          void auraEl.offsetWidth;
          auraEl.classList.add("active");
        }

        // Hạ nhẹ âm lượng nhạc nền trong 2.5s
        if (window.MusicPlayerModule && typeof window.MusicPlayerModule.duckVolume === "function") {
          window.MusicPlayerModule.duckVolume(2500);
        }

        // Phát âm thanh phép thuật
        playMagicChimeSound();

        // Bắn pháo hoa rực rỡ
        if (window.CountdownModule) {
          window.CountdownModule.triggerConfetti();
        }

        // Cập nhật thông điệp lung linh trên bánh
        if (hintText) {
          hintText.innerHTML = "✨ Điều ước của Tường Vy • Bé Bun chắc chắn sẽ thành sự thật! ✨";
        }

        // Hiện nút Thắp lại nến
        if (relightBtn) {
          relightBtn.classList.add("active");
        }

        showMascotSpeech("Điều ước của công chúa Tường Vy đã bay lên trời cao rồi nè Bun ơi! 💖🎂");
      }
    };

    // Thắp lại nến
    const handleRelight = (e) => {
      e.stopPropagation();
      isCandleBlown = false;
      candle.classList.remove("blown");
      if (hintText) {
        hintText.innerHTML = "🎂 Chạm vào ngọn nến để thổi tắt & ước một điều ước nhé!";
      }
      if (relightBtn) {
        relightBtn.classList.remove("active");
      }
      if (auraEl) {
        auraEl.classList.remove("active");
      }
      showMascotSpeech("Nến lung linh đã thắp lại rồi nè Bun ơi! Hãy ước thêm điều mới nha! ✨");
    };

    candle.addEventListener("click", handleBlowCandle);
    visualWrap.addEventListener("click", handleBlowCandle);
    if (relightBtn) relightBtn.addEventListener("click", handleRelight);
  }

  // =========================================================================
  // 2. HỘP QUÀ GACHA / VOUCHER YÊU THƯƠNG (6 HỘP)
  // =========================================================================
  function setupGachaBoxes() {
    const grid = document.getElementById("gacha-boxes-grid");
    const modal = document.getElementById("voucher-modal-backdrop");
    const closeBtn = document.getElementById("voucher-close-btn");

    if (!grid) return;
    grid.innerHTML = "";

    const boxIcons = ["🎁", "💖", "🍓", "🐰", "👑", "✨"];

    CONFIG.gachaVouchers.forEach((voucher, idx) => {
      const box = document.createElement("div");
      box.className = "gacha-box-item";
      box.id = `gacha-box-${voucher.id}`;
      box.innerHTML = `
        <div class="gacha-icon">${boxIcons[idx % boxIcons.length]}</div>
        <div class="gacha-label">Hộp quà #${voucher.id}</div>
        <div style="font-size:10px; color:#FF5D8F; font-weight:700;">Chạm để mở</div>
      `;

      box.addEventListener("click", () => {
        box.classList.add("opened");
        openVoucherModal(voucher);
        if (window.CountdownModule) {
          window.CountdownModule.triggerConfetti();
        }
      });

      grid.appendChild(box);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeVoucherModal);
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeVoucherModal();
      });
    }
  }

  function openVoucherModal(voucher) {
    const modal = document.getElementById("voucher-modal-backdrop");
    const titleEl = document.getElementById("voucher-title-display");
    const descEl = document.getElementById("voucher-desc-display");
    const codeEl = document.getElementById("voucher-code-display");

    if (titleEl) titleEl.textContent = voucher.title;
    if (descEl) descEl.textContent = voucher.desc;
    if (codeEl) codeEl.textContent = `MÃ VOUCHER: ${voucher.code}`;

    if (modal) modal.classList.add("active");
    showMascotSpeech(`Tường Vy vừa mở được: ${voucher.title}! Xịn xò chưa! 🎁`);
  }

  function closeVoucherModal() {
    const modal = document.getElementById("voucher-modal-backdrop");
    if (modal) modal.classList.remove("active");
  }

  // =========================================================================
  // 3. MASCOT THỎ BUN TƯƠNG TÁC (KÈM 3 CÂU THOẠI NGỌT NGÀO MỚI)
  // =========================================================================
  function setupMascotBunny() {
    const bunny = document.getElementById("mascot-bunny-body");
    if (!bunny) return;

    bunny.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerBunnyJoy();
    });

    // Sau 2 giây hiển thị câu chào đầu tiên
    setTimeout(() => {
      showMascotSpeech("Chào công chúa Tường Vy (Bé Bun)! Chúc em luôn rạng rỡ nha! 🌸");
    }, 2000);
  }

  function triggerBunnyJoy() {
    const bunny = document.getElementById("mascot-bunny-body");
    if (bunny) {
      bunny.style.animation = "none";
      void bunny.offsetWidth;
      bunny.style.animation = "bunnyBounce 0.5s ease-in-out 3";
    }

    // Chọn ngẫu nhiên một câu thoại đáng yêu từ CONFIG.mascotQuotes
    const quotes = CONFIG.mascotQuotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    showMascotSpeech(randomQuote);

    // Bắn vệt sao lấp lánh
    if (bunny) triggerSparkleAtElement(bunny);
  }

  function showMascotSpeech(text) {
    const bubble = document.getElementById("mascot-speech-bubble");
    if (!bubble) return;

    bubble.textContent = text;
    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");

    if (mascotSpeechTimer) clearTimeout(mascotSpeechTimer);
    mascotSpeechTimer = setTimeout(() => {
      bubble.classList.remove("show");
    }, 5500);
  }

  // =========================================================================
  // 4. VỆT SAO LẤP LÁNH THEO CHUỘT VÀ CHẠM VUỐT
  // =========================================================================
  function setupSparkleTrail() {
    let lastTime = 0;

    const handleSparkle = (x, y) => {
      const now = Date.now();
      if (now - lastTime < 50) return;
      lastTime = now;

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle-particle";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 650);
    };

    window.addEventListener("mousemove", (e) => {
      handleSparkle(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        handleSparkle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  function triggerSparkleAtElement(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const rx = cx + (Math.random() - 0.5) * 60;
        const ry = cy + (Math.random() - 0.5) * 60;
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle-particle";
        sparkle.style.left = `${rx}px`;
        sparkle.style.top = `${ry}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 650);
      }, i * 80);
    }
  }

  // =========================================================================
  // 5. CÁNH HOA & TRÁI TIM RƠI (CANVAS ENGINE 60FPS)
  // =========================================================================
  function initPetalsCanvas() {
    canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 14 : 28;
    particles = [];

    const colors = ["#FFB7C5", "#FF8FA3", "#FFCAD4", "#E2D1F9", "#FFF3B0"];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.4 ? "petal" : "heart"
      });
    }

    renderPetals();
  }

  function renderPetals() {
    if (!particlesEnabled) {
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.65;

      if (p.type === "petal") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(p.size / 2, -p.size, p.size, 0);
        ctx.quadraticCurveTo(p.size / 2, p.size, 0, 0);
        ctx.fill();
      } else {
        ctx.beginPath();
        const s = p.size * 0.6;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s, -s, -s * 2, s / 3, 0, s * 1.5);
        ctx.bezierCurveTo(s * 2, s / 3, s, -s, 0, 0);
        ctx.fill();
      }

      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;
    });

    animFrameId = requestAnimationFrame(renderPetals);
  }

  function setupParticlesToggle() {
    const btn = document.getElementById("particles-toggle-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      particlesEnabled = !particlesEnabled;
      if (particlesEnabled) {
        btn.innerHTML = "<span>🌸</span> Hiệu ứng: Bật";
        btn.classList.add("active");
        if (animFrameId) cancelAnimationFrame(animFrameId);
        renderPetals();
        if (window.AvatarThemeModule) window.AvatarThemeModule.showToast("Đã bật hiệu ứng cánh hoa rơi 🌸");
      } else {
        btn.innerHTML = "<span>🌸</span> Hiệu ứng: Tắt";
        btn.classList.remove("active");
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (window.AvatarThemeModule) window.AvatarThemeModule.showToast("Đã tắt hiệu ứng cánh hoa rơi");
      }
    });
  }

  return {
    init: init,
    showMascotSpeech: showMascotSpeech,
    triggerSparkleAtElement: triggerSparkleAtElement,
    playPopSound: playPopSound,
    playMagicChimeSound: playMagicChimeSound
  };
})();
