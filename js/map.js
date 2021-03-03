/* global L:readonly */

// теперь подключим карту (сделал это в разметке) из сторонней библиотеки Leaflet
// и в случае успешной загрузки карты сделаем формы снова активными

// найдём элемент, в котором разместим карту
const mapCanvas = document.querySelector('.map__canvas');

// создадим объект карты
const map = L.map(mapCanvas)
  // .on('load', () => isMapLoaded = true)
  .setView({
    lat: 35.4122,
    lng: 139.4130,
  }, 10);

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
    lat: 35.4122,
    lng: 139.4130,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
)
  // добавим её объекту карты
  .addTo(map);

export { map, mainPinMarker };
