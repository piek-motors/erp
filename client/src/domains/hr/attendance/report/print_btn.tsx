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
      margin: 5mm 0mm 0mm 0mm;  
    }

    html, body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    * {
      box-sizing: border-box;
      background: none !important;
      background-color: transparent !important;
      color: #000 !important;
      box-shadow: none !important;
      text-shadow: none !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Table container */
    .attendance-table {
      display: grid !important;
      width: 100% !important;
    }

    /* Header cells */
    .table-header-cell {
      background: #fff !important;
      border: .5px solid #000 !important;
      page-break-after: avoid;
      break-after: avoid;
    }

    /* Table cells */
    .table-cell {
      border: .5px solid #000 !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Cell content - prevents splitting */
    .table-cell-content {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Sticky column (first column) */
    .table-cell[style*="left: 0"] {
      position: static !important;
      background: #fff !important;
    }

    /* Prevent page breaks inside bordered sections */
    .border, [class*="border-"] {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Prevent orphans and widows */
    p, h1, h2, h3, h4, h5, h6 {
      orphans: 3;
      widows: 3;
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
