// это файл для работы с формами .ad-form и .map__filters
// здесь мы будем переводить их в неактивное состояние и наоборот

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
