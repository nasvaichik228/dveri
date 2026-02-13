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
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        header.style.transform = 'translateY(0)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        header.style.transform = 'translateY(0)';
    }
    
    // Эффект параллакса для hero-секции (только на главной)
    if (!isCatalogPage) {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (hero && heroContent && heroImage) {
            // Параллакс для фона
            const speed = 0.5;
            const yPos = -(scrollPosition * speed);
            hero.style.backgroundPosition = `center ${yPos}px`;
            
            // Параллакс для контента (элементы движутся с разной скоростью)
            heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            heroImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
    }
    
    // Анимация прогресс-бара чтения
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let readingProgress = document.querySelector('.reading-progress');
    if (!readingProgress) {
        readingProgress = document.createElement('div');
        readingProgress.className = 'reading-progress';
        document.body.appendChild(readingProgress);
    }
    readingProgress.style.width = scrolled + '%';
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
    
    // Инициализация параллакса для всех секций
    initScrollAnimations();
});

// Инициализация анимаций при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature, .service-card, .portfolio-item, .door-card, .benefit, .example-card, .catalog-info, .contact-content');
    
    // Добавляем класс fade-out изначально
    animatedElements.forEach(element => {
        element.classList.add('fade-out');
    });
    
    // Функция проверки видимости элемента
    function checkVisibility() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight - 100;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
                element.classList.remove('fade-out');
            } else {
                element.classList.remove('fade-in');
                element.classList.add('fade-out');
            }
        });
    }
    
    // Проверяем при скролле
    window.addEventListener('scroll', checkVisibility);
    
    // Проверяем сразу после загрузки
    checkVisibility();
}

// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
    // Показ/скрытие кнопки "Наверх"
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
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
    
    if (heroContent && heroImage) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 600);
    }
    
    // Скрываем лоадер при полной загрузке
    hideLoader();
    
    // Добавляем эффект градиента при движении мыши (только на главной)
    if (!isCatalogPage) {
        initMouseParallax();
    }
});

// Эффект параллакса при движении мыши
function initMouseParallax() {
    const hero = document.querySelector('.hero');
    const doorPlaceholder = document.querySelector('.door-placeholder');
    
    if (!hero || !doorPlaceholder) return;
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Дверь слегка двигается за мышью
        doorPlaceholder.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        
        // Градиент фона меняется в зависимости от положения мыши
        const gradientX = 50 + mouseX * 20;
        const gradientY = 50 + mouseY * 20;
        hero.style.background = `radial-gradient(circle at ${gradientX}% ${gradientY}%, #f5f1eb, #e8dfd3)`;
    });
}

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
        
        // Анимация переключения
        document.documentElement.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
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
    
    // Добавляем эффект свечения для активных элементов
    addGlowEffect();
});

// Эффект свечения для интерактивных элементов
function addGlowEffect() {
    const interactiveElements = document.querySelectorAll('.btn, .door-card, .filter-btn, .size-preset, .option-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Экспортируем функцию для использования в других файлах
window.showNotification = showNotification;
window.showLoader = showLoader;
window.hideLoader = hideLoader;