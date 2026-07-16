import GrainIcon from '@mui/icons-material/GrainRounded'
import HistoryIcon from '@mui/icons-material/HistoryRounded'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturingRounded'
import RawOnIcon from '@mui/icons-material/RawOn'
import WarehouseIcon from '@mui/icons-material/WarehouseRounded'
import WorkspacesIcon from '@mui/icons-material/WorkspacesRounded'
import {
  CreateDetailRequestIcon,
  createDetailRequestTooltip,
} from '@/domains/pdo/detail_requests/create_button'
import { routeMap } from '@/lib/routes'
import type { Link } from '../../components/nav_sidebar'

const icon_sx = { fontSize: 16, opacity: 0.8 }

export const nav_links: Link[] = [
  {
    name: 'Производство',
    href: routeMap.pdo.index,
    iconNode: <PrecisionManufacturingIcon sx={icon_sx} />,
  },
  {
    name: 'Группы',
    href: routeMap.pdo.detailGroups,
    iconNode: <WorkspacesIcon sx={icon_sx} />,
  },
  {
    name: 'Требования',
    href: routeMap.pdo.detailRequests,
    iconNode: <WarehouseIcon sx={icon_sx} />,
    endBlock: [
      {
        href: routeMap.pdo.detailRequestNew,
        iconNode: <CreateDetailRequestIcon sx={icon_sx} />,
        tooltip: createDetailRequestTooltip,
      },
    ],
  },
  {
    name: 'Детали',
    href: routeMap.pdo.details,
    iconNode: <GrainIcon sx={icon_sx} />,
    endBlock: [
      {
        href: routeMap.pdo.detail.new,
        tooltip: 'Создать деталь',
      },
    ],
  },
  {
    name: 'Материалы',
    href: routeMap.pdo.materials,
    iconNode: <RawOnIcon sx={icon_sx} />,
    endBlock: [
      {
        href: routeMap.pdo.material.new,
        tooltip: 'Создать материал',
      },
    ],
  },
  {
    name: 'Журнал',
    href: routeMap.pdo.operations,
    iconNode: <HistoryIcon sx={icon_sx} />,
  },
]
