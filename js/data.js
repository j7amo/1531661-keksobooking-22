// модуль, который создаёт данные
import { getRandomInt, getRandomFloat, getRandomElement, getRandomLengthArray } from './util.js';

const GENERATED_OBJECTS_COUNT = 10;
const OFFER_TITLE = 'Лучшее предложение по аренде недвижимости!';
const MIN_PRICE = 1;
const MIN_ROOMS = 1;
const MIN_GUESTS = 1;
const ACCOMMODATION = ['palace', 'flat', 'house', 'bungalow'];
const CHECKIN = ['12:00', '13:00', '14:00'];
const CHECKOUT = ['12:00', '13:00', '14:00'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const OFFER_DESCRIPTION = 'Все удобства! Евроремонт! Соседей нет!';
const PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
const LATITUDE_START = 35.65000;
const LATITUDE_END = 35.70000;
const LONGITUDE_START = 139.70000;
const LONGITUDE_END = 139.80000;
const PRECISION = 5;

const generateRentOffer = () => {

  const randomX = getRandomFloat(LATITUDE_START, LATITUDE_END, PRECISION);
  const randomY = getRandomFloat(LONGITUDE_START, LONGITUDE_END, PRECISION);

  return {
    author: {
      avatar: `img/avatars/user0${getRandomInt(1, 8)}.png`,
    },
    offer: {
      title: OFFER_TITLE,
      address: `${randomX}, ${randomY}`,
      price: getRandomInt(MIN_PRICE, Number.MAX_VALUE),
      type: getRandomElement(ACCOMMODATION),
      rooms: getRandomInt(MIN_ROOMS, Number.MAX_VALUE),
      guests: getRandomInt(MIN_GUESTS, Number.MAX_VALUE),
      checkin: getRandomElement(CHECKIN),
      checkout: getRandomElement(CHECKOUT),
      features: getRandomLengthArray(FEATURES),
      description: OFFER_DESCRIPTION,
      photos: getRandomLengthArray(PHOTOS),
    },
    location: {
      x: randomX,
      y: randomY,
    },
  }
};

const getGeneratedOffers = () => {
  const generatedOffers = [];

  for(let i = 0; i < GENERATED_OBJECTS_COUNT; i++) {
    generatedOffers.push(generateRentOffer());
  }

  return generatedOffers;
};

export { getGeneratedOffers };
