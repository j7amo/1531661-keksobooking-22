// в данном модуле напишем логику загрузки кастомного аватара пользователя с предпросмотром

// заведём разрешённые для загрузки типы файлов
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

// найдём нужные элементы в DOM-дереве
const fileChooser = document.querySelector('input[id="avatar"]');
const preview = document.querySelector('.ad-form-header__preview img');

// напишем функцию для подписки на событие change input'а
const addAvatarChangeListener = () => {
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const hasExtensionMatch = FILE_TYPES.some((extension) => {
      return fileName.endsWith(extension);
    });

    if (hasExtensionMatch) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
};

export { addAvatarChangeListener };
