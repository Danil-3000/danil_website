const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("modal-close");
const modalInner = document.getElementById("modal-inner");

function openModal(templateId) {
    const template = document.getElementById(templateId);
    if (!template) return;
  
    const content = template.content.cloneNode(true);
    modalInner.innerHTML = ""; // очищаем перед вставкой
    modalInner.appendChild(content);
  
    modal.classList.add("show");
    modal.classList.remove("closing");
    document.body.style.overflow = "hidden";
  
    // Подождать один кадр, чтобы DOM успел отрендериться
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

// Навешиваем всем с data-template
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-template]").forEach(el => {
      el.addEventListener("click", () => {
        openModal(el.dataset.template);
      });
    });
  });

// 👇 Функция ожидания загрузки всех изображений
function waitForImagesToLoad(container, callback) {
  const images = container.querySelectorAll('img');
  let loaded = 0;

  if (images.length === 0) {
    callback();
    return;
  }

  images.forEach((img) => {
    if (img.complete) {
      loaded++;
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === images.length) {
          callback();
        }
      });
    }
  });

  // На случай, если все уже загружены
  if (loaded === images.length) {
    callback();
  }
}

// 👇 Инициализация карусели
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
      
        // смещение
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      
        // логика показа/скрытия кнопок
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
  
    updateSlidePosition(); // инициализация
  }