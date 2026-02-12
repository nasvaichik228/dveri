// Данные для калькулятора
const calculatorData = {
    // Базовые цены по типу двери
    doorTypes: {
        interior: { base: 15000, name: 'Межкомнатная' },
        entrance: { base: 35000, name: 'Входная' },
        sliding: { base: 25000, name: 'Раздвижная' },
        glass: { base: 30000, name: 'Стеклянная' }
    },

    // Множители стоимости по материалу
    materials: {
        pine: { multiplier: 1.0, name: 'Сосна' },
        oak: { multiplier: 2.0, name: 'Дуб' },
        mdf: { multiplier: 0.8, name: 'МДФ' },
        steel: { multiplier: 1.5, name: 'Сталь' }
    },

    // Дополнительные опции
    options: {
        glass_insert: { price: 5000, name: 'Стеклянная вставка' },
        premium_lock: { price: 3000, name: 'Премиум замок' },
        soundproof: { price: 4000, name: 'Шумоизоляция' },
        thermal: { price: 6000, name: 'Теплоизоляция' },
        painting: { price: 7000, name: 'Покраска в цвет' },
        installation: { price: 8000, name: 'Установка' }
    },

    // Стандартные размеры (мм)
    standardSize: {
        height: 2000,
        width: 800,
        thickness: 40
    }
};

// Текущий расчёт
let currentCalculation = {
    doorType: 'interior',
    material: 'pine',
    height: 2000,
    width: 800,
    thickness: 40,
    selectedOptions: [],
    quantity: 1
};

// Предыдущие значения для анимации
let previousValues = {
    basePrice: 0,
    sizePrice: 0,
    optionsPrice: 0,
    pricePerDoor: 0,
    totalPrice: 0,
    finalPrice: 0
};

// Функция для анимации изменения цифр
function animateValue(element, start, end, duration = 500) {
    if (!element) return;
    
    // Если значения одинаковые, не анимируем
    if (start === end) {
        element.textContent = formatPrice(end);
        return;
    }
    
    // Добавляем класс анимации
    element.classList.add('price-changing');
    
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        
        // Easing функция для плавности
        progress = easeOutQuart(progress);
        
        const current = start + (range * progress);
        element.textContent = formatPrice(Math.round(current));
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = formatPrice(end);
            setTimeout(() => {
                element.classList.remove('price-changing');
            }, 200);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Easing функция для анимации
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Функция форматирования цены
function formatPrice(price) {
    return Math.round(price).toLocaleString('ru-RU') + ' ₽';
}

// Валидация формы
function validateForm(formElement) {
    let isValid = true;
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        // Удаляем предыдущие классы ошибок
        input.classList.remove('error', 'success');
        
        if (!input.value.trim()) {
            input.classList.add('error');
            input.setAttribute('placeholder', 'Это поле обязательно!');
            isValid = false;
            
            // Добавляем подсказку
            showFieldError(input, 'Поле обязательно для заполнения');
        } else {
            // Валидация email
            if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('error');
                showFieldError(input, 'Введите корректный email');
                isValid = false;
            }
            // Валидация телефона
            else if (input.type === 'tel' && !isValidPhone(input.value)) {
                input.classList.add('error');
                showFieldError(input, 'Введите корректный телефон');
                isValid = false;
            } else {
                input.classList.add('success');
                removeFieldError(input);
            }
        }
    });
    
    return isValid;
}

// Проверка email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Проверка телефона
function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

// Показ ошибки поля
function showFieldError(input, message) {
    removeFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    
    // Анимация появления ошибки
    setTimeout(() => {
        errorDiv.classList.add('visible');
    }, 10);
}

// Удаление ошибки поля
function removeFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Инициализация калькулятора
function initCalculator() {
    // Устанавливаем значения по умолчанию
    setDefaultValues();
    
    // Назначаем обработчики событий
    setupEventListeners();
    
    // Рассчитываем начальную стоимость
    calculatePrice();
    
    // Инициализируем предыдущие значения
    updatePreviousValues();
}

// Обновление предыдущих значений
function updatePreviousValues() {
    previousValues = {
        basePrice: getNumericValue('basePrice'),
        sizePrice: getNumericValue('sizePrice'),
        optionsPrice: getNumericValue('optionsPrice'),
        pricePerDoor: getNumericValue('pricePerDoor'),
        totalPrice: getNumericValue('totalPrice')
    };
}

