import { Box } from '@mui/joy'
import { useNavigate } from 'react-router'
import { MenuCard } from '@/components/nav-menu/menu-card'
import { MENU_LINKS, type MenuLink } from '@/components/nav-menu/menu-links'

interface MenuGridProps {
  mentionsCount: number
}

export const MenuGrid = ({ mentionsCount }: MenuGridProps) => {
  const navigate = useNavigate()

  const getBadgeCount = (link: MenuLink): number | undefined => {
    if (link.badgeKey === 'mentions') return mentionsCount
    return undefined
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 2,
        width: '100%',
        maxWidth: 900,
      }}
    >
      {MENU_LINKS.map(link => (
        <MenuCard
          key={link.href}
          icon={link.icon}
          name={link.name}
          count={getBadgeCount(link)}
          onClick={() => navigate(link.href)}
        />
      ))}
    </Box>
  )
}
