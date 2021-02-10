// модуль с утилитарными функциями

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

const getRandomFloat = (rangeStart = 0, rangeEnd = 0, digitsAfterPoint = 2) => {
  if(!isPositiveNumber(rangeStart) || !isPositiveNumber(rangeEnd) || !isPositiveNumber(digitsAfterPoint)) {
    return 0;
  }

  if(rangeEnd <= rangeStart) {
    return rangeStart;
  }

  return (Number(rangeStart) + Math.random() * (rangeEnd - rangeStart)).toFixed(digitsAfterPoint);
};

const getRandomElement = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

const getRandomLengthArray = (array) => {
  const randomLengthArrayElements = [];
  const randomLength = getRandomInt(1, array.length);

  while(randomLengthArrayElements.length < randomLength) {
    const randomElement = getRandomElement(array);

    if (!randomLengthArrayElements.includes(randomElement)) {
      randomLengthArrayElements.push(randomElement);
    }
  }
  return randomLengthArrayElements;
};

export { getRandomInt, getRandomFloat, getRandomElement, getRandomLengthArray };
