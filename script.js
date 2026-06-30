// Dark Mode Toggle Functionality
function initTheme() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-mode');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            darkModeToggle.classList.add('mode-switching');
            body.classList.add('mode-switching');

            setTimeout(() => {
                body.classList.toggle('dark-mode');

                if (body.classList.contains('dark-mode')) {
                    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                    localStorage.setItem('theme', 'dark');
                } else {
                    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                    localStorage.setItem('theme', 'light');
                }

                setTimeout(() => {
                    darkModeToggle.classList.remove('mode-switching');
                    body.classList.remove('mode-switching');
                }, 600);
            }, 10);
        });
    }
}

// Competition Read More Toggle
function initCompetitionsReadMore() {
    const compReadMoreBtn = document.getElementById("compReadMoreBtn");
    const moreCompetitions = document.getElementById("more-competitions");

    if (compReadMoreBtn && moreCompetitions) {
        compReadMoreBtn.addEventListener("click", function () {
            moreCompetitions.classList.toggle("show");
            if (moreCompetitions.classList.contains("show")) {
                compReadMoreBtn.innerHTML = "<i class='fas fa-chevron-up'></i> Show Less Participation";
            } else {
                compReadMoreBtn.innerHTML = "<i class='fas fa-chevron-down'></i> Show More Participation";
            }
        });
    }
}

// Scroll Animations (Intersection Observer)
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

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
}

// Active Nav Link Coloring
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Certifications Tab Toggling
function initCertificationsTabs() {
    const tabButtons = document.querySelectorAll('.cert-tab-btn');
    const panels = document.querySelectorAll('.cert-panel');

    if (tabButtons.length > 0 && panels.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                // Get target panel id and activate it
                const targetId = this.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCompetitionsReadMore();
    initScrollAnimations();
    initMobileNav();
    setActiveNavLink();
    initCertificationsTabs();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
