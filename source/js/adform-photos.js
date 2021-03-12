// в данном модуле напишем логику загрузки фотографии объявления с предпросмотром

// также как и с аватаром заведём разрешённые для загрузки типы файлов
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

// найдём нужные элементы в DOM-дереве
const fileChooser = document.querySelector('input[id="images"]');
const preview = document.querySelector('.ad-form__photo');

// напишем функцию для подписки на событие change input'а
const addPhotosChangeHandler = () => {
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const hasExtensionMatch = FILE_TYPES.some((extension) => {
      return fileName.endsWith(extension);
    });

    if (hasExtensionMatch) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const previewImage = document.createElement('img');
        previewImage.style.width = '70px';
        previewImage.style.height = '70px';
        previewImage.src = reader.result;
        preview.append(previewImage);
      });

      reader.readAsDataURL(file);
    }
  });
};

export { addPhotosChangeHandler };
