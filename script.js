// ===== State Management =====
let currentScene = 1;
const totalScenes = 13;
let isTransitioning = false;

// Touch handling for swipe gestures
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const songs = ["song1.mp3", "song2.mp3", "song3.mp3", "song4.mp3", "song5.mp3"];

// ===== DOM Elements =====
const openingOverlay = document.getElementById("opening-overlay");
const mainContainer = document.getElementById("main-container");
const scenes = document.querySelectorAll(".scene");
const progressDots = document.querySelectorAll(".progress-dot");
const floatingFlowersContainer = document.getElementById("floating-flowers");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const galleryItems = document.querySelectorAll(".gallery-item");
const backgroundMusic = document.getElementById("background-music");
const musicToggleBtn = document.getElementById("music-toggle");

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

setTimeout(() => {
  const randomSong =
    "images/" + songs[Math.floor(Math.random() * songs.length)];
  const audio = document.getElementById("background-music");
  audio.src = randomSong;
  audio.volume = 1;

  const enableSound = () => {
    audio.muted = false;
    document.removeEventListener("click", enableSound);
    document.removeEventListener("scroll", enableSound);
    document.removeEventListener("touchstart", enableSound);
    document.getElementById("music-icon").addEventListener("click", () => {
      audio.play();
    });
  };

  document.addEventListener("click", enableSound);
  document.addEventListener("scroll", enableSound);
  document.addEventListener("touchstart", enableSound);
}, 2000);


function setUpAutoScreenChange(){
  setInterval(() => {
    nextScene();
  }, 20000)
}


function initializeApp() {
  // Show opening overlay
  setTimeout(() => {
    openingOverlay.classList.add("active");
  }, 100);

  setUpAutoScreenChange();
  // Setup event listeners
  setupOpeningOverlay();
  setupNavigation();
  setupGallery();
  setupCountdown();
  setupEventItems();
  startFloatingFlowers();
  setupBackgroundMusic();
  // Update progress indicator
  updateProgressIndicator();
}

// ===== Opening Overlay =====
function setupOpeningOverlay() {
  openingOverlay.addEventListener("click", closeOpeningOverlay);
}

function closeOpeningOverlay() {
  openingOverlay.classList.remove("active");
  setTimeout(() => {
    openingOverlay.style.display = "none";
  }, 1000);
}

// ===== Background Music =====
function setupBackgroundMusic() {
  // Ensure audio element exists
  if (!backgroundMusic) return;

  // Set volume to reasonable level (0-1)
  backgroundMusic.volume = 0.5;

  // Ensure loop attribute is set
  backgroundMusic.loop = true;

  // Setup music toggle button
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleMusic);
  }

  // Attempt to play audio (may require user interaction due to browser policies)
  const playPromise = backgroundMusic.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("Background music is playing");
        updateMusicToggleButton(false); // false = playing
      })
      .catch((error) => {
        console.log("Auto-play was prevented:", error);
        updateMusicToggleButton(true); // true = paused
        // Add a click listener to play music on first user interaction
        document.addEventListener("click", playAudioOnFirstInteraction, {
          once: true,
        });
        document.addEventListener("touchstart", playAudioOnFirstInteraction, {
          once: true,
        });
      });
  }
}

function playAudioOnFirstInteraction() {
  if (backgroundMusic) {
    backgroundMusic.play().catch(() => {
      console.log("Could not play audio");
    });
    updateMusicToggleButton(false);
  }
}

function toggleMusic() {
  if (!backgroundMusic) return;

  if (backgroundMusic.paused) {
    backgroundMusic
      .play()
      .then(() => {
        updateMusicToggleButton(false);
      })
      .catch(() => {
        console.log("Could not play audio");
      });
  } else {
    backgroundMusic.pause();
    updateMusicToggleButton(true);
  }
}

