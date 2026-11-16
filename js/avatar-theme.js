/**
 * AVATAR-THEME.JS - TRÌNH CHIẾU ẢNH TƯỜNG VY & NGĂN KÉO TÙY CHỈNH (DRAWER/POPOVER)
 * Dành riêng cho Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 * Gọn hóa giao diện chính, gom khung viền & transition vào drawer + Toast hoa văn
 */

const AvatarThemeModule = (function () {
  let currentIndex = 0;
  let slideTimer = null;
  let activeFrame = "bunny";
  let activeTransition = "fade-zoom";
  let activePattern = "sakura-heart";
  let toastTimeout = null;

  // Danh sách ảnh đã nạp thành công
  let loadedAvatars = [];

  // Fallback Chibi SVG nếu ảnh chưa sẵn sàng
  const CHIBI_SVG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23FFE5EC'/%3E%3Ccircle cx='70' cy='85' r='12' fill='%235C4033'/%3E%3Ccircle cx='130' cy='85' r='12' fill='%235C4033'/%3E%3Ccircle cx='72' cy='82' r='4' fill='%23FFFFFF'/%3E%3Ccircle cx='132' cy='82' r='4' fill='%23FFFFFF'/%3E%3Cellipse cx='55' cy='105' rx='14' ry='8' fill='%23FF8FA3' opacity='0.7'/%3E%3Cellipse cx='145' cy='105' rx='14' ry='8' fill='%23FF8FA3' opacity='0.7'/%3E%3Cpath d='M90 108 Q100 120 110 108' stroke='%235C4033' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3Cpath d='M60 45 Q70 20 85 45' stroke='%23FF8FA3' stroke-width='6' fill='%23FFCAD4'/%3E%3Cpath d='M140 45 Q130 20 115 45' stroke='%23FF8FA3' stroke-width='6' fill='%23FFCAD4'/%3E%3Ctext x='100' y='165' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23FF5D8F'%3ETường Vy • Bun%3C/text%3E%3C/svg%3E";

  function init() {
    setupAvatarGallery();
    setupAvatarDrawer();
    setupFrameSelectors();
    setupTransitionSelectors();
    setupPatternSwitcher();
    startTypewriterBadge();
    startAutoSlide();
  }

  // Khởi tạo thư viện ảnh Avatar
  function setupAvatarGallery() {
    const viewport = document.getElementById("avatar-viewport");
    const dotsWrap = document.getElementById("avatar-dots-group");
    if (!viewport) return;

    viewport.innerHTML = "";
    if (dotsWrap) dotsWrap.innerHTML = "";

    loadedAvatars = CONFIG.avatarList;

    // Tạo hai layer ảnh (layer A và layer B) để thực hiện dual-layer crossfade
    const layerA = document.createElement("img");
    layerA.id = "avatar-layer-a";
    layerA.className = "avatar-layer active";
    layerA.alt = "Tường Vy";

    const layerB = document.createElement("img");
    layerB.id = "avatar-layer-b";
    layerB.className = "avatar-layer";
    layerB.alt = "Tường Vy";

    viewport.appendChild(layerA);
    viewport.appendChild(layerB);

    // Gắn chấm chỉ số (dots)
    if (dotsWrap) {
      loadedAvatars.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = `avatar-dot ${idx === 0 ? "active" : ""}`;
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          goToSlide(idx);
        });
        dotsWrap.appendChild(dot);
      });
    }

    // Hiển thị ảnh đầu tiên
    showAvatar(0, true);

    // Sự kiện chạm/click vào khung ảnh để đổi ảnh
    const frameBox = document.getElementById("avatar-frame-box");
    if (frameBox) {
      frameBox.addEventListener("click", () => {
        nextSlide();
        if (window.InteractiveFunModule) {
          window.InteractiveFunModule.triggerSparkleAtElement(frameBox);
        }
      });
    }

    const prevBtn = document.getElementById("avatar-prev-btn");
    const nextBtn = document.getElementById("avatar-next-btn");
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); });
  }

  function showAvatar(index, isInitial = false) {
    if (loadedAvatars.length === 0) return;
    currentIndex = (index + loadedAvatars.length) % loadedAvatars.length;
    const currentItem = loadedAvatars[currentIndex];

    const layerA = document.getElementById("avatar-layer-a");
    const layerB = document.getElementById("avatar-layer-b");
    const captionEl = document.getElementById("avatar-caption-display");

    if (captionEl) {
      captionEl.textContent = currentItem.caption || "Nguyễn Thị Tường Vy • Bun 💖";
    }

    // Cập nhật dots
    const dots = document.querySelectorAll(".avatar-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });

    if (isInitial) {
      if (layerA) {
        layerA.src = currentItem.src;
        layerA.onerror = () => { layerA.src = currentItem.fallback || CHIBI_SVG_FALLBACK; };
        layerA.classList.add("active");
      }
      return;
    }

    // Cơ chế chuyển cảnh mượt giữa Layer A và Layer B
    const isLayerAActive = layerA.classList.contains("active");
    const incomingLayer = isLayerAActive ? layerB : layerA;
    const outgoingLayer = isLayerAActive ? layerA : layerB;

    incomingLayer.src = currentItem.src;
    incomingLayer.onerror = () => { incomingLayer.src = currentItem.fallback || CHIBI_SVG_FALLBACK; };

    incomingLayer.classList.remove("prev");
    incomingLayer.classList.add("active");

    outgoingLayer.classList.remove("active");
    outgoingLayer.classList.add("prev");
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function goToSlide(index) {
    showAvatar(index);
    resetAutoSlide();
  }

  function startAutoSlide() {
    slideTimer = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function resetAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
    startAutoSlide();
  }

  // =========================================================================
  // NGĂN KÉO TÙY CHỈNH AVATAR (DRAWER / POPOVER)
  // =========================================================================
  function setupAvatarDrawer() {
    const triggerBtn = document.getElementById("avatar-custom-btn");
    const backdrop = document.getElementById("avatar-drawer-backdrop");
    const closeBtn = document.getElementById("close-avatar-drawer-btn");
    const drawerNextBtn = document.getElementById("drawer-next-avatar-btn");

    if (triggerBtn && backdrop) {
      triggerBtn.addEventListener("click", () => {
        backdrop.classList.add("active");
      });
    }

    if (closeBtn && backdrop) {
      closeBtn.addEventListener("click", () => {
        backdrop.classList.remove("active");
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("active");
        }
      });
    }

    if (drawerNextBtn) {
      drawerNextBtn.addEventListener("click", () => {
        nextSlide();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (backdrop && backdrop.classList.contains("active")) {
          backdrop.classList.remove("active");
        }
      }
    });
  }

  // Cài đặt chọn 5 Khung Viền Avatar
  function setupFrameSelectors() {
    const container = document.getElementById("frame-selector-chips");
    const frameBox = document.getElementById("avatar-frame-box");
    if (!container || !frameBox) return;

    container.innerHTML = "";
    CONFIG.avatarFrames.forEach(frame => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `option-pill ${frame.id === activeFrame ? "active" : ""}`;
      pill.innerHTML = `<span>${frame.icon}</span> <span>${frame.name}</span>`;
      pill.addEventListener("click", () => {
        // Xóa class frame cũ
        CONFIG.avatarFrames.forEach(f => frameBox.classList.remove(`frame-${f.id}`));
        frameBox.classList.add(`frame-${frame.id}`);
        activeFrame = frame.id;

        document.querySelectorAll("#frame-selector-chips .option-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");

        showMiniToast(`Đã đổi khung: ${frame.name} ${frame.icon}`);
      });
      container.appendChild(pill);
    });

    // Mặc định khung tai thỏ
    frameBox.classList.add(`frame-${activeFrame}`);
  }

  // Cài đặt chọn 3 Kiểu Chuyển Cảnh Avatar
  function setupTransitionSelectors() {
    const container = document.getElementById("transition-selector-chips");
    const viewport = document.getElementById("avatar-viewport");
    if (!container || !viewport) return;

    container.innerHTML = "";
    CONFIG.transitionStyles.forEach(style => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `option-pill ${style.id === activeTransition ? "active" : ""}`;
      pill.textContent = style.name;
      pill.addEventListener("click", () => {
        CONFIG.transitionStyles.forEach(s => viewport.classList.remove(`transition-${s.id}`));
        viewport.classList.add(`transition-${style.id}`);
        activeTransition = style.id;

        document.querySelectorAll("#transition-selector-chips .option-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");

        showMiniToast(`Đã chọn hiệu ứng: ${style.name}`);
      });
      container.appendChild(pill);
    });

    viewport.classList.add(`transition-${activeTransition}`);
  }

  // =========================================================================
  // BỘ ĐỔI HOA VĂN NỀN & MINI TOAST THÔNG BÁO
  // =========================================================================
  function setupPatternSwitcher() {
    const patternBtn = document.getElementById("pattern-switcher-btn");
    const patternLayer = document.getElementById("seamless-pattern-layer");
    if (!patternBtn || !patternLayer) return;

    let patternIdx = 0;
    patternLayer.className = `seamless-pattern-layer pattern-${CONFIG.bgPatterns[0].id}`;

    patternBtn.addEventListener("click", () => {
      patternIdx = (patternIdx + 1) % CONFIG.bgPatterns.length;
      const current = CONFIG.bgPatterns[patternIdx];

      // Đổi class hoa văn
      CONFIG.bgPatterns.forEach(p => patternLayer.classList.remove(`pattern-${p.id}`));
      patternLayer.classList.add(`pattern-${current.id}`);

      patternBtn.innerHTML = `<span>🎨</span> ${current.name}`;
      
      // Hiện Mini Toast góc trên màn hình
      showMiniToast(`Đã đổi hoa văn: ${current.name}`);

      if (window.InteractiveFunModule) {
        window.InteractiveFunModule.showMascotSpeech(`Đã đổi hoa văn nền sang: ${current.name}! Xinh xắn quá! ✨`);
      }
    });
  }

  // Hàm hiển thị Mini Toast
  function showMiniToast(message) {
    let toast = document.getElementById("mini-toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mini-toast-notification";
      toast.className = "mini-toast-box";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  // Hiệu ứng Typewriter trên Cute Name Badge
  function startTypewriterBadge() {
    const textEl = document.getElementById("typewriter-name-badge");
    if (!textEl) return;

    const titles = CONFIG.typewriterTitles;
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeStep() {
      const fullText = titles[titleIdx];
      if (isDeleting) {
        textEl.textContent = fullText.substring(0, charIdx - 1);
        charIdx--;
      } else {
        textEl.textContent = fullText.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === fullText.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        speed = 400;
      }

      setTimeout(typeStep, speed);
    }

    typeStep();
  }

  return {
    init: init,
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide,
    showToast: showMiniToast
  };
})();
