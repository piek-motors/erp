import { Sheet, Stack, Typography } from '@mui/joy'
import { EnUnit, Material } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { Observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Inp, Row, SendMutation, TakeLookHint } from 'shortcuts'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { ResourceName } from '../shared/material-name'
import { detailStore, materialListStore } from '../store'
import { t } from '../text'

function MaterialWeightInput(props: { material: Material }) {
  const relationData = detailStore.materials.get(props.material)
  return (
    <>
      <QtyInputWithUnit
        label="Вес заготовки"
        unitId={EnUnit.Gram}
        setValue={v => {
          detailStore.updateMaterialRelationData(props.material, {
            weight: v
          })
        }}
        value={relationData ? relationData.weight : ''}
      />
      <QtyInputWithUnit
        label="Длина заготовки"
        unitId={EnUnit.MilliMeter}
        setValue={v => {
          detailStore.updateMaterialRelationData(props.material, {
            length: v
          })
        }}
        value={relationData ? relationData.length : ''}
      />
    </>
  )
}

function DetailMaterialRelationForm() {
  return (
    <Sheet>
      <Stack my={1} gap={2}>
        {Array.from(detailStore.materials.keys()).map(material => {
          return (
            <Stack sx={{ width: 'max-content' }} key={material.id}>
              <Row sx={{ fontWeight: 'bold' }}>
                <Typography>Материал</Typography>
                <ResourceName resource={material?.getLabelProps()} />
              </Row>
              <Stack p={1}>
                <MaterialWeightInput material={material} />
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Sheet>
  )
}

export function UpdateDetail() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) return <>No id</>

  useEffect(() => {
    detailStore.loadDetailById(id)
  }, [])

  return (
    <Observer
      render={() => (
        <SmallInputForm
          header={t.EditDetail}
          last={<SendMutation onClick={detailStore.update} />}
        >
          <Stack gap={1}>
            <Typography>
              <b>ID</b> {detailStore.id}
            </Typography>
            <Inp
              fullWidth
              label={t.DetailName}
              onChange={v => {
                detailStore.setName(v)
              }}
              value={detailStore.name}
            />
            <DetailMaterialRelationForm />
          </Stack>
        </SmallInputForm>
      )}
    />
  )
}

export function AddDetail() {
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
                  link={openMetalFlowPage(MetalFlowRoutes.detail_update, res)}
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
              detailStore.setMaterials(m)
            }}
          />
          <DetailMaterialRelationForm />
        </SmallInputForm>
      )}
    />
  )
}
