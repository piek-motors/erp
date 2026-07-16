import { useCallback, useEffect, useRef, useState } from 'react'

export async function copyTextToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall back for local/non-secure contexts where Clipboard API may fail.
    }
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.append(textArea)
  textArea.select()

  try {
    return document.execCommand('copy')
  } finally {
    textArea.remove()
  }
}

export interface UseCopyToClipboardOptions {
  resetDelay?: number
}

export function useCopyToClipboard<CopiedKey extends string | number>({
  resetDelay = 450,
}: UseCopyToClipboardOptions = {}) {
  const [copiedKey, setCopiedKey] = useState<CopiedKey | null>(null)
  const resetTimeoutRef = useRef<number | null>(null)

  const clearResetTimeout = useCallback(() => {
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
  }, [])

  const clearCopied = useCallback(() => {
    clearResetTimeout()
    setCopiedKey(null)
  }, [clearResetTimeout])

  useEffect(() => clearResetTimeout, [clearResetTimeout])

  const copy = useCallback(
    async (text: string, key: CopiedKey) => {
      const copied = await copyTextToClipboard(text)
      if (!copied) {
        return false
      }

      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }

      setCopiedKey(key)
      resetTimeoutRef.current = window.setTimeout(() => {
        setCopiedKey(current => (current === key ? null : current))
        resetTimeoutRef.current = null
      }, resetDelay)

      return true
    },
    [resetDelay],
  )

  const isCopied = useCallback(
    (key: CopiedKey) => copiedKey === key,
    [copiedKey],
  )

  return {
    copiedKey,
    copy,
    clearCopied,
    isCopied,
  }
}
