// это файл для работы с формами .ad-form и .map__filters
// здесь напишем функции для перевода форм в неактивное / активное состояния
// импортируем объект карты для того, чтобы работать с формами с учётом состояния этого объекта
// import { map, mainPinMarker } from './map.js';

// найдём сначала нужные элементы в DOM'е
const mapFiltersForm = document.querySelector('.map__filters');
const mapFiltersSelects = mapFiltersForm.querySelectorAll('select');
const mapFiltersFieldset = mapFiltersForm.querySelector('fieldset');
const adForm = document.querySelector('.ad-form');
const adFormTitle = adForm.querySelector('input[name="title"]');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const addressInputField = adForm.querySelector('input[name = "address"]');
const adFormReset = adForm.querySelector('.ad-form__reset');
const offerType = adForm.querySelector('select[name="type"]');
const offerPrice = adForm.querySelector('input[name="price"]');
const offerCheckIn = adForm.querySelector('select[name="timein"]');
const offerCheckInOptions = offerCheckIn.querySelectorAll('option');
const offerCheckOut = adForm.querySelector('select[name="timeout"]');
const offerCheckOutOptions = offerCheckOut.querySelectorAll('option');
const offerNumberOfRooms = adForm.querySelector('select[name="rooms"]');
const offerCapacity = adForm.querySelector('select[name="capacity"]');
const offerCapacityOptions = offerCapacity.querySelectorAll('option');

// словарь "тип размещения - цена"
const minOfferPrices = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

// словарь "количество комнат - количество гостей"
const numberOfRoomsCapacity = {
  1: 1,
  2: 2,
  3: 3,
  100: 0,
};

// напишем отдельные функции для установления зависимостей между полями
// эти функции будем передавать в качестве коллбэков в функцию инициализации форм?

// по ТЗ: «Тип жилья» — выбор опции меняет атрибуты минимального значения и плейсхолдера поля «Цена за ночь»
const setOfferTypeToPriceDependency = () => {
  offerPrice.min = minOfferPrices[offerType.value];
  offerPrice.placeholder = minOfferPrices[offerType.value];
  addInvalidFormFieldNumberEventListener(offerPrice, offerPrice.min, offerPrice.max);
};

// по ТЗ: «Время заезда», «Время выезда» — выбор опции одного поля автоматически изменят значение другого (они д.б. одинаковы)
const setCheckOutToCheckInDependency = () => {
  offerCheckOutOptions.forEach((option) => {
    if (option.value === offerCheckIn.value) {
      option.selected = true;
    }
  });
};

const setCheckInToCheckOutDependency = () => {
  offerCheckInOptions.forEach((option) => {
    if (option.value === offerCheckOut.value) {
      option.selected = true;
    }
  });
};

// по ТЗ: Поле «Количество комнат» синхронизировано с полем «Количество мест» таким образом,
// что при выборе количества комнат вводятся ограничения на допустимые варианты выбора количества гостей:
const setNumberOfRoomsCapacityDependency = () => {
  offerCapacity.value = numberOfRoomsCapacity[offerNumberOfRooms.value];

  // добавим перед каждым заходом в switch сброс аттрибута disabled в значение false, иначе на первом же шаге
  // большая часть option'ов будет уже недоступна
  offerCapacityOptions.forEach((option) => {
    option.disabled = false;
  })

  switch (Number(offerNumberOfRooms.value)) {
    case 1:
      offerCapacityOptions.forEach((option) => {
        if (option.value !== '1') {
          option.disabled = true;
        }
      });
      break;
    case 2:
      offerCapacityOptions.forEach((option) => {
        if (option.value !== '1' && option.value !== '2') {
          option.disabled = true;
        }
      });
      break;
    case 3:
      offerCapacityOptions.forEach((option) => {
        if (option.value !== '1' && option.value !== '2' && option.value !== '3') {
          option.disabled = true;
        }
      });
      break;
    case 100:
      offerCapacityOptions.forEach((option) => {
        if (option.value !== '0') {
          option.disabled = true;
        }
      });
      break;
  }
};

// функция добавления обработчика события invalid на валидируемое ПО ДЛИНЕ поле
const addInvalidFormFieldLengthEventListener = (field, minLength, maxLength) => {
  field.addEventListener('invalid', () => {
    if (field.validity.tooShort) {
      field.setCustomValidity(`Введите минимум ${minLength} символа(ов)`);
    } else if (field.validity.tooLong) {
      field.setCustomValidity(`Введите максимум ${maxLength} символа(ов)`);
    } else if (field.validity.valueMissing) {
      field.setCustomValidity('Обязательное поле');
    } else {
      field.setCustomValidity('');
    }
  });
};

