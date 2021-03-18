/* global L:readonly */
const MAIN_PIN_WIDTH = 52;
const MAIN_PIN_HEIGHT = 52;
const ADDITIONAL_PIN_WIDTH = 52;
const ADDITIONAL_PIN_HEIGHT = 52;
const MAIN_PIN_LATITUDE = 35.65283;
const MAIN_PIN_LONGITUDE = 139.83947;
const MAP_ZOOM_LEVEL = 9;
const mapCanvas = document.querySelector('.map__canvas');

const additionalMarkers = [];

const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT],
  iconAnchor: [MAIN_PIN_WIDTH / 2, MAIN_PIN_HEIGHT],
});

const additionalPinIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [ADDITIONAL_PIN_WIDTH, ADDITIONAL_PIN_HEIGHT],
  iconAnchor: [ADDITIONAL_PIN_WIDTH / 2, ADDITIONAL_PIN_HEIGHT],
});

const mainPinMarker = L.marker(
  {
    lat: MAIN_PIN_LATITUDE,
    lng: MAIN_PIN_LONGITUDE,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const initializeMap = () => {
  const map = L.map(mapCanvas)
    .setView({
      lat: MAIN_PIN_LATITUDE,
      lng: MAIN_PIN_LONGITUDE,
    }, MAP_ZOOM_LEVEL);

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

const addOffersMarkersToMap = (popupsWithCoordinates, map) => {
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

const resetMainPinMarker = () => {
  mainPinMarker.setLatLng(
    {
      lat: MAIN_PIN_LATITUDE,
      lng: MAIN_PIN_LONGITUDE,
    },
  );
};

export { initializeMap, addOffersMarkersToMap, resetMainPinMarker };
