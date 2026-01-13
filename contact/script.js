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
});