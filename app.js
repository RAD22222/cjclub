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

  // 5. Membership Application Form Submission -> Google Sheets (Secured)
  const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyjZC0sF7zTjG6NQTJ6ixsjacwH6Uh9p__ZiHgBYo-KSM11ecscxESx27wR8AnfQ9Vv/exec";
  const clubApplyForm = document.getElementById("clubApplyForm");

  // Input Sanitizer: Strips control characters, trims, and enforces max length
  function sanitizeInput(val, maxLen = 100) {
    if (typeof val !== "string") return "";
    return val.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim().slice(0, maxLen);
  }

  if (clubApplyForm) {
    clubApplyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Bot Protection 1: Honeypot trap check
      const honeypot = document.getElementById("appHoneypot");
      if (honeypot && honeypot.value.trim() !== "") {
        console.warn("Spam bot submission blocked.");
        clubApplyForm.reset();
        return;
      }

      // Bot Protection 2: Rate Limiting Cooldown (25s cooldown between submissions)
      const lastSubmit = sessionStorage.getItem("cj_last_submit_time");
      const now = Date.now();
      if (lastSubmit && (now - Number(lastSubmit)) < 25000) {
        const remaining = Math.ceil((25000 - (now - Number(lastSubmit))) / 1000);
        showToast(`অনুগ্রহ করে ${remaining} সেকেন্ড পর আবার চেষ্টা করুন।`);
        return;
      }

      const submitBtn = clubApplyForm.querySelector(".btn-submit");
      const originalBtnText = submitBtn ? submitBtn.textContent : "আবেদন জমা দিন";

      const nameInput = document.getElementById("appName");
      const phoneInput = document.getElementById("appPhone");
      const emailInput = document.getElementById("appEmail");
      const studentIdInput = document.getElementById("appStudentId");
      const deptInput = document.getElementById("appDept");
      const sessionSelect = document.getElementById("appSession");
      const wingSelect = document.getElementById("appWing");
      const noteInput = document.getElementById("appNote");

      const rawPhone = phoneInput ? phoneInput.value.replace(/\s+/g, "") : "";
      const rawEmail = emailInput ? emailInput.value.trim() : "";

      // Validate Phone: must be 11 digits (e.g., 017XXXXXXXX) or with +88 prefix
      const bdPhoneRegex = /^(\+?88)?01[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(rawPhone)) {
        showToast("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(rawEmail)) {
        showToast("সঠিক ইমেইল ঠিকানা প্রদান করুন");
        if (emailInput) emailInput.focus();
        return;
      }

      const wingText = wingSelect && wingSelect.selectedIndex >= 0 
        ? sanitizeInput(wingSelect.options[wingSelect.selectedIndex].text, 100) 
        : "";

      const payload = {
        name: sanitizeInput(nameInput ? nameInput.value : "", 80),
        phone: sanitizeInput(rawPhone, 16),
        email: sanitizeInput(rawEmail, 100),
        studentId: sanitizeInput(studentIdInput ? studentIdInput.value : "", 25),
        dept: sanitizeInput(deptInput ? deptInput.value : "", 80),
        session: sanitizeInput(sessionSelect ? sessionSelect.value : "", 20),
        wing: wingText,
        note: sanitizeInput(noteInput ? noteInput.value : "", 800)
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "জমা হচ্ছে... (Submitting...)";
      }

      try {
        const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result && result.status === "success") {
          sessionStorage.setItem("cj_last_submit_time", Date.now().toString());
          clubApplyForm.reset();
          showToast(`অভিনন্দন ${payload.name}! আপনার আবেদন সফলভাবে গুগল শিটে জমা হয়েছে।`);
        } else {
          console.error("Apps Script Error:", result);
          showToast("গুগল শিটে ডেটা যুক্ত হতে পারেনি। শিটের নাম যাচাই করুন।");
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        showToast("আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
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


