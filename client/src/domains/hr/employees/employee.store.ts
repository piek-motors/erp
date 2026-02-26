import { makeAutoObservable, runInAction } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'

export interface Employee {
  id: number
  name: string
  jobTitle: string
  card: string
}

export interface JobTitleOption {
  label: string
  value: string
}

export class EmployeeStore {
  readonly loading = new LoadingController()
  employees: Employee[] = []
  jobTitles: JobTitleOption[] = []
  editedJobTitles: Map<number, string> = new Map()

  constructor() {
    makeAutoObservable(this)
  }

  async load() {
    const [data, jobTitles] = await this.loading.run(async () =>
      Promise.all([
        rpc.hr.employees.list.query(),
        rpc.hr.employees.get_job_titles.query(),
      ]),
    )
    runInAction(() => {
      this.employees = data.map(e => ({
        id: e.id,
        card: e.card,
        name: `${e.lastname} ${e.firstname}`,
        jobTitle: e.job_title || '',
      }))
      this.jobTitles = jobTitles.map(t => ({ label: t, value: t }))
    })
  }

  setEditedJobTitle(id: number, value: string) {
    this.editedJobTitles.set(id, value)
  }

  getEditedJobTitle(id: number, original: string): string {
    return this.editedJobTitles.get(id) ?? original
  }

  async saveJobTitle(id: number) {
    const employee = this.employees.find(e => e.id === id)
    if (!employee) return

    const editedTitle = this.editedJobTitles.get(id)?.trim()
    if (!editedTitle || editedTitle === employee.jobTitle) {
      // nothing changed
      this.editedJobTitles.delete(id)
      return
    }

    // call API only if the value changed
    await rpc.hr.employees.update_job_title.mutate({
      id,
      job_title: editedTitle,
    })

    runInAction(() => {
      employee.jobTitle = editedTitle
      this.editedJobTitles.delete(id)
    })

    notifier.ok(`Должность ${editedTitle} назначена ${employee.name}`)
  }

  cancelEdit(id: number) {
    this.editedJobTitles.delete(id)
  }
}

export const employeeStore = new EmployeeStore()
