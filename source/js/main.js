import debounce from 'lodash/debounce';
import { getFixedLengthArrayOfRandomElements } from './util.js';
import {
  initializeForms,
  enableAdForm,
  enableMapFiltersForm,
  addMapFiltersChangeHandler,
  getFiltersValues,
  disableForms,
  initializeAddressInputField,
  addMarkerMoveEndHandler,
  addAdFormSubmitHandler,
  addAdFormResetHandler,
  resetForms
} from './forms.js';
import { initializeMap, addOffersMarkersToMap, resetMainPinMarker } from './map.js';
import { filterOffers, createMapOfPopupsWithCoordinates } from './similar-objects.js';
import { getDataFromServer, sendDataToServer, showAlert, showSuccessMessage, showFailMessage } from './server-api.js';

const OFFERS_COUNT = 10;
const TIMEOUT = 0;
const DEBOUNCE_DELAY = 500;
let offers;

initializeForms();
disableForms();
const [map, mainPinMarker] = initializeMap();
map.whenReady(() => {
  enableAdForm();
  addAdFormResetHandler(() => {
    resetMainPinMarker();
    setTimeout(() =>
      initializeAddressInputField(mainPinMarker), TIMEOUT);
  });
  initializeAddressInputField(mainPinMarker);
  addMarkerMoveEndHandler(mainPinMarker);
  addAdFormSubmitHandler((form) => {
    sendDataToServer(
      () => {
        showSuccessMessage();
        resetForms();
        resetMainPinMarker();
        setTimeout(() =>
          initializeAddressInputField(mainPinMarker), TIMEOUT);
      },
      () => showFailMessage(),
      form);
  });
  getDataFromServer(
    (json) => {
      addMapFiltersChangeHandler(debounce(() => {
        const filtersValues = getFiltersValues();
        const filteredOffers = filterOffers(offers, filtersValues);
        const mapOfPopups = createMapOfPopupsWithCoordinates(filteredOffers);
        addOffersMarkersToMap(mapOfPopups, map);
      }, DEBOUNCE_DELAY));
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
