import { Container, Sheet, Stack } from '@mui/joy'
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
import { observer, Observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { detailStore, materialListStore } from '../store'
import { t } from '../text'
import { MaterialRelation } from './detail.store'

const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialRelation }) => {
    return (
      <>
        <QtyInputWithUnit
          label="Вес материала"
          unitId={EnUnit.Gram}
          setValue={v => {
            props.materialRelation.setWeight(v)
          }}
          value={props.materialRelation.weight}
        />
        <QtyInputWithUnit
          label="Длина материала"
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

function DetailMaterialRelationForm() {
  return (
    <Sheet>
      <Stack my={1} gap={2}>
        {detailStore.materials.map(materialRelation => {
          const { material } = materialRelation
          return (
            <Stack sx={{ width: 'max-content' }} key={material.id}>
              <Row sx={{ fontWeight: 'bold' }}>
                <P>Материал</P>
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
}

export const UpdateDetail = observer(() => {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) throw new Error('No id in url')
  const navigate = useNavigate()
  useEffect(() => {
    detailStore.load(id)
  }, [])
  return (
    <Container maxWidth="sm" sx={{ margin: 0, p: 1 }}>
      <PageTitle title={t.EditDetail} hideIcon />
      <Stack gap={1}>
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
              variant: 'soft',
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
    </Container>
  )
})

export const AddDetail = observer(() => {
  const { data: materials } = useGetMaterialsQuery()
  return (
    <Observer
      render={() => (
        <SmallInputForm
          header={t.AddDetail}
          last={
            <SendMutation
              onClick={detailStore.insert}
              additionals={(err, res) => (
                <TakeLookHint
                  text={t.RecentlyNewDetailAdded}
                  link={open(routeMap.metalflow.detail.edit, res)}
                />
              )}
            />
          }
        >
          <Inp
            label={t.DetailName}
            onChange={v => {
              detailStore.setName(v)
            }}
            value={detailStore.name}
          />
          <MaterialAutocompleteMulti
            data={materials}
            value={Array.from(materialListStore.materials)}
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
        </SmallInputForm>
      )}
    />
  )
})
