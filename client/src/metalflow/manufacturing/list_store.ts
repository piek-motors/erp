import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/deps'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from '../../../../server/src/lib/trpc'

export type ManufactoringListOutput =
  RouterOutput['metal']['manufacturing']['list']['inProduction'][number]

export class ManufacturingListStore {
  readonly async = new AsyncStoreController()

  detailsInProduction: ManufactoringListOutput[] = []
  detailsFinished: ManufactoringListOutput[] = []
  setDetailsInProduction(details: ManufactoringListOutput[]) {
    this.detailsInProduction = details
  }
  setDetailsFinished(details: ManufactoringListOutput[]) {
    this.detailsFinished = details
  }

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    this.async.run(async () => {
      const details = await rpc.metal.manufacturing.list.query()
      this.setDetailsInProduction(details.inProduction)
      this.setDetailsFinished(details.finished)
    })
  }

  async finishManufacturing(id: number) {
    await rpc.metal.manufacturing.finish.mutate({ id })
    this.load()
  }
}
