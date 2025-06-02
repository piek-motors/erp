/** @jsxImportSource @emotion/react */
import { Box, Button, Divider, Typography } from '@mui/joy'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { JSX, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InputStack, MyTabs, Row, SendMutation, TakeLookHint } from 'shortcuts'
import { map } from '../mappers'
import { SmallInputForm } from '../shared'
import { MaterialUnitSelect } from '../shared/basic'
import { ResourceName } from '../shared/material-name'
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
              link={openMetalFlowPage(
                MetalFlowRoutes.material_update,
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
    <SmallInputForm
      header={t.EditMaterial}
      name={
        map.material.convertable(materialStore.material) ? (
          <>
            <Box>
              <Typography level="h4">
                <ResourceName
                  resource={materialStore.material?.getLabelProps()}
                />
              </Typography>
              {t.Unit} {materialStore.unit}
            </Box>
            <UpdateMaterialUpdateStockLinks id={id} />
          </>
        ) : (
          <></>
        )
      }
      last={<SendMutation onClick={() => materialStore.update()} />}
    >
      <InputStack>{tabs[materialStore.shape]}</InputStack>
    </SmallInputForm>
  )
})

function UpdateMaterialUpdateStockLinks(props: { id: number }) {
  const navigate = useNavigate()
  const { id } = props

  return (
    <Row mt={2}>
      <Divider />
      <Button
        variant="outlined"
        color="warning"
        onClick={() =>
          navigate(
            openMetalFlowPage(MetalFlowRoutes.supply_add, id, {
              material_id: id
            })
          )
        }
      >
        {t.AddSupply}
      </Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() =>
          navigate(
            openMetalFlowPage(MetalFlowRoutes.writeoff_add, id, {
              material_id: id
            })
          )
        }
      >
        {t.AddWriteoff}
      </Button>
      <Divider />
    </Row>
  )
}
