// script.js
// Проверяем, находимся ли мы на странице каталога
const isCatalogPage = window.location.pathname.includes('catalog.html');

// Создаем индикатор загрузки
function createLoader() {
    // Проверяем, существует ли уже лоадер
    if (document.querySelector('.page-loader')) return;
    
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner">
                <i class="fas fa-door-closed"></i>
            </div>
            <div class="loader-text">МастерДвери</div>
        </div>
    `;
    document.body.appendChild(loader);
    
    // Скрываем лоадер после загрузки
    setTimeout(() => {
        hideLoader();
    }, 800);
}

// Показать лоадер
function showLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл
    }
}

// Скрыть лоадер
function hideLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
}

// Функции для модального окна (только для главной страницы)
if (!isCatalogPage) {
    window.openModal = function() {
        document.getElementById('modal').style.display = 'flex';
    };

    window.closeModal = function() {
        document.getElementById('modal').style.display = 'none';
    };
}

// Обработка формы заявки на замер
document.getElementById('measureForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showLoader();
    setTimeout(() => {
        alert('Спасибо! Мы свяжемся с вами в ближайшее время для уточнения времени замера.');
        closeModal();
        this.reset();
        hideLoader();
    }, 500); // Имитация отправки
});

// Обработка формы контактов
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showLoader();
    setTimeout(() => {
        alert('Спасибо за ваше сообщение! Мы ответим вам в течение 24 часов.');
        this.reset();
        hideLoader();
    }, 500);
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Добавление класса при скролле для шапки
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Имитация загрузки "наших работ"
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = [
        { title: 'Дубовая дверь', desc: 'Дверь из массива дуба' },
        { title: 'Раздвижная система', desc: 'Стеклянная раздвижная дверь' },
        { title: 'Входная дверь', desc: 'Бронированная входная дверь' }
    ];
    
    const portfolioElements = document.querySelectorAll('.portfolio-img');
    portfolioElements.forEach((element, index) => {
        if (portfolioItems[index]) {
            element.textContent = portfolioItems[index].title;
        }
    });
});

// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
    // Показ/скрытие кнопки "Наверх"
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.feature, .service-card, .portfolio-item, .door-card, .benefit');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
});

// Прокрутка наверх
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Добавим анимацию при загрузке для героя
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'translateY(0)';
    }, 600);
    
    // Скрываем лоадер при полной загрузке
    hideLoader();
});

// Тёмная тема (для главной страницы)
if (!isCatalogPage) {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
    }

    // Переключение темы
    themeToggle?.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Сохраняем выбор пользователя
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Проверяем системные настройки (опционально)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme')) {
        body.classList.add('dark-theme');
    }

    // Слушаем изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-theme');
            } else {
                body.classList.remove('dark-theme');
            }
        }
    });
}

// Функция для показа уведомлений (для использования в других файлах)
function showNotification(message, isError = false) {
    // Проверяем, существует ли уже функция showNotification в cart.js
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        return; // Используем существующую функцию из cart.js
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    notification.innerHTML = `
        <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем стили для уведомления
    if (!document.querySelector('.notification')) {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 25px;
                background: #4caf50;
                color: white;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1002;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.3s ease;
            }
            .notification.error {
                background: #f44336;
            }
            .notification i {
                font-size: 1.2rem;
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(30px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Показываем лоадер при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createLoader();
    showLoader();
    
    // Добавляем обработчики для всех ссылок (кроме якорных)
    document.querySelectorAll('a:not([href^="#"]):not([href^="javascript"])').forEach(link => {
        link.addEventListener('click', function(e) {
            // Не показываем лоадер для ссылок на ту же страницу
            if (this.hostname === window.location.hostname && 
                this.pathname === window.location.pathname) {
                return;
            }
            showLoader();
        });
    });
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.btn, button').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('btn-primary') || 
                this.classList.contains('btn-secondary') ||
                this.classList.contains('btn-outline')) {
                // Показываем лоадер для основных действий
                if (this.textContent.includes('Заказать') || 
                    this.textContent.includes('Отправить') ||
                    this.textContent.includes('Сохранить')) {
                    showLoader();
                    // Скрываем лоадер через 1 секунду, если нет перенаправления
                    setTimeout(hideLoader, 1000);
                }
            }
        });
    });
});

// Экспортируем функцию для использования в других файлах
window.showNotification = showNotification;
window.showLoader = showLoader;
window.hideLoader = hideLoader;