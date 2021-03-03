// это файл для работы с формами .ad-form и .map__filters
// здесь мы будем переводить их в неактивное состояние и наоборот
// импортируем объект карты для того, чтобы работать с формами с учётом состояния этого объекта
import { map, mainPinMarker } from './map.js';

// найдём эти элементы в DOM'е для последующей работы с ними
const mapFiltersForm = document.querySelector('.map__filters');
const mapFiltersSelects = mapFiltersForm.querySelectorAll('select');
const mapFiltersFieldset = mapFiltersForm.querySelector('fieldset');
const adForm = document.querySelector('.ad-form');
const adFormFieldsets = adForm.querySelectorAll('fieldset');

// сначала переводим в неактивное состояние согласно ТЗ:
// 1) Форма заполнения информации об объявлении .ad-form содержит класс ad-form--disabled;
adForm.classList.add('ad-form--disabled');
// 2) Все интерактивные элементы формы .ad-form должны быть заблокированы с помощью атрибута disabled,
// добавленного на них или на их родительские блоки fieldset;
adFormFieldsets.forEach((element) => {
  element.disabled = true;
});
// 3) Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form — на форму добавлен специальный класс,
mapFiltersForm.classList.add('map__filters--disabled');
// а на её интерактивные элементы атрибуты disabled;
mapFiltersSelects.forEach((element) => {
  element.disabled = true;
});
mapFiltersFieldset.disabled = true;

// далее после загрузки карты мы должны на странице вернуть активное состояние заблокированным формам
// сделаем это с помощью метода whenReady (пробовал сначала через map.on('load', cb), но не получилось, возможно потому,
// что событие происходит слишком быстро и в тот момент, когда мы пытаемся его отловить - оно не происходит уже)
map.whenReady(() => {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach((element) => {
    element.disabled = false;
  });
  mapFiltersForm.classList.remove('map__filters--disabled');
  mapFiltersSelects.forEach((element) => {
    element.disabled = false;
  });
  mapFiltersFieldset.disabled = false;
});

// далее реализуем выбор адреса путём перемещения главной метки
// для этого подпишемся на событие moveend метки и будем получать объект с новыми координатами
// эти координаты будем записывать в значение соответствующего инпута формы

// найдём сначала этот инпут
const addressInputField = adForm.querySelector('input[name = "address"]');

// пропишем ему аттрибут readonly (согласно ТЗ к ДЗ=) ручками мы не можем тут лазить)
addressInputField.readOnly = true;

// подписываемся и записываем новые координаты
mainPinMarker.on('moveend', (evt) => {
  let newCoordinatesObject = evt.target.getLatLng();
  addressInputField.value = `${newCoordinatesObject.lat.toFixed(4)}, ${newCoordinatesObject.lng.toFixed(4)}`;
});
