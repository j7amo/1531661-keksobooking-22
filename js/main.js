'use strict';

// Функция, возвращающая случайное целое число из переданного диапазона включительно.
// Диапазон может быть только положительный, включая ноль.
// Также необходимо придумать, как функция должна вести себя,
// если передать значение «до» меньшее, чем значение «от», или равное ему.

const getRandomInt = (rangeStart = 0, rangeEnd = 0) => {
  // проверяем переданные аргументы на их корректность
  if(isNaN(rangeStart) || isNaN(rangeEnd) || rangeStart < 0 || rangeEnd < 0) {
    return 0;
  }

  // проверяем случай когда значение "до" меньше либо равно значению "от"
  // и так как в ТЗ реализация поведения на такой случай остаётся на усмотрение разработчика, то выбран такой вариант:
  if(rangeEnd <= rangeStart) {
    rangeEnd = rangeStart;
  }

  // после всех проверок можно произвести расчёт случайного целого числа из диапазона
  return +rangeStart + Math.round(Math.random() * (rangeEnd - rangeStart));
};

// вызов-заглушка, чтобы сделать приятно линтеру...
getRandomInt();


