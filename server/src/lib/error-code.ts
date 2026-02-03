export enum Errcode {
  INVALID_CREDENTIAL = 'Неверный логин или пароль',
  INVALID_ACCESS_TOKEN = 'Сессия истекла. Обновите страницу.',
  INVALID_REFRESH_TOKEN = 'Сессия истекла. Войдите снова',
  INVALID_EMAIL = 'Некорректный адрес электронной почты',
  INVALID_PASSWORD = 'Пароль введён неверно',
  USER_NOT_FOUND = 'Пользователь не найден',
  UNKNOWN_ERROR_TRY_AGAIN = 'Что-то пошло не так. Попробуйте ещё раз',
  MISSING_AUTH_HEADER = 'Вы не авторизованы',
  MISSING_ORDERID_HEADER = 'Не удалось определить номер заказа',
}
