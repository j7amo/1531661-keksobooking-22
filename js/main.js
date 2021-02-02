'use strict';

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
