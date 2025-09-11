//Carousel
const buttons = document.querySelectorAll("[data-carousel-button]")

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")  

        const activeSlide = slides.querySelector("[data-active]")  

        let newIndex = [...slides.children].indexOf(activeSlide) + offset

        if (newIndex < 0) newIndex = slides.children.length - 1
        if (newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
})
 

/**
 * Draws smooth bezier connectors between staggered nodes.
 * Keeps background intact; only handles lines + reveal animations.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.querySelector('.flow-wrap');
  const svg  = document.querySelector('.flow-lines');
  const nodes = [...document.querySelectorAll('.node')];

  // Create defs for arrowheads
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('viewBox', '0 0 10 10');
  marker.setAttribute('refX', '8.5');
  marker.setAttribute('refY', '5');
  marker.setAttribute('markerWidth', '6.5');
  marker.setAttribute('markerHeight', '6.5');
  marker.setAttribute('orient', 'auto-start-reverse');

  const tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tip.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  tip.setAttribute('fill', 'rgba(88,146,178,0.95)');
  marker.appendChild(tip);
  defs.appendChild(marker);
  svg.appendChild(defs);

  function rectCenter(el) {
    const wrapRect = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - wrapRect.left + r.width / 2;
    const y = r.top  - wrapRect.top  + r.height / 2;
    return { x, y };
  }

  function connect(fromEl, toEl) {
    const { x: x1, y: y1 } = rectCenter(fromEl);
    const { x: x2, y: y2 } = rectCenter(toEl);

    // Horizontal offset for bezier curve (asymmetric bend)
    const dx = (x2 - x1) * 0.35 || 60;
    const c1x = x1 + dx;
    const c1y = y1 + (fromEl.classList.contains('right') ? 10 : -10);
    const c2x = x2 - dx;
    const c2y = y2 + (toEl.classList.contains('left') ? 10 : -10);

    const d = `M ${x1},${y1} C ${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'connector');
    path.setAttribute('marker-end', 'url(#arrow)');
    svg.appendChild(path);

    // Prep line animation
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    // Defer to trigger transition
    requestAnimationFrame(() => path.classList.add('drawn'));
  }

  function build() {
    // Clear previous connectors
    svg.querySelectorAll('.connector').forEach(p => p.remove());

    // Draw in sequence based on data-next
    nodes.forEach(node => {
      const nextSel = node.getAttribute('data-next');
      if (!nextSel) return;
      const next = document.querySelector(nextSel);
      if (next) connect(node, next);
    });
  }

  // Reveal nodes on load / small scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { root: null, threshold: 0.2 });

  nodes.forEach(n => io.observe(n));

  // Initial build and on resize (debounced)
  build();
  let rAF;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(build);
  });
});



//LOG/REG Forms
document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.getElementById("login-popup");
  const registerPopup = document.getElementById("register-popup");
  const openLogin = document.getElementById("open-login");
  const openRegister = document.getElementById("open-register");
  const closeBtns = document.querySelectorAll("[data-close]");

  // Open login
  openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginPopup.classList.add("active");
  });

  // Open register
  openRegister.addEventListener("click", (e) => {
    e.preventDefault();
    registerPopup.classList.add("active");
  });

  // Close any popup
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".auth-popup").classList.remove("active");
    });
  });

  // Close when clicking outside content
  [loginPopup, registerPopup].forEach(popup => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.classList.remove("active");
    });
  });

  // (Optional) form submit handling
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Logged in!");
    loginPopup.classList.remove("active");
  });

  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Registered!");
    registerPopup.classList.remove("active");
  });
});







