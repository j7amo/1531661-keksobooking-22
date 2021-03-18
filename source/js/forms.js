const FRACTION_DIGITS = 5;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const PREVIEW_IMAGE_WIDTH = '70px';
const PREVIEW_IMAGE_HEIGHT = '70px';

const minOfferPrices = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const numberOfRoomsCapacity = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};

const mapFiltersForm = document.querySelector('.map__filters');
const mapFiltersSelects = mapFiltersForm.querySelectorAll('select');
const mapFiltersFieldset = mapFiltersForm.querySelector('fieldset');
const mapFiltersCheckboxes = mapFiltersFieldset.querySelectorAll('input');
const adForm = document.querySelector('.ad-form');
const adFormTitle = adForm.querySelector('input[name="title"]');
const adFormFieldsets = adForm.querySelectorAll('fieldset');
const addressInputField = adForm.querySelector('input[name = "address"]');
const adFormReset = adForm.querySelector('.ad-form__reset');
const offerType = adForm.querySelector('select[name="type"]');
const offerPrice = adForm.querySelector('input[name="price"]');
const offerCheckIn = adForm.querySelector('select[name="timein"]');
const offerCheckInOptions = offerCheckIn.querySelectorAll('option');
const offerCheckOut = adForm.querySelector('select[name="timeout"]');
const offerCheckOutOptions = offerCheckOut.querySelectorAll('option');
const offerNumberOfRooms = adForm.querySelector('select[name="rooms"]');
const offerCapacity = adForm.querySelector('select[name="capacity"]');
const avatarChooser = adForm.querySelector('input[id="avatar"]');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const photosChooser = adForm.querySelector('input[id="images"]');
const photosPreview = adForm.querySelector('.ad-form__photo');

const setOfferTypeToPriceDependency = () => {
  offerPrice.min = minOfferPrices[offerType.value];
  offerPrice.placeholder = minOfferPrices[offerType.value];
  addInvalidFormFieldNumberHandler(offerPrice, offerPrice.min, offerPrice.max);
};

const setCheckOutToCheckInDependency = () => {
  offerCheckOutOptions.forEach((option) => {
    if (option.value === offerCheckIn.value) {
      option.selected = true;
    }
  });
};

const setCheckInToCheckOutDependency = () => {
  offerCheckInOptions.forEach((option) => {
    if (option.value === offerCheckOut.value) {
      option.selected = true;
    }
  });
};

const setNumberOfRoomsCapacityDependency = () => {
  const value = Number(offerNumberOfRooms.value);
  [...offerCapacity.options].forEach((option) => {
    option.disabled = !numberOfRoomsCapacity[value].includes(Number(option.value));
  })
  offerCapacity.value = value > 3 ? '0' : value;
}

const addInvalidFormFieldLengthHandler = (field, minLength, maxLength) => {
  field.addEventListener('invalid', () => {
    if (field.validity.tooShort) {
      field.setCustomValidity(`Введите минимум ${minLength} символа(ов)`);
    } else if (field.validity.tooLong) {
      field.setCustomValidity(`Введите максимум ${maxLength} символа(ов)`);
    } else if (field.validity.valueMissing) {
      field.setCustomValidity('Обязательное поле');
    } else {
      field.setCustomValidity('');
    }
  });
};

const addInvalidFormFieldNumberHandler = (field, minNumber, maxNumber) => {
  field.addEventListener('invalid', () => {
    if (field.validity.rangeUnderflow) {
      field.setCustomValidity(`Стоимость должна начинаться от ${minNumber}`);
    } else if (field.validity.rangeOverflow) {
      field.setCustomValidity(`Стоимость не должна превышать ${maxNumber}`);
    } else if (field.validity.valueMissing) {
      field.setCustomValidity('Обязательное поле');
    } else {
      field.setCustomValidity('');
    }
  });
};

