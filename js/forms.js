// это файл для работы с формами .ad-form и .map__filters
// здесь напишем функции для перевода форм в неактивное / активное состояния
// импортируем объект карты для того, чтобы работать с формами с учётом состояния этого объекта
// import { map, mainPinMarker } from './map.js';

// найдём сначала нужные элементы в DOM'е
const mapFiltersForm = document.querySelector('.map__filters');
const mapFiltersSelects = mapFiltersForm.querySelectorAll('select');
const mapFiltersFieldset = mapFiltersForm.querySelector('fieldset');
const adForm = document.querySelector('.ad-form');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const addressInputField = adForm.querySelector('input[name = "address"]');
const adFormReset = adForm.querySelector('.ad-form__reset');

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

// функция создания подписки на событие нажатия кнопки ОЧИСТИТЬ
// Примечание: кнопка ОЧИСТИТЬ с типом reset и так без всяких обработчиков очистить форму подачи объявления,
// но форма с фильтрами очищена не будет, так как это отдельная форма, поэтому нужна эта функция
const addAdFormResetListener = () => {
  adFormReset.addEventListener('click', () => {
    mapFiltersForm.reset();
  })
};

export {
  enableForms,
  disableForms,
  initializeAddressInputField,
  addMoveEndListenerToMarker,
  addAdFormSubmitListener,
  addAdFormResetListener
};
