import { makeAutoObservable, runInAction } from 'mobx'
import { rpc } from '@/lib/rpc/rpc.client'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'

export interface Employee {
  id: number
  first_name: string
  last_name: string
  job_title: string
  card: string
  access_card: string
  days_since_last_event: number | null
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
    const [employees, jobTitles] = await this.loading.run(async () =>
      Promise.all([
        rpc.hr.employees.list.query(),
        rpc.hr.employees.get_job_titles.query(),
      ]),
    )
    runInAction(() => {
      this.employees = employees
        .map(
          e =>
            ({
              id: e.id,
              card: e.card,
              access_card: e.access_card || '',
              first_name: e.firstname ?? '',
              last_name: e.lastname ?? '',
              job_title: e.job_title || '',
              days_since_last_event: e.days_since_last_event ?? null,
            }) satisfies Employee,
        )
        .toSorted((a, b) => {
          const aName = `${a.last_name} ${a.first_name}`.trim()
          const bName = `${b.last_name} ${b.first_name}`.trim()

          const aEmpty = !aName
          const bEmpty = !bName

          if (aEmpty && bEmpty) return 0
          if (aEmpty) return 1
          if (bEmpty) return -1

          return aName.localeCompare(bName)
        })

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
    if (!editedTitle || editedTitle === employee.job_title) {
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
      employee.job_title = editedTitle
      this.editedJobTitles.delete(id)
    })

    notifier.ok(
      `Должность ${editedTitle} назначена ${employee.first_name} ${employee.last_name}`,
    )
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
    if (!editedCard || editedCard === employee.access_card) {
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
      employee.access_card = editedCard
      this.editedAccessCards.delete(id)
    })

    notifier.ok(
      `Пропуск ${editedCard} назначен ${employee.first_name} ${employee.last_name}`,
    )
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
    const originalFirstname = employee.first_name
    const originalLastname = employee.last_name

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
      employee.last_name = editedLastname || originalLastname
      employee.first_name = editedFirstname || originalFirstname
      this.editedFirstnames.delete(id)
      this.editedLastnames.delete(id)
    })

    notifier.ok(
      `Сотрудник переименован: ${employee.first_name} ${employee.last_name}`,
    )
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
