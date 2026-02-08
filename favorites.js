// favorites.js - Функционал избранного

// Ключ для localStorage
const FAVORITES_STORAGE_KEY = 'masterdoors_favorites';

// Инициализация избранного
let favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];

// Функция для обновления счетчика избранного
function updateFavoritesCount() {
    const favoritesCountElement = document.getElementById('favoritesCount');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favorites.length;
        favoritesCountElement.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
    }
}

// Функция для сохранения избранного в localStorage
function saveFavorites() {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    updateFavoritesCount();
}

// Функция для добавления товара в избранное
function addToFavorites(doorId) {
    const door = doorsData.find(d => d.id === doorId);
    if (!door) return;
    
    if (!favorites.find(f => f.id === doorId)) {
        favorites.push({
            ...door,
            addedAt: new Date().toISOString()
        });
        saveFavorites();
        showNotification(`"${door.name}" добавлен в избранное!`, false);
        
        // Анимация сердца
        const heartBtn = document.querySelector(`.favorite-btn[data-id="${doorId}"]`);
        if (heartBtn) {
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
            heartBtn.classList.add('favorite-active');
            heartBtn.classList.add('heart-pulse');
            
            setTimeout(() => {
                heartBtn.classList.remove('heart-pulse');
            }, 300);
        }
    }
}

// Функция для удаления товара из избранного
function removeFromFavorites(doorId) {
    const index = favorites.findIndex(f => f.id === doorId);
    if (index > -1) {
        const doorName = favorites[index].name;
        favorites.splice(index, 1);
        saveFavorites();
        showNotification(`"${doorName}" удален из избранного`, false);
        
        // Обновляем кнопку
        const heartBtn = document.querySelector(`.favorite-btn[data-id="${doorId}"]`);
        if (heartBtn) {
            heartBtn.innerHTML = '<i class="far fa-heart"></i>';
            heartBtn.classList.remove('favorite-active');
        }
    }
}

// Функция для проверки, находится ли товар в избранном
function isInFavorites(doorId) {
    return favorites.some(f => f.id === doorId);
}

// Функция для переключения состояния избранного
function toggleFavorite(doorId) {
    if (isInFavorites(doorId)) {
        removeFromFavorites(doorId);
    } else {
        addToFavorites(doorId);
    }
    
    // Обновляем отображение, если мы на странице избранного
    if (window.location.pathname.includes('favorites.html')) {
        renderFavoritesPage();
    }
}

// Функция для отображения страницы избранного
function renderFavoritesPage() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');
    const favoritesActions = document.getElementById('favoritesActions');
    
    if (!favoritesGrid || !emptyFavorites || !favoritesActions) return;
    
    if (favorites.length === 0) {
        favoritesGrid.style.display = 'none';
        emptyFavorites.style.display = 'block';
        favoritesActions.style.display = 'none';
        return;
    }
    
    emptyFavorites.style.display = 'none';
    favoritesGrid.style.display = 'grid';
    favoritesActions.style.display = 'flex';
    
    favoritesGrid.innerHTML = favorites.map(door => `
        <div class="favorite-card" data-id="${door.id}">
            <div class="favorite-card-image">
                <i class="fas fa-door-open"></i>
                <button class="favorite-remove-btn" onclick="removeFromFavorites(${door.id})" title="Удалить из избранного">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="favorite-card-content">
                <span class="door-category ${Array.isArray(door.category) ? door.category[0] : door.category}">
                    ${getCategoryName(Array.isArray(door.category) ? door.category[0] : door.category)}
                </span>
                <h3>${door.name}</h3>
                <p>${door.description}</p>
                <div class="favorite-card-price">${formatPrice(door.price)}</div>
                <div class="favorite-card-actions">
                    <button class="btn btn-primary" onclick="showDoorDetails(${door.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="btn-outline" onclick="addToCart(${door.id})">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция для добавления всех избранных товаров в корзину
function addAllFavoritesToCart() {
    if (favorites.length === 0) {
        showNotification('В избранном нет товаров!', true);
        return;
    }
    
    let addedCount = 0;
    favorites.forEach(door => {
        addToCart(door);
        addedCount++;
    });
    
    showNotification(`${addedCount} товаров добавлено в корзину!`, false);
}

// Функция для очистки избранного
function clearFavorites() {
    if (favorites.length === 0) {
        showNotification('Избранное уже пусто!', false);
        return;
    }
    
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
        favorites = [];
        saveFavorites();
        renderFavoritesPage();
        showNotification('Избранное очищено!', false);
    }
}

// Функция для открытия модального окна избранного
function openFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        updateFavoritesModal();
        modal.style.display = 'flex';
    }
}

// Функция для закрытия модального окна избранного
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Функция для обновления модального окна избранного
function updateFavoritesModal() {
    const favoritesContent = document.getElementById('favoritesContent');
    if (!favoritesContent) return;
    
    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart fa-3x"></i>
                <h4>В избранном пока пусто</h4>
                <p>Добавляйте понравившиеся товары, нажимая на сердечко ♥</p>
            </div>
        `;
        return;
    }
    
    favoritesContent.innerHTML = `
        <div class="favorites-modal-list">
            ${favorites.slice(0, 5).map(door => `
                <div class="favorites-modal-item" data-id="${door.id}">
                    <div class="favorites-modal-image">
                        <i class="fas fa-door-open"></i>
                    </div>
                    <div class="favorites-modal-info">
                        <div class="favorites-modal-name">${door.name}</div>
                        <div class="favorites-modal-price">${formatPrice(door.price)}</div>
                    </div>
                    <div class="favorites-modal-actions">
                        <button class="btn-outline small" onclick="addToCart(${door.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="favorite-remove-btn small" onclick="removeFromFavorites(${door.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="favorites-modal-footer">
            <button class="btn btn-primary" onclick="closeFavoritesModal(); window.location.href='favorites.html'">
                <i class="fas fa-heart"></i> Перейти в избранное
            </button>
        </div>
    `;
}

// Инициализация избранного при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateFavoritesCount();
    
    // Если мы на странице избранного, рендерим ее
    if (window.location.pathname.includes('favorites.html')) {
        renderFavoritesPage();
    }
    
    // Закрытие модального окна избранного при клике вне его
    const favoritesModal = document.getElementById('favoritesModal');
    if (favoritesModal) {
        favoritesModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeFavoritesModal();
            }
        });
    }
    
    // Обработка клика по ссылке избранного
    const favoritesLink = document.getElementById('favoritesLink');
    if (favoritesLink) {
        favoritesLink.addEventListener('click', function(e) {
            if (!window.location.pathname.includes('favorites.html')) {
                e.preventDefault();
                openFavoritesModal();
            }
        });
    }
});

// Экспорт функций для использования в других файлах
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.toggleFavorite = toggleFavorite;
window.isInFavorites = isInFavorites;
window.openFavoritesModal = openFavoritesModal;
window.closeFavoritesModal = closeFavoritesModal;
window.addAllFavoritesToCart = addAllFavoritesToCart;
window.clearFavorites = clearFavorites;