// Получение числового значения цены
function getNumericValue(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return 0;
    const text = element.textContent.replace(/\s/g, '').replace('₽', '');
    return parseInt(text) || 0;
}

// Установка значений по умолчанию
function setDefaultValues() {
    document.querySelector('input[name="doorType"][value="interior"]').checked = true;
    document.querySelector('input[name="material"][value="pine"]').checked = true;
    
    document.getElementById('height').value = currentCalculation.height;
    document.getElementById('width').value = currentCalculation.width;
    document.getElementById('thickness').value = currentCalculation.thickness;
    document.getElementById('doorQuantity').value = currentCalculation.quantity;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Тип двери
    document.querySelectorAll('input[name="doorType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentCalculation.doorType = this.value;
            calculatePrice();
            highlightSelectedOption(this);
        });
    });

    // Материал
    document.querySelectorAll('input[name="material"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentCalculation.material = this.value;
            calculatePrice();
            highlightSelectedOption(this);
        });
    });

    // Размеры
    document.getElementById('height').addEventListener('input', updateSize);
    document.getElementById('width').addEventListener('input', updateSize);
    document.getElementById('thickness').addEventListener('input', updateSize);
    
    // Количество дверей
    document.getElementById('doorQuantity').addEventListener('input', function() {
        currentCalculation.quantity = parseInt(this.value) || 1;
        if (currentCalculation.quantity < 1) currentCalculation.quantity = 1;
        if (currentCalculation.quantity > 10) currentCalculation.quantity = 10;
        this.value = currentCalculation.quantity;
        calculatePrice();
    });

    // Предустановленные размеры
    document.querySelectorAll('.size-preset').forEach(button => {
        button.addEventListener('click', function() {
            const height = parseInt(this.dataset.height);
            const width = parseInt(this.dataset.width);
            
            document.getElementById('height').value = height;
            document.getElementById('width').value = width;
            
            currentCalculation.height = height;
            currentCalculation.width = width;
            
            this.classList.add('size-preset-active');
            setTimeout(() => {
                this.classList.remove('size-preset-active');
            }, 300);
            
            calculatePrice();
        });
    });

    // Дополнительные опции
    document.querySelectorAll('input[name="options"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                if (!currentCalculation.selectedOptions.includes(this.value)) {
                    currentCalculation.selectedOptions.push(this.value);
                }
            } else {
                const index = currentCalculation.selectedOptions.indexOf(this.value);
                if (index > -1) {
                    currentCalculation.selectedOptions.splice(index, 1);
                }
            }
            calculatePrice();
        });
    });

    // Кнопка сохранения
    document.getElementById('saveCalculation').addEventListener('click', openSaveModal);
    
    // Кнопка заказа
    document.getElementById('orderCalculation').addEventListener('click', openOrderModal);
    
    // Кнопка копирования ссылки
    document.getElementById('copyLink').addEventListener('click', copyCalculationLink);
    
    // Примеры расчётов
    document.querySelectorAll('[data-example]').forEach(button => {
        button.addEventListener('click', function() {
            loadExample(this.dataset.example);
        });
    });

    // Формы с валидацией
    const saveForm = document.getElementById('saveForm');
    if (saveForm) {
        saveForm.addEventListener('submit', saveCalculation);
        
        // Добавляем валидацию при вводе
        saveForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                removeFieldError(this);
            });
            
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                    showFieldError(this, 'Поле обязательно для заполнения');
                } else if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                    this.classList.add('error');
                    showFieldError(this, 'Введите корректный email');
                } else if (this.type === 'tel' && this.value.trim() && !isValidPhone(this.value)) {
                    this.classList.add('error');
                    showFieldError(this, 'Введите корректный телефон');
                } else {
                    this.classList.add('success');
                }
            });
        });
    }
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
        
        orderForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                removeFieldError(this);
            });
            
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                    showFieldError(this, 'Поле обязательно для заполнения');
                } else if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                    this.classList.add('error');
                    showFieldError(this, 'Введите корректный email');
                } else if (this.type === 'tel' && this.value.trim() && !isValidPhone(this.value)) {
                    this.classList.add('error');
                    showFieldError(this, 'Введите корректный телефон');
                } else {
                    this.classList.add('success');
                }
            });
        });
    }
    
    // Кнопка добавления в корзину из калькулятора
    const addToCartBtn = document.getElementById('addToCartFromCalculator');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addCalculationToCart);
    }
    
    // Кнопки управления количеством
    document.getElementById('decreaseQuantity')?.addEventListener('click', function() {
        if (currentCalculation.quantity > 1) {
            currentCalculation.quantity--;
            document.getElementById('doorQuantity').value = currentCalculation.quantity;
            calculatePrice();
        }
    });
    
    document.getElementById('increaseQuantity')?.addEventListener('click', function() {
        if (currentCalculation.quantity < 10) {
            currentCalculation.quantity++;
            document.getElementById('doorQuantity').value = currentCalculation.quantity;
            calculatePrice();
        }
    });
}

