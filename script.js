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