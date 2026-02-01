// Данные для каталога дверей
const doorsData = [
    {
        id: 1,
        name: "Дубовая классика",
        category: "interior",
        description: "Межкомнатная дверь из массива дуба с классическим дизайном",
        price: 25900,
        material: "Массив дуба",
        size: "2000x800 мм",
        color: "Натуральное дерево",
        thickness: "40 мм",
        popular: true,
        new: false
    },
    {
        id: 2,
        name: "Входная бронированная",
        category: "entrance",
        description: "Надежная входная дверь с повышенной безопасностью",
        price: 48900,
        material: "Сталь + МДФ",
        size: "2050x900 мм",
        color: "Темный орех",
        thickness: "80 мм",
        popular: true,
        new: false
    },
    {
        id: 3,
        name: "Стеклянная раздвижная",
        category: ["sliding", "glass"],
        description: "Современная раздвижная дверь с матовым стеклом",
        price: 38900,
        material: "Стекло + алюминий",
        size: "2100x900 мм",
        color: "Бронза",
        thickness: "30 мм",
        popular: true,
        new: true
    },
    {
        id: 4,
        name: "Шпон ореха",
        category: "interior",
        description: "Элегантная дверь с отделкой из шпона ореха",
        price: 21900,
        material: "МДФ + шпон",
        size: "2000x700 мм",
        color: "Светлый орех",
        thickness: "35 мм",
        popular: false,
        new: false
    },
    {
        id: 5,
        name: "Двойная стеклянная",
        category: ["glass", "interior"],
        description: "Двойная дверь с прозрачным стеклом",
        price: 54900,
        material: "Стекло + дерево",
        size: "2100x1200 мм",
        color: "Белый",
        thickness: "25 мм",
        popular: false,
        new: true
    },
    {
        id: 6,
        name: "Эко-дверь из сосны",
        category: "interior",
        description: "Экологичная дверь из массива сосны",
        price: 18900,
        material: "Массив сосны",
        size: "2000x800 мм",
        color: "Сосна",
        thickness: "35 мм",
        popular: true,
        new: false
    },
    {
        id: 7,
        name: "Скрытая дверь",
        category: "interior",
        description: "Невидимая дверь под отделку стен",
        price: 32900,
        material: "МДФ",
        size: "2000x800 мм",
        color: "Под покраску",
        thickness: "40 мм",
        popular: false,
        new: true
    },
    {
        id: 8,
        name: "Раздвижная система",
        category: "sliding",
        description: "Система раздвижных дверей в алюминиевой раме",
        price: 67900,
        material: "Алюминий + стекло",
        size: "2100x1800 мм",
        color: "Черный матовый",
        thickness: "20 мм",
        popular: true,
        new: false
    }
];

// Функция для форматирования цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Функция для получения названия категории
function getCategoryName(category) {
    const names = {
        'interior': 'Межкомнатная',
        'entrance': 'Входная',
        'sliding': 'Раздвижная',
        'glass': 'Стеклянная'
    };
    return names[category] || category;
}

