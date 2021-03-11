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

// функция для проверки присутствия элемента массива удобств в классах элемента списка popup__features
const isIncluded = (clonedFeature, generatedFeatures) => generatedFeatures.some((element) => clonedFeature.className.includes(`--${element}`));

// функция для проверки элементов списка popup__features
// если такого удобства в сгенерированном оффере нет - удаляем лишку нафиг
const createFeatures = (clonedFeatures, generatedFeatures) => {
  clonedFeatures.forEach((clonedFeature) => {
    if (!isIncluded(clonedFeature, generatedFeatures)) {
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

// функция получения рейтинга объявлений (чем выше соответствие оффера заданным фильтрам,
// тем выше его рейтинг и наоборот)
// ПРИМЕЧАНИЕ: данная функция нужна для нестрогой фильтрации на основе рейтинга
const getOfferRating = (offer, filtersValues) => {
  let offerRating = 0;

  // сначала начислим баллы за соответствие по select'ам
  if (offer.offer.type === filtersValues[0]) {
    offerRating += 2;
  }

  if (filtersValues[1] === 'low' && offer.offer.price < LOW_PRICE) {
    offerRating += 3;
  }

  if (filtersValues[1] === 'middle' && (offer.offer.price >= LOW_PRICE && offer.offer.price < MIDDLE_PRICE)) {
    offerRating += 3;
  }

  if (filtersValues[1] === 'high' && offer.offer.price >= MIDDLE_PRICE) {
    offerRating += 3;
  }

  if (Number(filtersValues[2]) === offer.offer.rooms) {
    offerRating += 1;
  }

  if (Number(filtersValues[3]) === offer.offer.guests) {
    offerRating += 1;
  }

  // далее проверим наличие удобств (удобства в массиве значений фильтров начинаются с индекса 4
  if (filtersValues.length > 4) {
    const features = filtersValues.slice(4);
    features.forEach((feature) => {
      if (offer.offer.features.includes(feature)) {
        offerRating += 1;
      }
    });
  }

  return offerRating;
};

// немного "магии":
// функция, которая отдаёт функцию (лол), которую для сортировки массива по рейтингу
// мы потом должны передать в метод sort объекта Array
// ПРИМЕЧАНИЕ: данная функция нужна для нестрогой фильтрации на основе рейтинга
const getSortOffersFunction = (cb, filtersValues) => {
  return (firstOffer, secondOffer) => {
    const firstOfferRating = cb(firstOffer, filtersValues);
    const secondOfferRating = cb(secondOffer, filtersValues);

    return secondOfferRating - firstOfferRating;
  };
};

// теперь напишем функцию для строгой фильтрации объявлений (то есть должно быть строгое соответствие фильтрам -
// при любом несовпадении объявление НЕ выводится)
const filterOffers = (offers, filtersValues) => {
  return offers.filter((offer) => {
    let hasAllFiltersValues = true;

    if (filtersValues[0] !== 'any' && offer.offer.type !== filtersValues[0]) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[1] === 'low' && offer.offer.price > LOW_PRICE) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[1] === 'middle' && (offer.offer.price < LOW_PRICE || offer.offer.price > MIDDLE_PRICE)) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[1] === 'high' && offer.offer.price < MIDDLE_PRICE) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[2] !== 'any' && Number(filtersValues[2]) !== offer.offer.rooms) {
      hasAllFiltersValues = false;
    }

    if (filtersValues[3] !== 'any' && Number(filtersValues[3]) > offer.offer.rooms) {
      hasAllFiltersValues = false;
    }

    // далее проверим наличие удобств (удобства в массиве значений фильтров начинаются с индекса 4
    if (filtersValues.length > 4) {
      const features = filtersValues.slice(4);
      features.forEach((feature) => {
        if (!offer.offer.features.includes(feature)) {
          hasAllFiltersValues = false;
        }
      });
    }

    return hasAllFiltersValues;
  });
};

// функция для создания попапов с координатами (источник данных может быть как сгенерирован на клиенте, так и получен с сервера)
// Эта функция создаёт и возвращает мапу (объект типа Map), в которой
// KEY = HTMLElement (сделанный на основе шаблона попап, готовый к добавлению в балун метки карты)
// VALUE = объект с координатами, которые мы используем для правильного размещения меток объявлений на карте
const createMapOfPopupsWithCoordinates = (offers) => {
  const popupsWithCoordinates = new Map();
  offers.forEach((offer) => {
    const popup = createPopup(template, offer);
    const location = offer.location;
    popupsWithCoordinates.set(popup, location);
  });

  return popupsWithCoordinates;
};

export { getOfferRating, getSortOffersFunction, filterOffers, createMapOfPopupsWithCoordinates };
