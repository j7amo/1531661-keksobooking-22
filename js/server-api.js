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
      if(response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then(json => {
      return onSuccess(json);
    })
    .catch(err => {
      onFail(err);
    });
};

// 2) Функция отправки данных на сервер
const sendDataToServer = (onFail, form) => {
  fetch(
    'https://22.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(form),
    },
  )
    .then(response => {
      console.log(response.ok);
      console.log(response.status);
      console.log(response.statusText);
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((json) => {
      console.log(json);
    })
    .catch(() => {
      onFail();
    });
};

// при ошибке отправки / получения данных будем рендерить красную полоску
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

export { getDataFromServer, sendDataToServer, showAlert };
