/**
 * COMMUNICATION & JOURNALISM CLUB, BRUR — INTERACTIVE ENGINE
 * Minimal, Fast & Lightweight Vanilla JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. Upper Scroll Progress Bar Handler
  const progressBar = document.getElementById("scrollProgressBar");
  if (progressBar) {
    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // 1. Toast Notification Utility
  const toastEl = document.getElementById("toastNotification");
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3200);
  }

  // 2. Language Toggle (Bangla / English)
  let currentLang = localStorage.getItem("cj_club_lang") || "bn";
  const langToggleBtn = document.getElementById("langToggleBtn");
  const langLabel = document.getElementById("langLabel");

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("cj_club_lang", lang);
    document.documentElement.setAttribute("lang", lang);

    if (langLabel) {
      langLabel.textContent = lang === "bn" ? "EN" : "বাং";
    }

    // Update all elements with data-en and data-bn
    document.querySelectorAll("[data-en][data-bn]").forEach(el => {
      el.textContent = lang === "bn" ? el.getAttribute("data-bn") : el.getAttribute("data-en");
    });

    showToast(lang === "bn" ? "ভাষা: বাংলা" : "Language: English");
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setLanguage(currentLang === "bn" ? "en" : "bn");
    });
  }

  // Apply saved language preference
  if (currentLang === "en") {
    setLanguage("en");
  }

  // 3. Theme Toggle (Light / Dark)
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("cj_club_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme");
      const next = active === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("cj_club_theme", next);
      showToast(next === "dark" ? "Dark mode enabled" : "Light mode enabled");
    });
  }

  // 4. Workshop RSVP Action
  document.querySelectorAll(".btn-rsvp").forEach(btn => {
    btn.addEventListener("click", () => {
      const eventName = btn.getAttribute("data-event") || "কর্মশালা";
      const userAction = prompt(`"${eventName}" কর্মশালার জন্য আপনার পূর্ণ নাম এবং মোবাইল নম্বর লিখুন:\n(e.g. Tanvir, 017XXXXXXXX)`);
      if (userAction && userAction.trim().length > 0) {
        btn.textContent = "সিট নিশ্চিত ✔";
        btn.style.backgroundColor = "var(--brand-blue)";
        btn.style.color = "#FFF";
        showToast("ধন্যবাদ! আপনার ফ্রি সিট সফলভাবে সংরক্ষিত হয়েছে।");
      }
    });
  });

  // 5. Membership Application Form Submission
  const clubApplyForm = document.getElementById("clubApplyForm");
  if (clubApplyForm) {
    clubApplyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const applicantName = document.getElementById("appName").value;
      const wing = document.getElementById("appWing").value;
      
      clubApplyForm.reset();
      showToast(`অভিনন্দন ${applicantName}! সিজে ক্লাবের মেম্বারশিপ আবেদন সফলভাবে জমা হয়েছে।`);
    });
  }

  // 6. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("menu-open");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("menu-open") && !navMenu.contains(e.target) && e.target !== mobileMenuBtn) {
        navMenu.classList.remove("menu-open");
      }
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("menu-open");
      });
    });
  }

  // 7. Committee Tab Switching (Executive, Advisors, General Members)
  window.switchCommitteeTab = function(targetTab) {
    if (!targetTab) return;

    // Update active tab buttons
    document.querySelectorAll(".com-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === targetTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Switch panels
    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.remove("active");
    });

    const activePanel = document.getElementById(`panel-${targetTab}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }
  };

  // 8. Mobile Posts Slider (Tap Navigation - Not Auto)
  const postsGrid = document.querySelector(".fb-posts-grid");
  const postPrevBtn = document.getElementById("postPrevBtn");
  const postNextBtn = document.getElementById("postNextBtn");
  const postDots = document.querySelectorAll("#postDots .m-dot");

  window.scrollPostTo = function(index) {
    if (!postsGrid) return;
    const cards = postsGrid.querySelectorAll(".fb-post-card");
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      updateDots(index);
    }
  };

  function updateDots(activeIdx) {
    postDots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeIdx);
    });
  }

  if (postsGrid && postPrevBtn && postNextBtn) {
    postNextBtn.addEventListener("click", () => {
      const card = postsGrid.querySelector(".fb-post-card");
      const scrollStep = card ? card.offsetWidth + 14 : 280;
      postsGrid.scrollBy({ left: scrollStep, behavior: "smooth" });
    });

    postPrevBtn.addEventListener("click", () => {
      const card = postsGrid.querySelector(".fb-post-card");
      const scrollStep = card ? card.offsetWidth + 14 : 280;
      postsGrid.scrollBy({ left: -scrollStep, behavior: "smooth" });
    });

    postsGrid.addEventListener("scroll", () => {
      const cards = postsGrid.querySelectorAll(".fb-post-card");
      const center = postsGrid.scrollLeft + postsGrid.offsetWidth / 2;
      cards.forEach((card, idx) => {
        if (card.offsetLeft <= center && (card.offsetLeft + card.offsetWidth) >= center) {
          updateDots(idx);
        }
      });
    }, { passive: true });
  }

  // 9. Mobile Wings Auto Scroll (Continuous auto-scroll on mobile only)
  const wingsGrid = document.querySelector(".wings-grid");
  if (wingsGrid) {
    let isWingsPaused = false;
    let wingsDirection = 1;

    wingsGrid.addEventListener("touchstart", () => { isWingsPaused = true; }, { passive: true });
    wingsGrid.addEventListener("touchend", () => {
      setTimeout(() => { isWingsPaused = false; }, 2000);
    }, { passive: true });

    function autoScrollWings() {
      if (window.innerWidth <= 768 && !isWingsPaused && wingsGrid) {
        const maxScroll = wingsGrid.scrollWidth - wingsGrid.clientWidth;
        if (maxScroll > 10) {
          if (wingsGrid.scrollLeft >= maxScroll - 2) {
            wingsGrid.scrollLeft = 0; // Wrap smoothly back to start
          } else {
            wingsGrid.scrollLeft += 1; // 1px smooth continuous drift
          }
        }
      }
      requestAnimationFrame(autoScrollWings);
    }
    requestAnimationFrame(autoScrollWings);
  }
});

// Also define on window immediately in case DOM loads fast
window.switchCommitteeTab = function(targetTab) {
  if (!targetTab) return;
  document.querySelectorAll(".com-tab-btn").forEach(btn => {
    if (btn.getAttribute("data-tab") === targetTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const activePanel = document.getElementById(`panel-${targetTab}`);
  if (activePanel) {
    activePanel.classList.add("active");
  }
};


