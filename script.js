gsap.registerPlugin(ScrollTrigger);

// 1. Loader
window.addEventListener('load', () => {
    gsap.to("#loader", {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => document.getElementById("loader").style.display = "none"
    });
});

// 2. Animación Hero
const heroTl = gsap.timeline();
heroTl.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "expo.out"
})
.from(".tag", { scale: 0, opacity: 0, duration: 0.8 }, "-=0.8")
.from("p", { y: 30, opacity: 0, duration: 1 }, "-=0.5");

// 3. Animación de Locales (Cards)
gsap.from(".local-card", {
    scrollTrigger: {
        trigger: "#locales",
        start: "top 70%",
    },
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: "power4.out"
});

// 4. Parallax Sutil en el fondo
gsap.to(".pattern-overlay", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2
    },
    y: 200,
    rotation: 10,
    ease: "none"
});

// 5. Scroll Smooth para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});