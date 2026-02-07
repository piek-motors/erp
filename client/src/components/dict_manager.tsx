import { Label, Loading, PlusIcon, Row } from '@/lib/index'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import type { DictEntry } from '@/server/lib/create_dict_router'
import {
  Button,
  Container,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { sort_rus } from 'models'

export interface Dict<V extends DictEntry> {
  ls(): Promise<V[]>
  rm(id: number): Promise<void>
  add(v: V['v']): Promise<V>
  onClick(V): void
}

class State {
  constructor() {
    makeAutoObservable(this)
  }
  readonly loader = new LoadingController()

  search?: string
  setSearch(s?: string) {
    this.search = s
  }

  options: DictEntry[] = []
  setOptions(ops: DictEntry[]) {
    this.options = sort_rus(ops, op => op.v)
  }
  modalOpen = false
  setModalOpen(v: boolean) {
    this.modalOpen = v
  }

  dict?: Dict<DictEntry>
  setDict(d?: Dict<any>) {
    this.dict = d
  }

  newValue?: string
  setNewValue(s?: string) {
    this.newValue = s
  }

  get filtredOptions() {
    if (this.search) {
      return this.options.filter(e =>
        e.v.toLocaleLowerCase().includes(this.search!.toLocaleLowerCase()),
      )
    }
    return this.options
  }

  async open<V extends DictEntry>(dict: Dict<V>) {
    this.dict = dict
    this.setModalOpen(true)
    const opts = await this.loader.run(() => dict.ls())
    this.setOptions(opts)
  }

  async close() {
    this.search = undefined
    this.setModalOpen(false)
    this.setDict(undefined)
  }

  async rm(id: number) {
    if (!this.dict) throw Error('dict is undefined')

    await this.dict.rm(id)
    this.setOptions(this.options.filter(each => each.id !== id))
  }

  async add() {
    if (!this.dict) throw Error('dict is undefined')
    if (!this.newValue) throw Error('name is not set')

    await this.dict.add(this.newValue)
    const opts = await this.dict?.ls()
    if (opts) {
      this.setOptions(opts)
    }
    notifier.ok(`В справочник добавлено значение ${this.newValue}`)

    this.setNewValue(undefined)
    this.setSearch(undefined)
  }

  async onClick(v) {
    if (!this.dict) throw Error('dict is undefined')
    this.dict?.onClick(v)
    this.close()
  }
}

export const DictManagerModal = observer(() => (
  <Modal open={state.modalOpen} onClose={() => state.setModalOpen(false)}>
    <ModalDialog layout="fullscreen">
      <Container maxWidth="xs" sx={{ overflow: 'auto' }}>
        <ModalClose />
        <Label>Справочник</Label>
        {state.loader.loading && <Loading />}
        <Input
          size="sm"
          placeholder="Поиск"
          variant="outlined"
          autoFocus
          value={state.search}
          onChange={e => state.setSearch(e.target.value)}
        />
        <Stack>
          {state.filtredOptions.map(option => (
            <Button
              sx={{
                textAlign: 'left',
                width: '100%',
                fontWeight: 'normal',
                justifyContent: 'start',
                py: 0.3,
                minHeight: 20,
              }}
              variant="plain"
              color="neutral"
              key={option.id}
              onClick={() => state.onClick(option)}
            >
              {option.v}
            </Button>
          ))}
          <Row py={1}>
            <Input
              size="sm"
              variant="outlined"
              placeholder="Новое значение"
              value={state.newValue}
              onChange={e => state.setNewValue(e.target.value)}
            />
            <PlusIcon
              onClick={() => state.add()}
              variant="outlined"
              size="sm"
            />
          </Row>
        </Stack>
      </Container>
    </ModalDialog>
  </Modal>
))

const state = new State()
export const dictManager = state
