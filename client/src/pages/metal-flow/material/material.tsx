/** @jsxImportSource @emotion/react */
import { Button, Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import {
  InputStack,
  MyTabs,
  P,
  Row,
  SendMutation,
  TakeLookHint
} from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { JSX, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { materialStore } from '../store'
import { t } from '../text'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './shape-data'

const tabs: Record<EnMaterialShape, JSX.Element> = {
  [EnMaterialShape.RoundBar]: <RoundBarInput />,
  [EnMaterialShape.SquareBar]: <SquareMaterialInput />,
  [EnMaterialShape.List]: <ListMaterialInput />,
  [EnMaterialShape.Pipe]: <PipeMaterialInput />
}

export const AddMaterial = observer(() => {
  const uiTabs: Record<string, JSX.Element> = {}
  for (const [key, val] of Object.entries(tabs)) {
    uiTabs[UiMaterialShape[key]] = val
  }
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
      <MyTabs tabs={uiTabs} handleChange={materialStore.setShape} />
      <MaterialUnitSelect
        value={materialStore.unit}
        onChange={v => materialStore.setUnit(v)}
      />
    </SmallInputForm>
  )
})

export const UpdateMaterial = observer(() => {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }
  useEffect(() => {
    materialStore.load(id)
  }, [])

  return (
    <Stack gap={1} p={1}>
      <PageTitle title="Изменить материал" hideIcon />
      <Row>
        <P level="h4">{materialStore.label}</P>
        <WareHouseOperationLinks id={id} />
      </Row>
      <InputStack>{tabs[materialStore.shape]}</InputStack>
      <SendMutation onClick={() => materialStore.update()} />
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
