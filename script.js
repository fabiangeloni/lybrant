document.addEventListener("DOMContentLoaded", function () {

    // =================================================================
    // BLOQUE 1: INICIALIZACIÓN DE MOTORES (OPTIMIZADO)
    // =================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Detección real de Móvil (Touch)
    // Aumentamos el umbral a 1024 para incluir tablets en modo "nativo"
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;

    let lenis;

    if (!isMobile) {
        // SOLO activamos Lenis en PC
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
        .from(".hero-content > *", { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.4");
    // Quitamos animación compleja de video en móvil si existe

    // 2.2 Tech Stack (Optimizada)
    const techBar = document.querySelector('.tech-stack-bar');
    if (techBar) {
        gsap.from(".tech-stack-bar", {
            scrollTrigger: { trigger: ".tech-stack-bar", start: "top 95%" },
            autoAlpha: 0, duration: 0.8 // Quitamos 'y' movement para fluidez
        });
        if (!isMobile) {
            // Solo animamos los logos uno a uno en PC
            gsap.from(".tech-logo", {
                scrollTrigger: { trigger: ".tech-stack-bar", start: "top 95%" },
                y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2
            });
        }
    }

    // =================================================================
    // BLOQUE 3: RESPONSIVE (SÚPER OPTIMIZADO)
    // =================================================================
    ScrollTrigger.matchMedia({
        // ESCRITORIO (FULL EXPERIENCIA)
        "(min-width: 1025px)": function () {
            // Parallax
            gsap.to(".hero-content, .hero-video", {
                yPercent: 50, ease: "none",
                scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
            });

            // Fade In Complejo
            const sections = gsap.utils.toArray('section:not(.hero-section):not(.metrics-section)');
            sections.forEach(section => {
                const elems = section.querySelectorAll('h2, .section-subtitle');
                if (elems.length > 0) gsap.from(elems, { scrollTrigger: { trigger: section, start: "top 80%" }, y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" });
            });
        },

        // MÓVIL (PERFORMANCE MODE)
        "(max-width: 1024px)": function () {
            // En móvil reducimos la cantidad de elementos animados drásticamente
            // Solo animamos los H2 principales, nada de textos pequeños o imagenes
            const sectionTitles = gsap.utils.toArray('h2');
            sectionTitles.forEach(title => {
                gsap.from(title, {
                    scrollTrigger: { trigger: title, start: "top 90%" },
                    autoAlpha: 0,
                    duration: 0.5
                    // Eliminamos el 'y' (transform) para evitar repaints costosos
                });
            });
        }
    });

    // =================================================================
    // BLOQUE 4: FUNCIONALIDADES ESPECÍFICAS
    // =================================================================

    // 4.1 Acordeón (Lógica standard)
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
                // ... lógica de imagen ...
                item.classList.add('active');
                gsap.to(item.querySelector('.acc-content'), { height: 'auto', duration: 0.6, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() });
            });
        });
    }

    // 4.2 Métricas
    // ANIMACIÓN DE NÚMEROS (Optimizada)
    document.querySelectorAll('.metric-number').forEach(counter => {
        let target = parseFloat(counter.getAttribute('data-target'));
        // Si es 0, forzamos que empiece en 0 para evitar saltos raros
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
                // Math.ceil para asegurar enteros limpios
                let num = Math.ceil(proxy.val);
                counter.innerText = prefix + num + suffix;
            }
        });
    });

    // 3D Tilt (SOLO EN ESCRITORIO - IMPORTANTE PARA MÓVIL)
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

    // Scroll Híbrido
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                if (document.body.classList.contains('nav-active')) toggleMenu();

                if (isMobile) {
                    // MÓVIL: Scroll Nativo Puro
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                } else {
                    // PC: Lenis
                    if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.5 });
                }
            }
        });
    });

    // =================================================================
    // BLOQUE FINAL: PARTÍCULAS (EL ASESINO DE RENDIMIENTO)
    // =================================================================
    // IMPORTANTE: SOLO CARGAR PARTÍCULAS SI NO ES MÓVIL
    if (!isMobile && typeof tsParticles !== 'undefined' && document.getElementById("tsparticles-background")) {
        tsParticles.load({
            id: "tsparticles-background",
            options: {
                background: { color: "transparent" },
                particles: {
                    color: { value: "#ffffff" },
                    links: { enable: true, color: "#ffffff", opacity: 0.3 },
                    move: { enable: true, speed: 0.5 }, // Velocidad baja
                    number: { value: 40 }, // Bajamos cantidad para asegurar performance
                    opacity: { value: 0.5 },
                    size: { value: { min: 1, max: 3 } }
                }
            }
        });
    }

    setTimeout(() => { ScrollTrigger.refresh(); }, 500);
});