/* global L:readonly */

// в этом модуле будем писать функции по работе с картой и связанными с ней объектами

// найдём элемент, в котором разместим карту
const mapCanvas = document.querySelector('.map__canvas');

// функция инициализации карты
// По моей задумке эта функция делает следующее:
// 1) создаёт объект карты
// 2) создаёт слой карты с изображением и копирайтом
// 3) размещает на карте главную метку
// 4) возвращает массив с нужными нам для дальнейшей работы объектами (карта, главная метка и т.д.)
// таким образом потребитель данной функции (разработчик) при её вызове получает рабочую карту (без меток объявлений, так как
// этот функционал по смыслу должен быть прописан в другом модуле - similar-objects.js)
const initializeMap = () => {
  const map = L.map(mapCanvas)
    // .on('load', () => isMapLoaded = true)
    .setView({
      lat: 35.65283,
      lng: 139.83947,
    }, 12);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  )
    .addTo(map);

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
    .addTo(map);

  return [map, mainPinMarker];
};

// функция добавления меток объявлений на карту
const addOffersMarkersToMap = (popupsWithCoordinates, map) => {
  const additionalPinIcon = L.icon({
    iconUrl: '../img/pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });

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
};

export { initializeMap, addOffersMarkersToMap };
