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
  clonedFeatures.forEach((clonedFeature) => {
    if(!isIncluded(clonedFeature, generatedFeatures)) {
      clonedFeature.remove();
    }
  });
};

// функция для создания элемента img с правильным src
const createPhotos = (photosContainer, photoTemplate, photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const popupPhoto = photoTemplate.cloneNode(true);
    popupPhoto.src = photo;
    fragment.append(popupPhoto);
  });

  photoTemplate.remove();
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
  const popupFeatures = popup.querySelector('.popup__features').querySelectorAll('li');
  const popupDescription = popup.querySelector('.popup__description');
  const popupPhotos = popup.querySelector('.popup__photos');
  const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
  const popupAvatar = popup.querySelector('.popup__avatar');

  const {
    offer: {
      title: offerTitle,
      address: offerAddress,
      price: offerPrice,
      type: offerType,
      rooms: offerRooms,
      guests: offerGuests,
      checkin: offerCheckin,
      checkout: offerCheckout,
      features: offerFeatures,
      description: offerDescription,
      photos: offerPhotos,
    },
    author: {
      avatar: offerAvatar,
    },
  } = offer;

  popupTitle.textContent = offerTitle ? offerTitle : popupTitle.remove();
  popupTextAddress.textContent = offerAddress ? offerAddress : popupTextAddress.remove();
  popupTextPrice.textContent = offerPrice ? `${offerPrice} \u20BD/ночь` : popupTextPrice.remove();
  popupType.textContent = offerTypes[offerType];
  popupTextCapacity.textContent = offerRooms && offerGuests ? `${offerRooms} комнаты для ${offerGuests} гостей` : popupTextCapacity.remove();
  popupTextTime.textContent = offerCheckin && offerCheckout ? `Заезд после ${offerCheckin}, выезд до ${offerCheckout}` : popupTextTime.remove();
  createFeatures(popupFeatures, offerFeatures);
  popupDescription.textContent = offerDescription ? offerDescription : popupDescription.remove();
  createPhotos(popupPhotos, popupPhotoFirst, offerPhotos);
  popupAvatar.src = offerAvatar ? offerAvatar : popupAvatar.remove();

  return popup;
};

// функция для создания массива попапов
const createPopupsFromOffers = (offers) => {
  const popups = [];

  offers.forEach((offer) => {
    const popup = createPopup(template, offer);
    popups.push(popup);
  });

  return popups;
};

const popups = createPopupsFromOffers(offers);

const mapCanvas = document.querySelector('#map-canvas');
