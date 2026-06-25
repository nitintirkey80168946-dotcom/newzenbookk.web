/**
 * ZenLedger.AI - Core Interactivity and Scroll Animation Engine
 * 
 * This file handles:
 * 1. Smooth inertial scroll tracking with phase-based transition logic.
 * 2. 3D Z-translation of layers based on scroll.
 * 3. Scroll-linked character typing animation.
 * 4. Scroll-linked counting ledger balances.
 * 5. Interactive sandbox console logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const heroContainer = document.getElementById('hero-scroll');
  const heroScene = document.getElementById('hero-scene');
  const layers = Array.from(document.querySelectorAll('.layer'));
  
  // Layer elements for animations
  const typingPromptBox = document.getElementById('typing-prompt');
  const promptCardSales = document.getElementById('card-sales-voucher');
  
  // Ledger elements
  const ledgerAmounts = Array.from(document.querySelectorAll('.ledger-amount'));
  const ledgerCards = Array.from(document.querySelectorAll('.ledger-card'));
  
  // Scroll variables for lerp (smoothness)
  let targetScrollY = 0;
  let currentScrollY = 0;
  const lerpFactor = window.innerWidth > 768 ? 0.10 : 0.15; // Responsive smooth lerp factor
  
  // Animation text configurations
  const promptText = "Sold 5 laptops to Ram Debtor with GST 18%";
  
  // Track window dimensions
  let maxScrollY = 0;
  let viewportHeight = window.innerHeight;
  
  function calculateDimensions() {
    viewportHeight = window.innerHeight;
    maxScrollY = heroContainer.offsetHeight - viewportHeight;
    if (maxScrollY <= 0) {
      maxScrollY = viewportHeight * 3.5;
    }
  }
  
  calculateDimensions();
  window.addEventListener('resize', calculateDimensions);
  window.addEventListener('load', calculateDimensions);
  
  // Listen for scroll events
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });
  
  // Format currency helper (INR)
  function formatINR(number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(number);
  }
  
  // Initial card states check
  let isLedgerPulsed = false;
  
  // Track last scroll position to skip unnecessary renders
  let lastScrollY = -1;
  
  // 3D Engine Loop
  function tick() {
    // Fallback if dimensions were initially calculated as 0 (e.g. before CSS loaded)
    if (maxScrollY <= 0) {
      calculateDimensions();
    }

    // Lerp calculation for inertia
    currentScrollY += (targetScrollY - currentScrollY) * lerpFactor;
    
    // Avoid calculations if difference is negligible
    if (Math.abs(targetScrollY - currentScrollY) < 0.05) {
      currentScrollY = targetScrollY;
    }
    
    // If scroll position hasn't changed, skip DOM writes to save CPU/GPU resources
    if (currentScrollY === lastScrollY) {
      requestAnimationFrame(tick);
      return;
    }
    lastScrollY = currentScrollY;
    
    // Normalize scroll ratio (0.0 to 1.0)
    let scrollRatio = 0;
    if (maxScrollY > 0) {
      scrollRatio = currentScrollY / maxScrollY;
    }
    
    // Bind scroll limits between 0 and 1
    scrollRatio = Math.max(0, Math.min(1, scrollRatio));
    
    // Max Z-translation depth ( Layer 4 is at -4500px )
    const maxDepth = 4500;
    const cameraZ = scrollRatio * maxDepth;
    
    // Apply Z-translation directly to the parent scene
    heroScene.style.transform = `translate3d(0, 0, ${cameraZ}px)`;
    
    // -- PRECISE TRANSITION LOGIC FOR OPACITY AND INTERACTIVITY --
    layers.forEach(layer => {
      const id = layer.getAttribute('id');
      const depth = parseFloat(layer.getAttribute('data-depth'));
      const relativeDepth = depth + cameraZ;
      
      let opacity = 0;
      let isInteractive = false;
      
      // Calculate active phases and opacity transitions based on scroll ratio
      if (id === 'layer-brain') {
        // Layer 1: AI Brain
        if (scrollRatio <= 0.15) {
          opacity = 1;
          isInteractive = true;
        } else if (scrollRatio > 0.15 && scrollRatio <= 0.25) {
          opacity = 1 - (scrollRatio - 0.15) / 0.10; // Fade out
          isInteractive = (opacity > 0.5);
        }
      } 
      else if (id === 'layer-dashboard') {
        // Layer 2: Prompt Dashboard
        if (scrollRatio >= 0.20 && scrollRatio < 0.28) {
          opacity = (scrollRatio - 0.20) / 0.08; // Fade in
          isInteractive = (opacity > 0.5);
        } else if (scrollRatio >= 0.28 && scrollRatio <= 0.45) {
          opacity = 1;
          isInteractive = true;
        } else if (scrollRatio > 0.45 && scrollRatio <= 0.55) {
          opacity = 1 - (scrollRatio - 0.45) / 0.10; // Fade out
          isInteractive = (opacity > 0.5);
        }
      } 
      else if (id === 'layer-ledger') {
        // Layer 3: Ledger Grid
        if (scrollRatio >= 0.50 && scrollRatio < 0.58) {
          opacity = (scrollRatio - 0.50) / 0.08; // Fade in
          isInteractive = (opacity > 0.5);
        } else if (scrollRatio >= 0.58 && scrollRatio <= 0.74) {
          opacity = 1;
          isInteractive = true;
        } else if (scrollRatio > 0.74 && scrollRatio <= 0.82) {
          opacity = 1 - (scrollRatio - 0.74) / 0.08; // Fade out
          isInteractive = (opacity > 0.5);
        }
      } 
      else if (id === 'layer-cta') {
        // Layer 4: Final CTA & Playground
        if (scrollRatio >= 0.78 && scrollRatio < 0.86) {
          opacity = (scrollRatio - 0.78) / 0.08; // Fade in
          isInteractive = (opacity > 0.5);
        } else if (scrollRatio >= 0.86) {
          opacity = 1;
          isInteractive = true;
        }
      }
      
      const newVisibility = opacity > 0.01 ? 'visible' : 'hidden';
      const newPointerEvents = isInteractive ? 'auto' : 'none';
      
      // Directly set styles to avoid trapping/precison-loss bugs
      layer.style.opacity = opacity;
      layer.style.visibility = newVisibility;
      layer.style.pointerEvents = newPointerEvents;
      
      if (newVisibility === 'visible') {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
      
      // Translate layer by its static depth offset and add rotateY on desktop
      let transformStr = `translate3d(0, 0, ${depth}px)`;
      if (window.innerWidth > 768) {
        const tiltAngle = (relativeDepth / 1000) * 8; // Max 8 degrees tilt
        transformStr = `translate3d(0, 0, ${depth}px) rotateY(${tiltAngle}deg)`;
      }
      
      layer.style.transform = transformStr;
    });
    
    // -- INTERACTION 1: Typing Animation (Layer 2) --
    // We bind typing progression between scrollRatio 0.28 and 0.42
    const startType = 0.28;
    const endType = 0.42;
    
    if (scrollRatio >= startType && scrollRatio <= endType) {
      const typeProgress = (scrollRatio - startType) / (endType - startType);
      const charsToShow = Math.floor(typeProgress * promptText.length);
      typingPromptBox.textContent = promptText.substring(0, charsToShow);
      promptCardSales.classList.remove('card-active');
    } else if (scrollRatio > endType) {
      typingPromptBox.textContent = promptText;
      promptCardSales.classList.add('card-active');
    } else {
      typingPromptBox.textContent = "";
      promptCardSales.classList.remove('card-active');
    }
    
    // -- INTERACTION 2: Ledger Balance Counting (Layer 3) --
    // We count up balances between scrollRatio 0.58 and 0.72
    const startLedger = 0.58;
    const endLedger = 0.72;
    
    if (scrollRatio >= startLedger && scrollRatio <= endLedger) {
      const ledgerProgress = (scrollRatio - startLedger) / (endLedger - startLedger);
      
      // Pulse cards once they begin updating
      if (ledgerProgress > 0.05 && !isLedgerPulsed) {
        ledgerCards.forEach(card => card.classList.add('pulse-active'));
        isLedgerPulsed = true;
      }
      
      // Increment balances
      ledgerAmounts.forEach(amount => {
        const targetValue = parseFloat(amount.getAttribute('data-target'));
        const currentValue = targetValue * ledgerProgress;
        amount.textContent = formatINR(currentValue);
      });
    } else if (scrollRatio > endLedger) {
      // Keep target balances solid
      ledgerAmounts.forEach(amount => {
        const targetValue = parseFloat(amount.getAttribute('data-target'));
        amount.textContent = formatINR(targetValue);
      });
      // Remove pulses
      ledgerCards.forEach(card => card.classList.remove('pulse-active'));
    } else {
      // Clear values when above the ledger section
      ledgerAmounts.forEach(amount => {
        amount.textContent = "₹0.00";
      });
      ledgerCards.forEach(card => card.classList.remove('pulse-active'));
      isLedgerPulsed = false;
    }
    
    // Call next frame
    requestAnimationFrame(tick);
  }
  
  // Fire animation loop
  requestAnimationFrame(tick);
  
  
  // -- PLAYGROUND SANDBOX ENGINE (Layer 4) --
  const playgroundBtns = Array.from(document.querySelectorAll('.playground-btn'));
  const playgroundInput = document.getElementById('playground-input');
  const playgroundSubmitBtn = document.getElementById('playground-submit-btn');
  const playgroundMicBtn = document.getElementById('playground-mic-btn');
  const terminalLoading = document.getElementById('terminal-loading');
  const terminalResults = document.getElementById('terminal-results');
  
  // Mini ledger balance displays
  const miniLeftVal = document.getElementById('mini-left-val');
  const miniRightVal = document.getElementById('mini-right-val');
  const miniCardLeft = document.getElementById('mini-card-left');
  const miniCardRight = document.getElementById('mini-card-right');
  
  const voicePhrases = [
    "Paid electricity bill ₹4,500 by bank transfer",
    "Received ₹15,000 from Rohit for consultancy fee",
    "Sold 2 monitors to Amit on credit for ₹24,000",
    "Paid salary of ₹35,000 to manager Suresh A/c",
    "Purchased computer stationary for ₹1,200 on cash"
  ];
  
  // Set initial playground state
  runPlaygroundSimCustom("Sold 5 tea cups to Amit on cash");
  
  // Click handler for quick selectors
  playgroundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playgroundBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const prompt = btn.getAttribute('data-prompt');
      playgroundInput.value = prompt;
      runPlaygroundSimCustom(prompt);
    });
  });
  
  // Custom submit handler
  if (playgroundSubmitBtn) {
    playgroundSubmitBtn.addEventListener('click', () => {
      runPlaygroundSimCustom(playgroundInput.value);
    });
  }
  
  // Enter key support in input
  if (playgroundInput) {
    playgroundInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runPlaygroundSimCustom(playgroundInput.value);
      }
    });
  }
  
  // Voice simulation dictate handler
  if (playgroundMicBtn) {
    playgroundMicBtn.addEventListener('click', () => {
      // Pick random voice phrase
      const randomPhrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];
      
      // Visual feedback
      playgroundMicBtn.textContent = "🔊";
      playgroundMicBtn.disabled = true;
      playgroundInput.disabled = true;
      playgroundInput.value = "";
      playgroundInput.placeholder = "Listening to voice input...";
      
      let index = 0;
      function typeCharacter() {
        if (index < randomPhrase.length) {
          playgroundInput.value += randomPhrase.charAt(index);
          index++;
          setTimeout(typeCharacter, 35);
        } else {
          playgroundMicBtn.textContent = "🎙️";
          playgroundMicBtn.disabled = false;
          playgroundInput.disabled = false;
          playgroundInput.placeholder = "Type e.g., Paid ₹500 for internet bill...";
          runPlaygroundSimCustom(randomPhrase);
        }
      }
      
      setTimeout(typeCharacter, 500);
    });
  }
  
  function runPlaygroundSimCustom(text) {
    if (!text || text.trim() === "") return;
    
    terminalResults.style.display = 'none';
    terminalResults.innerHTML = '';
    terminalLoading.style.display = 'block';
    
    miniCardLeft.style.animation = 'none';
    miniCardRight.style.animation = 'none';
    
    setTimeout(() => {
      terminalLoading.style.display = 'none';
      
      // Parse custom text
      const lower = text.toLowerCase();
      
      // Match number
      const numMatch = text.match(/\d+([,.]\d+)?/);
      let value = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0;
      let formattedVal = value > 0 ? formatINR(value) : "₹1,200.00";
      
      let config = {
        leftAccount: "Cash/Bank A/c",
        rightAccount: "Sales A/c",
        leftVal: formattedVal,
        rightVal: formattedVal,
        leftGlow: "green-text",
        rightGlow: "green-text",
        results: ""
      };
      
      if (lower.includes('rent') || lower.includes('electric') || lower.includes('bill') || lower.includes('paid') || lower.includes('expense') || lower.includes('salary') || lower.includes('purchased') || lower.includes('stationary')) {
        // Expense Type
        let expenseName = "General Expense A/c";
        if (lower.includes('rent')) expenseName = "Rent Expense A/c";
        else if (lower.includes('electric')) expenseName = "Electricity Expense A/c";
        else if (lower.includes('salary') || lower.includes('wage')) expenseName = "Salaries A/c";
        else if (lower.includes('stationary')) expenseName = "Office Stationary A/c";
        else if (lower.includes('internet')) expenseName = "Internet Expense A/c";
        
        config = {
          leftAccount: "Cash/Bank A/c",
          rightAccount: expenseName,
          leftVal: formattedVal,
          rightVal: formattedVal,
          leftGlow: "red-text",
          rightGlow: "red-text",
          results: `
            <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Expense Voucher</strong><br>
            <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>${expenseName}</em> with ${formattedVal}<br>
            <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>Cash/Bank A/c</em> with ${formattedVal}<br>
            <span class="terminal-system">[Audit]</span> Ledger posting balanced. Mobile-Sync OK.
          `
        };
      } else if (lower.includes('sale') || lower.includes('sold') || lower.includes('income') || lower.includes('revenue') || lower.includes('cups')) {
        // Sales Type
        config = {
          leftAccount: "Cash A/c",
          rightAccount: "Sales A/c",
          leftVal: formattedVal,
          rightVal: formattedVal,
          leftGlow: "green-text",
          rightGlow: "green-text",
          results: `
            <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Sales Invoice / POS</strong><br>
            <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>Cash A/c</em> with ${formattedVal}<br>
            <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>Sales A/c</em> with ${formattedVal}<br>
            <span class="terminal-system">[Audit]</span> Real-time Mobile POS upload complete.
          `
        };
      } else {
        // Receipt or general journal
        let creditAcc = "Suspense A/c";
        if (lower.includes('rohit')) creditAcc = "Rohit (Debtor) A/c";
        else if (lower.includes('warish')) creditAcc = "Warish Ansari A/c";
        else if (lower.includes('client')) creditAcc = "Accounts Receivable";
        
        config = {
          leftAccount: "Cash/Bank A/c",
          rightAccount: creditAcc,
          leftVal: formattedVal,
          rightVal: formattedVal,
          leftGlow: "green-text",
          rightGlow: "red-text",
          results: `
            <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Receipt Voucher</strong><br>
            <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>Cash/Bank A/c</em> with ${formattedVal}<br>
            <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>${creditAcc}</em> with ${formattedVal}<br>
            <span class="terminal-system">[Audit]</span> Voucher balanced cryptographically.
          `
        };
      }
      
      terminalResults.innerHTML = config.results;
      terminalResults.style.display = 'block';
      
      document.getElementById('mini-left-title').textContent = config.leftAccount;
      miniLeftVal.textContent = config.leftVal;
      miniLeftVal.className = `mini-val ${config.leftGlow}`;
      
      document.getElementById('mini-right-title').textContent = config.rightAccount;
      miniRightVal.textContent = config.rightVal;
      miniRightVal.className = `mini-val ${config.rightGlow}`;
      
      miniCardLeft.style.animation = 'card-flash 1s ease-out';
      miniCardRight.style.animation = 'card-flash 1s ease-out';
    }, 900);
  }

  // -- SIGN IN MODAL LOGIC --
  const signInBtn = document.getElementById('btn-nav-signin');
  const signInModal = document.getElementById('signin-modal');
  const signInClose = document.getElementById('signin-close');
  const signInForm = document.getElementById('signin-form');
  const btnSignInSubmit = document.getElementById('btn-signin-submit');
  const modalSignupLink = document.getElementById('modal-signup-link');

  function openSignInModal() {
    if (signInModal) signInModal.style.display = 'flex';
  }
  function closeSignInModal() {
    if (signInModal) signInModal.style.display = 'none';
  }

  if (signInBtn) signInBtn.addEventListener('click', openSignInModal);
  if (signInClose) signInClose.addEventListener('click', closeSignInModal);
  if (modalSignupLink) modalSignupLink.addEventListener('click', closeSignInModal);

  // Trigger modal from pricing CTA buttons
  const cardTrialBtns = Array.from(document.querySelectorAll('.btn-card-trial'));
  cardTrialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSignInModal();
    });
  });

  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const spinner = btnSignInSubmit.querySelector('.spinner');
      const btnText = btnSignInSubmit.querySelector('.btn-text');
      
      if (spinner && btnText) {
        spinner.style.display = 'inline-block';
        btnText.textContent = "Connecting...";
      }
      
      setTimeout(() => {
        if (spinner && btnText) {
          spinner.style.display = 'none';
          btnText.textContent = "Sign In";
        }
        closeSignInModal();
        
        // Redirect to playground smooth scroll
        const sandboxEl = document.getElementById('sandbox');
        if (sandboxEl) {
          sandboxEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    });
  }

  // -- CONTACT MODAL LOGIC --
  const contactLink = document.getElementById('nav-link-contact');
  const contactModal = document.getElementById('contact-modal');
  const contactClose = document.getElementById('contact-close');
  const contactForm = document.getElementById('contact-form');
  const btnContactSubmit = document.getElementById('btn-contact-submit');
  const contactSuccess = document.getElementById('contact-success');

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (contactModal) {
      contactModal.style.display = 'flex';
      if (contactForm) contactForm.style.display = 'flex';
      if (contactSuccess) contactSuccess.style.display = 'none';
    }
  }
  function closeContactModal() {
    if (contactModal) contactModal.style.display = 'none';
  }

  if (contactLink) contactLink.addEventListener('click', openContactModal);
  if (contactClose) contactClose.addEventListener('click', closeContactModal);

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const spinner = btnContactSubmit.querySelector('.spinner');
      const btnText = btnContactSubmit.querySelector('.btn-text');
      
      if (spinner && btnText) {
        spinner.style.display = 'inline-block';
        btnText.textContent = "Sending...";
      }
      
      setTimeout(() => {
        if (spinner && btnText) {
          spinner.style.display = 'none';
          btnText.textContent = "Send Message";
        }
        if (contactForm) contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'flex';
        
        setTimeout(closeContactModal, 2000);
      }, 1200);
    });
  }

  // Close modals when clicking backdrop overlay
  window.addEventListener('click', (e) => {
    if (e.target === signInModal) closeSignInModal();
    if (e.target === contactModal) closeContactModal();
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSignInModal();
      closeContactModal();
    }
  });

  // -- HYBRID PRICING TOGGLE ENGINE --
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleYearly = document.getElementById('toggle-yearly');
  
  const yearlyMembershipCard = document.getElementById('yearly-membership-card');

  if (toggleMonthly && toggleYearly) {
    toggleMonthly.addEventListener('click', () => {
      toggleMonthly.classList.add('active');
      toggleYearly.classList.remove('active');
      
      // Hide Yearly Membership card
      if (yearlyMembershipCard) yearlyMembershipCard.style.display = 'none';
    });

    toggleYearly.addEventListener('click', () => {
      toggleYearly.classList.add('active');
      toggleMonthly.classList.remove('active');
      
      // Show Yearly Membership card
      if (yearlyMembershipCard) yearlyMembershipCard.style.display = 'flex';
    });
  }

  // -- FEATURES SLIDER ENGINE --
  const track = document.getElementById('feat-track');
  const slides = Array.from(document.querySelectorAll('.feature-slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const prevBtn = document.getElementById('feat-prev');
  const nextBtn = document.getElementById('feat-next');
  
  if (track && slides.length > 0) {
    let currentIndex = 1; // start at 1 to have a nice center balance on load
    
    function updateSlider() {
      const viewportWidth = track.parentElement.offsetWidth;
      const slideWidth = slides[0].offsetWidth;
      const gap = 24; // matches CSS gap
      
      let visibleSlides = 3;
      if (window.innerWidth <= 768) {
        visibleSlides = 1;
      } else if (window.innerWidth <= 1024) {
        visibleSlides = 2;
      }
      
      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      let translateX = 0;
      if (visibleSlides === 3) {
        // Spotlight centering alignment
        const centerOffset = (viewportWidth / 2) - (slideWidth / 2);
        translateX = centerOffset - (currentIndex * (slideWidth + gap));
      } else {
        // Left-aligned scroll on smaller screens
        translateX = -currentIndex * (slideWidth + gap);
      }
      
      track.style.transform = `translateX(${translateX}px)`;
    }
    
    window.addEventListener('resize', updateSlider);
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });
    
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
      });
    });
    
    let autoPlayTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }, 5000);
    
    const pauseTimer = () => {
      clearInterval(autoPlayTimer);
    };
    
    const resumeTimer = () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
      }, 5000);
    };
    
    track.addEventListener('mouseenter', pauseTimer);
    track.addEventListener('mouseleave', resumeTimer);
    prevBtn.addEventListener('click', pauseTimer);
    nextBtn.addEventListener('click', pauseTimer);
    dots.forEach(dot => dot.addEventListener('click', pauseTimer));
    
    // Swipe gestures for touch screens
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      pauseTimer();
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
      const diffX = startX - endX;
      const threshold = 50; // min distance in px to trigger swipe
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swipe left -> Next slide
          currentIndex = (currentIndex + 1) % slides.length;
        } else {
          // Swipe right -> Prev slide
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        }
        updateSlider();
      }
      resumeTimer();
    });
    
    // Run initial setup
    setTimeout(updateSlider, 150);
  }



  // -- ANIMATED WEBGL SHADER BACKGROUND ENGINE --
  function initShaderBackground() {
    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported. Falling back to static gradient.');
      return;
    }

    // Vertex shader source
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    // Fragment shader source (Plasma waves and moving circles)
    const fsSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed = 0.2;
      const float gridSmoothWidth = 0.015;
      const float axisWidth = 0.05;
      const float majorLineWidth = 0.025;
      const float minorLineWidth = 0.0125;
      const float majorLineFrequency = 5.0;
      const float minorLineFrequency = 1.0;
      const vec4 gridColor = vec4(0.5);
      const float scale = 5.0;
      const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
      const float minLineWidth = 0.01;
      const float maxLineWidth = 0.2;
      const float lineSpeed = 1.0 * overallSpeed;
      const float lineAmplitude = 1.0;
      const float lineFrequency = 0.2;
      const float warpSpeed = 0.2 * overallSpeed;
      const float warpFrequency = 0.5;
      const float warpAmplitude = 1.0;
      const float offsetFrequency = 0.5;
      const float offsetSpeed = 1.33 * overallSpeed;
      const float minOffsetSpread = 0.6;
      const float maxOffsetSpread = 2.0;
      const int linesPerGroup = 16;

      #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
      #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
      #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

      float drawGridLines(float axis) {
        return drawCrispLine(0.0, axisWidth, axis)
              + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
              + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
      }

      float drawGrid(vec2 space) {
        return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
      }

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float horizontalFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec4 fragColor;
        vec2 uv = fragCoord.xy / iResolution.xy;
        vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

        float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
        float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

        vec4 lines = vec4(0.0);
        vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
        vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

        for(int l = 0; l < 16; l++) {
          float normalizedLineIndex = float(l) / 16.0;
          float offsetTime = iTime * offsetSpeed;
          float offsetPosition = float(l) + space.x * offsetFrequency;
          float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
          float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
          float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
          float linePosition = getPlasmaY(space.x, horizontalFade, offset);
          float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

          float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
          float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

          line = line + circle;
          lines += line * lineColor * rand;
        }

        fragColor = mix(bgColor1, bgColor2, uv.x);
        fragColor *= verticalFade;
        fragColor.a = 1.0;
        fragColor += lines;

        gl_FragColor = fragColor;
      }
    `;

    // Helper compile
    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttrib = gl.getAttribLocation(program, 'aVertexPosition');
    const resolutionUniform = gl.getUniformLocation(program, 'iResolution');
    const timeUniform = gl.getUniformLocation(program, 'iTime');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const startTime = Date.now();

    function render() {
      const elapsedSeconds = (Date.now() - startTime) / 1000;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Set resolution and time uniforms
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, elapsedSeconds);

      // Draw geometry
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttrib);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }



  // -- MOBILE MENU NAVIGATION LOGIC --
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
      }
    });
    
    // Close menu and navigate when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // -- THEME TOGGLE LOGIC --
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Check local storage for preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    }
    
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      
      let theme = 'dark';
      if (document.documentElement.classList.contains('light-mode')) {
        theme = 'light';
      }
      localStorage.setItem('theme', theme);
    });
  }

  // Initialize shader background
  initShaderBackground();
});
