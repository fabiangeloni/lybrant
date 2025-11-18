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
    // (Tu código original - Está perfecto)
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
                offset: -180,
                duration: 1.2,
                ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });


    // --- 4. ANIMACIONES DE SCROLL ---
    
    // 4.1. Animación General de Carga
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

    gsap.from(".hero-video", {
        duration: 1.2,
        x: 50,
        autoAlpha: 0,
        delay: 0.6,
        ease: "power3.out"
    });
    
    // 4.2. Animaciones por Media Query
    
    ScrollTrigger.matchMedia({

        // ======================================================
        // 1. Configuración para DESKTOP (993px en adelante)
        // ======================================================
        "(min-width: 993px)": function() {
            
            // --- A) Animación simple de Fade-In para las secciones viejas ---
            // (Eliminamos la animación "Weave" que causaba conflictos)
            const sections = gsap.utils.toArray('main > section:not(.hero-section, .process-sticky-container)');
            sections.forEach((section) => {
                const elements = section.querySelectorAll('h2, .section-subtitle, .splide, .cards-container, .content-panel#general, .service-list, .pre-footer-container, .main-footer .container');
                if (elements.length === 0) return;
                
                gsap.from(elements, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%', 
                        toggleActions: 'play none none none'
                    },
                    autoAlpha: 0,
                    y: 30,
                    stagger: 0.05,
                    duration: 1,
                    ease: 'power3.out'
                });
            });


            // ===================================================================
            // --- B) SCRIPT STICKY STACK (V7 - Arquitectura Correcta) ---
            // ===================================================================
            
            const stickyPanels = gsap.utils.toArray(".process-panel");
            const allCards = stickyPanels.map(panel => panel.querySelector(".process-card"));

            if (allCards.length) {
                
                // NO NECESITAMOS 'gsap.set'.
                // Todas las tarjetas están visibles por defecto.
                // El CSS ('position: sticky') hace que el panel 2 tape al 1,
                // el 3 al 2, etc.

                // 1. Recorremos los paneles (empezando por el 2do, índice 1)
                stickyPanels.forEach((panel, i) => {
                    
                    if (i === 0) return; // Saltamos el primer panel

                    // Esta es la tarjeta que se quedará ATRÁS
                    const prevCard = allCards[i - 1]; 

                    // 2. Creamos un ScrollTrigger que se activa cuando el panel
                    // que ENTRA (el 'panel') empieza a tapar al anterior.
                    ScrollTrigger.create({
                        trigger: panel,      // El trigger es el panel que entra (2, 3, 4)
                        start: "top bottom", // Cuando el 'top' de este panel toca el 'bottom' de la ventana
                        end: "top top",      // Cuando el 'top' de este panel toca el 'top' de la ventana
                        scrub: 0.5,          // Suavidad
                        
                        // markers: true,    // Descomenta esto para ver las guías
                        // id: `panel-out-${i}`,

                        // 3. En cada update del scroll, animamos la tarjeta ANTERIOR
                        onUpdate: (self) => {
                            // self.progress va de 0 a 1
                            
                            // Escala: de 1 a 0.9
                            let scale = 1 - (self.progress * 0.1); 
                            // Opacidad: de 1 a 0.7
                            let opacity = 1 ;
                            
                            // Usamos gsap.to() para aplicar esto con suavidad
                            gsap.to(prevCard, {
                                scale: scale,
                                autoAlpha: opacity,
                                ease: "none",
                                duration: 0.05 // Un 'duration' bajo lo hace instantáneo al scrub
                            });
                        }
                    });
                });
            } // fin del if(allCards.length)

        }, // --- FIN de (min-width: 993px) ---

        // ======================================================
        // 2. Configuración para MÓVIL (992px hacia abajo)
        // ======================================================
        "(max-width: 992px)": function() {
            
            // En móvil, animamos todo con un fade-in simple
            const allSections = gsap.utils.toArray('main > section'); 
            
            allSections.forEach((section) => {
                const elementsToAnimate = section.querySelectorAll('h2, .section-subtitle, .splide, .card, .process-card, .service-item, .pre-footer-container h2, .pre-footer-container .subtitle, .main-footer p');
                
                if (elementsToAnimate.length === 0) return;

                gsap.from(elementsToAnimate, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    autoAlpha: 0,
                    y: 40,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            });
        } // --- FIN de (max-width: 992px) ---
    }); // --- FIN de ScrollTrigger.matchMedia ---

    
    // --- 5. SLIDER DE TESTIMONIOS (Splide.js) ---
    // (Tu código original - Está perfecto)
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
    // (Tu código original - Está perfecto)
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.main-nav a');
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

    navToggle.addEventListener('click', () => {
        if (mainNav.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            
            const href = this.getAttribute('href');

            if (href === '#') {
                event.preventDefault();
                closeMenu();
            } 
            else {
                event.preventDefault();
                const destination = href;
                closeMenu();
                setTimeout(() => {
                    window.location.href = destination;
                }, 400); 
            }
        });
    });

});