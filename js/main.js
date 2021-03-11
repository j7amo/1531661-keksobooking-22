// точка входа, связывающая другие модули
import { getFixedLengthArrayOfRandomElements } from './util.js';
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
        // пока оставил код для фильтрации с учётом рейтинга (закомментированная строка) до ответа авторов по ТЗ
        // const sortedOffers = offers.sort(getSortOffersFunction(getOfferRating, filtersValues)).slice(0, OFFERS_COUNT);
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
