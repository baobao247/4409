/**
 * MUSIC-PLAYER.JS - TRÌNH PHÁT NHẠC MINI VINYL & HỘP NHẠC WEB AUDIO API
 * Dành riêng cho Nguyễn Thị Tường Vy (Bun • Kim Phụng)
 * Hỗ trợ encodeURI an toàn 100% cho GitHub Pages, nút Repeat nổi bật & Audio Ducking
 */

const MusicPlayerModule = (function () {
  let audioEl = null;
  let currentIndex = 0;
  let isPlaying = false;
  let isLooping = false;
  let activeCategory = "daily"; // 'daily' hoặc 'birthday'
  let isScrubbing = false;
  let baseVolume = 0.8;

  // Web Audio API Fallback Synth
  let audioCtx = null;
  let isWebAudioFallback = false;
  let synthInterval = null;
  let synthNoteIndex = 0;

  // Bản nhạc piano / music box nốt dự phòng (Web Audio API)
  const FALLBACK_TUNES = {
    birthday: [
      { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.25 }, { note: 293.66, dur: 0.6 },
      { note: 261.63, dur: 0.6 },  { note: 349.23, dur: 0.6 },  { note: 329.63, dur: 1.0 },
      { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.25 }, { note: 293.66, dur: 0.6 },
      { note: 261.63, dur: 0.6 },  { note: 392.00, dur: 0.6 },  { note: 349.23, dur: 1.0 },
      { note: 261.63, dur: 0.35 }, { note: 261.63, dur: 0.25 }, { note: 523.25, dur: 0.6 },
      { note: 440.00, dur: 0.6 },  { note: 349.23, dur: 0.6 },  { note: 329.63, dur: 0.6 },
      { note: 293.66, dur: 0.8 },  { note: 466.16, dur: 0.35 }, { note: 466.16, dur: 0.25 },
      { note: 440.00, dur: 0.6 },  { note: 349.23, dur: 0.6 },  { note: 392.00, dur: 0.6 },
      { note: 349.23, dur: 1.2 }
    ],
    daily: [
      { note: 329.63, dur: 0.5 }, { note: 392.00, dur: 0.5 }, { note: 440.00, dur: 0.5 },
      { note: 523.25, dur: 0.8 }, { note: 440.00, dur: 0.5 }, { note: 392.00, dur: 0.5 },
      { note: 329.63, dur: 1.0 }, { note: 293.66, dur: 0.5 }, { note: 329.63, dur: 0.5 },
      { note: 392.00, dur: 0.8 }, { note: 293.66, dur: 0.5 }, { note: 261.63, dur: 1.2 }
    ]
  };

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Phát một nốt chuông Music Box bằng Web Audio API
  function playMusicBoxTone(freq, duration) {
    if (!audioCtx) initAudioContext();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio note error:", e);
    }
  }

  function startWebAudioMusicBox(tuneKey) {
    isWebAudioFallback = true;
    stopWebAudioMusicBox();
    const tune = FALLBACK_TUNES[tuneKey] || FALLBACK_TUNES.daily;
    synthNoteIndex = 0;

    function step() {
      if (!isPlaying || !isWebAudioFallback) return;
      const item = tune[synthNoteIndex];
      playMusicBoxTone(item.note, item.dur);
      synthNoteIndex = (synthNoteIndex + 1) % tune.length;
      synthInterval = setTimeout(step, item.dur * 1000 + 120);
    }
    step();
  }

  function stopWebAudioMusicBox() {
    if (synthInterval) {
      clearTimeout(synthInterval);
      synthInterval = null;
    }
  }

  // Lọc playlist theo danh mục hiện tại
  function getFilteredPlaylist() {
    const list = CONFIG.playlist.filter(item => item.category === activeCategory);
    return list.length > 0 ? list : CONFIG.playlist;
  }

  function setupDOM() {
    audioEl = new Audio();
    audioEl.preload = "metadata";

    // Lắng nghe các sự kiện âm thanh
    audioEl.addEventListener("timeupdate", onTimeUpdate);
    audioEl.addEventListener("ended", onTrackEnded);
    audioEl.addEventListener("loadedmetadata", onMetaLoaded);
    audioEl.addEventListener("error", onAudioError);

    // Mở khóa AudioContext khi người dùng chạm bất kỳ đâu lần đầu
    const unlockAudio = () => {
      initAudioContext();
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("click", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    // Gắn sự kiện các nút
    const playBtn = document.getElementById("music-play-btn");
    const nextBtn = document.getElementById("music-next-btn");
    const prevBtn = document.getElementById("music-prev-btn");
    const loopBtn = document.getElementById("music-loop-btn");
    const volumeSlider = document.getElementById("music-volume-slider");
    const scrubTrack = document.getElementById("music-scrub-track");

    if (playBtn) playBtn.addEventListener("click", togglePlay);
    if (nextBtn) nextBtn.addEventListener("click", nextTrack);
    if (prevBtn) prevBtn.addEventListener("click", prevTrack);
    if (loopBtn) loopBtn.addEventListener("click", toggleLoop);

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        baseVolume = parseFloat(e.target.value);
        audioEl.volume = baseVolume;
      });
    }

    if (scrubTrack) {
      const handleScrub = (e) => {
        const rect = scrubTrack.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (audioEl.duration && !isNaN(audioEl.duration)) {
          audioEl.currentTime = ratio * audioEl.duration;
        }
      };

      scrubTrack.addEventListener("click", handleScrub);
      scrubTrack.addEventListener("touchstart", (e) => {
        isScrubbing = true;
        handleScrub(e);
      }, { passive: true });

      window.addEventListener("touchmove", (e) => {
        if (isScrubbing) handleScrub(e);
      }, { passive: true });

      window.addEventListener("touchend", () => {
        isScrubbing = false;
      });
    }

    // Tabs chuyển danh mục nhạc
    const tabDaily = document.getElementById("tab-music-daily");
    const tabBday = document.getElementById("tab-music-bday");

    if (tabDaily) {
      tabDaily.addEventListener("click", () => switchCategory("daily"));
    }
    if (tabBday) {
      tabBday.addEventListener("click", () => switchCategory("birthday"));
    }

    renderPlaylistItems();
    loadTrack(0, false);
  }

  function switchCategory(cat) {
    if (activeCategory === cat) return;
    activeCategory = cat;
    currentIndex = 0;

    const tabDaily = document.getElementById("tab-music-daily");
    const tabBday = document.getElementById("tab-music-bday");
    if (tabDaily && tabBday) {
      if (cat === "daily") {
        tabDaily.classList.add("active");
        tabBday.classList.remove("active");
      } else {
        tabBday.classList.add("active");
        tabDaily.classList.remove("active");
      }
    }

    renderPlaylistItems();
    loadTrack(0, isPlaying);
  }

  function renderPlaylistItems() {
    const listContainer = document.getElementById("playlist-items-box");
    if (!listContainer) return;

    const tracks = getFilteredPlaylist();
    listContainer.innerHTML = "";

    tracks.forEach((track, idx) => {
      const itemEl = document.createElement("div");
      itemEl.className = `playlist-item ${idx === currentIndex ? "active" : ""}`;
      const displayTitle = CONFIG.formatSongTitle ? CONFIG.formatSongTitle(track.title) : track.title;
      itemEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span>${idx === currentIndex && isPlaying ? "🎵" : "💿"}</span>
          <span>${displayTitle} - <small style="opacity:0.8">${track.artist}</small></span>
        </div>
        <span style="font-size:11px; opacity:0.75">${track.durationHint || ""}</span>
      `;
      itemEl.addEventListener("click", () => {
        loadTrack(idx, true);
      });
      listContainer.appendChild(itemEl);
    });
  }

  function loadTrack(index, autoPlay = true) {
    const list = getFilteredPlaylist();
    if (list.length === 0) return;
    currentIndex = (index + list.length) % list.length;
    const track = list[currentIndex];

    // Cập nhật giao diện với tên bài hát đã format sạch
    const titleEl = document.getElementById("track-name-display");
    const artistEl = document.getElementById("track-artist-display");
    const displayTitle = CONFIG.formatSongTitle ? CONFIG.formatSongTitle(track.title) : track.title;
    if (titleEl) titleEl.textContent = displayTitle;
    if (artistEl) artistEl.textContent = track.artist;

    renderPlaylistItems();

    // Dừng Web Audio fallback nếu đang chạy
    stopWebAudioMusicBox();
    isWebAudioFallback = false;

    // BỌC encodeURI() ĐẢM BẢO CHẠY 100% TRÊN GITHUB PAGES LINUX SERVERS
    audioEl.src = encodeURI(track.src);
    audioEl.load();

    if (autoPlay) {
      playAudio();
    }
  }

  function playAudio() {
    initAudioContext();
    audioEl.play().then(() => {
      isPlaying = true;
      updatePlayingState(true);
    }).catch(err => {
      console.warn("Direct audio play blocked or media aborted, fallback to Web Audio music box:", err);
      isPlaying = true;
      updatePlayingState(true);
      startWebAudioMusicBox(activeCategory);
    });
  }

  function pauseAudio() {
    isPlaying = false;
    audioEl.pause();
    stopWebAudioMusicBox();
    updatePlayingState(false);
  }

  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function nextTrack() {
    const list = getFilteredPlaylist();
    loadTrack((currentIndex + 1) % list.length, isPlaying);
  }

  function prevTrack() {
    const list = getFilteredPlaylist();
    loadTrack((currentIndex - 1 + list.length) % list.length, isPlaying);
  }

  // NÂNG CẤP TRẠNG THÁI NÚT REPEAT NỔI BẬT HOÀN TOÀN
  function toggleLoop() {
    isLooping = !isLooping;
    audioEl.loop = isLooping;
    const loopBtn = document.getElementById("music-loop-btn");
    if (loopBtn) {
      if (isLooping) {
        loopBtn.classList.add("repeat-on");
        loopBtn.title = "Lặp lại bài hát: ĐANG BẬT (ON)";
        if (window.AvatarThemeModule) {
          window.AvatarThemeModule.showToast("Lặp lại bài hát: ĐANG BẬT 🔁");
        }
      } else {
        loopBtn.classList.remove("repeat-on");
        loopBtn.title = "Lặp lại bài hát: ĐANG TẮT (OFF)";
        if (window.AvatarThemeModule) {
          window.AvatarThemeModule.showToast("Lặp lại bài hát: ĐANG TẮT");
        }
      }
    }
  }

  function updatePlayingState(playing) {
    const vinylDisc = document.getElementById("vinyl-disc-graphic");
    const playBtn = document.getElementById("music-play-btn");

    if (vinylDisc) {
      if (playing) {
        vinylDisc.classList.add("playing");
      } else {
        vinylDisc.classList.remove("playing");
      }
    }

    if (playBtn) {
      playBtn.innerHTML = playing ? "⏸️" : "▶️";
    }
  }

  function onTimeUpdate() {
    if (isScrubbing || !audioEl.duration) return;
    const current = audioEl.currentTime;
    const duration = audioEl.duration;

    const curTimeEl = document.getElementById("music-current-time");
    const durTimeEl = document.getElementById("music-duration-time");
    const scrubFill = document.getElementById("music-scrub-fill");

    if (curTimeEl) curTimeEl.textContent = formatTime(current);
    if (durTimeEl) durTimeEl.textContent = formatTime(duration);
    if (scrubFill) scrubFill.style.width = `${(current / duration) * 100}%`;
  }

  function onMetaLoaded() {
    const durTimeEl = document.getElementById("music-duration-time");
    if (durTimeEl && audioEl.duration) {
      durTimeEl.textContent = formatTime(audioEl.duration);
    }
  }

  function onTrackEnded() {
    if (!isLooping) {
      nextTrack();
    }
  }

  function onAudioError(e) {
    console.warn("Audio file load notice, smoothly engaging Web Audio music box:", e);
    if (isPlaying) {
      startWebAudioMusicBox(activeCategory);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  // Tự động hạ âm lượng nhạc nền trong thời gian ngắn (Audio Ducking)
  function duckVolumeForCelebration(durationMs = 2500) {
    if (!audioEl) return;
    const targetLow = baseVolume * 0.25;
    audioEl.volume = targetLow;

    setTimeout(() => {
      let cur = targetLow;
      const stepInterval = setInterval(() => {
        cur += 0.05;
        if (cur >= baseVolume) {
          audioEl.volume = baseVolume;
          clearInterval(stepInterval);
        } else {
          audioEl.volume = cur;
        }
      }, 50);
    }, durationMs);
  }

  return {
    init: setupDOM,
    play: playAudio,
    pause: pauseAudio,
    toggle: togglePlay,
    next: nextTrack,
    prev: prevTrack,
    switchCategory: switchCategory,
    duckVolume: duckVolumeForCelebration,
    isPlaying: () => isPlaying
  };
})();
