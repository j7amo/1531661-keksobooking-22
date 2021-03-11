// точка входа, связывающая другие модули
import _ from 'lodash';
import { getFixedLengthArrayOfRandomElements } from './util.js';
import { addAvatarChangeListener } from './avatar.js';
import { addPhotosChangeListener }from './adform-photos.js'
import {
  initializeForms,
  enableAdForm,
  enableMapFiltersForm,
  addMapFiltersChangeListener,
  getFiltersValues,
  disableForms,
  initializeAddressInputField,
  addMoveEndListenerToMarker,
  addAdFormSubmitListener,
  addAdFormResetListener,
  resetForms
} from './forms.js';
import { initializeMap, addOffersMarkersToMap, resetMainPinMarker } from './map.js';
import { filterOffers, createMapOfPopupsWithCoordinates } from './similar-objects.js';
import { getDataFromServer, sendDataToServer, showAlert, showSuccessMessage, showFailMessage } from './server-api.js';

const OFFERS_COUNT = 10;
let offers;

// теперь попробуем собрать из этих кубиков работающую программу
initializeForms();
disableForms();
const [map, mainPinMarker] = initializeMap();
map.whenReady(() => {
  enableAdForm();
  _.add();
  addAvatarChangeListener();
  addPhotosChangeListener();
  addAdFormResetListener(() => {
    resetMainPinMarker();
    setTimeout(() =>
      initializeAddressInputField(mainPinMarker), 0);
  });
  initializeAddressInputField(mainPinMarker);
  addMoveEndListenerToMarker(mainPinMarker);
  addAdFormSubmitListener((form) => {
    sendDataToServer(
      () => {
        showSuccessMessage();
        resetForms();
        resetMainPinMarker();
        setTimeout(() =>
          initializeAddressInputField(mainPinMarker), 0);
      },
      () => showFailMessage(),
      form);
  });
  getDataFromServer(
    (json) => {
      addMapFiltersChangeListener(() => {
        const filtersValues = getFiltersValues();
        const filteredOffers = filterOffers(offers, filtersValues);
        const mapOfPopups = createMapOfPopupsWithCoordinates(filteredOffers);
        addOffersMarkersToMap(mapOfPopups, map);
      });
      enableMapFiltersForm();
      return json;
    },
    () => showAlert('При получении данных с сервера произошла ошибка'),
  )
    .then(json => {
      offers = json;
      const randomOffers = getFixedLengthArrayOfRandomElements(offers, OFFERS_COUNT);
      return createMapOfPopupsWithCoordinates(randomOffers);
    })
    .then(popupsWithCoordinates => addOffersMarkersToMap(popupsWithCoordinates, map));
});
