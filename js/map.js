/* global L:readonly */

// в этом модуле будем писать функции по работе с картой и связанными с ней объектами

// найдём элемент, в котором разместим карту
const mapCanvas = document.querySelector('.map__canvas');

// заведём массив для хранения маркеров (меток) для того, чтобы из него брать метки для добавления их на карту
// и в нужный момент очищать массив (пригодится при удалении меток с карты в контексте фильтрации объявлений)
const additionalMarkers = [];

// опишем главную метку
const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

// опишем доп. метку
const additionalPinIcon = L.icon({
  iconUrl: '../img/pin.svg',
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
);

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
    .setView({
      lat: 35.65283,
      lng: 139.83947,
    }, 9);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  )
    .addTo(map);
  mainPinMarker.addTo(map);

  return [map, mainPinMarker];
};

// функция добавления меток объявлений на карту
const addOffersMarkersToMap = (popupsWithCoordinates, map) => {

  // добавим очистку меток перед нанесением на карту новых
  if (additionalMarkers.length > 0) {
    additionalMarkers.forEach((marker) => {
      marker.remove();
    })
    additionalMarkers.length = 0;
  }

  popupsWithCoordinates.forEach((value, key) => {
    const marker = L.marker(
      {
        lat: value.lat,
        lng: value.lng,
      },
      {
        draggable: false,
        icon: additionalPinIcon,
      },
    );
    additionalMarkers.push(marker);
    marker.addTo(map).bindPopup(key);
  });
};

// функция возврата главной метки  в исходное положение (понадобится в качестве коллбэка при успешной отправке формы)
const resetMainPinMarker = () => {
  mainPinMarker.setLatLng(
    {
      lat: 35.65283,
      lng: 139.83947,
    },
  );
};

export { initializeMap, addOffersMarkersToMap, resetMainPinMarker };