const initializeForms = () => {
  setOfferTypeToPriceDependency();
  setCheckOutToCheckInDependency();
  setNumberOfRoomsCapacityDependency();

  addImageUploadChangeHandler(avatarChooser, avatarPreview);
  addImageUploadChangeHandler(photosChooser, photosPreview);

  offerType.addEventListener('change', () => {
    setOfferTypeToPriceDependency();
  });

  offerCheckIn.addEventListener('change', () => {
    setCheckOutToCheckInDependency();
  });

  offerCheckOut.addEventListener('change', () => {
    setCheckInToCheckOutDependency();
  });

  offerNumberOfRooms.addEventListener('change', () => {
    setNumberOfRoomsCapacityDependency();
  });

  addInvalidFormFieldLengthHandler(adFormTitle, adFormTitle.minLength, adFormTitle.maxLength);
};

const getFiltersValues = () => {
  const filtersValues = [];

  mapFiltersSelects.forEach((select) => {
    filtersValues.push(select.value);
  });

  mapFiltersCheckboxes.forEach((input) => {
    if (input.checked) {
      filtersValues.push(input.value);
    }
  });

  return filtersValues;
}

const enableAdForm = () => {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach((element) => {
    element.disabled = false;
  });
};

const enableMapFiltersForm = () => {
  mapFiltersForm.classList.remove('map__filters--disabled');
  mapFiltersSelects.forEach((element) => {
    element.disabled = false;
  });
  mapFiltersFieldset.disabled = false;
};

const disableForms = () => {
  adForm.classList.add('ad-form--disabled');
  adFormFieldsets.forEach((element) => {
    element.disabled = true;
  });
  mapFiltersForm.classList.add('map__filters--disabled');
  mapFiltersSelects.forEach((element) => {
    element.disabled = true;
  });
  mapFiltersFieldset.disabled = true;
};

const initializeAddressInputField = (mainPinMarker) => {
  addressInputField.readOnly = true;
  const latitude = mainPinMarker.getLatLng().lat.toFixed(FRACTION_DIGITS);
  const longitude = mainPinMarker.getLatLng().lng.toFixed(FRACTION_DIGITS);
  addressInputField.value = `${latitude}, ${longitude}`;
};

const addMarkerMoveEndHandler = (pinMarker) => {
  pinMarker.on('moveend', (evt) => {
    let newCoordinatesObject = evt.target.getLatLng();
    addressInputField.value = `${newCoordinatesObject.lat.toFixed(FRACTION_DIGITS)}, ${newCoordinatesObject.lng.toFixed(FRACTION_DIGITS)}`;
  });
};

const addAdFormSubmitHandler = (cb) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    cb(adForm);
  });
};

const addMapFilterSelectChangeHandler = (cb) => {
  mapFiltersSelects.forEach((select) => {
    select.addEventListener('change', () => {
      cb();
    });
  });
};

const addMapFilterInputChangeHandler = (cb) => {
  mapFiltersCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      cb();
    });
  });
};

const addMapFiltersChangeHandler = (cb) => {
  addMapFilterSelectChangeHandler(cb);
  addMapFilterInputChangeHandler(cb);
}

const resetForms = () => {
  mapFiltersForm.reset();
  adForm.reset();
  avatarPreview.src = 'img/muffin-grey.svg';
  if (photosPreview.hasChildNodes()) {
    photosPreview.innerHTML = '';
  }
}

const addAdFormResetHandler = (cb) => {
  adFormReset.addEventListener('click', () => {
    resetForms();
    cb();
  })
};

const addImageUploadChangeHandler = (fileChooser, preview) => {
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const hasExtensionMatch = FILE_TYPES.some((extension) => {
      return fileName.endsWith(extension);
    });

    if (hasExtensionMatch) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (preview.tagName === 'IMG') {
          preview.src = reader.result;
        } else {
          const previewImage = document.createElement('img');
          previewImage.style.width = PREVIEW_IMAGE_WIDTH;
          previewImage.style.height = PREVIEW_IMAGE_HEIGHT;
          previewImage.src = reader.result;
          preview.append(previewImage);
        }
      });

      reader.readAsDataURL(file);
    }
  });
};

export {
  initializeForms,
  enableAdForm,
  enableMapFiltersForm,
  addMapFiltersChangeHandler,
  getFiltersValues,
  disableForms,
  initializeAddressInputField,
  addMarkerMoveEndHandler,
  addAdFormSubmitHandler,
  addAdFormResetHandler,
  resetForms
};
