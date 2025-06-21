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
import { MaterialUnitSelect, SaveAndDelete } from '../shared/basic'
import { material } from '../store'
import { t } from '../text'
import { ListMaterialInputBase } from './shape/list'
import { PipeMaterialInputBase } from './shape/pipe'
import { RoundBarInputBase } from './shape/round_bar'
import { SquareMaterialInputBase } from './shape/squate'

const tabList: TabConfig = [
  {
    value: EnMaterialShape.RoundBar,
    label: UiMaterialShape[EnMaterialShape.RoundBar],
    component: <RoundBarInputBase />
  },
  {
    value: EnMaterialShape.SquareBar,
    label: UiMaterialShape[EnMaterialShape.SquareBar],
    component: <SquareMaterialInputBase />
  },
  {
    value: EnMaterialShape.List,
    label: UiMaterialShape[EnMaterialShape.List],
    component: <ListMaterialInputBase />
  },
  {
    value: EnMaterialShape.Pipe,
    label: UiMaterialShape[EnMaterialShape.Pipe],
    component: <PipeMaterialInputBase />
  }
]

export const AddMaterialPage = observer(() => {
  useEffect(() => {
    return () => {
      material.clear()
    }
  }, [])

  return (
    <Stack gap={1} py={2}>
      <PageTitle subTitle={t.AddMaterial} hideIcon />
      <Tabs tabs={tabList} handleChange={v => material.setShape(v)} />
      <MaterialUnitSelect
        value={material.unit}
        onChange={v => material.setUnit(v)}
      />
      <SendMutation onClick={() => material.insert()} />
      {material.insertedMaterialId && (
        <TakeLookHint
          text={t.RecentlyNewMaterialAdded}
          link={open(
            routeMap.metalflow.material.edit,
            material.insertedMaterialId
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
  const navigate = useNavigate()

  useEffect(() => {
    material.load(materialId)
    return () => {
      material.clear()
    }
  }, [])

  return (
    <RowButColumsAtSm alignItems={'start'} p={1} gap={2}>
      <Stack gap={1}>
        <Row gap={2}>
          <P level="h4">{material.label}</P>
          <WarehouseOperations id={materialId} />
        </Row>
        <P level="body-sm">ID: {materialId}</P>
        <InputStack>
          {tabList.find(t => t.value === material.shape)?.component}
        </InputStack>
        <SaveAndDelete
          itemName={`Материал (${material.id}) - ${material.label}`}
          handleDelete={() =>
            material.delete().then(() => {
              navigate(open(routeMap.metalflow.materials))
            })
          }
          handleSave={() => material.update()}
        />
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
    material.loadDetailsMadeOfMaterial()
  }, [material.material])

  if (material.detailsMadeOfMaterial.length === 0) {
    return null
  }

  return (
    <Stack gap={2} sx={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <P fontWeight={600}>Детали из этого материала</P>
      <Stack gap={0.5}>
        {material.detailsMadeOfMaterial.map(each => (
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
