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
  const leftCard = document.getElementById('sim-card-left');
  const rightCard = document.getElementById('sim-card-right');
  const leftTitle = document.getElementById('sim-left-title');
  const rightTitle = document.getElementById('sim-right-title');
  const leftVal = document.getElementById('sim-left-val');
  const rightVal = document.getElementById('sim-right-val');

  // Simulated double-entry ledger configurations
  const simulations = {
    "Sold 5 laptops to Ram Debtor with GST 18%": {
      leftAcc: "Cash A/c",
      rightAcc: "Sales A/c",
      leftVal: "₹4,08,357.82",
      rightVal: "₹5,51,597.00",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Sales Invoice / POS</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>Cash A/c</em> with ₹4,08,357.82<br>
        <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>Sales A/c</em> with ₹5,51,597.00<br>
        <span class="terminal-results">[Audit] Real-time Mobile POS upload complete.</span>
      `
    },
    "Paid office rent ₹12,000 via HDFC bank": {
      leftAcc: "Rent Expense A/c",
      rightAcc: "HDFC Bank A/c",
      leftVal: "₹12,000.00",
      rightVal: "₹32,358.82",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Expense Voucher</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>Rent Expense A/c</em> with ₹12,000.00<br>
        <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>HDFC Bank A/c</em> with ₹32,358.82<br>
        <span class="terminal-results">[Audit] Ledger posting balanced. Mobile-Sync OK.</span>
      `
    },
    "Received ₹50,000 client fee from Warish Ansari": {
      leftAcc: "HDFC Bank A/c",
      rightAcc: "Warish Ansari A/c",
      leftVal: "₹82,358.82",
      rightVal: "₹1,00,000.00",
      terminalHtml: `
        <span class="terminal-system">[NewZen BookK AI]</span> Voucher Class detected: <strong>Receipt Voucher</strong><br>
        <span class="terminal-system">[NewZen BookK AI]</span> debiting <em>HDFC Bank A/c</em> with ₹82,358.82<br>
        <span class="terminal-system">[NewZen BookK AI]</span> crediting <em>Warish Ansari A/c</em> with ₹1,00,000.00<br>
        <span class="terminal-results">[Audit] Voucher balanced cryptographically.</span>
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
          
          // Update ledger cards
          if (leftTitle && rightTitle && leftVal && rightVal) {
            leftTitle.textContent = data.leftAcc;
            rightTitle.textContent = data.rightAcc;
            
            // Value counter effect (simplified)
            leftVal.textContent = data.leftVal;
            rightVal.textContent = data.rightVal;
            
            // Flash cards visual indicator
            leftCard.style.borderColor = 'var(--border-active)';
            rightCard.style.borderColor = 'var(--border-active)';
            
            setTimeout(() => {
              leftCard.style.borderColor = 'var(--border-glow)';
              rightCard.style.borderColor = 'var(--border-glow)';
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
        vec4 bgColor1 = vec4(0.04, 0.04, 0.08, 1.0);
        vec4 bgColor2 = vec4(0.08, 0.04, 0.12, 1.0);

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

      gl.clearColor(0.04, 0.04, 0.08, 1.0);
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

  // Initialize background WebGL shader
  initShaderBackground();

});
