// точка входа, связывающая другие модули
import { enableForms, disableForms, initializeAddressInputField, addMoveEndListenerToMarker } from './forms.js';
import { initializeMap, addOffersMarkersToMap } from './map.js';
import { mapOfPopupsWithCoordinates } from './similar-objects.js';

// теперь попробуем собрать из этих кубиков работающую программу
disableForms();
const[map, mainPinMarker] = initializeMap();
map.whenReady(() => {
  enableForms();
  initializeAddressInputField(mainPinMarker);
  addMoveEndListenerToMarker(mainPinMarker);
  addOffersMarkersToMap(mapOfPopupsWithCoordinates, map)
});
