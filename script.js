// Открытие модального окна
function openModal() {
    document.getElementById('modal').style.display = 'flex';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Обработка формы заявки на замер
document.getElementById('measureForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо! Мы свяжемся с вами в ближайшее время для уточнения времени замера.');
    closeModal();
    this.reset();
});

// Обработка формы контактов
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо за ваше сообщение! Мы ответим вам в течение 24 часов.');
    this.reset();
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
    const animatedElements = document.querySelectorAll('.feature, .service-card, .portfolio-item');
    
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
});

// Тёмная тема
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверяем сохранённую тему
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
}

// Переключение темы
themeToggle.addEventListener('click', function() {
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