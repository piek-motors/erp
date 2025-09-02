export type PrintOptions = {
  filename?: string
  page?: {
    size?: string
    orientation?: 'portrait' | 'landscape'
    margin?: string
  }
  hideSelectors?: string[]
  extraCss?: string
}

function buildPrintCss(opts: PrintOptions): string {
  const size = opts.page?.size ?? 'A4'
  const orientation = opts.page?.orientation ?? 'portrait'
  const margin = opts.page?.margin ?? '10mm'
  const selectors = opts.hideSelectors ?? [
    '.no-print',
    '[data-no-print="true"]'
  ]
  const hideRules = selectors.map(s => `${s}{display:none!important}`).join('')
  const extra = opts.extraCss ?? ''
  return `@page{size:${size} ${orientation};margin:${margin}}@media print{*{background:transparent!important;background-color:transparent!important;-webkit-print-color-adjust:economy;print-color-adjust:economy}*:before,*:after{background:transparent!important;background-color:transparent!important}${hideRules}${extra}}`
}

export async function printPage(options: PrintOptions = {}): Promise<void> {
  const prevTitle = document.title
  const title = options.filename?.trim()
  const style = document.createElement('style')
  style.setAttribute('data-print-style', '1')
  style.textContent = buildPrintCss(options)
  document.head.appendChild(style)
  if (title && title.length > 0) document.title = title
  await new Promise<void>(resolve => {
    const cleanup = () => {
      if (document.head.contains(style)) document.head.removeChild(style)
      document.title = prevTitle
    }
    const onAfter = () => {
      window.removeEventListener('afterprint', onAfter)
      cleanup()
      resolve()
    }
    window.addEventListener('afterprint', onAfter)
    const fallback = window.setTimeout(() => {
      window.removeEventListener('afterprint', onAfter)
      cleanup()
      resolve()
    }, 3000)
    const wrappedAfter = () => {
      window.clearTimeout(fallback)
      onAfter()
    }
    window.removeEventListener('afterprint', onAfter)
    window.addEventListener('afterprint', wrappedAfter, { once: true })
    window.print()
  })
}
