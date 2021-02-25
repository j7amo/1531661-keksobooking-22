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
const isIncluded = (clonedFeature, generatedFeatures) => generatedFeatures.some((element) => clonedFeature.className.includes(element));

// функция для проверки элементов списка popup__features
// если такого удобства в сгенерированном оффере нет - удаляем лишку нафиг
const checkFeatures = (clonedFeatures, generatedFeatures) => {
  for(let i = clonedFeatures.length - 1; i >= 0; i--) {
    if(!isIncluded(clonedFeatures[i], generatedFeatures)) {
      clonedFeatures[i].remove();
    }
  }
};

// функция для создания элемента img с правильным src
const createPhoto = (photosContainer, photoTemplate, photos) => {
  for(let i = 1; i < photos.length - 1; i++) {
    const popupPhoto = photoTemplate.cloneNode(true);
    popupPhoto.src = photos[i];
    photosContainer.appendChild(popupPhoto);
  }
};

// функция для создания попапа
const createPopup = (template, offer) => {
  const popup = template.cloneNode(true);
  const popupTitle = popup.querySelector('.popup__title');
  const offerTitle = offer.offer.title;
  popupTitle.textContent = offerTitle ? offerTitle : popupTitle.remove();
  const popupTextAddress = popup.querySelector('.popup__text--address');
  const offerAddress = offer.offer.address;
  popupTextAddress.textContent = offerAddress ? offerAddress : popupTextAddress.remove();
  const popupTextPrice = popup.querySelector('.popup__text--price');
  const offerPrice = offer.offer.price;
  popupTextPrice.textContent = offerPrice ? `${offerPrice} \u20BD/ночь` : popupTextPrice.remove();
  const popupType = popup.querySelector('.popup__type');
  const offerType = offer.offer.type;
  popupType.textContent = offerTypes[offerType];
  const popupTextCapacity = popup.querySelector('.popup__text--capacity');
  const offerRooms = offer.offer.rooms;
  const offerGuests = offer.offer.guests;
  popupTextCapacity.textContent = offerRooms && offerGuests ? `${offerRooms} комнаты для ${offerGuests} гостей` : popupTextCapacity.remove();
  const popupTextTime = popup.querySelector('.popup__text--time');
  const offerCheckin = offer.offer.checkin;
  const offerCheckout = offer.offer.checkout;
  popupTextTime.textContent = offerCheckin && offerCheckout ? `Заезд после ${offerCheckin}, выезд до ${offerCheckout}` : popupTextTime.remove();
  const popupFeatures = popup.querySelector('.popup__features');

  checkFeatures(popupFeatures.children, offer.offer.features);

  const popupDescription = popup.querySelector('.popup__description');
  const offerDescription = offer.offer.description;
  popupDescription.textContent = offerDescription ? offerDescription : popupDescription.remove();
  const popupPhotos = popup.querySelector('.popup__photos');
  const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
  const offerPhotos = offer.offer.photos;
  popupPhotoFirst.src = offerPhotos[0] ? offerPhotos[0] : popupPhotoFirst.remove();

  createPhoto(popupPhotos, popupPhotoFirst, offer.offer.photos);

  const popupAvatar = popup.querySelector('.popup__avatar');
  const offerAvatar = offer.author.avatar;
  popupAvatar.src = offerAvatar ? offerAvatar : popupAvatar.remove();

  return popup;
};

// функция для создания массива попапов
const createPopupArrayFromGeneratedOffers = (offers) => {
  const popupArray = [];

  for(let i = 0; i < offers.length; i++) {
    const popup = createPopup(template, offers[i]);
    popupArray.push(popup);
  }

  return popupArray;
};

const popups = createPopupArrayFromGeneratedOffers(offers);

const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(popups[0]);