function updateMusicToggleButton(isPaused) {
  if (!musicToggleBtn) return;

  if (isPaused) {
    musicToggleBtn.classList.add("paused");
    musicToggleBtn.querySelector(".music-icon").textContent = "🔇";
    musicToggleBtn.title = "Play Music";
  } else {
    musicToggleBtn.classList.remove("paused");
    musicToggleBtn.querySelector(".music-icon").textContent = "🔊";
    musicToggleBtn.title = "Pause Music";
  }
}

// ===== Navigation System =====
function setupNavigation() {
  // Click navigation (excluding interactive elements)
  document.addEventListener("click", handleClick);

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboard);

  // Touch/Swipe navigation
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });
}

function handleClick(e) {
  // Ignore clicks on opening overlay
  if (openingOverlay.classList.contains("active")) {
    return;
  }

  // Ignore clicks on interactive elements
  if (
    e.target.closest(".progress-dot") ||
    e.target.closest(".phone-link") ||
    e.target.closest(".gallery-item") ||
    e.target.closest(".lightbox")
  ) {
    return;
  }

  // Navigate to next scene
  // nextScene();
}

function handleKeyboard(e) {
  // Ignore if opening overlay is active
  if (openingOverlay.classList.contains("active")) {
    return;
  }

  // Ignore if lightbox is open
  if (lightbox.classList.contains("active")) {
    return;
  }

  switch (e.key) {
    case "ArrowRight":
    case " ":
      e.preventDefault();
      // nextScene();
      break;
    case "ArrowLeft":
      e.preventDefault();
      // previousScene();
      break;
    case "r":
    case "R":
      e.preventDefault();
      restartPresentation();
      break;
  }
}

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  // Ignore if opening overlay is active
  if (openingOverlay.classList.contains("active")) {
    return;
  }

  // Ignore if lightbox is open
  if (lightbox.classList.contains("active")) {
    return;
  }

  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  handleSwipe();
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 50;
  const verticalThreshold = 100;

  // Ignore if vertical movement is too large (scrolling)
  if (Math.abs(deltaY) > verticalThreshold) {
    return;
  }

  // Swipe left (next scene)
  if (deltaX < -minSwipeDistance) {
    // nextScene();
  }
  // Swipe right (previous scene)
  else if (deltaX > minSwipeDistance) {
    // previousScene();
  }
}

// ===== Scene Transitions =====
function nextScene() {
  if (isTransitioning) return;

  if (currentScene < totalScenes) {
    changeScene(currentScene + 1);
  }
}

function previousScene() {
  if (isTransitioning) return;

  if (currentScene > 1) {
    changeScene(currentScene - 1);
  }
}

function changeScene(newScene) {
  if (isTransitioning || newScene === currentScene) return;

  isTransitioning = true;

  const currentSceneElement = document.querySelector(
    `.scene[data-scene="${currentScene}"]`,
  );
  const newSceneElement = document.querySelector(
    `.scene[data-scene="${newScene}"]`,
  );

  // Exit animation for current scene
  currentSceneElement.classList.add("exiting");

  setTimeout(() => {
    currentSceneElement.classList.remove("active", "exiting");
    newSceneElement.classList.add("active");

    currentScene = newScene;
    updateProgressIndicator();

    setTimeout(() => {
      isTransitioning = false;
    }, 100);
  }, 1500);
}

function restartPresentation() {
  changeScene(1);
}

function updateProgressIndicator() {
  progressDots.forEach((dot, index) => {
    if (index + 1 === currentScene) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// ===== Floating Flowers =====
function startFloatingFlowers() {
  // Create initial flowers
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      createFloatingFlower();
    }, i * 400);
  }

  // Continue creating flowers
  setInterval(createFloatingFlower, 4000);
}

// ===== Event Items =====
function setupEventItems() {
  const eventItems = document.querySelectorAll(".event-item");

  eventItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Close other expanded items
      eventItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("expanded")) {
          otherItem.classList.remove("expanded");
        }
      });

      // Toggle current item
      item.classList.toggle("expanded");
    });
  });
}

