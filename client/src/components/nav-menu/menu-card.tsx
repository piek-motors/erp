import { Badge, Box, Typography } from '@mui/joy'
import { type Icon, UseIcon } from '@/lib/index'

interface MenuCardProps {
  icon: Icon
  name: string
  count?: number
  onClick: () => void
}

export const MenuCard = ({ icon, name, count, onClick }: MenuCardProps) => {
  const hasNotification = count !== undefined && count > 0

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        border: '1px solid',
        borderColor: 'neutral.outlinedBorder',
        bgcolor: 'background.popup',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: 'background.surface',
          borderColor: 'neutral.outlinedHoverBorder',
          boxShadow: 'md',
        },
      }}
    >
      <Box sx={{ fontSize: 36, mb: 1.5, color: 'text.secondary' }}>
        <UseIcon icon={icon} />
      </Box>
      <Typography
        level="body-md"
        textAlign="center"
        fontWeight={600}
        sx={{ color: 'text.primary' }}
      >
        {name}
      </Typography>
      {hasNotification && (
        <Badge
          color="danger"
          badgeContent={count}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        />
      )}
    </Box>
  )
}
