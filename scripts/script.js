// 👆 Свайп-слежение (вставлено в начало!)
function enableSwipe(element, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;
  
    element.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
  
    element.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const deltaX = touchEndX - touchStartX;
      const threshold = 50;
  
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) onSwipeLeft();
        else onSwipeRight();
      }
    });
  }
  
  const modal = document.getElementById("modal");
  const modalInner = document.getElementById("modal-inner");
  const closeModalBtn = document.getElementById("modal-close");
  
  async function openModal(templateId) {
    const response = await fetch(`scripts/modals/${templateId}.html`);
    const html = await response.text();
    modalInner.innerHTML = html;
  
    modal.classList.add("show");
    modal.classList.remove("closing");
    document.body.style.overflow = "hidden";
  
    requestAnimationFrame(() => {
      initCarousel();
    });
  }
  
  function closeModal() {
    modal.classList.remove("show");
    modal.classList.add("closing");
    setTimeout(() => {
      modalInner.innerHTML = "";
    }, 300);
    document.body.style.overflow = "";
  }
  
  closeModalBtn.addEventListener("click", closeModal);
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-template-url]").forEach(el => {
      el.addEventListener("click", () => {
        const url = el.dataset.templateUrl;
        openModal(url);
      });
    });
  });
  
  // обычная карусель
  function initCarousel() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (!carouselWrapper) return;
  
    const carousel = carouselWrapper.querySelector('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const nextBtn = carouselWrapper.querySelector('.carousel-btn.next');
    const prevBtn = carouselWrapper.querySelector('.carousel-btn.prev');
    let slides = Array.from(track.children);
    let currentSlide = 0;
  
    function updateSlidePosition() {
      const slideWidth = carousel.offsetWidth;
      slides = Array.from(track.children);
      track.style.width = `${slideWidth * slides.length}px`;
      slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.flex = '0 0 auto';
      });
      track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
      nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
    }
  
    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      updateSlidePosition();
    }
  
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    window.addEventListener('resize', updateSlidePosition);
    updateSlidePosition();
  
    enableSwipe(track, () => goToSlide(currentSlide + 1), () => goToSlide(currentSlide - 1));
  
    enableFullscreenViewer(); // <- вызываем здесь!
  }
  
  // по клику на картинку открываем фулскрин
  function enableFullscreenViewer() {
    const slideImages = document.querySelectorAll('.carousel-track img');
    slideImages.forEach((img, index) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        openFullscreenViewer(index);
      });
    });
  }
  
  function openFullscreenViewer(startIndex = 0) {
    const fullscreen = document.getElementById("fullscreen-viewer");
    const fullscreenImg = fullscreen.querySelector(".fullscreen-img");
    const slides = Array.from(document.querySelectorAll(".carousel-track img"));
    let currentSlide = startIndex;
  
    function updateImage() {
      fullscreenImg.src = slides[currentSlide].src;
      fullscreenImg.alt = slides[currentSlide].alt || '';
  
      const prevBtn = fullscreen.querySelector(".prev");
      const nextBtn = fullscreen.querySelector(".next");
  
      prevBtn.style.display = currentSlide === 0 ? "none" : "flex";
      nextBtn.style.display = currentSlide === slides.length - 1 ? "none" : "flex";
    }
  
    fullscreen.classList.remove("hidden");
    updateImage();
  
    fullscreen.querySelector(".fullscreen-btn.prev").onclick = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateImage();
    };
  
    fullscreen.querySelector(".fullscreen-btn.next").onclick = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateImage();
    };
  
    enableSwipe(
      fullscreen,
      () => {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          updateImage();
        }
      },
      () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateImage();
        }
      }
    );
  
    fullscreen.onclick = (e) => {
      const clickedInside = e.target.closest(".fullscreen-container");
      if (!clickedInside) {
        fullscreen.classList.add("hidden");
      }
    };
  }
  