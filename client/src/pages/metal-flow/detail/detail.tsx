import { Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { EnUnit } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import {
  DeleteResourceButton,
  Inp,
  P,
  Row,
  SendMutation,
  TakeLookHint
} from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QtyInputWithUnit } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { detailStore } from '../store'
import { t } from '../text'
import { MaterialRelation } from './store/detail.store'

const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialRelation }) => {
    return (
      <>
        <QtyInputWithUnit
          label="Вес"
          unitId={EnUnit.Gram}
          setValue={v => {
            props.materialRelation.setWeight(v)
          }}
          value={props.materialRelation.weight}
        />
        <QtyInputWithUnit
          label="Длина"
          unitId={EnUnit.MilliMeter}
          setValue={v => {
            props.materialRelation.setLength(v)
          }}
          value={props.materialRelation.length}
        />
      </>
    )
  }
)

const DetailMaterialRelationForm = observer(() => {
  if (!detailStore.usedMaterials.length) {
    return null
  }
  return (
    <Sheet sx={{ borderRadius: 'sm' }}>
      <Stack my={1} gap={1}>
        {detailStore.usedMaterials.map(materialRelation => {
          const { material } = materialRelation
          return (
            <Stack sx={{ width: 'max-content' }} key={material.id}>
              <Row sx={{ fontWeight: 'bold', px: 1 }}>
                <P>Расход для материала</P>
                <P>{material?.label}</P>
              </Row>
              <Stack p={1}>
                <MaterialWeightInput materialRelation={materialRelation} />
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Sheet>
  )
})

export const UpdateDetail = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)

  const navigate = useNavigate()
  useEffect(() => {
    detailStore.load(detailId)
    return () => {
      detailStore.clear()
    }
  }, [])
  return (
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.EditDetail} hideIcon />
      <Stack gap={2}>
        <P>
          <b>ID</b> {detailStore.id}
        </P>
        <Inp
          fullWidth
          label={t.DetailName}
          onChange={v => {
            detailStore.setName(v)
          }}
          value={detailStore.name}
        />
        <DetailMaterialRelationForm />
        {/* buttons */}
        <Row alignItems={'end'}>
          <SendMutation
            onClick={() => detailStore.update()}
            stackProps={{ sx: { flexGrow: 1 } }}
            buttonProps={{
              fullWidth: true
            }}
          />
          <DeleteResourceButton
            onClick={() =>
              detailStore.delete().then(() => {
                navigate(open(routeMap.metalflow.details))
              })
            }
          />
        </Row>
      </Stack>
    </Stack>
  )
})

export const AddDetail = observer(() => {
  useEffect(() => {
    detailStore.loadMaterials()
    return () => {
      detailStore.clear()
    }
  }, [])

  return (
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.AddDetail} hideIcon />
      <Inp
        label={t.DetailName}
        onChange={v => {
          detailStore.setName(v)
        }}
        value={detailStore.name}
      />
      <MaterialAutocompleteMulti
        data={detailStore.materialsSuggestions}
        value={detailStore.usedMaterials.map(m => m.material)}
        onChange={m => {
          detailStore.setMaterialRelations(
            m.map(
              m =>
                new MaterialRelation(m, {
                  length: '',
                  weight: ''
                })
            )
          )
        }}
      />
      <DetailMaterialRelationForm />
      <SendMutation
        onClick={() => detailStore.insert()}
        additionals={(err, mutationResult) => (
          <TakeLookHint
            text={t.RecentlyNewDetailAdded}
            link={open(routeMap.metalflow.detail.edit, mutationResult.id)}
          />
        )}
      />
    </Stack>
  )
})
