// script/main.js

/**
 * Módulo principal - Ejecuta funcionalidades con prioridades diferentes
 */
document.addEventListener("DOMContentLoaded", () => {
  // PRIORIDAD ALTA - Ejecución inmediata (crítico para UX)
  // handleAccessibility();
  // handleInitialVisibleElements();

  // PRIORIDAD MEDIA - Ejecución con breve delay (importante pero no crítico)
  setTimeout(() => {
    initializeScrollAnimations();
    handleStateButton();
  }, 800);

  // PRIORIDAD BAJA - Ejecución cuando el navegador esté inactivo
  requestIdleCallback(
    () => {
      renderTestimonials();
      renderCarousel();
      updateFooterYear();
    },
    { timeout: 2000 }
  );
});

/**
 * Inicializa las animaciones al hacer scroll
 */
function initializeScrollAnimations() {
  // Verificar si el navegador soporta IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    // Fallback para navegadores que no soportan IntersectionObserver
    document.querySelectorAll("[data-animate]").forEach((element) => {
      element.classList.add("animate-in");
    });
    return;
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  document.querySelectorAll("[data-animate]").forEach((element) => {
    element.classList.add("animate-out");
    observer.observe(element);
  });
}

/**
 * Maneja las intersecciones del Observer
 */
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Usar requestAnimationFrame para animaciones más suaves
      requestAnimationFrame(() => {
        entry.target.classList.add("animate-in");
        entry.target.classList.remove("animate-out");
      });
    }
  });
}

/**
 * Maneja elementos visibles al cargar la página
 */
function handleInitialVisibleElements() {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (animatedElements.length === 0) return;

  animatedElements.forEach((element) => {
    if (isElementInViewport(element)) {
      requestAnimationFrame(() => {
        element.classList.add("animate-in");
        element.classList.remove("animate-out");
      });
    }
  });
}

/**
 * Verifica si un elemento está visible en el viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
}

/**
 * Configura aspectos de accesibilidad
 */
function handleAccessibility() {
  // Respetar preferencia de reducción de movimiento
  if (!window.matchMedia) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handleMotionChange = () => {
    document.documentElement.style.scrollBehavior = motionQuery.matches
      ? "auto"
      : "smooth";
  };

  // Verificar si el navegador soporta addEventListener en MediaQueryList
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", handleMotionChange);
  } else if (motionQuery.addListener) {
    // Soporte para navegadores antiguos
    motionQuery.addListener(handleMotionChange);
  }

  handleMotionChange(); // Aplicar al cargar
}

const testimonios = [
  {
    texto:
      "La mejor experiencia de barbería que he tenido. El servicio es impecable y la atención al detalle es increíble.",
    nombre: "Carlos Méndez",
    tipo: "Cliente desde 2018",
    imagen: "assets/img/testimonial-1.jpg",
  },
  {
    texto:
      "Siempre salgo de aquí sintiéndome renovado. Los barberos realmente saben lo que hacen y el ambiente es relajante.",
    nombre: "David Ramos",
    tipo: "Cliente frecuente",
    imagen: "assets/img/testimonial-2.jpg",
  },
  {
    texto:
      "Recomiendo este lugar a todos mis amigos. La calidad del servicio justifica cada centavo.",
    nombre: "José Rodríguez",
    tipo: "Cliente desde 2015",
    imagen: "assets/img/testimonial-3.jpg",
  },
  {
    texto:
      "Excelente servicio y atención. Nunca me había sentido tan cómodo en una barbería.",
    nombre: "Miguel Ángel",
    tipo: "Cliente desde 2020",
    imagen: "assets/img/testimonial-4.jpg",
  },
  {
    texto:
      "Los mejores cortes de la ciudad. Siempre recibo cumplidos después de venir aquí.",
    nombre: "Andrés Gómez",
    tipo: "Cliente semanal",
    imagen: "assets/img/testimonial-5.jpg",
  },
  {
    texto:
      "Ambiente increíble y profesionales de primera. Mi lugar favorito para el cuidado personal.",
    nombre: "Fernando Castro",
    tipo: "Cliente mensual",
    imagen: "assets/img/testimonial-6.jpg",
  },
];

// Función para seleccionar testimonios aleatorios
function getRandomTestimonials(count) {
  // Usar un algoritmo de mezcla más eficiente (Fisher-Yates)
  const shuffled = [...testimonios];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
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
  const container = document.getElementById("testimonials-container");
  if (!container) return;

  const randomTestimonials = getRandomTestimonials(3);

  // Usar DocumentFragment para minimizar reflows
  const fragment = document.createDocumentFragment();
  randomTestimonials.forEach((testimonio) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = createTestimonialHTML(testimonio);
    fragment.appendChild(tempDiv.firstElementChild);
  });

  container.appendChild(fragment);
}

/**
 * Helper para debounce
 */
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Opcional: Reiniciar animaciones al redimensionar
 */
window.addEventListener(
  "resize",
  debounce(() => {
    handleInitialVisibleElements();
  }, 200)
);

function handleStateButton() {
  const reservaBtn = document.getElementById("reserva-btn");
  const floatingBtn = document.getElementById("floating-reserva");

  if (!reservaBtn || !floatingBtn) return;

  // Reemplaza con tu enlace real de reservas
  reservaBtn.href = "https://tu-sistema-de-reservas.com";

  // Usar debounce para el evento scroll
  window.addEventListener(
    "scroll",
    debounce(function () {
      if (window.scrollY > 300) {
        floatingBtn.classList.add("visible");
      } else {
        floatingBtn.classList.remove("visible");
      }
    }, 10)
  );

  // Opcional: Suavizar scroll al hacer clic en el botón de reserva
  reservaBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.open(this.href, "_blank");
  });

  // Mismo comportamiento para el botón flotante
  const floatingLink = floatingBtn.querySelector("a");
  if (floatingLink) {
    floatingLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(this.href, "_blank");
    });
  }
}

function renderCarousel() {
  const carouselTrack = document.getElementById("carousel-track");
  if (!carouselTrack) return;

  // Array de imágenes (reemplaza con tus propias imágenes)
  const images = [
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
    "assets/img/corte1.jpeg",
  ];

  // Duplicamos las imágenes para crear un efecto de bucle continuo
  const duplicatedImages = [...images, ...images];

  // Usar DocumentFragment para minimizar reflows
  const fragment = document.createDocumentFragment();

  duplicatedImages.forEach((imageSrc) => {
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Imagen de la barbería";
    // Carga lazy de imágenes
    img.loading = "lazy";

    carouselItem.appendChild(img);
    fragment.appendChild(carouselItem);
  });

  carouselTrack.appendChild(fragment);
}

function updateFooterYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
  }
}

// Polyfill para requestIdleCallback para navegadores que no lo soportan
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback, options) {
    const timeout = options && options.timeout ? options.timeout : 0;
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return 50; // 50ms como valor por defecto
        },
      });
    }, timeout);
  };
}
