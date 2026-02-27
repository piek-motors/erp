import { observer } from 'mobx-react-lite'
import { WebOnly } from '@/components/utilities/conditional-display'
import { ButtonXxs } from '@/lib'
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
      margin: 10mm;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
      background: none !important;
      background-color: transparent !important;
      color: #000 !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    table {
      page-break-inside: auto;
      border-collapse: collapse;
      width: 100%;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    /* Prevent page breaks inside bordered sections */
    .border, [class*="border-"] {
      page-break-inside: avoid;
    }

    /* Prevent page breaks inside table cells with borders */
    td, th {
      page-break-inside: avoid;
      border: 1px solid #000 !important;
    }

    /* Force page break before new sections if needed */
    .page-break-before {
      page-break-before: always;
    }

    /* Allow page break after major sections */
    .page-break-after {
      page-break-after: always;
    }

    /* Prevent orphans and widows */
    p, h1, h2, h3, h4, h5, h6 {
      orphans: 3;
      widows: 3;
    }

    /* Ensure table rows stay together */
    tbody tr {
      page-break-inside: avoid;
    }

    /* Add small margin to prevent border splitting */
    tbody {
      page-break-before: avoid;
    }
  `

      el.style.transformOrigin = 'initial'
      const contentWidth = el.scrollWidth
      const pageWidth = 1122 // A4 landscape @96dpi
      const scale = pageWidth / contentWidth

      // el.style.zoom = String(scale)

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
