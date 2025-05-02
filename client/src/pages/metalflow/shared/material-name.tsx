import { Box, Stack } from '@mui/material'
import { CircleShapeData, MaterialShape, UiMaterialShape } from 'shared'
import { EnMaterialShape } from 'shared/enumerations'
import { P } from 'src/shortcuts'
import { t } from '../text'

export function MaterialName(props: {
  shape: EnMaterialShape
  shapeData: MaterialShape
}) {
  switch (props.shape) {
    case EnMaterialShape.Circle: {
      const d = props.shapeData as any as CircleShapeData
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <pre>
            {UiMaterialShape[EnMaterialShape.Circle]} D{d.diameter}
          </pre>
          <P variant="caption" sx={{ whiteSpace: 'nowrap' }}>
            {d.alloy}
          </P>
          <CalibratedTag isCalibrated={d.calibrated} />
        </Stack>
      )
    }
    case EnMaterialShape.List:
      return <>Лист</>
    default:
      throw Error('Unknown shape')
  }
}

function CalibratedTag(props: { isCalibrated: boolean }) {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--L2)',
        padding: '0 4px',
        borderRadius: '4px'
      }}
    >
      <P variant="caption">{props.isCalibrated ? t.Calibrated : ''}</P>
    </Box>
  )
}
