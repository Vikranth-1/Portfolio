// --- Theme Management ---
function initTheme() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    // Determine initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

    const setTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (darkModeToggle) {
            if (theme === 'dark') {
                darkModeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
                darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
                darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
            }
        }
    };

    setTheme(initialTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            const isDark = html.getAttribute('data-theme') === 'dark';
            
            darkModeToggle.classList.add('mode-switching');
            
            setTimeout(() => {
                setTheme(isDark ? 'light' : 'dark');
                setTimeout(() => {
                    darkModeToggle.classList.remove('mode-switching');
                }, 600);
            }, 10);
        });
    }

    // Sync with system preferences if no saved theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// --- Global Hotkeys ---
function initGlobalHotkeys() {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // T for Theme
        if (e.key.toLowerCase() === 't') {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            html.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                if (isDark) {
                    darkModeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
                    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
                } else {
                    darkModeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
                    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
                }
            }
        }
        
        // R for Resume
        if (e.key.toLowerCase() === 'r') {
            const resumeBtn = document.querySelector('.btn-resume, a[href*="resume"]');
            if (resumeBtn && resumeBtn.href) {
                window.open(resumeBtn.href, '_blank');
            }
        }
    });
}

// --- Inline PDF Preview Logic ---
function initInlinePdfPreview() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-preview-inline');
        if (!btn) return;
        
        e.preventDefault();
        
        const card = btn.closest('.cert-card, .prize-card, .participation-card');
        if (!card) return;
        
        const container = card.querySelector('.pdf-preview-container');
        if (!container) return;
        
        const pdfUrl = btn.getAttribute('data-pdf');
        const isShowing = container.hasChildNodes();
        
        if (isShowing) {
            // Toggle off
            container.innerHTML = '';
            btn.innerHTML = '<i class="fas fa-eye" aria-hidden="true"></i> <span class="btn-text">Preview</span>';
        } else {
            // Toggle on
            container.innerHTML = `<iframe src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0" style="width: 100%; height: 400px; border: 1px solid var(--glass-border); border-radius: 8px; margin-top: 15px;" title="PDF Preview"></iframe>`;
            btn.innerHTML = '<i class="fas fa-eye-slash" aria-hidden="true"></i> <span class="btn-text">Close Preview</span>';
        }
    });
}

// --- Project Category Filter ---
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectTiles = document.querySelectorAll('.project-tile');

    if (filterBtns.length === 0 || projectTiles.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter logic
            const filterValue = btn.getAttribute('data-filter');
            
            projectTiles.forEach(tile => {
                const category = tile.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    tile.style.display = 'block';
                    setTimeout(() => { tile.style.opacity = '1'; }, 50);
                } else {
                    tile.style.opacity = '0';
                    setTimeout(() => { tile.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

// --- Mouse Tracking Radial Glow ---
function initMouseTrackingGlow() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.card-hover-glow');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// --- Miscellaneous Utilities ---
function initFooterYear() {
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
}

function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Toggle menu navigation');
        hamburger.setAttribute('role', 'button');

        hamburger.addEventListener('click', function () {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }));
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGlobalHotkeys();
    initInlinePdfPreview();
    initProjectFilters();
    initMouseTrackingGlow();
    initFooterYear();
    initScrollAnimations();
    initMobileNav();
    setActiveNavLink();
});
