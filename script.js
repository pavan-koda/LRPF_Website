document.addEventListener('DOMContentLoaded', () => {
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