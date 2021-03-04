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

// далее после загрузки карты мы должны на странице вернуть активное состояние заблокированным формам, а также сразу проставить
// начальные координаты главной метки (центр Токио) в поле ввода адреса
// сделаем это с помощью метода whenReady (пробовал сначала через map.on('load', cb), но не получилось, возможно потому,
// что событие происходит слишком быстро и в тот момент, когда мы пытаемся его отловить - оно не происходит уже)

// найдём этот инпут
const addressInputField = adForm.querySelector('input[name = "address"]');

// пропишем ему аттрибут readonly (согласно ТЗ к ДЗ=) ручками мы не можем тут лазить)
addressInputField.readOnly = true;

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
  const latitude = mainPinMarker.getLatLng().lat.toFixed(5);
  const longitude = mainPinMarker.getLatLng().lng.toFixed(5);
  addressInputField.value = `${latitude}, ${longitude}`;
});

// далее реализуем выбор адреса путём перемещения главной метки
// для этого подпишемся на событие moveend метки и будем получать объект с новыми координатами
// эти координаты будем записывать в значение соответствующего инпута формы
// подписываемся и записываем новые координаты
// примечание:
// тут есть странный момент: в ТЗ сказано, что координаты якобы должны ОКРУГЛЯТЬСЯ, но это довольно нетривиальная задача,
// поэтому пока ограничимся простой обрезкой числа через toFixed
mainPinMarker.on('moveend', (evt) => {
  let newCoordinatesObject = evt.target.getLatLng();
  addressInputField.value = `${newCoordinatesObject.lat.toFixed(5)}, ${newCoordinatesObject.lng.toFixed(5)}`;
});
