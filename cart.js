// cart.js - Функционал корзины

// Ключ для localStorage
const CART_STORAGE_KEY = 'masterdoors_cart';

// Инициализация корзины
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

// Функция для обновления счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Функция для обновления общей стоимости
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cartTotalPrice');
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(total);
    }
    
    const cartModalTotalElement = document.getElementById('cartModalTotalPrice');
    if (cartModalTotalElement) {
        cartModalTotalElement.textContent = formatPrice(total);
    }
    
    const cartFinalElement = document.getElementById('cartFinalPrice');
    if (cartFinalElement) {
        cartFinalElement.textContent = formatPrice(total);
    }
}

// Функция для сохранения корзины в localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
    updateCartDropdown();
}

// Функция для добавления товара в корзину
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    showNotification(`"${product.name}" добавлен в корзину!`);
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Функция для изменения количества товара
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
        }
    }
}

// Функция для очистки корзины
function clearCart() {
    if (cart.length === 0) {
        showNotification('Корзина уже пуста!');
        return;
    }
    
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        saveCart();
        showNotification('Корзина очищена!');
    }
}

// Функция для обновления выпадающего списка корзины
function updateCartDropdown() {
    const cartItemsElement = document.getElementById('cartItems');
    if (!cartItemsElement) return;
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p></div>';
        return;
    }
    
    cartItemsElement.innerHTML = cart.slice(0, 3).map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img">
                <i class="fas fa-door-open"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Функция для открытия модального окна корзины
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        updateCartModal();
        modal.style.display = 'flex';
    }
}

// Функция для закрытия модального окна корзины
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Функция для обновления модального окна корзины
function updateCartModal() {
    const cartItemsListElement = document.getElementById('cartItemsList');
    if (!cartItemsListElement) return;
    
    if (cart.length === 0) {
        cartItemsListElement.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h4>Корзина пуста</h4>
                <p>Добавьте товары из каталога</p>
                <button class="btn btn-primary" onclick="closeCartModal(); window.location.href='catalog.html'">
                    Перейти в каталог
                </button>
            </div>
        `;
        return;
    }
    
    cartItemsListElement.innerHTML = cart.map(item => `
        <div class="cart-item-modal" data-id="${item.id}">
            <div class="cart-item-modal-img">
                <i class="fas fa-door-open"></i>
            </div>
            <div class="cart-item-modal-info">
                <div class="cart-item-modal-name">${item.name}</div>
                <div class="cart-item-modal-details">${item.description || ''}</div>
                <div class="cart-item-modal-actions">
                    <div class="cart-item-modal-price">${formatPrice(item.price * item.quantity)}</div>
                    <div class="cart-item-modal-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Функция для оформления заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары перед оформлением заказа.');
        return;
    }
    
    // Сохраняем заказ
    const order = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Показываем форму заказа
    const orderForm = `
        <h4>Оформление заказа</h4>
        <form id="checkoutForm" style="margin-top: 1rem;">
            <input type="text" placeholder="Ваше имя" required>
            <input type="tel" placeholder="Ваш телефон" required>
            <input type="email" placeholder="Ваш email" required>
            <textarea placeholder="Адрес доставки и комментарий" rows="3"></textarea>
            <button type="submit" class="btn btn-primary">Подтвердить заказ</button>
        </form>
    `;
    
    const cartModalContent = document.getElementById('cartModalContent');
    if (cartModalContent) {
        cartModalContent.innerHTML = orderForm;
        
        document.getElementById('checkoutForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Очищаем корзину после заказа
            cart = [];
            saveCart();
            
            showNotification('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
            closeCartModal();
        });
    }
}

// Функция для применения скидки
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value;
    const discountCodes = {
        'WELCOME10': 10,
        'SUMMER15': 15,
        'DOOR20': 20
    };
    
    if (discountCode in discountCodes) {
        const discountPercent = discountCodes[discountCode];
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = total * discountPercent / 100;
        const finalPrice = total - discountAmount;
        
        document.getElementById('cartFinalPrice').textContent = formatPrice(finalPrice);
        showNotification(`Скидка ${discountPercent}% применена!`);
    } else {
        showNotification('Неверный код скидки', true);
    }
}

// Функция для перехода в корзину
function goToCart() {
    openCartModal();
}

// Функция для показа уведомлений
function showNotification(message, isError = false) {
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

// Функция для форматирования цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartTotal();
    updateCartDropdown();
    
    // Закрытие модального окна корзины при клике вне его
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCartModal();
            }
        });
    }
    
    // Обработка клика по иконке корзины
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            openCartModal();
        });
    }
});

// Экспорт функций для использования в других файлах
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.goToCart = goToCart;
window.applyDiscount = applyDiscount;
window.checkout = checkout;
window.showNotification = showNotification;