// Подсветка выбранной опции
function highlightSelectedOption(element) {
    const parentLabel = element.closest('label');
    if (parentLabel) {
        parentLabel.classList.add('option-selected');
        
        const allOptions = parentLabel.parentElement.querySelectorAll('label');
        allOptions.forEach(option => {
            if (option !== parentLabel) {
                option.classList.remove('option-selected');
            }
        });
        
        setTimeout(() => {
            parentLabel.classList.remove('option-selected');
        }, 500);
    }
}

// Обновление размеров
function updateSize() {
    currentCalculation.height = parseInt(document.getElementById('height').value) || 2000;
    currentCalculation.width = parseInt(document.getElementById('width').value) || 800;
    currentCalculation.thickness = parseInt(document.getElementById('thickness').value) || 40;
    calculatePrice();
}

// Рассчёт стоимости
function calculatePrice() {
    const doorType = calculatorData.doorTypes[currentCalculation.doorType];
    const material = calculatorData.materials[currentCalculation.material];
    
    // Базовая стоимость
    let basePrice = doorType.base * material.multiplier;
    
    // Надбавка за нестандартный размер
    const sizeMultiplier = calculateSizeMultiplier();
    const sizePrice = basePrice * (sizeMultiplier - 1);
    
    // Стоимость дополнительных опций
    let optionsPrice = 0;
    currentCalculation.selectedOptions.forEach(optionId => {
        if (calculatorData.options[optionId]) {
            optionsPrice += calculatorData.options[optionId].price;
        }
    });
    
    // Итоговая стоимость за одну дверь
    const pricePerDoor = basePrice + sizePrice + optionsPrice;
    
    // Общая стоимость с учётом количества
    const totalPrice = pricePerDoor * currentCalculation.quantity;
    
    // Скидка при заказе от 2 дверей
    let discount = 0;
    let discountAmount = 0;
    if (currentCalculation.quantity >= 2) {
        discount = 15;
        discountAmount = totalPrice * discount / 100;
    }
    
    // Цена со скидкой
    const finalPrice = totalPrice - discountAmount;
    
    // Обновление отображения с анимацией
    updatePriceDisplayWithAnimation(basePrice, sizePrice, optionsPrice, pricePerDoor, totalPrice, discount, discountAmount, finalPrice);
    
    // Сохранение расчёта в localStorage
    saveToLocalStorage();
}

