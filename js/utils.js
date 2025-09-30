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

      // Нормализация путей для включённых компонентов (assets и index)
      try {
        const isInPages = /\/pages\//.test(window.location.pathname.replace(/\\/g, '/'));
        const assetsPrefix = isInPages ? '../assets/' : './assets/';
        const indexHref = isInPages ? '../index.html' : './index.html';

        element.querySelectorAll('img[src^="./assets/"]').forEach(img => {
          const rest = img.getAttribute('src').slice('./assets/'.length);
          img.setAttribute('src', assetsPrefix + rest);
        });
        element.querySelectorAll('a[href="./index.html"]').forEach(a => {
          a.setAttribute('href', indexHref);
        });
      } catch (_) { }

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

  // После загрузки компонентов запускаем настройку мобильных функций и анимации корзины
  setupMobileFeatures();
  setupCartFlyAnimation();
  setupCartAddHandlers();
  setupProductNavigation();
  updateCartButtonStates();
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
      anchor.addEventListener('click', function (e) {
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

    // Обработчик меню задаётся в компоненте header.html, чтобы избежать конфликта не добавляем его здесь

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
    const img = btn.querySelector('img[alt="Добавить в корзину"]');
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

/** Навигация: клик по карточке → открытие product.html с данными из карточки */
function setupProductNavigation() {
  if (window.__productNavBound) return;
  window.__productNavBound = true;

  const computeProductPath = () => './pages/product.html';

  const extractText = (el) => (el ? (el.textContent || '').trim() : 'Товар');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card, .artist-card, .stickerpack-card');
    if (!card) return;
    if (e.target.closest('button, .add-to-cart, a[href]')) return; // не перехватываем кнопки/ссылки

    e.preventDefault();
    const imgEl = card.querySelector('img');
    let img = imgEl ? imgEl.getAttribute('src') || '' : '';
    img = img.replace(/^\.\//, '').replace(/^\//, ''); // нормализуем

    const titleEl = card.querySelector('p.text-gray-700, h3, p');
    const title = extractText(titleEl);

    const priceEl = card.querySelector('.font-bold');
    const price = priceEl ? (priceEl.textContent || '').replace(/[^0-9]/g, '') : '0';

    const params = new URLSearchParams({ title, img: img.startsWith('assets/') ? img : `assets/${img.split('/').pop()}`, price });
    const url = `${computeProductPath()}?${params.toString()}`;
    window.location.href = url;
  }, true);
}
/** Добавление товара в корзину с автосбором данных с карточки */
function setupCartAddHandlers() {
  if (window.__cartAddBound) return;
  window.__cartAddBound = true;

  const textToNumber = (t) => {
    if (!t) return 0;
    return parseInt(String(t).replace(/[^0-9]/g, '')) || 0;
  };

  const updateCartCountSoft = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  };

  const notify = (msg) => {
    try {
      const n = document.createElement('div');
      n.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transform translate-y-10 opacity-0 transition-all duration-300';
      n.textContent = msg;
      document.body.appendChild(n);
      setTimeout(() => n.classList.remove('translate-y-10', 'opacity-0'), 50);
      setTimeout(() => { n.classList.add('translate-y-10', 'opacity-0'); setTimeout(() => n.remove(), 300); }, 2500);
    } catch (_) { }
  };

  const extractFromCard = (btn) => {
    const card = btn.closest('.product-card, .sticker-card, .stickerpack-card, .artist-card');
    if (!card) return null;
    const img = card.querySelector('img');
    const imgSrc = img ? img.src : '';
    let name = '';
    const titleP = card.querySelector('.p-3 p.text-gray-700, .p-4 p.text-gray-700');
    const anyP = card.querySelector('.p-3 p:last-of-type, .p-4 p:last-of-type');
    const h3 = card.querySelector('h3');
    name = (titleP && titleP.textContent.trim()) || (h3 && h3.textContent.trim()) || (anyP && anyP.textContent.trim()) || 'Товар';
    let priceText = '';
    const priceEl = card.querySelector('.p-3 .font-bold, .p-4 .font-bold');
    priceText = priceEl ? priceEl.textContent : '';
    const price = textToNumber(priceText);
    const category = card.classList.contains('artist-card') ? 'Стикеры' : card.classList.contains('stickerpack-card') ? 'Стикерпак' : card.classList.contains('product-card') ? 'Товар' : 'Товар';
    const id = (name + '|' + imgSrc).replace(/\W+/g, '-').toLowerCase() + '-' + Date.now();
    return { id, name, price, img: imgSrc, category, quantity: 1 };
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    const imgBtn = e.target.closest('button')?.querySelector('img[alt="Добавить в корзину"]');
    const srcBtn = btn || (imgBtn ? e.target.closest('button') : null);
    if (!srcBtn) return;

    // Если у .add-to-cart есть data-атрибуты, пусть работает существующая логика страницы
    if (btn && btn.dataset && btn.dataset.id) return;

    const data = extractFromCard(srcBtn);
    if (!data || !data.price) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(data);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountSoft();
    notify(`${data.name} добавлен в корзину`);
    updateCartButtonStates();
  }, true);
}
/**
 * Красивая анимация «полет в корзину» для всех кнопок добавления
 * Работает для .add-to-cart и для кнопок с картинкой alt="Добавить в корзину"
 */
