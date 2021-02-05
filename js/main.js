'use strict';

// ДЗ №2 (module2-task1)
const isPositiveNumber = (number) => !isNaN(number) && number >= 0;

const getRandomInt = (rangeStart = 0, rangeEnd = 0) => {
  if(!isPositiveNumber(rangeStart) || !isPositiveNumber(rangeEnd)) {
    return 0;
  }

  if(rangeEnd <= rangeStart) {
    return rangeStart;
  }

  return Number(rangeStart) + Math.round(Math.random() * (rangeEnd - rangeStart));
};

getRandomInt();

const getRandomFloat = (rangeStart = 0, rangeEnd = 0, digitsAfterPoint = 2) => {
  if(!isPositiveNumber(rangeStart) || !isPositiveNumber(rangeEnd) || !isPositiveNumber(digitsAfterPoint)) {
    return 0;
  }

  if(rangeEnd <= rangeStart) {
    return rangeStart;
  }

  return (Number(rangeStart) + Math.random() * (rangeEnd - rangeStart)).toFixed(digitsAfterPoint);
};

getRandomFloat();

// ДЗ №3 (module3-task1)

// В файле main.js на основе написанных в прошлом задании утилитарных функций напишите необходимые функции
// для создания массива из 10 сгенерированных JS-объектов.

// 1) объявим необходимые константы, известные до выполнения
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

// 2) объявим утилитарную функцию, которая будет возвращать случайный элемент из переданного ей массива
const getRandomElement = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

// 3) объявим утилитарную функцию, которая будет:
//    - принимать массив;
//    - возвращать новый случайной длины.
// При этом элементы массива должны быть уникальны, то есть НЕ повторяться.
const getRandomLengthArray = (array) => {
  const randomLengthArray = [];
  const randomLength = getRandomInt(1, array.length);

  while(randomLengthArray.length < randomLength) {
    const randomElement = getRandomElement(array);

    if (!randomLengthArray.includes(randomElement)) {
      randomLengthArray.push(randomElement);
    }
  }
  return randomLengthArray;
};

// 4) объявим функцию, которая будет возвращать сгенерированный согласно ТЗ объект
const generateRentOffer = () => {

  // объявим отдельно 2 переменные вне return, так как эти значения требуются в разных свойствах генерируемого объекта
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

// 5) объявим утилитарную функцию, которая добавит сгенерированные объекты в массив и вернёт его
const getGeneratedOffers = () => {
  const generatedOffers = [];

  for(let i = 0; i < GENERATED_OBJECTS_COUNT; i++) {
    generatedOffers.push(generateRentOffer());
  }

  return generatedOffers;
};

// "приласкаем" линтер вызовом функции
getGeneratedOffers();
