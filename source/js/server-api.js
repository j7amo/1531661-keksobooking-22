// время показа ошибки
const ALERT_SHOW_TIME = 5000;

// Для взаимодействия с сервером напишем 2 отдельные функции
// 1) Функция получения данных с сервера (она будет возвращать JSON - массив объектов)
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

// 2) Функция отправки данных на сервер
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

// при успешной отправке объявления будем рендерить соответствующее сообщение на странице согласно ТЗ
const showSuccessMessage = () => {
  const mainContainer = document.querySelector('main');
  const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  const successMessage = successMessageTemplate.cloneNode(true);
  mainContainer.appendChild(successMessage);

  // сразу при создании сообщения повесим на всё окно обработчик на click и Escape
  // для того, чтобы пользователь мог скрыть сообщение
  document.addEventListener('click', () => {
    successMessage.remove();
  });
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      successMessage.remove();
    }
  });
};

// при неудачной отправке объявления будем рендерить соответствующее сообщение на странице согласно ТЗ
const showFailMessage = () => {
  const mainContainer = document.querySelector('main');
  const failMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  const failMessage = failMessageTemplate.cloneNode(true);
  const errorButton = failMessage.querySelector('.error__button');
  mainContainer.appendChild(failMessage);

  // сразу при создании сообщения повесим на всё окно обработчик на click и Escape, а также на click по специальной кнопке
  // для того, чтобы пользователь мог скрыть сообщение
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

// при ошибке получения данных будем рендерить красную полоску
// с текстом "При работе с сервером произошла ошибка"
const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};


export { getDataFromServer, sendDataToServer, showAlert, showSuccessMessage, showFailMessage };
