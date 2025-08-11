// script/main.js

/**
 * Módulo principal - Ejecuta todas las funcionalidades cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    initializeScrollAnimations();
    handleAccessibility();
    handleInitialVisibleElements();
    renderTestimonials();
    handleStateButton();
});

/**
 * Configura el desplazamiento suave para enlaces internos
 */
function setupSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                scrollToElement(targetElement);
                updateBrowserHistory(targetId);
            }
        });
    });
}

/**
 * Desplaza suavemente hasta un elemento
 */
function scrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * Actualiza el historial del navegador
 */
function updateBrowserHistory(hash) {
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

/**
 * Inicializa las animaciones al hacer scroll
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(element => {
        element.classList.add('animate-out');
        observer.observe(element);
    });
}

/**
 * Maneja las intersecciones del Observer
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.classList.remove('animate-out');
        }
    });
}

/**
 * Maneja elementos visibles al cargar la página
 */
function handleInitialVisibleElements() {
    document.querySelectorAll('[data-animate]').forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('animate-in');
            element.classList.remove('animate-out');
        }
    });
}

/**
 * Verifica si un elemento está visible en el viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight * 0.75) &&
        rect.bottom >= 0
    );
}

/**
 * Configura aspectos de accesibilidad
 */
function handleAccessibility() {
    // Respetar preferencia de reducción de movimiento
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = () => {
        document.documentElement.style.scrollBehavior = 
            motionQuery.matches ? 'auto' : 'smooth';
    };

    motionQuery.addEventListener('change', handleMotionChange);
    handleMotionChange(); // Aplicar al cargar
}

const testimonios = [
    {
        texto: "La mejor experiencia de barbería que he tenido. El servicio es impecable y la atención al detalle es increíble.",
        nombre: "Carlos Méndez",
        tipo: "Cliente desde 2018",
        imagen: "assets/img/testimonial-1.jpg"
    },
    {
        texto: "Siempre salgo de aquí sintiéndome renovado. Los barberos realmente saben lo que hacen y el ambiente es relajante.",
        nombre: "David Ramos",
        tipo: "Cliente frecuente",
        imagen: "assets/img/testimonial-2.jpg"
    },
    {
        texto: "Recomiendo este lugar a todos mis amigos. La calidad del servicio justifica cada centavo.",
        nombre: "José Rodríguez",
        tipo: "Cliente desde 2015",
        imagen: "assets/img/testimonial-3.jpg"
    },
    {
        texto: "Excelente servicio y atención. Nunca me había sentido tan cómodo en una barbería.",
        nombre: "Miguel Ángel",
        tipo: "Cliente desde 2020",
        imagen: "assets/img/testimonial-4.jpg"
    },
    {
        texto: "Los mejores cortes de la ciudad. Siempre recibo cumplidos después de venir aquí.",
        nombre: "Andrés Gómez",
        tipo: "Cliente semanal",
        imagen: "assets/img/testimonial-5.jpg"
    },
    {
        texto: "Ambiente increíble y profesionales de primera. Mi lugar favorito para el cuidado personal.",
        nombre: "Fernando Castro",
        tipo: "Cliente mensual",
        imagen: "assets/img/testimonial-6.jpg"
    }
];

// Función para seleccionar testimonios aleatorios
function getRandomTestimonials(count) {
    const shuffled = [...testimonios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Función para generar el HTML de un testimonio
function createTestimonialHTML(testimonio) {
    return `
        <div class="testimonial-card">
            <p>"${testimonio.texto}"</p>
            <div class="testimonial-author">
               
                <div class="author-info">
                    <h4>${testimonio.nombre}</h4>
                    <small>${testimonio.tipo}</small>
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar los testimonios
function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    const randomTestimonials = getRandomTestimonials(3);
    
    container.innerHTML = randomTestimonials.map(createTestimonialHTML).join('');
}

/**
 * Opcional: Reiniciar animaciones al redimensionar
 */
window.addEventListener('resize', debounce(() => {
    handleInitialVisibleElements();
}, 200));

/**
 * Helper para debounce
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

function handleStateButton(){
     const reservaBtn = document.getElementById('reserva-btn');
    const floatingBtn = document.getElementById('floating-reserva');
    
    // Reemplaza con tu enlace real de reservas
    reservaBtn.href = 'https://tu-sistema-de-reservas.com';
    
    // Mostrar/ocultar botón flotante al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) { // Aparece después de 300px de scroll
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
        }
    });
    
    // Opcional: Suavizar scroll al hacer clic en el botón de reserva
    reservaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(this.href, '_blank');
    });
    
    // Mismo comportamiento para el botón flotante
    floatingBtn.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(this.href, '_blank');
    });
}