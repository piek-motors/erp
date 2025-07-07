import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../server/src/lib/trpc'

export type ManufactoringListOutput =
  RouterOutput['metal']['manufacturing']['list']['inProduction'][number]

export class ManufacturingStore {
  detailsInProduction: ManufactoringListOutput[] = []
  detailsFinished: ManufactoringListOutput[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async init() {
    const details = await rpc.metal.manufacturing.list.query()
    this.detailsInProduction = details.inProduction
    this.detailsFinished = details.finished
  }
}
