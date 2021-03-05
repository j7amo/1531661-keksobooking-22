// точка входа, связывающая другие модули
import { enableForms, disableForms, initializeAddressInputField, addMoveEndListenerToMarker } from './forms.js';
import { initializeMap, addOffersMarkersToMap } from './map.js';
import { createMapOfPopupsWithCoordinates } from './similar-objects.js';
import {getDataFromServer, showAlert} from './server-api.js';

// теперь попробуем собрать из этих кубиков работающую программу
disableForms();
const[map, mainPinMarker] = initializeMap();
map.whenReady(() => {
  enableForms();
  initializeAddressInputField(mainPinMarker);
  addMoveEndListenerToMarker(mainPinMarker);
  getDataFromServer(
    (json) => {
      return json;
    },
    () => {
      showAlert('При работе с сервером произошла ошибка');
    },
  )
    .then((json) => createMapOfPopupsWithCoordinates(json))
    .then((popupsWithCoordinates) => addOffersMarkersToMap(popupsWithCoordinates, map))
});
