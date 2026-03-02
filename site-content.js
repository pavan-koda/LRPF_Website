/**
 * site-content.js
 * Loads saved content from localStorage and applies it to the page.
 * Include this script in every page to enable admin-managed content.
 */
(function () {
    'use strict';
    var P = 'lrpf_';

    function g(key) {
        return localStorage.getItem(P + key);
    }

    function apply() {
        // --- Logo (all header logo images + favicon) ---
        var logo = g('logo');
        if (logo) {
            document.querySelectorAll('header .logo img').forEach(function (el) {
                el.src = logo;
            });
            var fav = document.querySelector('link[rel="icon"]');
            if (fav) fav.href = logo;
        }

        // --- About page logo (separate or same as logo) ---
        var aboutLogo = g('about_logo') || logo;
        if (aboutLogo) {
            document.querySelectorAll('.about-page-logo').forEach(function (el) {
                el.src = aboutLogo;
            });
        }

        // --- Banner carousel slides ---
        var heroSlidesEl = document.getElementById('hero-slides');
        if (heroSlidesEl) {
            var bannersData = g('banners');
            if (bannersData) {
                try {
                    var banners = JSON.parse(bannersData);
                    if (banners && banners.length) {
                        heroSlidesEl.innerHTML = banners.map(function(b) {
                            return '<div class="hero-slide" style="background-image:url(\'' +
                                escHtml(b.src) + '\')"></div>';
                        }).join('');
                    }
                } catch (e) { /* keep default slide */ }
            } else {
                // Backward compat: single hero_bg key
                var heroBg = g('hero_bg');
                if (heroBg) {
                    var firstSlide = heroSlidesEl.querySelector('.hero-slide');
                    if (firstSlide) {
                        firstSlide.style.backgroundImage = 'url("' + heroBg + '")';
                    }
                }
            }
        }

        // --- Text / HTML / src content by data-key attribute ---
        document.querySelectorAll('[data-key]').forEach(function (el) {
            var key = el.getAttribute('data-key');
            var val = g(key);
            if (val === null || val === '') return;
            var type = el.getAttribute('data-key-type') || 'text';
            if (type === 'html') {
                el.innerHTML = val;
            } else if (type === 'src') {
                el.src = val;
            } else {
                el.textContent = val;
            }
        });

        // --- Gallery items (gallery.html) ---
        var galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            var gd = g('gallery');
            if (gd) {
                try {
                    var items = JSON.parse(gd);
                    if (items && items.length) {
                        galleryGrid.innerHTML = items.map(function (item) {
                            return '<div class="gallery-item">' +
                                '<img src="' + escHtml(item.src) + '" alt="' + escHtml(item.caption) + '">' +
                                '<div class="gallery-caption">' + escHtml(item.caption) + '</div>' +
                                '</div>';
                        }).join('');
                    }
                } catch (e) { /* keep defaults */ }
            }
        }

        // --- Global email ---
        var email = g('email');
        if (email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
                el.href = 'mailto:' + email;
                if (el.textContent.indexOf('@') !== -1) {
                    el.textContent = email;
                }
            });
        }

        // --- Social links (matched by title attribute) ---
        var socialKeys = [
            ['social_twitter',  'Twitter'],
            ['social_facebook', 'Facebook'],
            ['social_threads',  'Threads'],
            ['social_youtube',  'YouTube']
        ];
        socialKeys.forEach(function (pair) {
            var val = g(pair[0]);
            if (!val) return;
            document.querySelectorAll('a[title*="' + pair[1] + '"]').forEach(function (el) {
                el.href = val;
            });
        });
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    } else {
        apply();
    }
})();
