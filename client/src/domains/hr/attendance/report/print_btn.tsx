import { WebOnly } from '@/components/utilities/conditional-display'
import { ButtonXxs } from '@/lib'
import { observer } from 'mobx-react-lite'
import { vm } from './view_model'

export const PrintPdfButton = observer(
  ({ printRef }: { printRef: React.RefObject<HTMLDivElement | null> }) => {
    const handlePrint = () => {
      const el = printRef.current
      if (!el) return

      const originalZoom = el.style.zoom

      const styleId = '__print_page_style__'
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
      }

      styleEl.textContent = `
    @page {
      size: A4 landscape;
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    table {
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
  `

      el.style.transformOrigin = 'initial'
      const contentWidth = el.scrollWidth
      const pageWidth = 1122 // A4 landscape @96dpi
      const scale = pageWidth / contentWidth

      el.style.zoom = String(scale)

      document.title = `Отчёт по рабочему времени за ${vm.report?.month.replace('.', '')}`

      setTimeout(() => {
        window.print()

        el.style.zoom = originalZoom
        styleEl!.textContent = ''
      }, 100)
    }

    return (
      <WebOnly>
        <ButtonXxs size="sm" onClick={handlePrint} variant="solid">
          PDF
        </ButtonXxs>
      </WebOnly>
    )
  },
)