function createFloatingFlower() {
  const flowers = ["🌸", "🌺", "🌼", "🏵️", "💐", "🌹"];
  const flower = document.createElement("div");
  flower.className = "floating-flower";
  flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];

  // Random position
  flower.style.left = Math.random() * 100 + "%";

  // Random size
  const size = 1 + Math.random() * 2;
  flower.style.fontSize = size + "rem";

  // Random animation duration
  const duration = 15 + Math.random() * 15;
  flower.style.animationDuration = duration + "s";

  // Random delay
  flower.style.animationDelay = Math.random() * 2 + "s";

  floatingFlowersContainer.appendChild(flower);

  // Remove after animation
  setTimeout(
    () => {
      flower.remove();
    },
    (duration + 2) * 1000,
  );
}

// ===== Photo Gallery & Lightbox =====
function setupGallery() {
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  lightboxNext.addEventListener("click", () => navigateLightbox(1));

  // Close lightbox on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation in lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        navigateLightbox(-1);
        break;
      case "ArrowRight":
        navigateLightbox(1);
        break;
    }
  });
}

let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  lightbox.classList.add("active");
  updateLightboxContent();
}

function closeLightbox() {
  lightbox.classList.remove("active");
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;

  if (currentLightboxIndex < 0) {
    currentLightboxIndex = galleryItems.length - 1;
  } else if (currentLightboxIndex >= galleryItems.length) {
    currentLightboxIndex = 0;
  }

  updateLightboxContent();
}

function updateLightboxContent() {
  const lightboxContainer = document.querySelector(".lightbox-image-container");
  const galleryItem = galleryItems[currentLightboxIndex];
  const placeholder = galleryItem.querySelector(".gallery-placeholder");

  lightboxContainer.innerHTML = `<div class="lightbox-placeholder">${placeholder.textContent}</div>`;
}

// ===== Countdown Timer =====
function setupCountdown() {
  const weddingDate = new Date("2026-04-21T18:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      document.getElementById("days").textContent = "0";
      document.getElementById("hours").textContent = "0";
      document.getElementById("minutes").textContent = "0";
      document.getElementById("seconds").textContent = "0";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }

  // Update immediately
  updateCountdown();

  // Update every second
  setInterval(updateCountdown, 1000);
}

// ===== Video Backgrounds (Optional Enhancement) =====
// This function can be used to add video backgrounds to scenes
function addVideoBackgrounds() {
  scenes.forEach((scene, index) => {
    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.opacity = "0.15";
    video.style.filter = "blur(5px)";
    video.style.zIndex = "-1";

    // Add video source (placeholder - replace with actual video URLs)
    // video.src = `path/to/video${index + 1}.mp4`;

    // scene.querySelector('.scene-card').prepend(video);
  });
}

// ===== Utility Functions =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== Console Welcome Message =====
console.log(
  "%c💒 Wedding Invitation 💒",
  "font-size: 24px; color: #D4AF37; font-weight: bold;",
);
console.log("%cAnubhav & Nishi", "font-size: 18px; color: #C5B358;");
console.log("%c21st April 2026", "font-size: 14px; color: #F5F5DC;");
console.log(
  "%c\nNavigation Tips:",
  "font-size: 12px; color: #D4AF37; font-weight: bold;",
);
console.log(
  "%c- Click anywhere to advance",
  "font-size: 11px; color: #F5F5DC;",
);
console.log(
  "%c- Swipe left/right on mobile",
  "font-size: 11px; color: #F5F5DC;",
);
console.log(
  "%c- Use arrow keys or spacebar",
  "font-size: 11px; color: #F5F5DC;",
);
console.log("%c- Press R to restart", "font-size: 11px; color: #F5F5DC;");
console.log(
  "%c- Click dots to jump to scenes",
  "font-size: 11px; color: #F5F5DC;",
);
