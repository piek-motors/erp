export const isDuplicateKeyError = (e: any) => {
	if (typeof e !== 'object') return false
	if ('code' in e && e.code === '23505') return true
}
