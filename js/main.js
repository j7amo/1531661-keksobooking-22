// точка входа, связывающая другие модули
import {
  initializeForms,
  enableForms,
  disableForms,
  initializeAddressInputField,
  addMoveEndListenerToMarker,
  addAdFormSubmitListener,
  addAdFormResetListener,
  resetForms
} from './forms.js';
import { initializeMap, addOffersMarkersToMap, resetMainPinMarker } from './map.js';
import { createMapOfPopupsWithCoordinates } from './similar-objects.js';
import {getDataFromServer, sendDataToServer, showAlert, showSuccessMessage, showFailMessage } from './server-api.js';

// теперь попробуем собрать из этих кубиков работающую программу
initializeForms();
disableForms();
const[map, mainPinMarker] = initializeMap();
map.whenReady(() => {
  enableForms();
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
      () => {
        showFailMessage();
      },
      form);
  });
  getDataFromServer(
    (json) => {
      return json;
    },
    () => {
      showAlert('При получении данных с сервера произошла ошибка');
    },
  )
    .then((json) => createMapOfPopupsWithCoordinates(json))
    .then((popupsWithCoordinates) => addOffersMarkersToMap(popupsWithCoordinates, map));
});
