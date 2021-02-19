import { getGeneratedOffers } from './data.js';

const generatedOffers = getGeneratedOffers();
const offerTemplateContent = document.querySelector('#card').content;
const offerTemplate = offerTemplateContent.querySelector('.popup');

// словарь видов размещения
const offerTypes = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

// функция для проверки присутствия элемента массива удобств в классах элемента списка popup__features
const checkIfIncluded = (clonedFeature, generatedFeatures) => generatedFeatures.some((element) => clonedFeature.className.includes(element));

// функция для проверки элементов списка popup__features
// если такого удобства в сгенерированном оффере нет - удаляем лишку нафиг
const checkFeatures = (clonedFeatures, generatedFeatures) => {
  for(let i = clonedFeatures.length - 1; i >= 0; i--) {
    if(!checkIfIncluded(clonedFeatures[i], generatedFeatures)) {
      clonedFeatures[i].remove();
    }
  }
};

// функция для создания элемента img с правильным src
const createPhoto = (nodeToAppendPhoto, photoTemplate, generatedPhotos) => {
  for(let i = 1; i < generatedPhotos.length - 1; i++) {
    const popupPhoto = photoTemplate.cloneNode(true);
    popupPhoto.src = generatedPhotos[i];
    nodeToAppendPhoto.appendChild(popupPhoto);
  }
};

// функция для создания попапа
const createPopup = (popupTemplate, generatedOffer) => {
  const elementFromOfferTemplate = popupTemplate.cloneNode(true);
  const popupTitle = elementFromOfferTemplate.querySelector('.popup__title');
  const offerTitle = generatedOffer.offer.title;
  popupTitle.textContent = offerTitle ? offerTitle : popupTitle.remove();
  const popupTextAddress = elementFromOfferTemplate.querySelector('.popup__text--address');
  const offerAddress = generatedOffer.offer.address;
  popupTextAddress.textContent = offerAddress ? offerAddress : popupTextAddress.remove();
  const popupTextPrice = elementFromOfferTemplate.querySelector('.popup__text--price');
  const offerPrice = generatedOffer.offer.price;
  popupTextPrice.textContent = offerPrice ? `${offerPrice} \u20BD/ночь` : popupTextPrice.remove();
  const popupType = elementFromOfferTemplate.querySelector('.popup__type');
  const offerType = generatedOffer.offer.type;
  popupType.textContent = offerTypes[offerType];
  const popupTextCapacity = elementFromOfferTemplate.querySelector('.popup__text--capacity');
  const offerRooms = generatedOffer.offer.rooms;
  const offerGuests = generatedOffer.offer.guests;
  popupTextCapacity.textContent = offerRooms && offerGuests ? `${offerRooms} комнаты для ${offerGuests} гостей` : popupTextCapacity.remove();
  const popupTextTime = elementFromOfferTemplate.querySelector('.popup__text--time');
  const offerCheckin = generatedOffer.offer.checkin;
  const offerCheckout = generatedOffer.offer.checkout;
  popupTextTime.textContent = offerCheckin && offerCheckout ? `Заезд после ${offerCheckin}, выезд до ${offerCheckout}` : popupTextTime.remove();
  const popupFeatures = elementFromOfferTemplate.querySelector('.popup__features');

  checkFeatures(popupFeatures.children, generatedOffer.offer.features);

  const popupDescription = elementFromOfferTemplate.querySelector('.popup__description');
  const offerDescription = generatedOffer.offer.description;
  popupDescription.textContent = offerDescription ? offerDescription : popupDescription.remove();
  const popupPhotos = elementFromOfferTemplate.querySelector('.popup__photos');
  const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
  const offerPhotos = generatedOffer.offer.photos;
  popupPhotoFirst.src = offerPhotos[0] ? offerPhotos[0] : popupPhotoFirst.remove();

  createPhoto(popupPhotos, popupPhotoFirst, generatedOffer.offer.photos);

  const popupAvatar = elementFromOfferTemplate.querySelector('.popup__avatar');
  const offerAvatar = generatedOffer.author.avatar;
  popupAvatar.src = offerAvatar ? offerAvatar : popupAvatar.remove();

  return elementFromOfferTemplate;
};

// функция для создания массива попапов
const createPopupArrayFromGeneratedOffers = (generatedOffers) => {
  const popupArray = [];

  for(let i = 0; i < generatedOffers.length; i++) {
    const popup = createPopup(offerTemplate, generatedOffers[i]);
    popupArray.push(popup);
  }

  return popupArray;
};

const popups = createPopupArrayFromGeneratedOffers(generatedOffers);

const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(popups[0]);
