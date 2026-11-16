/**
 * WISH-LETTER.JS - QUẢN LÝ LỜI CHÚC, POPUP LÁ THƯ ĐA GIAO DIỆN & TẢI PNG
 * Dành riêng cho Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 */

const WishLetterModule = (function () {
  let selectedSticker = "Thương bé Bun nhất 💖";
  let activeTheme = "sakura-pink";
  let currentLetterData = null;

  const STORAGE_KEY = "tuongvy_bday_wishes_v1";

  function init() {
    setupStickerChips();
    setupFormEvents();
    setupLetterModalEvents();
    renderThemeChips();
  }

  // Khởi tạo các chip sticker tem cảm xúc
  function setupStickerChips() {
    const wrap = document.getElementById("wish-stickers-wrap");
    if (!wrap) return;

    wrap.innerHTML = "";
    CONFIG.wishStickers.forEach((stk, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `sticker-chip ${idx === 0 ? "active" : ""}`;
      chip.innerHTML = `<span>${stk.icon}</span> <span>${stk.label}</span>`;
      chip.addEventListener("click", () => {
        document.querySelectorAll(".sticker-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selectedSticker = stk.label;
      });
      wrap.appendChild(chip);
    });
  }

  // Bắt sự kiện form nhập lời chúc
  function setupFormEvents() {
    const form = document.getElementById("wish-composer-form");
    const textarea = document.getElementById("wish-message-input");
    const nameInput = document.getElementById("wish-sender-input");

    if (textarea) {
      // Nhấn Enter để gửi (Shift + Enter để xuống dòng)
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendWish();
        }
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSendWish();
      });
    }

    // Nút mở hộp thư kỷ niệm đã lưu
    const openDrawerBtn = document.getElementById("open-saved-wishes-btn");
    const closeDrawerBtn = document.getElementById("close-saved-drawer-btn");
    if (openDrawerBtn) openDrawerBtn.addEventListener("click", openSavedDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeSavedDrawer);
  }

  function handleSendWish() {
    const textarea = document.getElementById("wish-message-input");
    const nameInput = document.getElementById("wish-sender-input");
    if (!textarea) return;

    let message = textarea.value.trim();
    if (!message) {
      message = "Chúc công chúa Tường Vy (bé Bun) tuổi mới luôn tràn ngập nụ cười, luôn hạnh phúc, bình an và đạt được mọi ước mơ rực rỡ nhất! Anh mãi luôn yêu thương và bên cạnh em! 💖🌸";
    }

    let sender = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Người thương của Tường Vy";

    const letterData = {
      id: Date.now(),
      sender: sender,
      message: message,
      sticker: selectedSticker,
      dateStr: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    };

    // Lưu vào localStorage
    saveWishToStorage(letterData);

    // Mở popup lá thư
    openLetterModal(letterData);

    // Pháo giấy chúc mừng
    if (window.CountdownModule) {
      window.CountdownModule.triggerConfetti();
    }

    // Mascot chúc mừng
    if (window.InteractiveFunModule) {
      window.InteractiveFunModule.showMascotSpeech(`Lá thư gửi tới Tường Vy đã được niêm phong bằng sáp trái tim! 💌`);
    }
  }

  // Render các nút chọn 5 Themes thư
  function renderThemeChips() {
    const container = document.getElementById("letter-theme-chips");
    if (!container) return;

    container.innerHTML = "";
    CONFIG.letterThemes.forEach(thm => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `theme-chip ${thm.id === activeTheme ? "active" : ""}`;
      chip.textContent = thm.name;
      chip.addEventListener("click", () => {
        applyTheme(thm.id);
      });
      container.appendChild(chip);
    });
  }

  function applyTheme(themeId) {
    const paper = document.getElementById("letter-paper-card");
    if (!paper) return;

    CONFIG.letterThemes.forEach(t => paper.classList.remove(`theme-${t.id}`));
    paper.classList.add(`theme-${themeId}`);
    activeTheme = themeId;

    const chips = document.querySelectorAll(".theme-chip");
    CONFIG.letterThemes.forEach((t, idx) => {
      if (chips[idx]) {
        chips[idx].classList.toggle("active", t.id === themeId);
      }
    });
  }

  // Mở popup lá thư
  function openLetterModal(data) {
    currentLetterData = data;
    const backdrop = document.getElementById("letter-modal-backdrop");
    const salutationEl = document.getElementById("letter-salutation-display");
    const bodyEl = document.getElementById("letter-body-display");
    const senderEl = document.getElementById("letter-sender-display");
    const dateEl = document.getElementById("letter-date-display");
    const stickerEl = document.getElementById("letter-sticker-display");

    if (salutationEl) {
      salutationEl.textContent = `Gửi em: Công chúa Nguyễn Thị Tường Vy (Bé Bun) 🌸`;
    }
    if (bodyEl) {
      bodyEl.textContent = data.message;
    }
    if (senderEl) {
      senderEl.textContent = data.sender;
    }
    if (dateEl) {
      dateEl.textContent = data.dateStr;
    }
    if (stickerEl) {
      stickerEl.textContent = data.sticker;
    }

    applyTheme(activeTheme);

    if (backdrop) {
      backdrop.classList.add("active");
      backdrop.classList.remove("screenshot-mode");
    }
  }

  function closeLetterModal() {
    const backdrop = document.getElementById("letter-modal-backdrop");
    if (backdrop) {
      backdrop.classList.remove("active");
      backdrop.classList.remove("screenshot-mode");
    }
  }

  function setupLetterModalEvents() {
    const closeBtn = document.getElementById("letter-close-btn");
    const backdrop = document.getElementById("letter-modal-backdrop");
    const screenshotBtn = document.getElementById("letter-screenshot-btn");
    const downloadBtn = document.getElementById("letter-download-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeLetterModal();
      });
    }

    // Click ra ngoài để đóng nếu không ở screenshot mode
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (backdrop.classList.contains("screenshot-mode")) {
          // Nhấp để thoát chế độ chụp ảnh sạch
          backdrop.classList.remove("screenshot-mode");
          return;
        }
        if (e.target === backdrop) {
          closeLetterModal();
        }
      });
    }

    // Phím Esc đóng modal hoặc thoát screenshot mode
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (backdrop && backdrop.classList.contains("screenshot-mode")) {
          backdrop.classList.remove("screenshot-mode");
        } else {
          closeLetterModal();
          closeSavedDrawer();
        }
      }
    });

    // Chế độ chụp màn hình sạch (Clean Screenshot Mode)
    if (screenshotBtn) {
      screenshotBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (backdrop) {
          backdrop.classList.add("screenshot-mode");
          if (window.InteractiveFunModule) {
            window.InteractiveFunModule.showMascotSpeech("Chế độ chụp màn hình sạch đã bật! Bạn có thể chụp ảnh hoặc nhấp để quay lại 📸");
          }
        }
      });
    }

    // Tải lá thư về máy dạng PNG bằng html2canvas
    if (downloadBtn) {
      downloadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        exportLetterAsPNG();
      });
    }
  }

  // Xuất file PNG chất lượng cao Retina
  function exportLetterAsPNG() {
    const paper = document.getElementById("letter-paper-card");
    if (!paper || typeof html2canvas !== "function") {
      alert("Đang chuẩn bị tải thư về...");
      return;
    }

    const downloadBtn = document.getElementById("letter-download-btn");
    const originalText = downloadBtn ? downloadBtn.innerHTML : "";
    if (downloadBtn) downloadBtn.innerHTML = "<span>⏳</span> Đang tạo ảnh...";

    html2canvas(paper, {
      scale: 2.5, // Tối ưu siêu sắc nét trên cả màn hình điện thoại & laptop
      useCORS: true,
      backgroundColor: null,
      logging: false
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `Loi-Chuc-Sinh-Nhat-Tuong-Vy-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      if (downloadBtn) downloadBtn.innerHTML = originalText;
      if (window.InteractiveFunModule) {
        window.InteractiveFunModule.showMascotSpeech("Đã tải lá thư PNG về máy thành công! Bạn nhớ cất giữ kỷ niệm thật đẹp nhé! 💖");
      }
    }).catch(err => {
      console.error("html2canvas export error:", err);
      if (downloadBtn) downloadBtn.innerHTML = originalText;
    });
  }

  // LocalStorage
  function saveWishToStorage(wish) {
    try {
      const list = getSavedWishes();
      list.unshift(wish);
      // Giới hạn lưu tối đa 30 lời chúc
      if (list.length > 30) list.pop();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }

  function getSavedWishes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function openSavedDrawer() {
    const drawer = document.getElementById("saved-wishes-drawer");
    const listEl = document.getElementById("saved-wishes-list");
    if (!drawer || !listEl) return;

    const list = getSavedWishes();
    listEl.innerHTML = "";

    if (list.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding: 20px; color: #8C6A5D;">
          <p style="font-size: 28px; margin-bottom: 6px;">💌</p>
          <p>Chưa có lời chúc nào được gửi. Hãy viết lời chúc đầu tiên dành tặng Tường Vy nhé!</p>
        </div>
      `;
    } else {
      list.forEach(w => {
        const item = document.createElement("div");
        item.style.cssText = "background: #FFF; border: 1.5px solid #FFCAD4; border-radius: 16px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: transform 0.2s;";
        
        const headRow = document.createElement("div");
        headRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;";
        
        const senderStrong = document.createElement("strong");
        senderStrong.style.cssText = "color:#FF5D8F; font-size:14px;";
        senderStrong.textContent = w.sender || "Người thương của Tường Vy";
        
        const dateSpan = document.createElement("span");
        dateSpan.style.cssText = "font-size:11px; color:#8C6A5D;";
        dateSpan.textContent = w.dateStr || "";
        
        headRow.appendChild(senderStrong);
        headRow.appendChild(dateSpan);
        
        const msgP = document.createElement("p");
        msgP.style.cssText = "font-size:14px; color:#4A3525; white-space:pre-wrap; line-height:1.5;";
        msgP.textContent = w.message;
        
        const stkDiv = document.createElement("div");
        stkDiv.style.cssText = "margin-top:6px; font-size:12px; color:#FF8FA3; font-weight:700;";
        stkDiv.textContent = w.sticker || "";
        
        item.appendChild(headRow);
        item.appendChild(msgP);
        item.appendChild(stkDiv);
        
        item.addEventListener("click", () => {
          closeSavedDrawer();
          openLetterModal(w);
        });
        listEl.appendChild(item);
      });
    }

    drawer.classList.add("active");
  }

  function closeSavedDrawer() {
    const drawer = document.getElementById("saved-wishes-drawer");
    if (drawer) drawer.classList.remove("active");
  }

  return {
    init: init,
    openLetter: openLetterModal,
    exportPNG: exportLetterAsPNG
  };
})();
