/* global L:readonly */
import { popupsWithCoordinates } from './similar-objects.js';

// теперь подключим карту (сделал это в разметке) из сторонней библиотеки Leaflet
// и в случае успешной загрузки карты сделаем формы снова активными

// найдём элемент, в котором разместим карту
const mapCanvas = document.querySelector('.map__canvas');

// создадим объект карты
const map = L.map(mapCanvas)
  // .on('load', () => isMapLoaded = true)
  .setView({
    lat: 35.65283,
    lng: 139.83947,
  }, 12);

// создадим слой карты с изображением и копирайтом
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
)
  // добавим его объекту карты
  .addTo(map);

// создадим главную метку на карте, предварительно задав ей кастомный внешний вид (есть в исходниках)
const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: 35.65283,
    lng: 139.83947,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
)
  // добавим её объекту карты
  .addTo(map);

// сделаем добавление дополнительных (не главных) меток на карту с помощью внутреннего объекта location каждого оффера
// предварительно задав внешний вид для доп. маркера
const additionalPinIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

// перебираем мапу, используем широту и долготу (берём из значения пары) для задания координат доп. метки,
// добавляем метку на карту, берём элемент с разметкой из ключа пары и размещаем его в балуне
popupsWithCoordinates.forEach((value, key) => {
  L.marker(
    {
      lat: value.x,
      lng: value.y,
    },
    {
      draggable: false,
      icon: additionalPinIcon,
    },
  )
    .addTo(map)
    // биндим попап к метке
    .bindPopup(key);
});

export { map, mainPinMarker };