// Функция для создания карточки двери
function createDoorCard(door) {
    const categories = Array.isArray(door.category) ? door.category : [door.category];
    const categoryClass = categories[0];
    
    return `
        <div class="door-card" data-category="${categories.join(' ')}" data-id="${door.id}">
            <div class="door-image" style="position: relative;">
                <button class="add-to-cart-btn" onclick="addDoorToCart(${door.id})" title="Добавить в корзину">
                    <i class="fas fa-cart-plus"></i>
                    Добавить
                </button>
                <button class="quick-view-btn" onclick="quickView(${door.id})" title="Быстрый просмотр">
                    <i class="fas fa-eye"></i>
                </button>
                <i class="fas fa-door-open"></i>
            </div>
            <div class="door-content">
                <span class="door-category ${categoryClass}">${getCategoryName(categories[0])}</span>
                <h3 class="door-title">${door.name}</h3>
                <p class="door-description">${door.description}</p>
                <div class="door-price">${formatPrice(door.price)}</div>
                <div class="door-actions">
                    <button class="btn btn-primary" onclick="showDoorDetails(${door.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="btn-outline" onclick="addDoorToCart(${door.id})">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Функция для добавления двери в корзину
function addDoorToCart(doorId) {
    const door = doorsData.find(d => d.id === doorId);
    if (door) {
        addToCart(door);
    }
}

// Функция для отображения каталога
function renderCatalog(doors = doorsData) {
    const grid = document.getElementById('doorsGrid');
    if (!grid) return;
    
    grid.innerHTML = doors.map(door => createDoorCard(door)).join('');
}

// Функция для фильтрации дверей
function filterDoors(category) {
    if (category === 'all') {
        renderCatalog(doorsData);
        return;
    }
    
    const filteredDoors = doorsData.filter(door => {
        const categories = Array.isArray(door.category) ? door.category : [door.category];
        return categories.includes(category);
    });
    
    renderCatalog(filteredDoors);
}

// Функция для сортировки дверей
function sortDoards(sortBy) {
    let sortedDoors = [...doorsData];
    
    switch(sortBy) {
        case 'price-low':
            sortedDoors.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedDoors.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            sortedDoors.sort((a, b) => b.new - a.new);
            break;
        case 'popular':
        default:
            sortedDoors.sort((a, b) => b.popular - a.popular);
            break;
    }
    
    renderCatalog(sortedDoors);
}

// Функция для показа деталей двери
function showDoorDetails(doorId) {
    const door = doorsData.find(d => d.id === doorId);
    if (!door) return;
    
    const modalContent = document.getElementById('productModalContent');
    const categories = Array.isArray(door.category) ? door.category : [door.category];
    
    modalContent.innerHTML = `
        <div class="product-image">
            <i class="fas fa-door-open"></i>
        </div>
        <div class="product-details">
            <span class="door-category ${categories[0]}">${getCategoryName(categories[0])}</span>
            <h3>${door.name}</h3>
            <p>${door.description}</p>
            <div class="product-price">${formatPrice(door.price)}</div>
            
            <h4>Характеристики:</h4>
            <ul class="product-features">
                <li><i class="fas fa-ruler-combined"></i> Размер: ${door.size}</li>
                <li><i class="fas fa-tree"></i> Материал: ${door.material}</li>
                <li><i class="fas fa-palette"></i> Цвет: ${door.color}</li>
                <li><i class="fas fa-arrows-alt-h"></i> Толщина: ${door.thickness}</li>
            </ul>
            
            <div class="door-actions" style="margin-top: 2rem;">
                <button class="btn btn-primary" onclick="addDoorToCart(${door.id}); closeProductModal()">
                    <i class="fas fa-cart-plus"></i> Добавить в корзину
                </button>
                <button class="btn-outline" onclick="closeProductModal()">Закрыть</button>
            </div>
        </div>
    `;
    
    document.getElementById('productModal').style.display = 'flex';
}

// Функция для закрытия модального окна товара
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Функция для быстрого просмотра
function quickView(doorId) {
    const door = doorsData.find(d => d.id === doorId);
    if (!door) return;
    
    // Создаем модальное окно быстрого просмотра
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'quick-view-modal';
    quickViewModal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view" onclick="closeQuickView()">&times;</button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="quick-view-info">
                    <h3>${door.name}</h3>
                    <p>${door.description}</p>
                    <div class="quick-view-price">${formatPrice(door.price)}</div>
                    <button class="btn btn-primary" onclick="addDoorToCart(${door.id}); closeQuickView()">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                    <button class="btn-outline" onclick="showDoorDetails(${door.id}); closeQuickView()">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(quickViewModal);
    document.body.style.overflow = 'hidden';
    
    // Закрытие по клику вне окна
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuickView();
        }
    });
}

// Функция закрытия быстрого просмотра
function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Функция для заказа двери (старая версия - можно оставить для обратной совместимости)
function orderDoor(doorId) {
    const door = doorsData.find(d => d.id === doorId);
    if (door) {
        alert(`Вы выбрали дверь "${door.name}" по цене ${formatPrice(door.price)}. Мы свяжемся с вами для уточнения деталей заказа.`);
        closeProductModal();
        closeQuickView();
    }
}

// Инициализация каталога при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Рендерим каталог
    renderCatalog();
    
    // Назначаем обработчики для фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            // Применяем фильтр
            filterDoors(this.dataset.filter);
        });
    });
    
    // Назначаем обработчик для сортировки
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortDoards(this.value);
        });
    }
    
    // Закрытие модальных окон при клике вне их
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProductModal();
            }
        });
    }
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCartModal();
            }
        });
    }
    
    // Активируем текущую страницу в меню
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === 'catalog.html' && link.textContent === 'Каталог')) {
            link.classList.add('active');
        }
    });
    
    // Назначаем обработчик для переключателя темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Сохраняем выбор пользователя
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Закрытие быстрого просмотра по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
            closeCartModal();
            closeProductModal();
        }
    });
});

// Экспортируем функции для использования в консоли
window.showDoorDetails = showDoorDetails;
window.orderDoor = orderDoor;
window.addDoorToCart = addDoorToCart;
window.closeProductModal = closeProductModal;
window.quickView = quickView;
window.closeQuickView = closeQuickView;