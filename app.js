/**
 * NewZenBookK - Core Application Logic
 * 
 * Includes:
 * 1. Mobile Menu Toggling
 * 2. Theme Switching (Light/Dark Mode)
 * 3. Bookkeeping Simulation (Typing & Real-time ledger balances)
 * 4. WebGL Plasma Wave Shader Background
 * 5. Interactive Pricing Switcher
 * 6. Sign-in & Contact Modals
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
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
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     THEME SWITCHER (LIGHT/DARK MODE)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Set theme from local storage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      const theme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
    });
  }

  /* ==========================================================================
     HYBRID PRICING TOGGLE ENGINE
     ========================================================================== */
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleYearly = document.getElementById('toggle-yearly');
  const priceCards = document.querySelectorAll('.price-card');

  const pricingData = {
    monthly: {
      starter: { val: '₹59', cycle: '/mo' },
      growth: { val: '₹99', cycle: '/mo' },
      pro: { val: '₹159', cycle: '/mo' },
      unlimited: { val: '₹199', cycle: '/mo', title: 'Unlimited', desc: 'High-Volume POS Hubs & Firms' }
    },
    yearly: {
      starter: { val: '₹59', cycle: '/mo' },
      growth: { val: '₹99', cycle: '/mo' },
      pro: { val: '₹159', cycle: '/mo' },
      unlimited: { val: '₹1,999', cycle: '/yr', title: 'Yearly Membership', desc: 'Unlimited features for a full year' }
    }
  };

  function updatePricing(billingCycle) {
    priceCards.forEach(card => {
      const plan = card.getAttribute('data-plan');
      if (plan && pricingData[billingCycle][plan]) {
        const valEl = card.querySelector('.price-value');
        const cycleEl = card.querySelector('.price-cycle');
        if (valEl && cycleEl) {
          valEl.textContent = pricingData[billingCycle][plan].val;
          cycleEl.textContent = pricingData[billingCycle][plan].cycle;
        }
        
        if (plan === 'unlimited') {
          const titleEl = document.getElementById('unlimited-title');
          const descEl = document.getElementById('unlimited-desc');
          if (titleEl && descEl) {
            titleEl.textContent = pricingData[billingCycle][plan].title;
            descEl.textContent = pricingData[billingCycle][plan].desc;
          }
        }
      }
    });
  }

  if (toggleMonthly && toggleYearly) {
    toggleMonthly.addEventListener('click', () => {
      toggleMonthly.classList.add('active');
      toggleYearly.classList.remove('active');
      updatePricing('monthly');
    });

    toggleYearly.addEventListener('click', () => {
      toggleYearly.classList.add('active');
      toggleMonthly.classList.remove('active');
      updatePricing('yearly');
    });
  }

  /* ==========================================================================
     SIGN-IN AND CONTACT MODALS
     ========================================================================== */
  const signInBtn = document.getElementById('btn-nav-signin');
  const signInModal = document.getElementById('signin-modal');
  const signInClose = document.getElementById('signin-close');
  const signInForm = document.getElementById('signin-form');
  const btnSignInSubmit = document.getElementById('btn-signin-submit');
  const modalSignupLink = document.getElementById('modal-signup-link');

  const contactLink = document.getElementById('nav-link-contact');
  const contactModal = document.getElementById('contact-modal');
  const contactClose = document.getElementById('contact-close');
  const contactForm = document.getElementById('contact-form');
  const btnContactSubmit = document.getElementById('btn-contact-submit');
  const contactSuccess = document.getElementById('contact-success');

  // Trigger modal from pricing CTA trial buttons
  const trialButtons = document.querySelectorAll('.btn-card-trial');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
    }
  }

  if (signInBtn) signInBtn.addEventListener('click', () => openModal(signInModal));
  if (signInClose) signInClose.addEventListener('click', () => closeModal(signInModal));
  if (modalSignupLink) modalSignupLink.addEventListener('click', () => closeModal(signInModal));

  trialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(signInModal);
    });
  });

  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnSignInSubmit) {
        btnSignInSubmit.textContent = "Connecting...";
        btnSignInSubmit.disabled = true;
      }
      setTimeout(() => {
        if (btnSignInSubmit) {
          btnSignInSubmit.textContent = "Sign In";
          btnSignInSubmit.disabled = false;
        }
        closeModal(signInModal);
        
        // Scroll smoothly to simulator sandbox
        const heroEl = document.getElementById('hero');
        if (heroEl) {
          heroEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    });
  }

  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(contactModal);
      if (contactForm) contactForm.style.display = 'block';
      if (contactSuccess) contactSuccess.style.display = 'none';
    });
  }
  if (contactClose) contactClose.addEventListener('click', () => closeModal(contactModal));

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnContactSubmit) {
        btnContactSubmit.textContent = "Sending...";
        btnContactSubmit.disabled = true;
      }
      setTimeout(() => {
        if (btnContactSubmit) {
          btnContactSubmit.textContent = "Send Message";
          btnContactSubmit.disabled = false;
        }
        contactForm.style.display = 'none';
        if (contactSuccess) contactSuccess.style.display = 'block';
        
        setTimeout(() => closeModal(contactModal), 2000);
      }, 1200);
    });
  }

  // Backdrop overlay click to close modals
  window.addEventListener('click', (e) => {
    if (e.target === signInModal) closeModal(signInModal);
    if (e.target === contactModal) closeModal(contactModal);
  });

  // Escape key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(signInModal);
      closeModal(contactModal);
    }
  });

  /* ==========================================================================
     INTERACTIVE AI BOOKKEEPING SIMULATOR
     ========================================================================== */
  const simInput = document.getElementById('sim-input');
  const simResults = document.getElementById('sim-results');
  const simBtns = document.querySelectorAll('.sim-btn');
  
  // New Digits Ledger Node Elements
  const sourceCard = document.getElementById('ledger-source-card');
  const sourceTag = document.getElementById('source-tag');
  const sourceTitle = document.getElementById('source-title');
  const sourceVal = document.getElementById('source-val');
  const sourceDetails = document.getElementById('source-details');
  
  const debitCard = document.getElementById('ledger-debit-card');
  const debitTag = document.getElementById('debit-tag');
  const debitTitle = document.getElementById('debit-title');
  const debitVal = document.getElementById('debit-val');
  
  const creditCard = document.getElementById('ledger-credit-card');
  const creditTag = document.getElementById('credit-tag');
  const creditTitle = document.getElementById('credit-title');
  const creditVal = document.getElementById('credit-val');
  
  const chartLine = document.getElementById('chart-line');
  const chartArea = document.getElementById('chart-area');
  const chartMarker = document.getElementById('chart-marker');
  
  const particleDebit = document.getElementById('particle-debit');
  const particleCredit = document.getElementById('particle-credit');

  // Simulated double-entry ledger configurations
  const simulations = {
    "Sold 5 laptops to Ram Debtor with GST 18%": {
      sourceTag: "Sales Invoice",
      sourceTitle: "Ram Debtor",
      sourceVal: "₹1,18,000",
      sourceDetails: "GST 18% Included",
      debitTag: "Debit (Cash)",
      debitTitle: "Cash & Bank A/c",
      debitVal: "+₹1,00,000",
      creditTag: "Credit (GST)",
      creditTitle: "GST Output A/c",
      creditVal: "+₹18,000",
      chartLine: "M0,50 L100,60 L200,45 L300,70 L400,30 L500,40",
      chartArea: "M0,100 L0,50 L100,60 L200,45 L300,70 L400,30 L500,40 L500,100 Z",
      markerCx: "500",
      markerCy: "40",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Parsed invoice entities: <strong>POS Sales</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Debiting Cash A/c with <em>₹1,00,000</em><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Crediting GST Output A/c with <em>₹18,000</em><br>
        <span class="terminal-results">[Audit] Double-entry balanced. Real-time graphs updated.</span>
      `
    },
    "Paid office rent ₹12,000 via HDFC bank": {
      sourceTag: "Expense Pay",
      sourceTitle: "Office Rent",
      sourceVal: "₹12,000",
      sourceDetails: "Payment via HDFC NetBanking",
      debitTag: "Debit (Expense)",
      debitTitle: "Rent Expense A/c",
      debitVal: "+₹12,000",
      creditTag: "Credit (Asset)",
      creditTitle: "HDFC Bank A/c",
      creditVal: "-₹12,000",
      chartLine: "M0,50 L100,40 L200,55 L300,30 L400,65 L500,75",
      chartArea: "M0,100 L0,50 L100,40 L200,55 L300,30 L400,65 L500,75 L500,100 Z",
      markerCx: "500",
      markerCy: "75",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Parsed transaction: <strong>Expense Voucher</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Debiting Rent Expense A/c with <em>₹12,000</em><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Crediting HDFC Bank A/c with <em>-₹12,000</em><br>
        <span class="terminal-results">[Audit] Cash outflow verified. Books automatically balanced.</span>
      `
    },
    "Received ₹50,000 client fee from Warish Ansari": {
      sourceTag: "Client Receipt",
      sourceTitle: "Warish Ansari",
      sourceVal: "₹50,000",
      sourceDetails: "Direct Bank Transfer",
      debitTag: "Debit (Asset)",
      debitTitle: "Cash & Bank A/c",
      debitVal: "+₹50,000",
      creditTag: "Credit (Revenue)",
      creditTitle: "Professional Fee A/c",
      creditVal: "+₹50,000",
      chartLine: "M0,50 L100,55 L200,40 L300,65 L400,20 L500,15",
      chartArea: "M0,100 L0,50 L100,55 L200,40 L300,65 L400,20 L500,15 L500,100 Z",
      markerCx: "500",
      markerCy: "15",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Parsed receipt: <strong>Revenue Voucher</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Debiting Cash & Bank A/c with <em>₹50,000</em><br>
        <span class="terminal-system">[NewZen BookK AI]</span> Crediting Professional Fee A/c with <em>₹50,000</em><br>
        <span class="terminal-results">[Audit] Revenue ledger synced to GST cloud.</span>
      `
    }
  };

  let typingTimeout = null;

  function runSimulation(prompt) {
    if (!simInput || !simulations[prompt]) return;

    // Clear typing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set simulator to typing state
    simInput.value = "";
    simResults.innerHTML = `<span class="terminal-system">[NewZen BookK AI]</span> Parsing transaction...`;
    
    let index = 0;
    
    function type() {
      if (index < prompt.length) {
        simInput.value += prompt.charAt(index);
        index++;
        typingTimeout = setTimeout(type, 35);
      } else {
        // Complete typing, display results
        setTimeout(() => {
          const data = simulations[prompt];
          simResults.innerHTML = data.terminalHtml;
          
          // Update Digits Ledger node contents
          if (sourceTag && sourceTitle && sourceVal && sourceDetails) {
            sourceTag.textContent = data.sourceTag;
            sourceTitle.textContent = data.sourceTitle;
            sourceVal.textContent = data.sourceVal;
            sourceDetails.textContent = data.sourceDetails;
          }
          
          if (debitTag && debitTitle && debitVal) {
            debitTag.textContent = data.debitTag;
            debitTitle.textContent = data.debitTitle;
            debitVal.textContent = data.debitVal;
          }
          
          if (creditTag && creditTitle && creditVal) {
            creditTag.textContent = data.creditTag;
            creditTitle.textContent = data.creditTitle;
            creditVal.textContent = data.creditVal;
          }

          // Update SVG Chart
          if (chartLine && chartArea && chartMarker) {
            chartLine.setAttribute('d', data.chartLine);
            chartArea.setAttribute('d', data.chartArea);
            chartMarker.setAttribute('cx', data.markerCx);
            chartMarker.setAttribute('cy', data.markerCy);
          }

          // Trigger particle animations flow
          if (particleDebit && particleCredit) {
            particleDebit.style.animation = 'none';
            particleCredit.style.animation = 'none';
            particleDebit.offsetHeight; // trigger reflow
            particleCredit.offsetHeight; // trigger reflow
            particleDebit.style.animation = 'move-particle 2s linear forwards';
            particleCredit.style.animation = 'move-particle 2.2s linear forwards 0.2s';
          }

          // Trigger Three.js 3D laser beams to nodes
          if (typeof window.trigger3DLaser === 'function') {
            if (prompt.includes('laptops') || prompt.includes('Sold')) {
              window.trigger3DLaser('Cash', 0x00ff66); // green laser to Cash node
              window.trigger3DLaser('GST', 0x00d2ff);  // cyan laser to GST node
            } else if (prompt.includes('rent') || prompt.includes('Paid')) {
              window.trigger3DLaser('Expense', 0xff5f56); // red laser to Expense node
            } else if (prompt.includes('fee') || prompt.includes('Received')) {
              window.trigger3DLaser('Revenue', 0xffbd2e); // yellow laser to Revenue node
            }
          }
          
          // Flash cards visual indicator
          if (sourceCard && debitCard && creditCard) {
            sourceCard.style.borderColor = 'var(--border-active)';
            debitCard.style.borderColor = 'var(--border-active)';
            creditCard.style.borderColor = 'var(--border-active)';
            
            setTimeout(() => {
              sourceCard.style.borderColor = 'var(--border-glow)';
              debitCard.style.borderColor = 'var(--border-glow)';
              creditCard.style.borderColor = 'var(--border-glow)';
            }, 800);
          }
        }, 300);
      }
    }
    
    type();
  }

  // Pre-load default simulation on startup
  runSimulation("Sold 5 laptops to Ram Debtor with GST 18%");

  // Add click listeners to buttons
  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const prompt = btn.getAttribute('data-prompt');
      runSimulation(prompt);
    });
  });

  /* ==========================================================================
     WEBGL PLASMA WAVE BACKGROUND SHADER
     ========================================================================== */
  function initShaderBackground() {
    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported by browser. Falling back to static gradient.');
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;

    // Fragment Shader Source
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
      const vec4 lineColor = vec4(0.0, 0.4, 1.0, 1.0);
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
        vec4 bgColor1 = vec4(0.01, 0.03, 0.07, 1.0);
        vec4 bgColor2 = vec4(0.04, 0.08, 0.16, 1.0);

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

    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
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
      console.error('Shader linking failed:', gl.getProgramInfoLog(program));
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

      gl.clearColor(0.01, 0.03, 0.07, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, elapsedSeconds);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttrib);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* ==========================================================================
     AI COMPANION ROBOT INTERACTION ENGINE
     ========================================================================== */
  const botEl = document.getElementById('ai-companion');
  const botHead = botEl ? botEl.querySelector('.bot-head') : null;
  const botBodyWrapper = botEl ? botEl.querySelector('.bot-body-wrapper') : null;
  const botBubble = document.getElementById('bot-bubble');

  if (botEl && botHead && botBodyWrapper) {
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    let isSpinning = false;
    
    // Draggability and Game state variables
    let isDragging = false;
    let isDeactivated = false;
    let isMischievous = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let mischiefTimer = null;
    let returnHomeTimeout = null;
    let cursorChaseInterval = null;

    // Helper to send bot back to its bottom-right home dock
    function returnHome() {
      if (isDeactivated) return;
      botEl.classList.remove('mischievous');
      isMischievous = false;
      if (botBubble) botBubble.classList.remove('active');
      
      botEl.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      botEl.style.left = `${window.innerWidth - 110}px`;
      botEl.style.top = `${window.innerHeight - 170}px`;
      
      clearInterval(cursorChaseInterval);
      
      // Re-anchor to bottom/right style after transition completes
      setTimeout(() => {
        if (!isDragging && !isMischievous && !isDeactivated) {
          botEl.style.transition = '';
          botEl.style.left = '';
          botEl.style.top = '';
          botEl.style.bottom = '80px';
          botEl.style.right = '40px';
        }
      }, 800);
    }

    // Helper to deactivate / block the bot
    function deactivateBot(message = "System Blocked. Click to reboot.") {
      isDeactivated = true;
      isMischievous = false;
      botEl.classList.remove('mischievous');
      botEl.classList.add('deactivated');
      clearInterval(cursorChaseInterval);
      clearTimeout(returnHomeTimeout);

      if (botBubble) {
        botBubble.textContent = message;
        botBubble.classList.add('active');
      }

      // Drop bot to the bottom center of the viewport
      botEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      botEl.style.bottom = 'auto';
      botEl.style.right = 'auto';
      botEl.style.left = `${window.innerWidth / 2 - 35}px`;
      botEl.style.top = `${window.innerHeight - 110}px`;
      
      setTimeout(() => {
        botEl.style.transition = '';
      }, 600);
    }

    // Helper to reactivate the bot
    function rebootBot() {
      isDeactivated = false;
      botEl.classList.remove('deactivated');
      if (botBubble) botBubble.classList.remove('active');
      
      // Flash eyes green on reboot
      const eyes = botEl.querySelectorAll('.bot-eye');
      eyes.forEach(eye => {
        eye.style.background = '#00ff66';
        eye.style.boxShadow = '0 0 12px #00ff66';
      });

      setTimeout(() => {
        eyes.forEach(eye => {
          eye.style.background = '';
          eye.style.boxShadow = '';
        });
        returnHome();
      }, 500);
    }

    // Helper to trigger mischievous disturbance
    function triggerMischief() {
      if (isDeactivated || isDragging || isMischievous) return;
      isMischievous = true;
      botEl.classList.add('mischievous');
      
      if (botBubble) {
        botBubble.textContent = "AI is taking over! 🤖 Click to Block!";
        botBubble.classList.add('active');
      }

      // Fly to viewport center
      const rect = botEl.getBoundingClientRect();
      botEl.style.bottom = 'auto';
      botEl.style.right = 'auto';
      botEl.style.left = `${rect.left}px`;
      botEl.style.top = `${rect.top}px`;
      
      // Delay slightly for transition toggle
      setTimeout(() => {
        botEl.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        botEl.style.left = `${window.innerWidth / 2 - 35}px`;
        botEl.style.top = `${window.innerHeight / 3}px`;
      }, 20);

      // Chase/Disturb the cursor
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 3;
      
      const trackMouse = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      window.addEventListener('mousemove', trackMouse);

      cursorChaseInterval = setInterval(() => {
        if (!isMischievous || isDragging || isDeactivated) {
          window.removeEventListener('mousemove', trackMouse);
          return;
        }
        
        // Move towards the cursor to block it
        const currentRect = botEl.getBoundingClientRect();
        const dx = mouseX - (currentRect.left + 35);
        const dy = mouseY - (currentRect.top + 45);
        
        botEl.style.transition = 'all 0.6s ease-out';
        botEl.style.left = `${currentRect.left + dx * 0.15}px`;
        botEl.style.top = `${currentRect.top + dy * 0.15}px`;
      }, 80);

      // Auto-return home after 12 seconds if not blocked/clicked
      returnHomeTimeout = setTimeout(() => {
        window.removeEventListener('mousemove', trackMouse);
        returnHome();
      }, 12000);
    }

    // Start periodic mischief check (every 18 seconds)
    mischiefTimer = setInterval(() => {
      // 40% chance of trigger if active
      if (Math.random() < 0.4) {
        triggerMischief();
      }
    }, 18000);

    // 1. Drag & Drop Handlers (Mouse & Touch)
    const startDrag = (clientX, clientY) => {
      if (isDeactivated) {
        rebootBot();
        return;
      }
      
      isDragging = true;
      botEl.classList.add('is-dragging');
      if (botBubble) botBubble.classList.remove('active');
      
      const rect = botEl.getBoundingClientRect();
      botEl.style.bottom = 'auto';
      botEl.style.right = 'auto';
      botEl.style.left = `${rect.left}px`;
      botEl.style.top = `${rect.top}px`;
      
      dragOffsetX = clientX - rect.left;
      dragOffsetY = clientY - rect.top;
      
      botEl.style.transition = 'none';
      clearInterval(cursorChaseInterval);
      clearTimeout(returnHomeTimeout);
    };

    const doDrag = (clientX, clientY) => {
      if (!isDragging) return;
      
      // Constrain coordinates within viewport
      const x = Math.max(0, Math.min(window.innerWidth - 70, clientX - dragOffsetX));
      const y = Math.max(0, Math.min(window.innerHeight - 90, clientY - dragOffsetY));
      
      botEl.style.left = `${x}px`;
      botEl.style.top = `${y}px`;
    };

    const stopDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      botEl.classList.remove('is-dragging');
      botEl.style.transition = '';
      
      if (isMischievous) {
        // If dragged while disturbing, deactivate it!
        deactivateBot("Mischief Deactivated! Click to reboot.");
      } else {
        // Let it settle at the drag drop location or float back home after 3s
        setTimeout(() => {
          if (!isDragging && !isMischievous && !isDeactivated) {
            returnHome();
          }
        }, 3000);
      }
    };

    // Mouse Listeners
    botEl.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      doDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      stopDrag();
    });

    // Touch Listeners
    botEl.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      doDrag(touch.clientX, touch.clientY);
    });

    window.addEventListener('touchend', () => {
      stopDrag();
    });

    // 2. Scroll-linked tilting & wavy translation
    window.addEventListener('scroll', () => {
      if (isDragging || isDeactivated || isMischievous) return;

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Calculate vertical scroll velocity limit to 30px max
      const velocity = Math.max(-30, Math.min(30, scrollDiff));
      const tiltAngle = velocity * 0.8; // tilts up to 24deg
      
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = documentHeight > 0 ? currentScrollY / documentHeight : 0;
      const wavyOffset = Math.sin(scrollPercent * Math.PI * 6) * 35; // wobbles up to 35px left and right

      if (!isSpinning) {
        botBodyWrapper.style.transform = `translateY(0) rotateY(${wavyOffset * 0.3}deg) rotateX(${tiltAngle}deg) translateX(${wavyOffset}px)`;
        const boosterFlame = botEl.querySelector('.bot-booster');
        if (boosterFlame) {
          boosterFlame.style.transform = `skewX(${velocity * 0.4}deg)`;
        }
      }

      // Smoothly return back to idle state once scrolling halts
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isSpinning && !isDragging && !isDeactivated && !isMischievous) {
          botBodyWrapper.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg) translateX(0px)';
          const boosterFlame = botEl.querySelector('.bot-booster');
          if (boosterFlame) {
            boosterFlame.style.transform = 'skewX(0deg)';
          }
        }
      }, 250);
    });

    // 3. Mouse move look-at target tracking
    window.addEventListener('mousemove', (e) => {
      if (isSpinning || isDragging || isDeactivated) return;
      
      const botRect = botEl.getBoundingClientRect();
      const botCenterX = botRect.left + botRect.width / 2;
      const botCenterY = botRect.top + botRect.height / 2;

      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 500) {
        const angleX = Math.max(-25, Math.min(25, deltaX / 15));
        const angleY = Math.max(-20, Math.min(20, -deltaY / 15));
        botHead.style.transform = `translateZ(5px) rotateY(${angleX}deg) rotateX(${angleY}deg)`;
      } else {
        botHead.style.transform = 'translateZ(5px) rotateY(0deg) rotateX(0deg)';
      }
    });

    // 4. Click interaction (Block/Deactivate or spin on regular click)
    botEl.addEventListener('click', (e) => {
      // If dragged/dragging, ignore click
      if (isDragging) return;

      if (isDeactivated) {
        rebootBot();
        return;
      }

      if (isMischievous) {
        // Block/Deactivate if clicked during disturbance
        deactivateBot("Mischief Deactivated! Click to reboot.");
        e.stopPropagation();
        return;
      }

      if (isSpinning) return;
      isSpinning = true;

      // Add spin and glow animations
      botBodyWrapper.style.transition = 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
      botBodyWrapper.style.transform = 'translateY(-20px) rotateY(720deg) rotateX(20deg)';

      const eyes = botEl.querySelectorAll('.bot-eye');
      eyes.forEach(eye => {
        eye.style.background = '#00ff66';
        eye.style.boxShadow = '0 0 12px #00ff66';
      });

      setTimeout(() => {
        if (!isDeactivated && !isMischievous) {
          botBodyWrapper.style.transition = '';
          botBodyWrapper.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg)';
          
          eyes.forEach(eye => {
            eye.style.background = '';
            eye.style.boxShadow = '';
          });
        }
        isSpinning = false;
      }, 1100);
    });
  }

  /* ==========================================================================
     THREE.JS 3D INTERACTIVE LEDGER CORE
     ========================================================================== */
  function initThreeDHeroVisual() {
    const container = document.getElementById('hero-3d-container');
    const canvas = document.getElementById('hero-3d-canvas');
    if (!container || !canvas) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js is not loaded. Skipping 3D visual.');
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x0066ff, 3.5, 18);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core Geometry (Geodesic Icosahedron)
    const coreGeometry = new THREE.IcosahedronGeometry(2.0, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: false,
      transparent: true,
      opacity: 0.75
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Inner glowing core sphere
    const innerGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.4
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Concentric Orbit Rings
    const orbitGroup = new THREE.Group();
    mainGroup.add(orbitGroup);

    const ringCount = 3;
    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.35 }),
      new THREE.LineBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.35 }),
      new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 })
    ];

    const orbits = [];
    const orbitRadii = [3.6, 4.8, 6.0];
    const rotations = [
      { x: Math.PI / 6, y: Math.PI / 4, z: 0 },
      { x: -Math.PI / 5, y: -Math.PI / 3, z: Math.PI / 6 },
      { x: Math.PI / 3, y: -Math.PI / 6, z: -Math.PI / 4 }
    ];

    for (let i = 0; i < ringCount; i++) {
      const radius = orbitRadii[i];
      const segments = 64;
      const ringGeometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        vertices.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
      }
      ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      
      const lineLoop = new THREE.LineLoop(ringGeometry, ringMaterials[i]);
      lineLoop.rotation.set(rotations[i].x, rotations[i].y, rotations[i].z);
      orbitGroup.add(lineLoop);
      orbits.push(lineLoop);
    }

    // 3. Floating Ledger Nodes on Orbit Rings
    const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const nodeColors = [0x00ff66, 0x00d2ff, 0xffbd2e, 0xff5f56];
    const nodeLabels = ["Cash", "GST Tax", "Revenue", "Expense"];
    const nodes = [];

    for (let i = 0; i < 4; i++) {
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: nodeColors[i],
        transparent: true,
        opacity: 0.95
      });
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      const orbitIndex = i % ringCount;
      nodeMesh.userData = {
        orbitIndex: orbitIndex,
        radius: orbitRadii[orbitIndex],
        angle: (i * Math.PI / 2) + Math.random() * 0.5,
        speed: 0.006 + (i * 0.002),
        label: nodeLabels[i],
        color: nodeColors[i],
        pulse: 0
      };
      
      orbitGroup.add(nodeMesh);
      nodes.push(nodeMesh);
    }

    // Particle Beam System for laser transfers
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleTargets = [];
    const particleStates = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;
      particleSpeeds[i] = 0.04 + Math.random() * 0.04;
      particleTargets.push(null);
      particleStates.push(0);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ff66,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    window.trigger3DLaser = function(nodeName, colorHex = 0x00ff66) {
      const targetNode = nodes.find(n => n.userData.label.toLowerCase().includes(nodeName.toLowerCase()));
      if (!targetNode) return;

      coreMaterial.color.setHex(colorHex);
      innerMat.color.setHex(colorHex);
      coreLight.color.setHex(colorHex);
      coreLight.intensity = 8;
      
      targetNode.scale.set(1.8, 1.8, 1.8);
      targetNode.userData.pulse = 1.0;

      setTimeout(() => {
        coreMaterial.color.setHex(0x0066ff);
        innerMat.color.setHex(0x00d2ff);
        coreLight.color.setHex(0x0066ff);
        coreLight.intensity = 3.5;
      }, 1000);

      let activated = 0;
      const positions = particleSystem.geometry.attributes.position.array;
      particleMaterial.color.setHex(colorHex);

      for (let i = 0; i < particleCount; i++) {
        if (particleStates[i] === 0) {
          particleStates[i] = 1;
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
          particleTargets[i] = targetNode;
          particleSpeeds[i] = 0.04 + Math.random() * 0.06;
          
          activated++;
          if (activated >= 30) break;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    };

    // Mode toggling
    let renderMode = 'solid';
    const ctrlButtons = container.querySelectorAll('.threed-ctrl-btn');
    ctrlButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        ctrlButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMode = btn.getAttribute('data-mode');

        if (renderMode === 'wireframe') {
          coreMaterial.wireframe = true;
          coreMesh.visible = true;
          innerMesh.visible = false;
        } else if (renderMode === 'solid') {
          coreMaterial.wireframe = false;
          coreMesh.visible = true;
          innerMesh.visible = true;
        } else if (renderMode === 'particles') {
          coreMesh.visible = false;
          innerMesh.visible = false;
        }
        e.stopPropagation();
      });
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      targetX = (e.clientX - halfWidth) / halfWidth * 0.35;
      targetY = (e.clientY - halfHeight) / halfHeight * 0.25;
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (coreMesh.visible) {
        coreMesh.rotation.x += 0.004;
        coreMesh.rotation.y += 0.006;
      }
      innerMesh.rotation.y -= 0.003;

      orbits.forEach((orbit, index) => {
        orbit.rotation.z += 0.001 * (index + 1);
      });

      const positions = particleSystem.geometry.attributes.position.array;
      
      nodes.forEach((node) => {
        const u = node.userData;
        u.angle += u.speed;
        
        const orbitRing = orbits[u.orbitIndex];
        const localPos = new THREE.Vector3(
          Math.cos(u.angle) * u.radius,
          Math.sin(u.angle) * u.radius,
          0
        );
        
        localPos.applyEuler(orbitRing.rotation);
        node.position.copy(localPos);

        if (u.pulse > 0) {
          u.pulse -= delta * 1.5;
          const scale = 1.0 + u.pulse * 0.8;
          node.scale.set(scale, scale, scale);
        }
      });

      let particlesNeedUpdate = false;
      for (let i = 0; i < particleCount; i++) {
        if (particleStates[i] === 1) {
          particlesNeedUpdate = true;
          const targetNode = particleTargets[i];
          
          if (targetNode) {
            const px = positions[i * 3];
            const py = positions[i * 3 + 1];
            const pz = positions[i * 3 + 2];
            
            const dx = targetNode.position.x - px;
            const dy = targetNode.position.y - py;
            const dz = targetNode.position.z - pz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 0.25) {
              particleStates[i] = 0;
              positions[i * 3] = 0;
              positions[i * 3 + 1] = 0;
              positions[i * 3 + 2] = 0;
            } else {
              positions[i * 3] += (dx / dist) * particleSpeeds[i];
              positions[i * 3 + 1] += (dy / dist) * particleSpeeds[i];
              positions[i * 3 + 2] += (dz / dist) * particleSpeeds[i];
            }
          } else {
            particleStates[i] = 0;
          }
        }
      }
      if (particlesNeedUpdate) {
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      mainGroup.rotation.y = currentX * 1.0;
      mainGroup.rotation.x = currentY * 0.7;

      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);

    animate();
  }

  /* ==========================================================================
     3D CARD TILT & REFLECTION SHINE ENGINE
     ========================================================================== */
  function initCard3DTilt() {
    const cards = document.querySelectorAll('.bento-card, .price-card, .usecase-card, .blueprint-card, .policy-card');
    
    cards.forEach(card => {
      const shine = document.createElement('div');
      shine.className = 'card-shine';
      card.appendChild(shine);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const percentX = (mouseX - centerX) / centerX;
        const percentY = (mouseY - centerY) / centerY;

        const maxTilt = 8;
        const rotateX = -percentY * maxTilt;
        const rotateY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        card.style.setProperty('--shine-x', `${(mouseX / rect.width) * 100}%`);
        card.style.setProperty('--shine-y', `${(mouseY / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.removeProperty('--shine-x');
        card.style.removeProperty('--shine-y');
      });
    });
  }

  // Initialize interactive systems
  initThreeDHeroVisual();
  initCard3DTilt();
  initShaderBackground();

});
