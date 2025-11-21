document.addEventListener("DOMContentLoaded", function () {

    // =================================================================
    // BLOQUE 0: CONFIGURACIÓN CRÍTICA (PERFORMANCE MÓVIL)
    // =================================================================
    gsap.registerPlugin(ScrollTrigger);

    // 1. ESTO ARREGLA EL SCROLL "RARO" EN MÓVIL
    // Evita que GSAP recalcule todo cuando la barra de dirección del navegador se mueve.
    ScrollTrigger.config({
        ignoreMobileResize: true
    });

    // 2. Detección robusta de móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 993;

    // =================================================================
    // BLOQUE 1: INICIALIZACIÓN DE MOTORES
    // =================================================================

    let lenis; // Declaramos fuera para usarla luego

    if (!isMobile) {
        // SOLO activamos Lenis en PC (Scroll Cinematográfico)
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        // Conexión Lenis <-> ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // =================================================================
    // BLOQUE 2: ANIMACIONES GLOBALES
    // =================================================================

    // 2.1 Intro
    const tlIntro = gsap.timeline();
    tlIntro.from('body', { autoAlpha: 0, duration: 0.5 })
        .from('.main-header', { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, "-=0.2")
        .from(".hero-content > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.4")
        .from(".hero-video", { x: 50, autoAlpha: 0, duration: 1, ease: "power3.out" }, "-=0.8");

    // 2.2 Tech Stack
    const techBar = document.querySelector('.tech-stack-bar');
    if (techBar) {
        gsap.from(".tech-stack-bar", {
            scrollTrigger: { trigger: ".tech-stack-bar", start: "top 95%" },
            y: 20, opacity: 0, duration: 0.8, ease: "power2.out"
        });
        // En móvil animamos el bloque entero, en PC logo por logo
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
        "(min-width: 993px)": function () {
            // Parallax
            gsap.to(".hero-content, .hero-video", {
                yPercent: 50, ease: "none",
                scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
            });

            // Sticky Process
            const panels = gsap.utils.toArray(".process-panel");
            if (panels.length > 0) {
                panels.forEach((panel, i) => {
                    if (i === 0) return;
                    const prevCard = panels[i - 1].querySelector(".process-card");
                    ScrollTrigger.create({
                        trigger: panel, start: "top bottom", end: "top top", scrub: true,
                        onUpdate: (self) => {
                            if (prevCard) gsap.to(prevCard, { scale: 1 - (self.progress * 0.1), opacity: 1 - (self.progress * 0.3), overwrite: 'auto', duration: 0.1 });
                        }
                    });
                });
            }

            // Fade In General
            const sections = gsap.utils.toArray('section:not(.hero-section):not(.process-sticky-container):not(.metrics-section):not(.services-section)');
            sections.forEach(section => {
                const elems = section.querySelectorAll('h2, .section-subtitle');
                if (elems.length > 0) gsap.from(elems, { scrollTrigger: { trigger: section, start: "top 80%" }, y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" });
            });
        },
        // MÓVIL
        "(max-width: 992px)": function () {
            const allSections = gsap.utils.toArray('main > section');
            allSections.forEach(section => {
                const elementsToAnimate = section.querySelectorAll('h2, .section-subtitle, .card, img');
                if (elementsToAnimate.length > 0) gsap.from(elementsToAnimate, { scrollTrigger: { trigger: section, start: "top 85%" }, y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.6 });
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
                const activeImg = document.querySelector('.feature-img.active');
                if (activeImg) {
                    activeImg.classList.remove('active');
                    gsap.to(activeImg, { autoAlpha: 0, scale: 1.05, duration: 0.4 });
                }
                item.classList.add('active');
                gsap.to(item.querySelector('.acc-content'), { height: 'auto', duration: 0.6, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() });
                const nextImg = featureImages[index];
                if (nextImg) {
                    nextImg.classList.add('active');
                    gsap.fromTo(nextImg, { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 0.6 });
                }
            });
        });
    }

    // 4.2 Métricas
    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        const metricCards = document.querySelectorAll('.metric-card');

        // Entrada
        gsap.from(metricCards, {
            scrollTrigger: { trigger: ".metrics-section", start: "top 85%", toggleActions: "play none none none" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)"
        });

        // Contadores
        document.querySelectorAll('.metric-number').forEach(counter => {
            let target = parseFloat(counter.getAttribute('data-target'));
            let proxy = { val: (target === 0) ? 10 : 0 };
            gsap.to(proxy, {
                val: target, duration: 2, ease: "power2.out",
                scrollTrigger: { trigger: ".metrics-section", start: "top 85%" },
                onUpdate: () => {
                    let decimals = counter.getAttribute('data-decimals') ? 1 : 0;
                    let prefix = counter.getAttribute('data-prefix') || '';
                    let suffix = counter.getAttribute('data-suffix') || '';
                    let num = proxy.val.toFixed(decimals);
                    if (num.endsWith('.0')) num = parseInt(num);
                    counter.innerText = prefix + num + suffix;
                }
            });
        });

        // 3D Tilt (SOLO ESCRITORIO - CRÍTICO PARA PERFORMANCE MÓVIL)
        if (!isMobile) {
            metricCards.forEach(card => {
                gsap.set(card, { transformPerspective: 1000, transformStyle: "preserve-3d" });
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
                    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
                    gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.05, duration: 0.1, ease: "power1.out", overwrite: "auto" });
                    const shine = card.querySelector('.card-shine');
                    if (shine) shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%)`;
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
                });
            });
        }
    }

    // 4.3 Servicios Focus Reveal (ESTO FALTABA ANTES)
    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length > 0) {
        serviceItems.forEach((item) => {
            ScrollTrigger.create({
                trigger: item, start: "top 70%", end: "bottom 30%",
                onEnter: () => item.classList.add('active'),
                onLeave: () => item.classList.remove('active'),
                onEnterBack: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active')
            });
        });
    }

    // 4.4 Equipo
    const teamWrapper = document.querySelector('.team-spotlight-wrapper');
    if (teamWrapper) {
        const cards = teamWrapper.querySelectorAll('.team-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => {
                    if (c === card) {
                        gsap.to(c, { scale: 1.05, opacity: 1, filter: 'blur(0px)', duration: 0.4 });
                        gsap.to(c.querySelector('.img-gradient-ring'), { scale: 1.1, opacity: 1, duration: 0.4 });
                    } else {
                        gsap.to(c, { scale: 0.95, opacity: 0.5, filter: 'blur(4px)', duration: 0.4 });
                        gsap.to(c.querySelector('.img-gradient-ring'), { scale: 1, opacity: 0.5, duration: 0.4 });
                    }
                });
            });
        });
        teamWrapper.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                gsap.to(c, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.4 });
                gsap.to(c.querySelector('.img-gradient-ring'), { scale: 1, opacity: 0.8, duration: 0.4 });
            });
        });
    }

    // =================================================================
    // BLOQUE 5: UI & NAVEGACIÓN (SISTEMA HÍBRIDO)
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

    // Scroll Híbrido Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);

            if (target) {
                if (document.body.classList.contains('nav-active')) toggleMenu();

                // Si es móvil, usamos scroll nativo para máxima fluidez
                if (isMobile) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                } else {
                    // Si es PC, usamos Lenis
                    if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.5 });
                }
            }
        });
    });

    // Partículas (SOLO PC)
    // Desactivamos en móvil para ganar FPS en el scroll
    if (!isMobile && typeof tsParticles !== 'undefined' && document.getElementById("tsparticles-background")) {
        tsParticles.load({
            id: "tsparticles-background",
            options: {
                background: { color: "transparent" },
                particles: {
                    color: { value: "#ffffff" },
                    links: { enable: true, color: "#ffffff", opacity: 0.3 },
                    move: { enable: true, speed: 0.5 },
                    number: { value: 60 },
                    opacity: { value: 0.5 },
                    size: { value: { min: 1, max: 3 } }
                }
            }
        });
    }

    setTimeout(() => { ScrollTrigger.refresh(); }, 500);
});