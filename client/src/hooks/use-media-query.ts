import { useEffect, useState } from 'react'

export const useMediaQuery = query => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia(query)
		setMatches(mediaQuery.matches)

		const handler = event => setMatches(event.matches)
		mediaQuery.addEventListener('change', handler)

		return () => mediaQuery.removeEventListener('change', handler)
	}, [query])

	return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 600px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 600px)')
