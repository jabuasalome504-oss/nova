/**
 * NovaTech Landing Page - JavaScript Functionality
 * Pure Vanilla JS for modern interactions, animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const heroCard = document.getElementById('interactiveCard');
  const statNumbers = document.querySelectorAll('.stat-number');
  const skillBars = document.querySelectorAll('.skill-bar');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const featureCards = document.querySelectorAll('.feature-card');
  const contactForm = document.getElementById('contactForm');
  const formSuccessState = document.getElementById('formSuccessState');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const newsletterForm = document.getElementById('newsletterForm');

  /* =========================================================
     1. THEME SWITCHER (Dark / Light Mode)
     ========================================================= */
  const savedTheme = localStorage.getItem('novatech_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme', !isLight);
    localStorage.setItem('novatech_theme', isLight ? 'light' : 'dark');
    showToast(isLight ? 'ჩაირთო დღის რეჟიმი' : 'ჩაირთო ღამის რეჟიმი');
  });

  /* =========================================================
     2. STICKY HEADER & BACK-TO-TOP BUTTON
     ========================================================= */
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header background change
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Active Section Tracking (Scrollspy)
    highlightNavOnScroll();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* =========================================================
     3. MOBILE NAVIGATION MENU
     ========================================================= */
  const toggleMobileMenu = () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !header.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  /* =========================================================
     4. SCROLLSPY (Highlight active link in navbar)
     ========================================================= */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const currentNavLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

      if (currentNavLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          currentNavLink.classList.add('active');
        }
      }
    });
  };

  /* =========================================================
     5. STATS COUNTER ANIMATION (IntersectionObserver)
     ========================================================= */
  let statsAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  /* =========================================================
     6. SKILL BARS ANIMATION
     ========================================================= */
  let skillsAnimated = false;
  const skillsContainer = document.querySelector('.skills-list');

  if (skillsContainer) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
        }
      });
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsContainer);
  }

  /* =========================================================
     7. 3D CARD TILT INTERACTION (Hero visual)
     ========================================================= */
  if (heroCard && window.matchMedia('(hover: hover)').matches) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* =========================================================
     8. FEATURES CATEGORY FILTER TABS
     ========================================================= */
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active tab button
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filter = button.getAttribute('data-filter');

      // Filter cards
      featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // subtle fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* =========================================================
     9. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
     ========================================================= */
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const submitBtn = document.getElementById('submitFormBtn');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const clearErrors = () => {
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    nameInput.classList.remove('invalid');
    emailInput.classList.remove('invalid');
    messageInput.classList.remove('invalid');
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'გთხოვთ შეიყვანოთ თქვენი სახელი და გვარი';
        nameInput.classList.add('invalid');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameError.textContent = 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს';
        nameInput.classList.add('invalid');
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'გთხოვთ შეიყვანოთ ელ-ფოსტის მისამართი';
        emailInput.classList.add('invalid');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტა (მაგ: mail@domain.ge)';
        emailInput.classList.add('invalid');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'გთხოვთ დაწეროთ შეტყობინება';
        messageInput.classList.add('invalid');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'შეტყობინება უნდა შედგებოდეს მინიმუმ 10 სიმბოლოსგან';
        messageInput.classList.add('invalid');
        isValid = false;
      }

      if (!isValid) return;

      // Show submitting state with spinner
      submitBtn.classList.add('submitting');
      submitBtn.disabled = true;

      // Simulate API Submission Delay
      setTimeout(() => {
        submitBtn.classList.remove('submitting');
        submitBtn.disabled = false;
        contactForm.style.display = 'none';
        formSuccessState.style.display = 'block';
        showToast('შეტყობინება წარმატებით გაიგზავნა!');
      }, 900);
    });

    // Reset Form button
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        clearErrors();
        formSuccessState.style.display = 'none';
        contactForm.style.display = 'flex';
      });
    }
  }

  /* =========================================================
     10. NEWSLETTER FORM
     ========================================================= */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = document.getElementById('newsletterEmail').value;
      if (validateEmail(emailVal)) {
        showToast('გმადლობთ! სიახლეების გამოწერა გააქტიურებულია 🚀');
        newsletterForm.reset();
      } else {
        showToast('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა');
      }
    });
  }

  /* =========================================================
     11. TOAST NOTIFICATION HELPER
     ========================================================= */
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification) return;

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toastNotification.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3500);
  }
});
