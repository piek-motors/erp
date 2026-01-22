export enum Errcode {
	INVALID_CREDENTIAL = 'Неправильный пароль',
	INVALID_ACCESS_TOKEN = 'Invalid access token',
	INVALID_REFRESH_TOKEN = 'Invalid refresh token',
	INVALID_EMAIL = 'Invalid email',
	INVALID_PASSWORD = 'Invalid password',
	USER_NOT_FOUND = 'User not found',
	UNKNOWN_ERROR_TRY_AGAIN = 'Unknown error occured. Please try again.',
	MISSING_AUTH_HEADER = 'The authorization header is missing',
	MISSING_ORDERID_HEADER = 'The orderid header is missing',
}
