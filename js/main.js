document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // Fade-up animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Animated counters
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current + (el.dataset.suffix || '');
        }, 30);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // Testimonial slider
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-card').length;

  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.querySelector('.slider-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.querySelector('.slider-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));
  setInterval(() => goToSlide(currentSlide + 1), 6000);

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Lightbox
  const lightbox = document.querySelector('.lightbox');
  const lbImg = lightbox?.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.querySelector('img').src;
      lightbox.classList.add('active');
    });
  });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
    }
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('active'));

  // Contact form -> WhatsApp
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;

    const texto = `¡Hola BioBalance!%0A%0AMe gustaría recibir información.%0A%0A*Nombre:* ${nombre}%0A*Email:* ${email}%0A*Teléfono:* ${telefono}%0A*Interés:* ${mensaje}`;
    const url = `https://wa.me/56995112640?text=${texto}`;
    
    window.open(url, '_blank');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = '¡Redirigiendo...! ✓';
    btn.style.background = '#7A9E7E';
    setTimeout(() => { btn.textContent = 'Enviar Mensaje'; btn.style.background = ''; e.target.reset(); }, 3000);
  });

  // Smooth scroll for nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Parallax effect for hero
  const heroBgImg = document.querySelector('.hero-bg img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBgImg.style.transform = `translateY(${scrolled * 0.35}px)`;
      }
    });
  }

  // Renderizar precios dinámicamente
  renderPrices();
});
// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const hero = document.querySelector('.hero');

    // Bloqueamos scroll al entrar
    document.body.style.overflow = 'hidden';

    // Tiempo que el logo se queda en pantalla (1.2 seg)
    setTimeout(() => {
        // 1. Quitamos el preloader con desvanecimiento suave
        preloader.classList.add('preloader-hidden');
        
        // 2. Activamos las letras del Hero justo cuando empieza a irse el fondo
        if(hero) {
            hero.classList.add('hero-active');
        }

        // 3. Liberamos el scroll y eliminamos el preloader por completo
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 800); // mismo tiempo que la transición CSS
    }, 1200); 
});

// Manejo de error en imagen de calendario
document.querySelector('.calendar-img')?.addEventListener('error', function() {
    this.classList.add('error');
});

// Renderizado dinámico de precios
function renderPrices() {
    const grid = document.getElementById('pricing-grid');
    if (!grid || !window.BIOBALANCE_CONFIG) return;

    grid.innerHTML = window.BIOBALANCE_CONFIG.planes.map((plan, index) => `
        <div class="pricing-card ${plan.destacado ? 'featured' : ''} fade-up" style="transition-delay: ${index * 0.1}s">
            ${plan.tag ? `<div class="pricing-tag">${plan.tag}</div>` : ''}
            <h3>${plan.nombre}</h3>
            <div class="price">$${plan.precio}<span>/mes</span></div>
            <div class="period">${plan.periodo}</div>
            <ul>
                ${plan.caracteristicas.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <a href="${plan.link}" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center; ${plan.destacado ? 'background: var(--primary-light); color: var(--bg-dark);' : ''}">
                ${plan.textoBoton}
            </a>
        </div>
    `).join('');

    // Re-activar observador para los nuevos elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.15 });
    grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}