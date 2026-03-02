document.addEventListener('DOMContentLoaded', () => {
    // ===== Hero Banner Carousel =====
    const slidesContainer = document.getElementById('hero-slides');
    if (slidesContainer) {
        const dotsContainer = document.getElementById('hero-dots');
        const prevBtn = document.getElementById('hero-prev');
        const nextBtn = document.getElementById('hero-next');
        const heroSection = document.getElementById('hero-section');
        let current = 0;
        let autoplayTimer = null;

        function getSlides() {
            return Array.from(slidesContainer.querySelectorAll('.hero-slide'));
        }

        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const slides = getSlides();
            const single = slides.length <= 1;
            dotsContainer.style.display = single ? 'none' : '';
            if (prevBtn) prevBtn.style.display = single ? 'none' : '';
            if (nextBtn) nextBtn.style.display = single ? 'none' : '';
            slides.forEach(function(_, i) {
                const dot = document.createElement('button');
                dot.className = 'hero-dot' + (i === current ? ' active' : '');
                dot.setAttribute('aria-label', 'Slide ' + (i + 1));
                dot.addEventListener('click', function() { goTo(i); resetAutoplay(); });
                dotsContainer.appendChild(dot);
            });
        }

        function goTo(n) {
            const slides = getSlides();
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
            if (!slides.length) return;
            if (slides[current]) slides[current].classList.remove('active');
            if (dots[current]) dots[current].classList.remove('active');
            current = ((n % slides.length) + slides.length) % slides.length;
            if (slides[current]) slides[current].classList.add('active');
            if (dots[current]) dots[current].classList.add('active');
        }

        function startAutoplay() {
            if (getSlides().length <= 1) return;
            autoplayTimer = setInterval(function() { goTo(current + 1); }, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        // Init
        buildDots();
        goTo(0);
        startAutoplay();

        // Arrow buttons
        if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); resetAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); resetAutoplay(); });

        // Pause on hover, resume on leave
        if (heroSection) {
            heroSection.addEventListener('mouseenter', function() { clearInterval(autoplayTimer); });
            heroSection.addEventListener('mouseleave', startAutoplay);
        }

        // Touch swipe support
        let touchStartX = 0;
        if (heroSection) {
            heroSection.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroSection.addEventListener('touchend', function(e) {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 40) {
                    goTo(diff > 0 ? current + 1 : current - 1);
                    resetAutoplay();
                }
            }, { passive: true });
        }
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Interactive Cards (Our Work)
    document.querySelectorAll('.card.interactive').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });

    // Mobile Social Sidebar Toggle
    const socialSidebar = document.querySelector('.social-sidebar');
    if (socialSidebar) {
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'social-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        socialSidebar.prepend(toggleBtn);

        let closeTimeout;

        // Function to open sidebar and set auto-close timer
        const openSidebar = () => {
            socialSidebar.classList.add('visible');
            if (closeTimeout) clearTimeout(closeTimeout);
            closeTimeout = setTimeout(() => {
                socialSidebar.classList.remove('visible');
            }, 5000);
        };

        // Function to close sidebar
        const closeSidebar = () => {
            socialSidebar.classList.remove('visible');
            if (closeTimeout) clearTimeout(closeTimeout);
        };

        // Open initially on load
        openSidebar();

        toggleBtn.addEventListener('click', () => {
            openSidebar();
        });

        // Swipe Detection
        let touchStartX = 0;
        let touchEndX = 0;

        socialSidebar.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive: true});
        socialSidebar.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 30) closeSidebar(); // Swipe Left to Close
            if (touchEndX - touchStartX > 30) openSidebar();  // Swipe Right to Open
        }, {passive: true});
    }
});