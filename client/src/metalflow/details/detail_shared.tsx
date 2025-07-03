/** @jsxImportSource @emotion/react */
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { WithSmallLinkButton } from 'components/small_link_button'
import { EnUnit } from 'domain-model'
import {
  Button,
  DeleteResourceButton,
  Inp,
  Label,
  P,
  Row,
  Sheet,
  Stack,
  observer
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { cache } from 'metalflow/metal_flow_cache'
import { Link } from 'react-router-dom'
import { MaterialAutocomplete } from '../shared/material_autocomplete'
import { QtyInputWithUnit } from '../shared/qty_input_with_unit'
import { MaterialCost, detailStore } from './detail.store'

export const MaterialWeightInput = observer(
  (props: { materialRelation: MaterialCost }) => {
    return (
      <Row gap={3}>
        <QtyInputWithUnit
          size="sm"
          label="Вес"
          unitId={EnUnit.Gram}
          setValue={v => {
            props.materialRelation.setWeight(v)
          }}
          value={props.materialRelation.weight}
        />
        <QtyInputWithUnit
          size="sm"
          label="Длина"
          unitId={EnUnit.MilliMeter}
          setValue={v => {
            props.materialRelation.setLength(v)
          }}
          value={props.materialRelation.length}
        />
      </Row>
    )
  }
)
export const MaterialSelect = observer(
  (props: { value: MaterialCost; index: number }) => {
    return (
      <MaterialAutocomplete
        size="sm"
        data={cache.materials.getMaterials().map(e => {
          return new MaterialCost({
            materialId: e.id,
            label: e.label
          })
        })}
        value={props.value}
        onChange={m => {
          if (m) {
            detailStore.updateMaterialRelation(
              props.index,
              { id: m.materialId, label: m.materialLabel },
              {
                length: m.length,
                weight: m.weight
              }
            )
          }
        }}
      />
    )
  }
)
export const MaterialRelationDataInputs = observer(() => {
  return (
    <Sheet sx={{ borderRadius: 'sm' }}>
      <Stack gap={1}>
        {detailStore.usedMaterials.map((materialCost, index) => {
          return (
            <Stack
              sx={{ width: 'max-content', p: 1 }}
              key={materialCost.materialId}
            >
              <Label>Расход для материала</Label>
              <Stack>
                <Row>
                  <MaterialSelect value={materialCost} index={index} />
                  <DeleteResourceButton
                    onClick={() => {
                      if (!detailStore.id) {
                        throw new Error('Detail id is not set')
                      }
                      detailStore.deleteDetailMaterial(
                        detailStore.id,
                        materialCost.materialId
                      )
                    }}
                  />
                </Row>
                <MaterialWeightInput materialRelation={materialCost} />
              </Stack>
            </Stack>
          )
        })}
      </Stack>
      <Button
        sx={{ m: 1 }}
        variant="soft"
        onClick={() => {
          detailStore.addMaterial(
            detailStore.usedMaterials.length,
            {
              id: 0,
              label: ''
            },
            { length: '', weight: '' }
          )
        }}
      >
        Добавить материал
      </Button>
    </Sheet>
  )
})
export const DetailNameInput = observer(() => {
  return (
    <Inp
      fullWidth
      label="Наименование детали (без группы)"
      onChange={v => {
        detailStore.setName(v)
      }}
      value={detailStore.name}
    />
  )
})
export const DetailPartCodeInput = observer(() => {
  return (
    <Inp
      label="Конструкторский номер"
      onChange={v => {
        detailStore.setPartCode(v)
      }}
      value={detailStore.partCode}
    />
  )
})

export const DetailGroupInput = observer(() => {
  const groupOptions: BaseOption[] = cache.detailGroups
    .getGroups()
    .map(group => ({
      label: group.name,
      value: group.id
    }))

  const selectedGroup =
    groupOptions.find(option => option.value === detailStore.groupId) || null

  return (
    <Stack>
      <Label>
        Группа детали (если деталь универсальная и используется в разных
        группах, оставьте пустым)
      </Label>
      <BaseAutocomplete
        options={groupOptions}
        value={selectedGroup}
        onChange={group => {
          detailStore.setGroupId(group?.value || null)
        }}
      />
    </Stack>
  )
})

interface Detail {
  id: number
  name: string
  group_id: number | null
}

export const DetailName = observer(
  (props: { detail: Detail; showLinkButton?: boolean }) => {
    const { detail, showLinkButton } = props

    const name = (
      <Row>
        <P sx={{ whiteSpace: 'nowrap', width: 'min-content' }}>{detail.name}</P>
        {detail.group_id && (
          <Button
            variant="plain"
            color="primary"
            size="sm"
            sx={{ p: '.1 0' }}
            onClick={e => e.stopPropagation()}
          >
            <Link
              to={open(routeMap.metalflow.detailGroup, detail.group_id)}
              style={{ textDecoration: 'none' }}
            >
              <P color="primary" sx={{ cursor: 'pointer' }}>
                {cache.detailGroups.getGroupName(detail.group_id)}
              </P>
            </Link>
          </Button>
        )}
      </Row>
    )

    if (showLinkButton) {
      return (
        <WithSmallLinkButton
          linkTo={
            detail.id ? open(routeMap.metalflow.detail.edit, detail.id) : '#'
          }
        >
          {name}
        </WithSmallLinkButton>
      )
    }

    return name
  }
)
