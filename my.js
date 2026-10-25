(function () {
  "use strict";

  /**
   * Конфигурация: цены и доступные модификаторы.
   */
  function getPrices() {
    return {
      // Базовая цена за единицу для каждого типа услуги
      basePrices: {
        type1: 1000,
        type2: 1500,
        type3: 2200
      },
      // Надбавка за выбранную опцию (только для type2)
      optionPrices: {
        opt1: 0,
        opt2: 300,
        opt3: 700
      },
      // Надбавка за выбранное свойство (только для type3), в процентах
      propertyPercent: 30
    };
  }

  /**
   * Возвращает ссылки на ключевые элементы интерфейса.
   */
  function getElements() {
    return {
      form: document.getElementById("serviceForm"),
      quantity: document.getElementById("quantity"),
      typeRadios: document.querySelectorAll('input[name="serviceType"]'),
      optionField: document.getElementById("optionField"),
      option: document.getElementById("option"),
      propertyField: document.getElementById("propertyField"),
      property: document.getElementById("property"),
      totalPrice: document.getElementById("totalPrice"),
      details: document.getElementById("details")
    };
  }

  /**
   * Определяет выбранный тип услуги.
   */
  function getSelectedType(typeRadios) {
    let selected = "type1";
    typeRadios.forEach(function (radio) {
      if (radio.checked) {
        selected = radio.value;
      }
    });
    return selected;
  }

  /**
   * Нормализует количество: минимум 1, целое число.
   */
  function normalizeQuantity(value) {
    let qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
    }
    return qty;
  }

  /**
   * Форматирует число как цену в рублях.
   */
  function formatPrice(value) {
    return Math.round(value).toLocaleString("ru-RU") + " ₽";
  }

  /**
   * Показывает/скрывает блоки опций и свойств в зависимости от типа.
   * - type1: ничего не показываем;
   * - type2: показываем только селект опций;
   * - type3: показываем только чекбокс свойства.
   */
  function toggleFields(type, elements) {
    const showOption = type === "type2";
    const showProperty = type === "type3";

    elements.optionField.classList.toggle("is-hidden", !showOption);
    elements.propertyField.classList.toggle("is-hidden", !showProperty);

    // Сбрасываем неактивные контролы, чтобы они не влияли на цену
    if (!showOption) {
      elements.option.value = "opt1";
    }
    if (!showProperty) {
      elements.property.checked = false;
    }
  }

  /**
   * Выполняет полный пересчёт стоимости и обновляет интерфейс.
   */
  function updatePrice() {
    const elements = getElements();
    const prices = getPrices();

    const type = getSelectedType(elements.typeRadios);
    const quantity = normalizeQuantity(elements.quantity.value);

    toggleFields(type, elements);

    // Базовая цена за единицу
    let unitPrice = prices.basePrices[type] || 0;
    const parts = ["Базовая: " + formatPrice(unitPrice)];

    // Надбавка за опцию (только type2)
    if (type === "type2") {
      const optionPrice = prices.optionPrices[elements.option.value] || 0;
      if (optionPrice > 0) {
        unitPrice += optionPrice;
        parts.push("опция: +" + formatPrice(optionPrice));
      }
    }

    // Надбавка за свойство (только type3, процент от базовой цены)
    if (type === "type3" && elements.property.checked) {
      const base = prices.basePrices[type] || 0;
      const extra = base * (prices.propertyPercent / 100);
      unitPrice += extra;
      parts.push("приоритет: +" + formatPrice(extra));
    }

    const total = unitPrice * quantity;

    elements.totalPrice.textContent = formatPrice(total);
    elements.details.textContent =
      quantity + " × " + formatPrice(unitPrice) + " = " + formatPrice(total) +
      " (" + parts.join(", ") + ")";
  }

  /**
   * Инициализация после загрузки DOM.
   */
  function init() {
    const elements = getElements();

    // Обработчик количества
    elements.quantity.addEventListener("input", updatePrice);
    elements.quantity.addEventListener("change", updatePrice);

    // Обработчики радиокнопок типа услуги
    elements.typeRadios.forEach(function (radio) {
      radio.addEventListener("change", updatePrice);
    });

    // Обработчик опции
    elements.option.addEventListener("change", updatePrice);

    // Обработчик свойства
    elements.property.addEventListener("change", updatePrice);

    // Первичный расчёт
    updatePrice();
  }

  window.addEventListener("DOMContentLoaded", init);
})();