// функция добавления обработчика события invalid на валидируемое ПО ЧИСЛУ поле
const addInvalidFormFieldNumberEventListener = (field, minNumber, maxNumber) => {
  field.addEventListener('invalid', () => {
    if (field.validity.rangeUnderflow) {
      field.setCustomValidity(`Стоимость должна начинаться от ${minNumber}`);
    } else if (field.validity.rangeOverflow) {
      field.setCustomValidity(`Стоимость не должна превышать ${maxNumber}`);
    } else if (field.validity.valueMissing) {
      field.setCustomValidity('Обязательное поле');
    } else {
      field.setCustomValidity('');
    }
  });
};

// эта функция будет
// - задавать начальные зависимости между полями (с помощью вызова дополнительных внутренних функций)
// - подписываться на изменение этих полей для сохранения установленных зависимостей в процессе взаимодействия с формой
// + возможно проверять вводимые данные (но это не точно - может быть лучше проверку (валидацию) сделать отдельной функцией)
const initializeForms = () => {
  setOfferTypeToPriceDependency();
  setCheckOutToCheckInDependency();
  setNumberOfRoomsCapacityDependency();

  offerType.addEventListener('change', () => {
    setOfferTypeToPriceDependency();
  });

  offerCheckIn.addEventListener('change', () => {
    setCheckOutToCheckInDependency();
  });

  offerCheckOut.addEventListener('change', () => {
    setCheckInToCheckOutDependency();
  });

  offerNumberOfRooms.addEventListener('change', () => {
    setNumberOfRoomsCapacityDependency();
  });

  addInvalidFormFieldLengthEventListener(adFormTitle, adFormTitle.minLength, adFormTitle.maxLength);
};

// функция для перевода форм в активное состояние
const enableForms = () => {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach((element) => {
    element.disabled = false;
  });
  mapFiltersForm.classList.remove('map__filters--disabled');
  mapFiltersSelects.forEach((element) => {
    element.disabled = false;
  });
  mapFiltersFieldset.disabled = false;
};

// функция для перевода форм в неактивное состояние
const disableForms = () => {
  adForm.classList.add('ad-form--disabled');
  adFormFieldsets.forEach((element) => {
    element.disabled = true;
  });
  mapFiltersForm.classList.add('map__filters--disabled');
  mapFiltersSelects.forEach((element) => {
    element.disabled = true;
  });
  mapFiltersFieldset.disabled = true;
};

// функция для инициализации инпута с координатами (выношу в отдельную функцию, так как этот конкретный инпут имеет свою логику)
const initializeAddressInputField = (mainPinMarker) => {
  addressInputField.readOnly = true;
  const latitude = mainPinMarker.getLatLng().lat.toFixed(5);
  const longitude = mainPinMarker.getLatLng().lng.toFixed(5);
  addressInputField.value = `${latitude}, ${longitude}`;
};

// функция подписки на событие moveend метки карты
const addMoveEndListenerToMarker = (pinMarker) => {
  pinMarker.on('moveend', (evt) => {
    let newCoordinatesObject = evt.target.getLatLng();
    addressInputField.value = `${newCoordinatesObject.lat.toFixed(5)}, ${newCoordinatesObject.lng.toFixed(5)}`;
  });
};

// функция создания подписки на событие submit формы подачи объявления
const addAdFormSubmitListener = (cb) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    cb(evt.target);
  });
};

// функция, которая сбрасывает формы в исходное состояние (пригодится нам в качестве коллбэка при успешной отправке формы)
const resetForms = () => {
  mapFiltersForm.reset();
  adForm.reset();
}

// функция создания подписки на событие нажатия кнопки ОЧИСТИТЬ
// Примечание: кнопка ОЧИСТИТЬ с типом reset и так без всяких обработчиков очистить форму подачи объявления,
// но форма с фильтрами очищена не будет, так как это отдельная форма, поэтому нужна эта функция
const addAdFormResetListener = (cb) => {
  adFormReset.addEventListener('click', () => {
    mapFiltersForm.reset();
    cb();
  })
};

export {
  initializeForms,
  enableForms,
  disableForms,
  initializeAddressInputField,
  addMoveEndListenerToMarker,
  addAdFormSubmitListener,
  addAdFormResetListener,
  resetForms
};
