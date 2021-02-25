import { getGeneratedOffers } from './data.js';

const offers = getGeneratedOffers();
const template = document.querySelector('#card').content.querySelector('.popup');

// словарь видов размещения
const offerTypes = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

// функция для проверки присутствия элемента массива удобств в классах элемента списка popup__features
const isIncluded = (clonedFeature, generatedFeatures) => generatedFeatures.some((element) => clonedFeature.className.includes(`--${element}`));

// функция для проверки элементов списка popup__features
// если такого удобства в сгенерированном оффере нет - удаляем лишку нафиг
const createFeatures = (clonedFeatures, generatedFeatures) => {
  const limit = clonedFeatures.length - 1;

  // замена на forEach мне не видится возможной из-за того, что перебор значений нисходящий
  for(let i = limit; i >= 0; i--) {
    if(!isIncluded(clonedFeatures[i], generatedFeatures)) {
      clonedFeatures[i].remove();
    }
  }
};

// функция для создания элемента img с правильным src
const createPhoto = (photosContainer, photoTemplate, photos) => {
  const limit = photos.length;
  const fragment = document.createDocumentFragment();

  // специально попробовал через forEach, но в этом конкретном случае мы перебираем не все элементы массива, поэтому не работает
  // photos.forEach((photo) => {
  //   const popupPhoto = photoTemplate.cloneNode(true);
  //   popupPhoto.src = photo;
  //   fragment.append(popupPhoto);
  // });

  for(let i = 1; i < limit; i++) {
    const popupPhoto = photoTemplate.cloneNode(true);
    popupPhoto.src = photos[i];
    fragment.append(popupPhoto);
  }

  photosContainer.append(fragment);
};

// функция для создания попапа
const createPopup = (template, offer) => {
  const popup = template.cloneNode(true);
  const popupTitle = popup.querySelector('.popup__title');
  const popupTextAddress = popup.querySelector('.popup__text--address');
  const popupTextPrice = popup.querySelector('.popup__text--price');
  const popupType = popup.querySelector('.popup__type');
  const popupTextCapacity = popup.querySelector('.popup__text--capacity');
  const popupTextTime = popup.querySelector('.popup__text--time');
  const popupFeatures = popup.querySelector('.popup__features');
  const popupDescription = popup.querySelector('.popup__description');
  const popupPhotos = popup.querySelector('.popup__photos');
  const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
  const popupAvatar = popup.querySelector('.popup__avatar');
  // 11 строк заменил на 2 (одна из них довольно длинная получилась)
  const innerOfferObject = offer.offer;
  const {title: offerTitle, address: offerAddress, price: offerPrice, type: offerType, rooms: offerRooms, guests: offerGuests, checkin: offerCheckin, checkout: offerCheckout, features: offerFeatures, description: offerDescription, photos: offerPhotos} = innerOfferObject;
  const offerAvatar = offer.author.avatar;

  popupTitle.textContent = offerTitle ? offerTitle : popupTitle.remove();
  popupTextAddress.textContent = offerAddress ? offerAddress : popupTextAddress.remove();
  popupTextPrice.textContent = offerPrice ? `${offerPrice} \u20BD/ночь` : popupTextPrice.remove();
  popupType.textContent = offerTypes[offerType];
  popupTextCapacity.textContent = offerRooms && offerGuests ? `${offerRooms} комнаты для ${offerGuests} гостей` : popupTextCapacity.remove();
  popupTextTime.textContent = offerCheckin && offerCheckout ? `Заезд после ${offerCheckin}, выезд до ${offerCheckout}` : popupTextTime.remove();
  createFeatures(popupFeatures.children, offerFeatures);
  popupDescription.textContent = offerDescription ? offerDescription : popupDescription.remove();
  popupPhotoFirst.src = offerPhotos[0] ? offerPhotos[0] : popupPhotoFirst.remove();
  popupPhotoFirst ? createPhoto(popupPhotos, popupPhotoFirst, offerPhotos) : popupPhotos.remove();
  popupAvatar.src = offerAvatar ? offerAvatar : popupAvatar.remove();

  return popup;
};

// функция для создания массива попапов
const createPopupsFromOffers = (offers) => {
  const popups = [];

  // единственный цикл, который удалось заменить на forEach
  offers.forEach((offer) => {
    const popup = createPopup(template, offer);
    popups.push(popup);
  });

  return popups;
};

const popups = createPopupsFromOffers(offers);

const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.append(popups[0]);
