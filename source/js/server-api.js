const ALERT_SHOW_TIME = 5000;
const ALERT_ZINDEX = '100';
const ALERT_POSITION = 'absolute';
const ALERT_POSITION_LEFT = '0';
const ALERT_POSITION_TOP = '0';
const ALERT_POSITION_RIGHT = '0';
const ALERT_PADDING = '10px 3px';
const ALERT_FONTSIZE = '30px';
const ALERT_TEXTALIGN = 'center';
const ALERT_BACKGROUNDCOLOR = 'red';

const getDataFromServer = (onSuccess, onFail) => {
  return fetch(
    'https://22.javascript.pages.academy/keksobooking/data',
    {
      method: 'GET',
      credentials: 'same-origin',
    },
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then(json => onSuccess(json))
    .catch(err => onFail(err));
};

const sendDataToServer = (onSuccess, onFail, form) => {
  fetch(
    'https://22.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(form),
    },
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then(() => onSuccess())
    .catch(() => onFail());
};

const showSuccessMessage = () => {
  const mainContainer = document.querySelector('main');
  const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  const successMessage = successMessageTemplate.cloneNode(true);
  mainContainer.appendChild(successMessage);

  document.addEventListener('click', () => {
    successMessage.remove();
  });
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      successMessage.remove();
    }
  });
};

const showFailMessage = () => {
  const mainContainer = document.querySelector('main');
  const failMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  const failMessage = failMessageTemplate.cloneNode(true);
  const errorButton = failMessage.querySelector('.error__button');
  mainContainer.appendChild(failMessage);

  document.addEventListener('click', () => {
    failMessage.remove();
  });
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      failMessage.remove();
    }
  });
  errorButton.addEventListener('click', () => {
    failMessage.remove();
  });
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = ALERT_ZINDEX;
  alertContainer.style.position = ALERT_POSITION;
  alertContainer.style.left = ALERT_POSITION_LEFT;
  alertContainer.style.top = ALERT_POSITION_TOP;
  alertContainer.style.right = ALERT_POSITION_RIGHT;
  alertContainer.style.padding = ALERT_PADDING;
  alertContainer.style.fontSize = ALERT_FONTSIZE;
  alertContainer.style.textAlign = ALERT_TEXTALIGN;
  alertContainer.style.backgroundColor = ALERT_BACKGROUNDCOLOR;

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

export { getDataFromServer, sendDataToServer, showAlert, showSuccessMessage, showFailMessage };
