/* global L:readonly */
import '../leaflet/leaflet.js';

// теперь подключим карту из сторонней библиотеки Leaflet и в случае успешной загрузки карты сделаем формы снова активными
// найдём элемент, в котором разместим карту
const mapCanvas = document.querySelector('.map__canvas');
L.map('mapCanvas')
  .setView({
    lat: 59.92749,
    lng: 30.31127,
  }, 10);
