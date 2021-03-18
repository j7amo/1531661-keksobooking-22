const OFFER_TYPE_INDEX = 0;
const OFFER_PRICE_INDEX = 1;
const OFFER_ROOMS_INDEX = 2;
const OFFER_GUESTS_INDEX = 3;
const OFFER_FEATURES_START_INDEX = 4;
const LOW_PRICE = 10000;
const MIDDLE_PRICE = 50000;

const template = document.querySelector('#card').content.querySelector('.popup');

// словарь видов размещения
const offerTypes = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

const isIncluded = (clonedFeature, generatedFeatures) => generatedFeatures.some((element) => clonedFeature.className.includes(`--${element}`));

const createFeatures = (clonedFeatures, generatedFeatures) => {
  clonedFeatures.forEach((clonedFeature) => {
    if (!isIncluded(clonedFeature, generatedFeatures)) {
      clonedFeature.remove();
    }
  });
};

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

const filterOffers = (offers, filtersValues) => {
  return offers.filter((offer) => {
    const { type, price, rooms, guests, features } = offer.offer;
    let hasAllFiltersValues = true;

    if (filtersValues[OFFER_TYPE_INDEX] !== 'any' && type !== filtersValues[OFFER_TYPE_INDEX]) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[OFFER_PRICE_INDEX] === 'low' && Number(price) > LOW_PRICE) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[OFFER_PRICE_INDEX] === 'middle' && (Number(price) < LOW_PRICE || Number(price) > MIDDLE_PRICE)) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[OFFER_PRICE_INDEX] === 'high' && Number(price) < MIDDLE_PRICE) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[OFFER_ROOMS_INDEX] !== 'any' && Number(filtersValues[OFFER_ROOMS_INDEX]) !== Number(rooms)) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[OFFER_GUESTS_INDEX] !== 'any' && Number(filtersValues[OFFER_GUESTS_INDEX]) > Number(guests)) {
      hasAllFiltersValues = false;
    }

    if (Number(filtersValues[OFFER_GUESTS_INDEX]) === 0 && Number(filtersValues[OFFER_GUESTS_INDEX]) !== Number(guests)) {
      hasAllFiltersValues = false;
    }

    if (filtersValues.length > OFFER_FEATURES_START_INDEX) {
      const localFeatures = filtersValues.slice(OFFER_FEATURES_START_INDEX);
      localFeatures.forEach((feature) => {
        if (!features.includes(feature)) {
          hasAllFiltersValues = false;
        }
      });
    }

    return hasAllFiltersValues;
  });
};

const createMapOfPopupsWithCoordinates = (offers) => {
  const popupsWithCoordinates = new Map();
  offers.forEach((offer) => {
    const popup = createPopup(template, offer);
    const location = offer.location;
    popupsWithCoordinates.set(popup, location);
  });

  return popupsWithCoordinates;
};

export { filterOffers, createMapOfPopupsWithCoordinates };
