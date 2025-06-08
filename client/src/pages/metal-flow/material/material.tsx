/** @jsxImportSource @emotion/react */
import { Button, Stack } from '@mui/joy'
import { TabConfig, Tabs } from 'components/tabs'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import { InputStack, P, Row, SendMutation, TakeLookHint } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { materialStore } from '../store'
import { t } from '../text'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './material-shape.input'

const tabList: TabConfig = [
  {
    value: EnMaterialShape.RoundBar,
    label: UiMaterialShape[EnMaterialShape.RoundBar],
    component: <RoundBarInput />
  },
  {
    value: EnMaterialShape.SquareBar,
    label: UiMaterialShape[EnMaterialShape.SquareBar],
    component: <SquareMaterialInput />
  },
  {
    value: EnMaterialShape.List,
    label: UiMaterialShape[EnMaterialShape.List],
    component: <ListMaterialInput />
  },
  {
    value: EnMaterialShape.Pipe,
    label: UiMaterialShape[EnMaterialShape.Pipe],
    component: <PipeMaterialInput />
  }
]

export const AddMaterialPage = observer(() => {
  useEffect(() => {
    materialStore.clear()
  }, [])

  return (
    <SmallInputForm
      header={t.AddMaterial}
      last={
        <>
          <SendMutation onClick={() => materialStore.insert()} />
          {materialStore.insertedMaterialId && (
            <TakeLookHint
              text={t.RecentlyNewMaterialAdded}
              link={open(
                routeMap.metalflow.material.edit,
                materialStore.insertedMaterialId
              )}
            />
          )}
        </>
      }
    >
      <Tabs tabs={tabList} handleChange={v => materialStore.setShape(v)} />
      <MaterialUnitSelect
        value={materialStore.unit}
        onChange={v => materialStore.setUnit(v)}
      />
    </SmallInputForm>
  )
})

export const UpdateMaterialPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)

  useEffect(() => {
    materialStore.load(materialId)
  }, [])

  return (
    <Stack gap={1} p={1}>
      <Row>
        <P level="h4">{materialStore.label}</P>
        <WareHouseOperationLinks id={materialId} />
      </Row>
      <P level="body-sm">ID: {materialId}</P>
      <InputStack>
        {tabList.find(t => t.value === materialStore.shape)?.component}
      </InputStack>
      <SendMutation
        onClick={() => materialStore.update()}
        buttonProps={{ color: 'success' }}
      />
    </Stack>
  )
})

function WareHouseOperationLinks(props: { id: number }) {
  const navigate = useNavigate()
  const { id } = props
  return (
    <>
      <Button
        variant="soft"
        color="success"
        onClick={() =>
          navigate(
            open(routeMap.metalflow.supply.new, id, {
              material_id: id
            })
          )
        }
      >
        Приход
      </Button>
      <Button
        color="warning"
        variant="soft"
        onClick={() =>
          navigate(
            open(routeMap.metalflow.writeoff.new, id, {
              material_id: id
            })
          )
        }
      >
        Расход
      </Button>
    </>
  )
}
