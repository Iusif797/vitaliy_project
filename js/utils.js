/**
 * Загружает HTML компоненты в страницу и настраивает мобильное отображение
 * Использование: <div data-include="./components/header.html"></div>
 */
async function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  
  for (const element of includes) {
    try {
      const filePath = element.getAttribute('data-include');
      const response = await fetch(filePath);
      
      if (!response.ok) {
        console.error(`Ошибка загрузки компонента: ${filePath}`);
        continue;
      }
      
      const content = await response.text();
      element.innerHTML = content;
      
      // Запускаем скрипты, если они есть в компоненте
      const scripts = element.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });
    } catch (error) {
      console.error('Ошибка при загрузке компонента:', error);
    }
  }

  // После загрузки компонентов запускаем настройку мобильных функций
  setupMobileFeatures();
}

// Запускаем после полной загрузки страницы
document.addEventListener('DOMContentLoaded', includeHTML); 

/**
 * Настройка функциональности для мобильных устройств
 */
function setupMobileFeatures() {
  // Обработка макета карточек для мобильных устройств
  const handleMobileCardLayout = () => {
    const isMobile = window.innerWidth < 640;
    const cardGrids = document.querySelectorAll('.card-grid-mobile');
    
    cardGrids.forEach(grid => {
      if (isMobile) {
        // На мобильных устройствах настраиваем особый макет
        const cards = Array.from(grid.children);
        
        // Группируем карточки попарно для мобильного отображения
        for (let i = 0; i < cards.length; i += 2) {
          const pair = cards.slice(i, i + 2);
          if (pair.length === 2) {
            // Обеспечиваем правильные отступы между парами
            pair[0].classList.add('mb-2');
            pair[1].classList.add('mb-2');
          }
        }
      } else {
        // На десктопах убираем мобильные отступы
        Array.from(grid.children).forEach(card => {
          card.classList.remove('mb-2');
        });
      }
    });
  };
  
  // Настройка плавной прокрутки для всех якорных ссылок
  const setupSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Учитываем фиксированный заголовок
            behavior: 'smooth'
          });
        }
      });
    });
  };
  
  // Ленивая загрузка изображений
  const setupLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.removeAttribute('data-src');
              lazyImageObserver.unobserve(lazyImage);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    } else {
      // Запасной вариант для браузеров, которые не поддерживают Intersection Observer
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };

  // Добавляем поддержку мобильной навигации
  const setupMobileNavigation = () => {
    // Проверяем наличие мобильного меню после загрузки компонентов
    const mobileMenuToggle = document.getElementById('menu-toggle');
    const mobileSearchToggle = document.getElementById('search-toggle');

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('hidden');
        }
      });
    }

    if (mobileSearchToggle) {
      mobileSearchToggle.addEventListener('click', () => {
        const mobileSearch = document.getElementById('mobile-search');
        if (mobileSearch) {
          mobileSearch.classList.toggle('hidden');
        }
      });
    }
  };
  
  // Находим все кнопки, содержащие SVG корзины
  document.querySelectorAll('button').forEach(btn => {
    const img = btn.querySelector('img[src$="button_add.svg"]');
    if (img) {
      btn.classList.add('cart-btn');
      btn.addEventListener('click', () => {
        btn.classList.add('scale-95');
        setTimeout(() => btn.classList.remove('scale-95'), 150);
        console.log('Добавление в корзину (заглушка)');
      });
    }
  });
  
  // Инициализация всех мобильных функций
  handleMobileCardLayout();
  setupSmoothScrolling();
  setupLazyLoading();
  setupMobileNavigation();
  
  // Обновление макета при изменении размера окна
  window.addEventListener('resize', () => {
    handleMobileCardLayout();
  });

  // Promo slider arrows
  const promoImg = document.getElementById('promo-image');
  if (promoImg) {
    const slides = [
      './assets/banner2.png',
      './assets/bannerS.png'
    ];
    let idx = 0;
    const showSlide = (i) => {
      idx = (i + slides.length) % slides.length;
      promoImg.src = slides[idx];
    };
    document.querySelectorAll('.promo-prev').forEach(btn => btn.addEventListener('click', () => showSlide(idx - 1)));
    document.querySelectorAll('.promo-next').forEach(btn => btn.addEventListener('click', () => showSlide(idx + 1)));
  }
} 