// Обновление отображения цен с анимацией
function updatePriceDisplayWithAnimation(basePrice, sizePrice, optionsPrice, pricePerDoor, totalPrice, discount, discountAmount, finalPrice) {
    // Анимируем каждое значение
    animateValue(document.getElementById('basePrice'), previousValues.basePrice, basePrice);
    animateValue(document.getElementById('sizePrice'), previousValues.sizePrice, sizePrice);
    animateValue(document.getElementById('optionsPrice'), previousValues.optionsPrice, optionsPrice);
    animateValue(document.getElementById('pricePerDoor'), previousValues.pricePerDoor, pricePerDoor);
    animateValue(document.getElementById('totalPrice'), previousValues.totalPrice, totalPrice);
    
    document.getElementById('quantityDisplay').textContent = currentCalculation.quantity;
    
    // Обновляем предыдущие значения
    updatePreviousValues();
    
    // Обновляем информацию о скидке
    const discountElement = document.getElementById('discountInfo');
    const finalPriceElement = document.getElementById('finalPrice');
    
    if (discount > 0) {
        discountElement.innerHTML = `
            <div class="discount-badge">
                <i class="fas fa-tag"></i>
                <span>Скидка ${discount}% за ${currentCalculation.quantity} дверей: -${formatPrice(discountAmount)}</span>
            </div>
        `;
        discountElement.style.display = 'block';
        
        finalPriceElement.innerHTML = `
            <div class="price-row final-total">
                <span>Итого со скидкой:</span>
                <span id="finalPriceValue">${formatPrice(finalPrice)}</span>
            </div>
        `;
        finalPriceElement.style.display = 'block';
        
        // Анимируем финальную цену
        const finalPriceValue = document.getElementById('finalPriceValue');
        if (finalPriceValue) {
            animateValue(finalPriceValue, previousValues.finalPrice || 0, finalPrice);
        }
        previousValues.finalPrice = finalPrice;
    } else {
        discountElement.style.display = 'none';
        finalPriceElement.style.display = 'none';
        previousValues.finalPrice = 0;
    }
    
    // Обновляем бейдж экономии
    const economyBadge = document.querySelector('.economy-badge');
    if (economyBadge) {
        if (currentCalculation.quantity >= 2) {
            economyBadge.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Вы экономите ${formatPrice(discountAmount)} (${discount}%)!</span>
            `;
            economyBadge.style.background = '#e8f5e9';
            economyBadge.style.color = '#2e7d32';
            economyBadge.classList.add('economy-badge-animate');
            setTimeout(() => {
                economyBadge.classList.remove('economy-badge-animate');
            }, 500);
        } else {
            economyBadge.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Экономия до 15% при заказе от 2 дверей</span>
            `;
            economyBadge.style.background = '';
            economyBadge.style.color = '';
        }
    }
}

// Расчёт множителя за размер
function calculateSizeMultiplier() {
    const standardArea = calculatorData.standardSize.height * calculatorData.standardSize.width;
    const currentArea = currentCalculation.height * currentCalculation.width;
    
    let multiplier = 1.0;
    
    const areaRatio = currentArea / standardArea;
    if (areaRatio > 1) {
        multiplier = 1 + (areaRatio - 1) * 1.5;
    }
    
    if (currentCalculation.thickness > 40) {
        multiplier *= 1 + (currentCalculation.thickness - 40) / 100;
    }
    
    return Math.round(multiplier * 100) / 100;
}

// Сохранение в localStorage
function saveToLocalStorage() {
    const calculationData = {
        ...currentCalculation,
        timestamp: new Date().toISOString(),
        totalPrice: getNumericValue('totalPrice')
    };
    
    localStorage.setItem('lastCalculation', JSON.stringify(calculationData));
}

