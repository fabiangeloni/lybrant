document.addEventListener("DOMContentLoaded", function() {

    // --- 1. REGISTRAR PLUGINS DE GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. CONFIGURACIÓN DE SCROLL SUAVE (LENIS) + INTEGRACIÓN GSAP ---
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1500);
    });
    gsap.ticker.lagSmoothing(0);


    // --- 3. LÓGICA DE SEGMENTACIÓN (INTERACTIVA) ---
    const cards = document.querySelectorAll(".card");
    const panels = document.querySelectorAll(".content-panel");
    const generalPanel = document.getElementById("general");
    const contentSection = document.querySelector('.content-section');
    let currentActivePanel = generalPanel;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const targetId = card.dataset.target;
            const targetPanel = document.getElementById(targetId);

            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            if (targetPanel === currentActivePanel) return;

            gsap.to(currentActivePanel, {
                duration: 0.5,
                height: 0,
                autoAlpha: 0,
                ease: "power3.inOut"
            });

            gsap.fromTo(targetPanel, 
                { height: 0, autoAlpha: 0 },
                { 
                    duration: 0.8,
                    height: "auto",
                    autoAlpha: 1,
                    delay: 0.3,
                    ease: "power3.out"
                }
            );

            currentActivePanel = targetPanel;
            
            lenis.scrollTo(contentSection, {
                offset: -180, // Ajustado a tu altura de header
                duration: 1.2,
                ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });


    // --- 4. ANIMACIONES DE SCROLL (BARRIDO HORIZONTAL + RESPONSIVE) ---
    
    // 4.1. Animación General de Carga (Esto corre en AMBOS, desktop y móvil)
    gsap.from('body', { duration: 0.5, autoAlpha: 0, ease: 'power3.out' });
    gsap.from('.main-header', { duration: 1, yPercent: -100, autoAlpha: 0, ease: 'power3.out', delay: 0.1 });
    gsap.from(".hero-content > *", { 
        duration: 1.2,
        y: 30,
        autoAlpha: 0,
        stagger: 0.1, 
        delay: 0.4,
        ease: "power3.out"
    });

    // ==================================
    //     INICIO DEL BLOQUE NUEVO
    // ==================================
    // Animación para el video del Hero
    gsap.from(".hero-video", {
        duration: 1.2,
        x: 50, // Lo movemos 50px a la derecha (animará hacia la izquierda)
        autoAlpha: 0,
        delay: 0.6, // Un poco después de que empiece el texto
        ease: "power3.out"
    });
    // ==================================
    //       FIN DEL BLOQUE NUEVO
    // ==================================


   // --- COPIA Y REEMPLAZA DESDE AQUÍ ---

    // 4.2. Animación "Weave" (Alternancia Horizontal)
    const sections = gsap.utils.toArray('main > section:not(.hero-section)');

    ScrollTrigger.matchMedia({

        // 1. Configuración para DESKTOP (SÍ corre la animación "weave" horizontal)
        "(min-width: 993px)": function() {
            sections.forEach((section, index) => {
                const heading = section.querySelector('h2');
                const subtitle = section.querySelector('.section-subtitle');
                const content = section.querySelectorAll('.splide, .cards-container, .content-panel#general, .process-grid, .service-list, .pre-footer-container, .main-footer .container');

                // Animación Horizontal (la que ya tenías)
                const xPercent = (index % 2 === 0) ? -50 : 50;
                
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%', 
                        toggleActions: 'play none none none'
                    }
                });
                
                if (heading) tl.from(heading, { autoAlpha: 0, xPercent: xPercent, duration: 1.2, ease: 'power3.out' });
                if (subtitle) tl.from(subtitle, { autoAlpha: 0, xPercent: xPercent, duration: 1.2, ease: 'power3.out' }, "-=1.0");
                if (content) tl.from(content, { autoAlpha: 0, xPercent: xPercent, duration: 1.2, ease: 'power3.out' }, "-=0.9");
            });
        },

        // 2. Configuración para MÓVIL (NUEVA Animación "Fade-In" vertical)
        "(max-width: 992px)": function() {
            
            // ¡Este es el bloque que antes estaba vacío!
            // Ahora creamos una animación vertical simple.
            
            sections.forEach((section) => {
                // Seleccionamos todos los elementos que queremos animar DENTRO de la sección
                const elementsToAnimate = section.querySelectorAll('h2, .section-subtitle, .splide, .card, .process-card, .service-item, .pre-footer-container h2, .pre-footer-container .subtitle, .main-footer p');
                
                if (elementsToAnimate.length === 0) return;

                // Creamos la animación
                gsap.from(elementsToAnimate, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%', // Empezar un poco después en móvil
                        toggleActions: 'play none none none'
                    },
                    autoAlpha: 0, // Opacidad y visibility
                    y: 40,        // Mover 40px hacia abajo (animará hacia arriba)
                    duration: 0.8,
                    stagger: 0.1, // Pequeño retraso entre cada elemento
                    ease: 'power3.out'
                });
            });
        }
    });

// --- HASTA AQUÍ ---

    
    // --- 5. SLIDER DE TESTIMONIOS (Splide.js) ---
    if (typeof Splide !== 'undefined') {
        new Splide('#testimonial-slider', {
            type   : 'loop',
            perPage: 2,
            perMove: 1,
            gap    : '30px',
            pagination: true,
            arrows: true,
            breakpoints: {
                992: { perPage: 1 },
                600: { perPage: 1, arrows: false }
            }
        }).mount();
    }

    // --- 6. NAVEGACIÓN MÓVIL ---
   // --- COPIA Y REEMPLAZA TODA LA SECCIÓN 6 CON ESTO ---

    // --- 6. NAVEGACIÓN MÓVIL ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.main-nav a'); // Seleccionamos TODOS los links
    const body = document.body;

    function openMenu() {
        navToggle.classList.add('is-active');
        mainNav.classList.add('is-active');
        navOverlay.classList.add('is-active');
        body.classList.add('nav-active');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        navToggle.classList.remove('is-active');
        mainNav.classList.remove('is-active');
        navOverlay.classList.remove('is-active');
        body.classList.remove('nav-active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Lógica para abrir/cerrar con el botón
    navToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Lógica para cerrar con el overlay
    navOverlay.addEventListener('click', closeMenu);

    // --- ESTA ES LA PARTE NUEVA Y CORREGIDA ---
    // Lógica inteligente para los links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            
            // Obtenemos el destino (href) del link en el que se hizo clic
            const href = this.getAttribute('href');

            // ----------------------------------------------------
            // CASO A: Es un link de ancla (href="#")
            // (como "Servicios", "Nosotros", "Consultar")
            // ----------------------------------------------------
            if (href === '#') {
                // 1. Prevenimos que la página salte al inicio
                event.preventDefault();
                // 2. Simplemente cerramos el menú
                closeMenu();
            } 
            
            // ----------------------------------------------------
            // CASO B: Es un link que navega a OTRA página
            // (como "index.html" o "index-en.html")
            // ----------------------------------------------------
            else {
                // 1. Prevenimos la navegación INMEDIATA
                event.preventDefault();
                
                // Guardamos la URL a la que queremos ir
                const destination = href;

                // 2. Cerramos el menú
                closeMenu();

                // 3. ESPERAMOS a que la animación de cierre termine
                //    (Tu CSS dice que la transición dura 0.4s = 400ms)
                //    y SÓLO ENTONCES navegamos a la nueva página.
                setTimeout(() => {
                    window.location.href = destination;
                }, 400); 
            }
        });
    });

// --- HASTA AQUÍ EL REEMPLAZO ---

});