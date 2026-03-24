(function() {
  // ========== 1. CARRUSEL DE IMÁGENES ==========
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoInterval = null;
  let isTransitioning = false;
  const TRANSITION_DURATION = 450;

  function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      idx === currentIndex ? dot.classList.add('active') : dot.classList.remove('active');
    });
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (isTransitioning) return;
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    if (currentIndex === index) return;
    isTransitioning = true;
    currentIndex = index;
    updateCarousel();
    setTimeout(() => { isTransitioning = false; }, TRANSITION_DURATION);
  }

  function nextSlide() { goToSlide(currentIndex + 1); resetAutoPlay(); }
  function prevSlide() { goToSlide(currentIndex - 1); resetAutoPlay(); }

  function startAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      if (!isTransitioning) nextSlide();
    }, 5000);
  }
  function resetAutoPlay() {
    if (autoInterval) {
      clearInterval(autoInterval);
      startAutoPlay();
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => { if (autoInterval) clearInterval(autoInterval); });
    carouselWrapper.addEventListener('mouseleave', () => { if (!autoInterval) startAutoPlay(); });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (!isTransitioning) updateCarousel(); }, 100);
  });

  if (track) {
    track.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    createDots();
    updateCarousel();
    startAutoPlay();
  }

  // Gestos táctiles
  let touchStartX = 0;
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    carouselContainer.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevSlide() : nextSlide();
        resetAutoPlay();
      }
    });
  }

  // ========== 2. SLIDERS INTERACTIVOS (Personalización visual) ==========
  const fontSlider = document.getElementById('fontSlider');
  const bgSlider = document.getElementById('bgSlider');
  const fontSizeVal = document.getElementById('fontSizeValue');
  const brightnessVal = document.getElementById('brightnessValue');
  const demoBox = document.getElementById('demoBox');

  let currentFontSize = 18;
  let currentBgLightness = 52;

  function updateDemoBox() {
    if (demoBox) {
      demoBox.style.fontSize = `${currentFontSize}px`;
      demoBox.style.backgroundColor = `hsl(205, 65%, ${currentBgLightness}%)`;
      demoBox.style.color = currentBgLightness < 40 ? '#f0f9ff' : '#1e2f3e';
    }
  }

  if (fontSlider) {
    fontSlider.addEventListener('input', (e) => {
      currentFontSize = parseInt(e.target.value, 10);
      fontSizeVal.innerText = `${currentFontSize}px`;
      updateDemoBox();
    });
  }
  if (bgSlider) {
    bgSlider.addEventListener('input', (e) => {
      currentBgLightness = parseInt(e.target.value, 10);
      brightnessVal.innerText = `${currentBgLightness}%`;
      updateDemoBox();
    });
  }

  // Valores iniciales
  if (fontSlider) fontSlider.value = currentFontSize;
  if (bgSlider) bgSlider.value = currentBgLightness;
  if (fontSizeVal) fontSizeVal.innerText = `${currentFontSize}px`;
  if (brightnessVal) brightnessVal.innerText = `${currentBgLightness}%`;
  updateDemoBox();

  // ========== 3. Newsletter (demo) ==========
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por suscribirte! Recibirás nuestras novedades.');
      newsletterForm.reset();
    });
  }
})();