export enum Errcode {
  INVALID_REQUEST = 'Invalid request',
  INVALID_CREDENTIAL = 'Invalid credential',
  INVALID_ACCESS_TOKEN = 'Invalid access token',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  INVALID_EMAIL = 'Invalid email',
  INVALID_PASSWORD = 'Invalid password',
  INVALID_USERNAME = 'Invalid username',
  USER_NOT_FOUND = 'User not found',
  USERNAME_NOT_AVAILABLE = 'Try another username',
  EMAIL_NOT_AVAILABLE = 'Try another email',
  UNKNOWN_ERROR_TRY_AGAIN = 'Unknown error occured. Please try again.',
  MISSING_AUTH_HEADER = 'The authorization header is missing',
  MISSING_ORDERID_HEADER = 'The orderid header is missing'
}
