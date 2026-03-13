import { makeAutoObservable, runInAction } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'

export interface Employee {
  id: number
  name: string
  jobTitle: string
  card: string
  accessCard: string
}

export interface JobTitleOption {
  label: string
  value: string
}

export class EmployeeListVM {
  readonly loading = new LoadingController()
  employees: Employee[] = []
  jobTitles: JobTitleOption[] = []
  editedJobTitles: Map<number, string> = new Map()
  editedAccessCards: Map<number, string> = new Map()
  editedFirstnames: Map<number, string> = new Map()
  editedLastnames: Map<number, string> = new Map()

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
        accessCard: e.access_card || '',
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
    await rpc.hr.employees.update_employee.mutate({
      id,
      job_title: editedTitle,
    })

    runInAction(() => {
      employee.jobTitle = editedTitle
      this.editedJobTitles.delete(id)
    })

    notifier.ok(`Должность ${editedTitle} назначена ${employee.name}`)
  }

  setEditedAccessCard(id: number, value: string) {
    this.editedAccessCards.set(id, value)
  }

  getEditedAccessCard(id: number, original: string): string {
    return this.editedAccessCards.get(id) ?? original
  }

  async saveAccessCard(id: number) {
    const employee = this.employees.find(e => e.id === id)
    if (!employee) return

    const editedCard = this.editedAccessCards.get(id)?.trim()
    if (!editedCard || editedCard === employee.accessCard) {
      // nothing changed
      this.editedAccessCards.delete(id)
      return
    }

    // call API only if the value changed
    await rpc.hr.employees.update_employee.mutate({
      id,
      access_card: editedCard,
    })

    runInAction(() => {
      employee.accessCard = editedCard
      this.editedAccessCards.delete(id)
    })

    notifier.ok(`Пропуск ${editedCard} назначен ${employee.name}`)
  }

  setEditedFirstname(id: number, value: string) {
    this.editedFirstnames.set(id, value)
  }

  getEditedFirstname(id: number) {
    return this.editedFirstnames.get(id)
  }

  setEditedLastname(id: number, value: string) {
    this.editedLastnames.set(id, value)
  }

  getEditedLastname(id: number) {
    return this.editedLastnames.get(id)
  }

  async saveName(id: number) {
    const employee = this.employees.find(e => e.id === id)
    if (!employee) return

    const editedFirstname = this.editedFirstnames.get(id)?.trim()
    const editedLastname = this.editedLastnames.get(id)?.trim()
    const originalName = employee.name.split(' ')
    const originalFirstname = originalName.slice(1).join(' ')
    const originalLastname = originalName[0]

    const firstnameChanged =
      editedFirstname && editedFirstname !== originalFirstname
    const lastnameChanged =
      editedLastname && editedLastname !== originalLastname

    if (!firstnameChanged && !lastnameChanged) {
      // nothing changed
      this.editedFirstnames.delete(id)
      this.editedLastnames.delete(id)
      return
    }

    // call API only if the value changed
    await rpc.hr.employees.update_employee.mutate({
      id,
      firstname: editedFirstname || originalFirstname,
      lastname: editedLastname || originalLastname,
    })

    runInAction(() => {
      employee.name = `${editedLastname || originalLastname} ${editedFirstname || originalFirstname}`
      this.editedFirstnames.delete(id)
      this.editedLastnames.delete(id)
    })

    notifier.ok(`Сотрудник переименован: ${employee.name}`)
  }

  cancelEdit(id: number) {
    this.editedJobTitles.delete(id)
    this.editedAccessCards.delete(id)
    this.editedFirstnames.delete(id)
    this.editedLastnames.delete(id)
  }

  async delete(id: number) {
    await rpc.hr.employees.delete_employee.mutate({ id })
    runInAction(() => {
      this.employees = this.employees.filter(e => e.id !== id)
    })
    notifier.ok(`Сотрудник удален`)
  }
}

export const employee_list_vm = new EmployeeListVM()
