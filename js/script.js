document.addEventListener('DOMContentLoaded', () => {

    //!!--GET THE APP — Platform Detection--!!

        const APP_STORE_URL  = 'https://apps.apple.com';
        const PLAY_STORE_URL = 'https://play.google.com/store';
        const storeURL = /Android/.test(navigator.userAgent) ? PLAY_STORE_URL : APP_STORE_URL;
        document.querySelectorAll('.get-app-btn, .mobile-get-app').forEach(el => {
            el.href = storeURL;
        });


    //!!--HERO PANEL — Auto-rotate--!!

        const heroSlides = [...document.querySelectorAll('.hero-slide')];
        const heroDots   = [...document.querySelectorAll('.hero-dot')];

        if (heroSlides.length) {
            let current = 0;
            let timer   = null;

            function showSlide(idx) {
                heroSlides[current].classList.remove('active');
                heroDots[current] && heroDots[current].classList.remove('active');
                current = (idx + heroSlides.length) % heroSlides.length;
                heroSlides[current].classList.add('active');
                heroDots[current] && heroDots[current].classList.add('active');
            }

            function startTimer() {
                clearInterval(timer);
                timer = setInterval(() => showSlide(current + 1), 5000);
            }

            heroDots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    showSlide(i);
                    startTimer();
                });
            });

            // Pause on hover
            const heroEl = document.getElementById('hero');
            if (heroEl) {
                heroEl.addEventListener('mouseenter', () => clearInterval(timer));
                heroEl.addEventListener('mouseleave', startTimer);
            }

            startTimer();
        }


    //!!--FLOW CONNECTORS--!!

        const wrap  = document.querySelector('.flow-wrap');
        const svg   = document.querySelector('.flow-lines');
        const nodes = [...document.querySelectorAll('.node')];

        if (wrap && svg && nodes.length) {

            const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrow');
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '8.5');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '6');
            marker.setAttribute('markerHeight', '6');
            marker.setAttribute('orient', 'auto-start-reverse');
            const tip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tip.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            tip.setAttribute('fill', 'rgba(88, 146, 178, 0.9)');
            marker.appendChild(tip);
            defs.appendChild(marker);
            svg.appendChild(defs);

            function rectCenter(el) {
                const wr = wrap.getBoundingClientRect();
                const r  = el.getBoundingClientRect();
                return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
            }

            function connect(a, b) {
                const { x: x1, y: y1 } = rectCenter(a);
                const { x: x2, y: y2 } = rectCenter(b);
                const dx  = (x2 - x1) * 0.35 || 60;
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${x1},${y1} C ${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`);
                path.setAttribute('class', 'connector');
                path.setAttribute('marker-end', 'url(#arrow)');
                svg.appendChild(path);
                const len = path.getTotalLength();
                path.style.strokeDasharray = path.style.strokeDashoffset = `${len}`;
                requestAnimationFrame(() => path.classList.add('drawn'));
            }

            function build() {
                svg.querySelectorAll('.connector').forEach(p => p.remove());
                nodes.forEach(n => {
                    const sel = n.getAttribute('data-next');
                    if (sel) { const next = document.querySelector(sel); if (next) connect(n, next); }
                });
            }

            const io = new IntersectionObserver(
                entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
                { threshold: 0.2 }
            );
            nodes.forEach(n => io.observe(n));
            build();
            let rAF;
            window.addEventListener('resize', () => { cancelAnimationFrame(rAF); rAF = requestAnimationFrame(build); });
        }


    //!!--CONTACT POPUP--!!

        const contactSection = document.getElementById('contactSection');
        const closeContact   = document.getElementById('close-contact');
        const contactForm    = document.getElementById('contact-form');

        function openContactForm(e) {
            e.preventDefault();
            closeMobileMenu();
            contactSection.style.display = 'flex';
        }

        const contactLink       = document.getElementById('contact-link');
        const mobileContactLink = document.getElementById('mobile-contact-link');
        if (contactLink)       contactLink.addEventListener('click', openContactForm);
        if (mobileContactLink) mobileContactLink.addEventListener('click', openContactForm);

        document.querySelectorAll('.open-contact-popup').forEach(el => {
            el.addEventListener('click', openContactForm);
        });

        if (closeContact) {
            closeContact.addEventListener('click', () => contactSection.style.display = 'none');
        }
        if (contactForm) {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();
                alert('Message sent!');
                contactSection.style.display = 'none';
                contactForm.reset();
            });
        }
        if (contactSection) {
            contactSection.addEventListener('click', e => {
                if (e.target === contactSection) contactSection.style.display = 'none';
            });
        }


    //!!--HAMBURGER MENU--!!

        const hamburger       = document.getElementById('hamburger');
        const mobileMenu      = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        function closeMobileMenu() {
            if (!hamburger || !mobileMenu) return;
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        }

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('open');
                mobileMenu.classList.toggle('open');
            });
        }
        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (!link.id && !link.classList.contains('open-contact-popup')) closeMobileMenu();
                });
            });
        }


    //!!--MOBILE SERVICES DROPDOWN--!!

        const mobileServicesItem   = document.querySelector('.mobile-services-item');
        const mobileServicesToggle = document.querySelector('.mobile-services-toggle');
        if (mobileServicesToggle) {
            mobileServicesToggle.addEventListener('click', () => mobileServicesItem.classList.toggle('open'));
        }


    //!!--FAQ ACCORDION--!!

        document.querySelectorAll('.faq-item').forEach(item => {
            const q = item.querySelector('.faq-question');
            if (!q) return;
            q.addEventListener('click', () => {
                const open = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                if (!open) item.classList.add('open');
            });
        });


    //!!--SERVICES SIDE NAV SCROLL SPY--!!

        const sideNav = document.getElementById('services-side-nav');
        if (sideNav) {
            const ssnItems = [...sideNav.querySelectorAll('.ssn-item[data-target]')];
            const sections = ['purchase-sale','title-registry','closing-services','refinancing','transfers']
                .map(id => document.getElementById(id)).filter(Boolean);

            ssnItems.forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault();
                    const t = item.dataset.target;
                    if (t === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                    else { const el = document.getElementById(t); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                });
            });

            function updateActive() {
                const mid = window.scrollY + window.innerHeight * 0.4;
                let active = null;
                sections.forEach(s => { if (s.offsetTop <= mid) active = s.id; });
                ssnItems.forEach(item => item.classList.toggle('active', item.dataset.target === active));
            }
            window.addEventListener('scroll', updateActive, { passive: true });
            updateActive();
        }

});