// Загрузка примера
function loadExample(exampleId) {
    const examples = {
        '1': {
            doorType: 'interior',
            material: 'oak',
            height: 2000,
            width: 800,
            thickness: 40,
            options: ['glass_insert'],
            quantity: 1
        },
        '2': {
            doorType: 'entrance',
            material: 'steel',
            height: 2100,
            width: 900,
            thickness: 80,
            options: ['thermal', 'premium_lock'],
            quantity: 1
        },
        '3': {
            doorType: 'glass',
            material: 'mdf',
            height: 2100,
            width: 1000,
            thickness: 25,
            options: ['painting', 'soundproof', 'installation'],
            quantity: 2
        }
    };
    
    const example = examples[exampleId];
    if (!example) return;
    
    // Устанавливаем значения
    document.querySelector(`input[name="doorType"][value="${example.doorType}"]`).checked = true;
    document.querySelector(`input[name="material"][value="${example.material}"]`).checked = true;
    
    document.getElementById('height').value = example.height;
    document.getElementById('width').value = example.width;
    document.getElementById('thickness').value = example.thickness;
    document.getElementById('doorQuantity').value = example.quantity;
    
    document.querySelectorAll('input[name="options"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    example.options.forEach(optionId => {
        const checkbox = document.querySelector(`input[name="options"][value="${optionId}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    currentCalculation = {
        doorType: example.doorType,
        material: example.material,
        height: example.height,
        width: example.width,
        thickness: example.thickness,
        selectedOptions: example.options,
        quantity: example.quantity
    };
    
    calculatePrice();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Пример расчёта успешно загружен!');
}

// Открытие модального окна сохранения
function openSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.style.display = 'flex';
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Закрытие модального окна сохранения
function closeSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Открытие модального окна заказа
function openOrderModal() {
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = generateOrderSummary();
    
    const modal = document.getElementById('orderModal');
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Закрытие модального окна заказа
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Генерация сводки заказа
function generateOrderSummary() {
    const doorType = calculatorData.doorTypes[currentCalculation.doorType];
    const material = calculatorData.materials[currentCalculation.material];
    const totalPrice = getNumericValue('totalPrice');
    
    let discount = 0;
    let discountAmount = 0;
    if (currentCalculation.quantity >= 2) {
        discount = 15;
        discountAmount = totalPrice * discount / 100;
    }
    const finalPrice = totalPrice - discountAmount;
    
    let optionsList = '';
    if (currentCalculation.selectedOptions.length > 0) {
        optionsList = '<ul style="margin: 10px 0; padding-left: 20px;">';
        currentCalculation.selectedOptions.forEach(optionId => {
            const option = calculatorData.options[optionId];
            optionsList += `<li>${option.name}: ${option.price.toLocaleString()} ₽</li>`;
        });
        optionsList += '</ul>';
    } else {
        optionsList = '<p>Без дополнительных опций</p>';
    }
    
    return `
        <h4>Детали заказа:</h4>
        <p><strong>Тип:</strong> ${doorType.name}</p>
        <p><strong>Материал:</strong> ${material.name}</p>
        <p><strong>Количество:</strong> ${currentCalculation.quantity} шт.</p>
        <p><strong>Размеры:</strong> ${currentCalculation.height}×${currentCalculation.width}×${currentCalculation.thickness} мм</p>
        <p><strong>Дополнительные опции:</strong></p>
        ${optionsList}
        ${currentCalculation.quantity >= 2 ? `
            <p style="color: #4caf50; font-weight: bold;">
                <i class="fas fa-tag"></i> Скидка ${discount}%: -${discountAmount.toLocaleString()} ₽
            </p>
        ` : ''}
        <p style="font-size: 1.2rem; font-weight: bold; color: #8B4513; margin-top: 15px;">
            Итоговая стоимость: ${finalPrice.toLocaleString()} ₽
        </p>
    `;
}

// Сохранение расчёта с валидацией
function saveCalculation(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Пожалуйста, заполните все обязательные поля', true);
        return;
    }
    
    const formData = new FormData(e.target);
    const calculation = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        comment: formData.get('comment'),
        calculation: currentCalculation,
        totalPrice: getNumericValue('totalPrice'),
        timestamp: new Date().toISOString()
    };
    
    let savedCalculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    savedCalculations.push(calculation);
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
    
    showNotification('Расчёт отправлен на ваш email! Также он сохранён в истории.');
    closeSaveModal();
    e.target.reset();
    
    // Сбрасываем классы полей
    e.target.querySelectorAll('input, textarea').forEach(field => {
        field.classList.remove('success', 'error');
    });
}

// Отправка заказа с валидацией
function submitOrder(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Пожалуйста, заполните все обязательные поля', true);
        return;
    }
    
    const formData = new FormData(e.target);
    const order = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        calculation: currentCalculation,
        totalPrice: getNumericValue('totalPrice'),
        timestamp: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    showNotification('Заявка отправлена! Наш менеджер свяжется с вами в течение 15 минут.');
    closeOrderModal();
    e.target.reset();
}

// Копирование ссылки на расчёт
function copyCalculationLink() {
    const calculationString = JSON.stringify(currentCalculation);
    const base64String = btoa(encodeURIComponent(calculationString));
    const url = `${window.location.origin}${window.location.pathname}#calculation=${base64String}`;
    
    navigator.clipboard.writeText(url)
        .then(() => {
            const btn = document.getElementById('copyLink');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#4caf50';
            
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.color = '';
            }, 2000);
        })
        .catch(err => {
            showNotification('Не удалось скопировать ссылку', true);
        });
}

