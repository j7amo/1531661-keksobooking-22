import { getGeneratedOffers } from './data.js';

const generatedOffers = getGeneratedOffers();
const offerTemplateContent = document.querySelector('#card').content;
const offerTemplate = offerTemplateContent.querySelector('.popup');
const elementFromOfferTemplate = offerTemplate.cloneNode(true);

const popupTitle = elementFromOfferTemplate.querySelector('.popup__title');
popupTitle.textContent = generatedOffers[0].offer.title ? generatedOffers[0].offer.title : popupTitle.remove();

const popupTextAddress = elementFromOfferTemplate.querySelector('.popup__text--address');
popupTextAddress.textContent = generatedOffers[0].offer.address ? generatedOffers[0].offer.address : popupTextAddress.remove();

const popupTextPrice = elementFromOfferTemplate.querySelector('.popup__text--price');
popupTextPrice.textContent = generatedOffers[0].offer.price ? `${generatedOffers[0].offer.price} \u20BD/ночь` : popupTextPrice.remove();

const popupType = elementFromOfferTemplate.querySelector('.popup__type');

const offerTypeDictionary = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
};

popupType.textContent = offerTypeDictionary[generatedOffers[0].offer.type];

const popupTextCapacity = elementFromOfferTemplate.querySelector('.popup__text--capacity');
popupTextCapacity.textContent = generatedOffers[0].offer.rooms && generatedOffers[0].offer.guests ? `${generatedOffers[0].offer.rooms} комнаты для ${generatedOffers[0].offer.guests} гостей` : popupTextCapacity.remove();

const popupTextTime = elementFromOfferTemplate.querySelector('.popup__text--time');
popupTextTime.textContent = generatedOffers[0].offer.checkin && generatedOffers[0].offer.checkout ? `Заезд после ${generatedOffers[0].offer.checkin}, выезд до ${generatedOffers[0].offer.checkout}` : popupTextTime.remove();

const popupFeatures = elementFromOfferTemplate.querySelector('.popup__features');

const createFeature = (clonedFeatures, generatedFeatures) => {
  for(let feature of clonedFeatures) {
    let isIncluded = false;
    let offerFeatureIncluded = '';

    for(let generatedOfferFeature of generatedFeatures) {
      if(feature.className.includes(generatedOfferFeature)) {
        isIncluded = true;
        offerFeatureIncluded = generatedOfferFeature;
        break;
      }
    }

    if(isIncluded) {
      feature.textContent = offerFeatureIncluded;
    } else {
      feature.remove();
    }
  }
};

createFeature(popupFeatures.children, generatedOffers[0].offer.features);

const popupDescription = elementFromOfferTemplate.querySelector('.popup__description');
popupDescription.textContent = generatedOffers[0].offer.description ? generatedOffers[0].offer.description : popupDescription.remove();

const popupPhotos = elementFromOfferTemplate.querySelector('.popup__photos');
const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
popupPhotoFirst.src = generatedOffers[0].offer.photos[0] ? generatedOffers[0].offer.photos[0] : popupPhotoFirst.remove();

const createPhoto = (nodeToAppendPhoto, generatedPhotos) => {
  for(let i = 1; i < generatedPhotos.length - 1; i++) {
    const popupPhoto = popupPhotoFirst.cloneNode(true);
    popupPhoto.src = generatedPhotos[i];
    nodeToAppendPhoto.appendChild(popupPhoto);
  }
};

createPhoto(popupPhotos, generatedOffers[0].offer.photos);

const popupAvatar = elementFromOfferTemplate.querySelector('.popup__avatar');
popupAvatar.src = generatedOffers[0].author.avatar ? generatedOffers[0].author.avatar : popupAvatar.remove();

const mapCanvas = document.querySelector('#map-canvas');
mapCanvas.appendChild(elementFromOfferTemplate);
