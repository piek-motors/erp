import { Stack } from '@mui/material'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { apolloClient } from '../../../api'
import { MetalFlowSys } from '../../../lib/routes'
import { Input, P } from '../../../shortcuts'
import {
  UpdateDetailMaterialCostDocument,
  UpdateDetailMaterialCostMutation,
  UpdateDetailMaterialCostMutationVariables,
  useGetDetailByPkQuery,
  useUpdateDetailMutation
} from '../../../types/graphql-shema'
import { Detail } from '../domain/detail'
import { GenericForm } from '../shared'
import { MutationWithStatus } from '../shared/basic'
import { t } from '../text'
import { DetailMaterialPropInput } from './shared'
import { useDetail } from './state'

export function DetailUpdate() {
  const id = Number(new URLSearchParams(useLocation().search).get('id'))
  if (!id) {
    return <>No id</>
  }

  const state = useDetail()
  const { data, refetch } = useGetDetailByPkQuery({
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  const [mutate] = useUpdateDetailMutation()

  useEffect(() => {
    if (data) {
      state.unpack(data.metal_pdo_details_by_pk)
    }
  }, [data])

  const handleSave = async () => {
    await mutate({
      variables: {
        id: state.id,
        _set: {
          name: state.name
        }
      }
    })

    for (const m of state.materials) {
      const cost = state.materialCosts[m.id]

      await apolloClient.mutate<
        UpdateDetailMaterialCostMutation,
        UpdateDetailMaterialCostMutationVariables
      >({
        mutation: UpdateDetailMaterialCostDocument,
        variables: {
          cost: Number(cost),
          detail_id: state.id,
          material_id: m.id
        }
      })
    }

    state.setRecentlyUpdated(new Detail(state.id, state.name, state.materials))
    setTimeout(() => refetch(), 1000)
  }

  return (
    <GenericForm
      header={t.EditDetail}
      goBackUrl={MetalFlowSys.details}
      lastSection={<MutationWithStatus mutation={handleSave} />}
    >
      <Stack
        gap={1}
        sx={{
          display: 'flex'
        }}
      >
        <P>ID {state.id}</P>

        <Input
          label={t.DetailName}
          onChange={(event: any) => {
            state.setName(event.target.value)
          }}
          value={state.name}
          autoComplete={'off'}
        />

        <DetailMaterialPropInput />
      </Stack>
    </GenericForm>
  )
}
