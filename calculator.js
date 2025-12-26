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
    selectedOptions: []
};

// Инициализация калькулятора
function initCalculator() {
    // Устанавливаем значения по умолчанию
    setDefaultValues();
    
    // Назначаем обработчики событий
    setupEventListeners();
    
    // Рассчитываем начальную стоимость
    calculatePrice();
}

// Установка значений по умолчанию
function setDefaultValues() {
    document.querySelector('input[name="doorType"][value="interior"]').checked = true;
    document.querySelector('input[name="material"][value="pine"]').checked = true;
    
    document.getElementById('height').value = currentCalculation.height;
    document.getElementById('width').value = currentCalculation.width;
    document.getElementById('thickness').value = currentCalculation.thickness;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Тип двери
    document.querySelectorAll('input[name="doorType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentCalculation.doorType = this.value;
            calculatePrice();
        });
    });

    // Материал
    document.querySelectorAll('input[name="material"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentCalculation.material = this.value;
            calculatePrice();
        });
    });

    // Размеры
    document.getElementById('height').addEventListener('input', updateSize);
    document.getElementById('width').addEventListener('input', updateSize);
    document.getElementById('thickness').addEventListener('input', updateSize);

    // Предустановленные размеры
    document.querySelectorAll('.size-preset').forEach(button => {
        button.addEventListener('click', function() {
            const height = parseInt(this.dataset.height);
            const width = parseInt(this.dataset.width);
            
            document.getElementById('height').value = height;
            document.getElementById('width').value = width;
            
            currentCalculation.height = height;
            currentCalculation.width = width;
            
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

    // Формы
    document.getElementById('saveForm').addEventListener('submit', saveCalculation);
    document.getElementById('orderForm').addEventListener('submit', submitOrder);
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
    
    // Итоговая стоимость
    const totalPrice = basePrice + sizePrice + optionsPrice;
    
    // Обновление отображения
    updatePriceDisplay(basePrice, sizePrice, optionsPrice, totalPrice);
    
    // Сохранение расчёта в localStorage
    saveToLocalStorage();
}

// Расчёт множителя за размер
function calculateSizeMultiplier() {
    const standardArea = calculatorData.standardSize.height * calculatorData.standardSize.width;
    const currentArea = currentCalculation.height * currentCalculation.width;
    
    let multiplier = 1.0;
    
    // +10% за каждые 10% увеличения площади
    const areaRatio = currentArea / standardArea;
    if (areaRatio > 1) {
        multiplier = 1 + (areaRatio - 1) * 1.5;
    }
    
    // Дополнительная надбавка за толщину
    if (currentCalculation.thickness > 40) {
        multiplier *= 1 + (currentCalculation.thickness - 40) / 100;
    }
    
    return Math.round(multiplier * 100) / 100;
}

// Обновление отображения цен
function updatePriceDisplay(basePrice, sizePrice, optionsPrice, totalPrice) {
    const formatPrice = (price) => Math.round(price).toLocaleString('ru-RU') + ' ₽';
    
    document.getElementById('basePrice').textContent = formatPrice(basePrice);
    document.getElementById('sizePrice').textContent = formatPrice(sizePrice);
    document.getElementById('optionsPrice').textContent = formatPrice(optionsPrice);
    document.getElementById('totalPrice').textContent = formatPrice(totalPrice);
}

// Сохранение в localStorage
function saveToLocalStorage() {
    const calculationData = {
        ...currentCalculation,
        timestamp: new Date().toISOString(),
        totalPrice: getTotalPrice()
    };
    
    localStorage.setItem('lastCalculation', JSON.stringify(calculationData));
}

// Получение итоговой цены
function getTotalPrice() {
    const totalElement = document.getElementById('totalPrice');
    const priceText = totalElement.textContent.replace(/\s/g, '');
    return parseInt(priceText);
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
            options: ['glass_insert']
        },
        '2': {
            doorType: 'entrance',
            material: 'steel',
            height: 2100,
            width: 900,
            thickness: 80,
            options: ['thermal', 'premium_lock']
        },
        '3': {
            doorType: 'glass',
            material: 'mdf',
            height: 2100,
            width: 1000,
            thickness: 25,
            options: ['painting', 'soundproof', 'installation']
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
    
    // Сбрасываем все опции
    document.querySelectorAll('input[name="options"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Устанавливаем выбранные опции
    example.options.forEach(optionId => {
        const checkbox = document.querySelector(`input[name="options"][value="${optionId}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Обновляем текущий расчёт
    currentCalculation = {
        doorType: example.doorType,
        material: example.material,
        height: example.height,
        width: example.width,
        thickness: example.thickness,
        selectedOptions: example.options
    };
    
    // Пересчитываем
    calculatePrice();
    
    // Прокручиваем к верху
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Открытие модального окна сохранения
function openSaveModal() {
    document.getElementById('saveModal').style.display = 'flex';
}

// Закрытие модального окна сохранения
function closeSaveModal() {
    document.getElementById('saveModal').style.display = 'none';
}

// Открытие модального окна заказа
function openOrderModal() {
    // Заполняем сводку заказа
    const summary = document.getElementById('orderSummary');
    summary.innerHTML = generateOrderSummary();
    
    document.getElementById('orderModal').style.display = 'flex';
}

// Закрытие модального окна заказа
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Генерация сводки заказа
function generateOrderSummary() {
    const doorType = calculatorData.doorTypes[currentCalculation.doorType];
    const material = calculatorData.materials[currentCalculation.material];
    const totalPrice = getTotalPrice();
    
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
        <p><strong>Размеры:</strong> ${currentCalculation.height}×${currentCalculation.width}×${currentCalculation.thickness} мм</p>
        <p><strong>Дополнительные опции:</strong></p>
        ${optionsList}
        <p style="font-size: 1.2rem; font-weight: bold; color: #8B4513; margin-top: 15px;">
            Итоговая стоимость: ${totalPrice.toLocaleString()} ₽
        </p>
    `;
}

// Сохранение расчёта
function saveCalculation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const calculation = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        comment: formData.get('comment'),
        calculation: currentCalculation,
        totalPrice: getTotalPrice(),
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    let savedCalculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    savedCalculations.push(calculation);
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations));
    
    // Отправляем "на email" (имитация)
    alert('Расчёт отправлен на ваш email! Также он сохранён в истории.');
    closeSaveModal();
    e.target.reset();
}

// Отправка заказа
function submitOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const order = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        calculation: currentCalculation,
        totalPrice: getTotalPrice(),
        timestamp: new Date().toISOString()
    };
    
    // Сохраняем заказ
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Заявка отправлена! Наш менеджер свяжется с вами в течение 15 минут для уточнения деталей.');
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
            alert('Не удалось скопировать ссылку');
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
            
            // Применяем сохранённый расчёт
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы (если есть common.js)
    if (typeof initializeTheme === 'function') {
        initializeTheme();
    }
    
    // Инициализация калькулятора
    initCalculator();
    
    // Загрузка расчёта из URL (если есть)
    loadFromUrl();
    
    // Закрытие модальных окон при клике вне их
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
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
});

// Экспорт функций для глобального использования
window.openSaveModal = openSaveModal;
window.closeSaveModal = closeSaveModal;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.printCalculation = printCalculation;