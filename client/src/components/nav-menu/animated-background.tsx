import { Box } from '@mui/joy'

export const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: theme =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #111827 52%, #1f2937 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: theme =>
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at 20% 50%, rgba(80, 100, 140, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(50, 70, 110, 0.24) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(90, 115, 150, 0.16) 0%, transparent 50%)
              `
              : `
                radial-gradient(circle at 20% 50%, rgba(200, 210, 230, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(220, 230, 240, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(210, 220, 235, 0.15) 0%, transparent 50%)
              `,
          animation: 'rotate 40s linear infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              var(--joy-palette-neutral-plainHoverBg) 80px,
              var(--joy-palette-neutral-plainHoverBg) 160px
            )
          `,
        },
        '@keyframes rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      <BackgroundShape
        sx={{
          width: 350,
          height: 350,
          borderRadius: '50%',
          opacity: 0.5,
          top: '8%',
          left: '10%',
          animation: 'float 25s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '33%': { transform: 'translate(40px, -40px) rotate(120deg)' },
            '66%': { transform: 'translate(-30px, 30px) rotate(240deg)' },
          },
        }}
      />
      <BackgroundShape
        sx={{
          width: 250,
          height: 250,
          borderRadius: '30px',
          opacity: 0.42,
          bottom: '12%',
          right: '12%',
          animation: 'float2 18s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
            '50%': { transform: 'translate(-50px, -50px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 180,
          height: 180,
          bgcolor: 'neutral.softBg',
          borderRadius: '50%',
          opacity: 0.45,
          top: '55%',
          left: '75%',
          animation: 'pulse 10s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.03 },
            '50%': { transform: 'scale(1.3)', opacity: 0.06 },
          },
        }}
      />
      <BackgroundShape
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          opacity: 0.38,
          top: '70%',
          left: '5%',
          animation: 'float3 22s ease-in-out infinite',
          '@keyframes float3': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, -30px)' },
          },
        }}
      />
    </Box>
  )
}

const BackgroundShape = ({ sx }: { sx: object }) => (
  <Box
    sx={{
      position: 'absolute',
      border: '1px solid',
      borderColor: 'neutral.outlinedBorder',
      ...sx,
    }}
  />
)
