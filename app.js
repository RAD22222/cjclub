/**
 * COMMUNICATION & JOURNALISM CLUB, BRUR — INTERACTIVE ENGINE
 * Minimal, Fast & Lightweight Vanilla JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
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
    mobileMenuBtn.addEventListener("click", () => {
      const isVisible = navMenu.style.display === "flex";
      navMenu.style.display = isVisible ? "none" : "flex";
      navMenu.style.flexDirection = "column";
      navMenu.style.position = "absolute";
      navMenu.style.top = "70px";
      navMenu.style.left = "0";
      navMenu.style.width = "100%";
      navMenu.style.background = "var(--bg-card)";
      navMenu.style.padding = "1.5rem";
      navMenu.style.borderBottom = "1px solid var(--border-light)";
      navMenu.style.boxShadow = "var(--shadow-hover)";
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = "none";
        }
      });
    });
  }
});
