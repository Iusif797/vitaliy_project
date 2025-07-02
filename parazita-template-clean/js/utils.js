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