import { useEffect } from 'react'

/**
 * Calls the provided callback when Escape key is pressed and enabled is true.
 */
export function useEscapeClose(enabled: boolean, onClose: () => void) {
  useEffect(() => {
    if (!enabled) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onClose])
}