// Печать расчёта
function printCalculation() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Расчёт стоимости двери - МастерДвери</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #8B4513; }
                    .calculation-details { margin: 20px 0; }
                    .price { font-size: 24px; font-weight: bold; color: #8B4513; margin: 20px 0; }
                    .footer { margin-top: 40px; font-size: 12px; color: #666; }
                    .discount { color: #4caf50; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Расчёт стоимости двери</h1>
                <p>Дата: ${new Date().toLocaleDateString()}</p>
                <div class="calculation-details">
                    ${generateOrderSummary().replace(/<[^>]*>/g, '').replace(/\n/g, '<br>')}
                </div>
                <div class="footer">
                    <p>МастерДвери - производство дверей на заказ</p>
                    <p>Телефон: +7 (999) 123-45-67</p>
                    <p>Email: info@masterdoors.ru</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Загрузка расчёта из ссылки
function loadFromUrl() {
    const hash = window.location.hash;
    if (hash.includes('calculation=')) {
        const base64String = hash.split('=')[1];
        try {
            const calculationString = decodeURIComponent(atob(base64String));
            const savedCalculation = JSON.parse(calculationString);
            
            if (savedCalculation.doorType) {
                document.querySelector(`input[name="doorType"][value="${savedCalculation.doorType}"]`).checked = true;
                currentCalculation.doorType = savedCalculation.doorType;
            }
            
            if (savedCalculation.material) {
                document.querySelector(`input[name="material"][value="${savedCalculation.material}"]`).checked = true;
                currentCalculation.material = savedCalculation.material;
            }
            
            if (savedCalculation.height) {
                document.getElementById('height').value = savedCalculation.height;
                currentCalculation.height = savedCalculation.height;
            }
            
            if (savedCalculation.width) {
                document.getElementById('width').value = savedCalculation.width;
                currentCalculation.width = savedCalculation.width;
            }
            
            if (savedCalculation.thickness) {
                document.getElementById('thickness').value = savedCalculation.thickness;
                currentCalculation.thickness = savedCalculation.thickness;
            }
            
            if (savedCalculation.quantity) {
                document.getElementById('doorQuantity').value = savedCalculation.quantity;
                currentCalculation.quantity = savedCalculation.quantity;
            }
            
            if (savedCalculation.selectedOptions) {
                document.querySelectorAll('input[name="options"]').forEach(checkbox => {
                    checkbox.checked = savedCalculation.selectedOptions.includes(checkbox.value);
                });
                currentCalculation.selectedOptions = savedCalculation.selectedOptions;
            }
            
            calculatePrice();
        } catch (error) {
            console.error('Ошибка загрузки расчёта из URL:', error);
        }
    }
}

// Функция для добавления расчета в корзину
function addCalculationToCart() {
    const doorType = calculatorData.doorTypes[currentCalculation.doorType];
    const material = calculatorData.materials[currentCalculation.material];
    const totalPrice = getNumericValue('totalPrice');
    
    let discount = 0;
    if (currentCalculation.quantity >= 2) {
        discount = 15;
    }
    const discountAmount = totalPrice * discount / 100;
    const finalPrice = totalPrice - discountAmount;
    
    const customDoor = {
        id: Date.now(),
        name: `Дверь ${doorType.name} из ${material.name}`,
        description: `Индивидуальный заказ: ${doorType.name}, ${material.name}, ${currentCalculation.height}x${currentCalculation.width}x${currentCalculation.thickness}мм, Количество: ${currentCalculation.quantity} шт.`,
        price: finalPrice / currentCalculation.quantity,
        quantity: currentCalculation.quantity,
        custom: true,
        calculation: { ...currentCalculation }
    };
    
    if (currentCalculation.selectedOptions.length > 0) {
        const optionsText = currentCalculation.selectedOptions.map(optionId => {
            return calculatorData.options[optionId].name;
        }).join(', ');
        
        customDoor.description += `, опции: ${optionsText}`;
    }
    
    if (discount > 0) {
        customDoor.description += `, Скидка: ${discount}%`;
    }
    
    addToCart(customDoor, currentCalculation.quantity);
    showNotification(`Индивидуальная дверь (${currentCalculation.quantity} шт.) добавлена в корзину!`);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializeTheme === 'function') {
        initializeTheme();
    }
    
    initCalculator();
    loadFromUrl();
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                setTimeout(() => {
                    this.style.display = 'none';
                }, 300);
            }
        });
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// Экспорт функций для глобального использования
window.openSaveModal = openSaveModal;
window.closeSaveModal = closeSaveModal;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.printCalculation = printCalculation;
window.addCalculationToCart = addCalculationToCart;