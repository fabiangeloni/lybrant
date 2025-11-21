document.addEventListener("DOMContentLoaded", function () {

    // =================================================================
    // BLOQUE 0: CONFIGURACIÓN CRÍTICA DE PERFORMANCE
    // =================================================================
    gsap.registerPlugin(ScrollTrigger);

    // 1. Evita que ScrollTrigger recalcule todo cuando la barra del navegador 
    // se esconde/muestra en el móvil. Esto elimina el "salto".
    ScrollTrigger.config({
        ignoreMobileResize: true
    });

    // 2. Detección de Móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;

    // =================================================================
    // BLOQUE 1: INICIALIZACIÓN DE MOTORES
    // =================================================================
    let lenis = null; // Inicializamos como null explícitamente

    if (!isMobile) {
        // SOLO activamos Lenis en PC
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // =================================================================
    // BLOQUE 2: ANIMACIONES GLOBALES
    // =================================================================

    const tlIntro = gsap.timeline();
    tlIntro.from('body', { autoAlpha: 0, duration: 0.5 })
        .from('.main-header', { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, "-=0.2")
        .from(".hero-content > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.4");

    const techBar = document.querySelector('.tech-stack-bar');
    if (techBar) {
        gsap.from(".tech-stack-bar", {
            scrollTrigger: { trigger: ".tech-stack-bar", start: "top 95%" },
            autoAlpha: 0, duration: 0.8
        });
        if (!isMobile) {
            gsap.from(".tech-logo", {
                scrollTrigger: { trigger: ".tech-stack-bar", start: "top 95%" },
                y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2
            });
        }
    }

    // =================================================================
    // BLOQUE 3: RESPONSIVE
    // =================================================================
    ScrollTrigger.matchMedia({
        // ESCRITORIO
        "(min-width: 1025px)": function () {
            gsap.to(".hero-content, .hero-video", {
                yPercent: 50, ease: "none",
                scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
            });

            const sections = gsap.utils.toArray('section:not(.hero-section):not(.metrics-section)');
            sections.forEach(section => {
                const elems = section.querySelectorAll('h2, .section-subtitle');
                if (elems.length > 0) gsap.from(elems, { scrollTrigger: { trigger: section, start: "top 80%" }, y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" });
            });
        },

        // MÓVIL
        "(max-width: 1024px)": function () {
            // Animación muy ligera para móvil
            const sectionTitles = gsap.utils.toArray('h2');
            sectionTitles.forEach(title => {
                gsap.from(title, {
                    scrollTrigger: { trigger: title, start: "top 90%" },
                    autoAlpha: 0,
                    duration: 0.5
                });
            });
        }
    });

    // =================================================================
    // BLOQUE 4: FUNCIONALIDADES ESPECÍFICAS
    // =================================================================

    // 4.1 Acordeón
    const accItems = document.querySelectorAll('.acc-item');
    const featureImages = document.querySelectorAll('.feature-img');
    if (accItems.length > 0) {
        gsap.set(accItems[0].querySelector('.acc-content'), { height: 'auto' });
        if (featureImages[0]) gsap.set(featureImages[0], { autoAlpha: 1, scale: 1 });
        accItems.forEach((item, index) => {
            item.querySelector('.acc-header').addEventListener('click', () => {
                if (item.classList.contains('active')) return;
                const activeItem = document.querySelector('.acc-item.active');
                if (activeItem) {
                    activeItem.classList.remove('active');
                    gsap.to(activeItem.querySelector('.acc-content'), { height: 0, duration: 0.4 });
                }
                item.classList.add('active');
                gsap.to(item.querySelector('.acc-content'), { height: 'auto', duration: 0.6, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() });
            });
        });
    }

    // 4.2 Métricas
    document.querySelectorAll('.metric-number').forEach(counter => {
        let target = parseFloat(counter.getAttribute('data-target'));
        let startVal = (target === 0) ? 0 : 0;
        let proxy = { val: startVal };

        gsap.to(proxy, {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: { trigger: ".metrics-section", start: "top 85%" },
            onUpdate: () => {
                let prefix = counter.getAttribute('data-prefix') || '';
                let suffix = counter.getAttribute('data-suffix') || '';
                let num = Math.ceil(proxy.val);
                counter.innerText = prefix + num + suffix;
            }
        });
    });

    // 3D Tilt (Solo Desktop)
    if (!isMobile) {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            gsap.set(card, { transformPerspective: 1000, transformStyle: "preserve-3d" });
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
                const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
                gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.05, duration: 0.1 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
            });
        });
    }

    // =================================================================
    // BLOQUE 5: UI & NAVEGACIÓN
    // =================================================================
    const navToggle = document.querySelector('.nav-toggle');
    function toggleMenu() {
        document.body.classList.toggle('nav-active');
        document.querySelector('.main-nav').classList.toggle('is-active');
        document.querySelector('.nav-overlay').classList.toggle('is-active');
        navToggle.classList.toggle('is-active');
    }
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
        document.querySelector('.nav-overlay').addEventListener('click', toggleMenu);
    }

    // Scroll Híbrido en Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                if (document.body.classList.contains('nav-active')) toggleMenu();

                if (isMobile) {
                    // MÓVIL: Cálculo manual + window.scrollTo
                    // Esto es más ligero que usar scrollIntoView en algunos móviles viejos
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                } else {
                    // PC: Lenis
                    if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.5 });
                }
            }
        });
    });

    // =================================================================
    // BLOQUE FINAL
    // =================================================================
    if (!isMobile && typeof tsParticles !== 'undefined' && document.getElementById("tsparticles-background")) {
        tsParticles.load({
            id: "tsparticles-background",
            options: {
                background: { color: "transparent" },
                particles: {
                    color: { value: "#ffffff" },
                    links: { enable: true, color: "#ffffff", opacity: 0.3 },
                    move: { enable: true, speed: 0.5 },
                    number: { value: 40 },
                    opacity: { value: 0.5 },
                    size: { value: { min: 1, max: 3 } }
                }
            }
        });
    }

    setTimeout(() => { ScrollTrigger.refresh(); }, 500);
});