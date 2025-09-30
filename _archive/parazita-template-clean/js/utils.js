/**
 * Загружает HTML компоненты в страницу
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
}

// Запускаем после полной загрузки страницы
document.addEventListener('DOMContentLoaded', includeHTML);

/**
 * Красивая анимация «полет в корзину» для кнопок добавления
 */
function setupCartFlyAnimation() {
  if (window.__cartFlyBound) return;
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
    flyer.src = sourceEl.tagName === 'IMG' && sourceEl.src ? sourceEl.src : './assets/button_add.svg';
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
      } catch (_) { }
    }, { once: true });
  };

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    const imgBtn = e.target.closest('button')?.querySelector('img[alt="Добавить в корзину"]');
    const source = (e.target.closest('button')?.querySelector('img[alt="Добавить в корзину"]')) || addBtn;
    if (!addBtn && !imgBtn) return;
    animateToCart(imgBtn || addBtn);
  }, true);
}

document.addEventListener('DOMContentLoaded', setupCartFlyAnimation);