function setupCartFlyAnimation() {
  if (window.__cartFlyBound) return; // предотвращаем дубль
  window.__cartFlyBound = true;

  const getCartTarget = () => {
    const candidates = Array.from(document.querySelectorAll('header a[href$="cart.html"]'));
    return candidates.find(el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0) || candidates[0];
  };

  const animateToCart = (sourceEl) => {
    const cartEl = getCartTarget();
    if (!sourceEl || !cartEl) return;

    const srcRect = sourceEl.getBoundingClientRect();
    const trgRect = (cartEl.querySelector('svg') || cartEl).getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = sourceEl.tagName === 'IMG' && sourceEl.src ? sourceEl.src : './assets/button_add.png';
    flyer.style.position = 'fixed';
    flyer.style.left = `${srcRect.left + srcRect.width / 2}px`;
    flyer.style.top = `${srcRect.top + srcRect.height / 2}px`;
    flyer.style.width = '35px';
    flyer.style.height = '35px';
    flyer.style.transform = 'translate(-50%, -50%) scale(1)';
    flyer.style.transition = 'transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 600ms ease';
    flyer.style.zIndex = '9999';
    flyer.style.pointerEvents = 'none';
    flyer.style.filter = 'drop-shadow(0 6px 14px rgba(0,0,0,.15))';
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      const targetX = trgRect.left + trgRect.width / 2;
      const targetY = trgRect.top + trgRect.height / 2;
      flyer.style.transform = `translate(${targetX - (srcRect.left + srcRect.width / 2)}px, ${targetY - (srcRect.top + srcRect.height / 2)}px) scale(0.25)`;
      flyer.style.opacity = '0.6';
    });

    flyer.addEventListener('transitionend', () => {
      flyer.remove();
      try {
        (cartEl.querySelector('svg') || cartEl).animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' }
        ], { duration: 300, easing: 'ease-out' });
      } catch (_) { /* no-op */ }
    }, { once: true });
  };

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    const imgBtn = e.target.closest('button')?.querySelector('img[alt="Добавить в корзину"]');
    if (!addBtn && !imgBtn) return;
    animateToCart(imgBtn || addBtn);
  }, true);
}

function updateCartButtonStates() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartImgSources = cart.map(item => {
    try {
      const url = new URL(item.img, window.location.href);
      return url.pathname.split('/').pop();
    } catch (_) {
      return item.img.split('/').pop();
    }
  });

  document.querySelectorAll('img[alt="Добавить в корзину"]').forEach(btn => {
    const card = btn.closest('.product-card, .artist-card, .stickerpack-card');
    if (!card) return;
    const cardImg = card.querySelector('img');
    if (!cardImg) return;
    const cardImgName = cardImg.src.split('/').pop();
    if (cartImgSources.includes(cardImgName)) {
      btn.src = './assets/button_add_done.png';
      btn.closest('button')?.classList.add('in-cart');
    } else {
      btn.src = './assets/button_add.png';
      btn.closest('button')?.classList.remove('in-cart');
    }
  });
}