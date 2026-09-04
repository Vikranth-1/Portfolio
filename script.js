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

// --- Modal PDF Preview Logic ---
function initInlinePdfPreview() {
    // Create modal if it doesn't exist
    if (!document.getElementById('pdf-modal')) {
        const modalHtml = `
            <div id="pdf-modal" class="pdf-modal" aria-hidden="true">
                <div class="pdf-modal-content">
                    <div class="pdf-modal-header">
                        <h3 id="pdf-modal-title">Certificate Preview</h3>
                        <button id="pdf-modal-close" class="pdf-modal-close" aria-label="Close Preview">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="pdf-modal-body">
                        <iframe id="pdf-modal-iframe" src="" title="PDF Preview" frameborder="0"></iframe>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('pdf-modal');
        const closeBtn = document.getElementById('pdf-modal-close');

        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.getElementById('pdf-modal-iframe').src = ''; // clear iframe
            document.body.style.overflow = ''; // restore scrolling
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-preview-inline');
        if (!btn) return;
        
        const pdfUrl = btn.getAttribute('data-pdf');
        if (!pdfUrl) return; // Allow normal link behavior if no data-pdf
        
        e.preventDefault();
        
        const card = btn.closest('.cert-card, .prize-card, .participation-card');
        if (!card) return;
        
        const titleElement = card.querySelector('h3');
        const titleText = titleElement ? titleElement.innerText : 'Certificate Preview';
        
        const modal = document.getElementById('pdf-modal');
        const iframe = document.getElementById('pdf-modal-iframe');
        const modalTitle = document.getElementById('pdf-modal-title');
        
        modalTitle.innerText = titleText;
        iframe.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
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
