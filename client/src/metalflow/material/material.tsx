/** @jsxImportSource @emotion/react */
import { PageTitle } from 'components/page-title'
import { TabConfig, Tabs } from 'components/tabs'
import { EnMaterialShape, UiMaterialShape } from 'domain-model'
import {
  Button,
  InputStack,
  Link,
  observer,
  P,
  Row,
  RowButColumsAtSm,
  SendMutation,
  Stack,
  TakeLookHint,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { MaterialUnitSelect } from '../shared/basic'
import { materialStore } from '../store'
import { t } from '../text'
import {
  ListMaterialInput,
  PipeMaterialInput,
  RoundBarInput,
  SquareMaterialInput
} from './material_specific_inputs'

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
    return () => {
      materialStore.clear()
    }
  }, [])

  return (
    <Stack gap={1} py={2}>
      <PageTitle subTitle={t.AddMaterial} hideIcon />
      <Tabs tabs={tabList} handleChange={v => materialStore.setShape(v)} />
      <MaterialUnitSelect
        value={materialStore.unit}
        onChange={v => materialStore.setUnit(v)}
      />
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
    </Stack>
  )
})

export const UpdateMaterialPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)

  useEffect(() => {
    materialStore.load(materialId)
    return () => {
      materialStore.clear()
    }
  }, [])

  return (
    <RowButColumsAtSm alignItems={'start'} p={1} gap={2}>
      <Stack gap={1}>
        <Row gap={2}>
          <P level="h4">{materialStore.label}</P>
          <WarehouseOperations id={materialId} />
        </Row>
        <P level="body-sm">ID: {materialId}</P>
        <InputStack>
          {tabList.find(t => t.value === materialStore.shape)?.component}
        </InputStack>
        <SendMutation onClick={() => materialStore.update()} />
      </Stack>
      <DetailsMadeOfMaterial />
    </RowButColumsAtSm>
  )
})

function WarehouseOperations(props: { id: number }) {
  const navigate = useNavigate()
  const { id } = props
  return (
    <Row gap={1}>
      <Button
        color="primary"
        variant="soft"
        onClick={() =>
          navigate(
            open(routeMap.metalflow.supply.new, id, {
              material_id: id
            })
          )
        }
      >
        Поставка
      </Button>
      <Button
        color="danger"
        variant="soft"
        onClick={() =>
          navigate(
            open(routeMap.metalflow.writeoff.new, id, {
              material_id: id
            })
          )
        }
      >
        Списание
      </Button>
    </Row>
  )
}

const DetailsMadeOfMaterial = observer(() => {
  useEffect(() => {
    materialStore.loadDetailsMadeOfMaterial()
  }, [materialStore.material])

  if (materialStore.detailsMadeOfMaterial.length === 0) {
    return null
  }

  return (
    <Stack gap={2} sx={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <P fontWeight={600}>Детали из этого материала</P>
      <Stack gap={0.5}>
        {materialStore.detailsMadeOfMaterial.map(each => (
          <Link to={open(routeMap.metalflow.detail.edit, each.id)}>
            <P key={each.id} level="body-sm">
              {each.name}
            </P>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
})
