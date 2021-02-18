import { getGeneratedOffers } from './data.js';
// Это модуль, который будет отвечать за генерацию разметки похожих элементов.
// Он "собирается" на основе:
// - временных данных для разработки (значит, нам понадобится массив объявлений, который возвращает функция getGeneratedOffers)
const generatedOffers = getGeneratedOffers();

// - шаблона #card (значит, нам понадобится получить соотв. шаблон из index.html и использовать его содержимое)
const offerTemplateContent = document.querySelector('#card').content;

// объявляем корневой элемент дерева, начиная с которого мы будем клонировать элементы
const offerTemplate = offerTemplateContent.querySelector('.popup');

// клонируем ОДИН (пока один для тестирования) элемент и дальше "пляшем" от него
const elementFromOfferTemplate = offerTemplate.cloneNode(true);

// создайте DOM-элементы, соответствующие объявлениям, и заполните их данными:

// 1) Выведите заголовок объявления offer.title в заголовок .popup__title.
const popupTitle = elementFromOfferTemplate.querySelector('.popup__title');
if(generatedOffers[0].offer.title === '') {
  
} else {
  popupTitle.textContent = generatedOffers[0].offer.title;
}

// 2) Выведите адрес offer.address в блок .popup__text--address.
const popupTextAddress = elementFromOfferTemplate.querySelector('.popup__text--address');
popupTextAddress.textContent = generatedOffers[0].offer.address;

// 3) Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}} ₽/ночь. Например, «5200 ₽/ночь».
const popupTextPrice = elementFromOfferTemplate.querySelector('.popup__text--price');
popupTextPrice.textContent = `${generatedOffers[0].offer.price} \u20BD/ночь`;

// 4) В блок .popup__type выведите тип жилья offer.type, сопоставив с подписями:
// Квартира для flat
// Бунгало для bungalow
// Дом для house
// Дворец для palace
const popupType = elementFromOfferTemplate.querySelector('.popup__type');
popupType.textContent = (() => {
  switch(generatedOffers[0].offer.type) {
    case 'flat':
      return 'Квартира';
    case 'bungalow':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }
})();

// 5) Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity
// строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, «2 комнаты для 3 гостей».
const popupTextCapacity = elementFromOfferTemplate.querySelector('.popup__text--capacity');
popupTextCapacity.textContent = `${generatedOffers[0].offer.rooms} комнаты для ${generatedOffers[0].offer.guests} гостей`;

// 6) Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой
// вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, «Заезд после 14:00, выезд до 14:00».
const popupTextTime = elementFromOfferTemplate.querySelector('.popup__text--time');
popupTextTime.textContent = `Заезд после ${generatedOffers[0].offer.checkin}, выезд до ${generatedOffers[0].offer.checkout}`;

// 7) В список .popup__features выведите все доступные удобства в объявлении.
const popupFeatures = elementFromOfferTemplate.querySelector('.popup__features');

// так как в данном случае мы не можем просто засэтить textContent DOM-элемента popupFeatures, то нам придётся
// получить всех его потомков, чтобы сэтить это свойство у них, при этом ситуация осложняется тем, что нам
// нужно засэтить textContent у НУЖНЫХ li'шек, а ненужные вообще удалить из DOM'а (если я правильно рассуждаю),
// иначе они будут занимать место при отрисовке, при этом не имея никакого контента и разметка съедет

// будем идти по li'шкам
for(let feature of popupFeatures.children) {

  // пройдём по массиву удобств, которые указаны в объяве, и будем
  // - сэтить свойство textContent у тех элементов DOM'а (списка), в которых будет найдено совпадение(частичное)
  // удобства и модификатора
  // - те элементы списка, совпадений по которым найдено не будет, удаляем из DOM'а

  // объявим флаг, который будет сигнализировать об успешном/неудачном поиске совпадения
  let isIncluded = false;

  // также объявим переменную, которую будем сэтить найденным совпадением
  let offerFeatureIncluded = '';

  // объявим вложенный цикл, который должен пройтись по всем удобствам объявления и сравнить их с модификатором li'шки
  for(let generatedOfferFeature of generatedOffers[0].offer.features) {
    if(feature.classList[1].includes(generatedOfferFeature)) {
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

// 8) В блок .popup__description выведите описание объекта недвижимости offer.description.
const popupDescription = elementFromOfferTemplate.querySelector('.popup__description');
popupDescription.textContent = generatedOffers[0].offer.description;

// 9) В блок .popup__photos выведите все фотографии из списка offer.photos.
// Каждая из строк массива photos должна записываться как src соответствующего изображения.
const popupPhotos = elementFromOfferTemplate.querySelector('.popup__photos');

// тут похожая на пункт 7 история, но проще, так как нам не нужно искать совпадений,
// а просто сгенерировать элементы img с правильным атрибутом src,
// но небольшая "засада" заключается в том, что у нас уже при клонировании есть один элемент img,
// а следовательно его атрибут мы должны засэтить отдельно
const popupPhotoFirst = popupPhotos.querySelector('.popup__photo');
popupPhotoFirst.src = generatedOffers[0].offer.photos[0];

// а остальные элементы можно обработать в цикле (клонирование -> заполнение атрибута -> добавление элемента родителю)
for(let i = 1; i < generatedOffers[0].offer.photos.length - 1; i++) {
  const popupPhoto = popupPhotoFirst.cloneNode(true);
  popupPhoto.src = generatedOffers[0].offer.photos[i];
  popupPhotos.appendChild(popupPhoto);
}

// 10) Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar —
// на значения поля author.avatar отрисовываемого объекта.
const popupAvatar = elementFromOfferTemplate.querySelector('.popup__avatar');
popupAvatar.src = generatedOffers[0].author.avatar;

