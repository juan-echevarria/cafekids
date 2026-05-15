// 1. CARGADOR FAILSAFE (2 SEGUNDOS)
window.addEventListener('load', () => {
    setTimeout(() => {
        const l = document.getElementById('loader');
        if (l) {
            l.style.opacity = '0';
            setTimeout(() => {
                l.style.display = "none";
                updateMagneticLine(); // Coloca la rayita inicial
            }, 600);
        }
    }, 2000);
});

// 2. FUNCIÓN DE SCROLL CINEMATOGRÁFICO MEJORADA
function elegantScroll(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    // Calculamos la altura del Navbar para que no tape el título
    const navOffset = document.querySelector('.nav-glass').offsetHeight || 80;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navOffset - 10);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;

    // Ajustamos duración dinámica (Elegante)
    const duration = Math.min(Math.max(Math.abs(distance) * 0.8, 1400), 2800);
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
        else window.scrollTo(0, targetPosition); // Ajuste final de precisión
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// 3. CAPTURAR CLICKS EN EL MENÚ (ASIGNACIÓN DIRECTA)
// Buscamos todos los links que tengan la clase .nav-link y seccionamos el scroll
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link) {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            elegantScroll(href);
        }
    }
});

// 4. SISTEMA ZOOM LIGHTBOX
function zoom(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (lb && img) {
        img.src = src;
        lb.style.display = 'flex';
        setTimeout(() => lb.classList.add('active'), 50);
    }
}

// 5. TABS DE LA CARTA
function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// 6. INDICADOR DE RAYA FLUIDA (NAV INDICATOR)
const nM = document.getElementById('nav-menu');
const ind = document.getElementById('nav-indicator');
const sections = document.querySelectorAll('section[id]');

function updateMagneticLine() {
    let fromT = window.scrollY;
    let currentSectionId = "";

    sections.forEach(s => {
        const sectionTop = s.offsetTop - 350; // Umbral de detección
        if (fromT >= sectionTop) {
            currentSectionId = s.getAttribute('id');
        }
    });

    if (currentSectionId) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
        if (activeLink && ind && nM) {
            const r = activeLink.getBoundingClientRect();
            const pr = nM.getBoundingClientRect();
            ind.style.width = `${r.width}px`;
            ind.style.left = `${activeLink.offsetLeft}px`;
            ind.style.opacity = "1";
        }
    }
}
window.addEventListener('scroll', updateMagneticLine);

// 7. GPS - ENCONTRAR MÁS CERCANO (RESALTE CINEMATOGRÁFICO)
function findNearest() {
    const places = [
        { id: 'sucursal-batlle', lat: -34.9011, lng: -56.1624 },
        { id: 'sucursal-nuevo', lat: -34.871, lng: -56.173 },
        { id: 'sucursal-shangrila', lat: -34.853, lng: -56.002 }
    ];

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            const uL = p.coords.latitude, uG = p.coords.longitude;
            let nearest = places[0], minD = Infinity;

            places.forEach(pt => {
                let d = Math.sqrt(Math.pow(pt.lat - uL, 2) + Math.pow(pt.lng - uG, 2));
                if (d < minD) { minD = d; nearest = pt; }
            });

            // Primero vamos a la zona de locales con scroll lento
            elegantScroll('#locales');

            // Resaltamos el local exacto
            document.querySelectorAll('.local-card-box').forEach(c => {
                c.parentElement.classList.remove('closest-highlight');
            });

            setTimeout(() => {
                const targetEl = document.getElementById(nearest.id);
                if (targetEl) {
                    targetEl.parentElement.classList.add('closest-highlight');
                }
            }, 2000);
        }, () => alert("Para mostrarte el local más cercano necesitamos acceso a tu ubicación."));
    }
}