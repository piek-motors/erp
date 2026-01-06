import {
  Button,
  Divider,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack
} from '@mui/joy'
import { Label, Loading, PlusIcon, Row } from 'lib/index'
import { LoadingController } from 'lib/store/loading_controller'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { DictEntry } from 'srv/lib/create_dict_router'

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

  options: DictEntry[] = []
  setOptions(ops: DictEntry[]) {
    this.options = ops.toSorted((a, b) => a.v.localeCompare(b.v))
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

  async open<V extends DictEntry>(dict: Dict<V>) {
    this.dict = dict
    this.setModalOpen(true)
    const opts = await this.loader.run(() => dict.ls())
    this.setOptions(opts)
  }

  async close() {
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
    this.newValue = undefined
  }

  async onClick(v) {
    if (!this.dict) throw Error('dict is undefined')

    this.dict?.onClick(v)
    this.close()
  }
}

export const DictManagerModal = observer(() => (
  <Modal open={state.modalOpen} onClose={() => state.setModalOpen(false)}>
    <ModalDialog>
      <>
        <ModalClose />
        <Label>Справочник</Label>
        {state.loader.loading && <Loading />}
        <Stack sx={{ overflow: 'auto' }}>
          {state.options.map(option => (
            <Button
              sx={{
                width: '100%',
                justifyContent: 'start'
              }}
              variant="plain"
              color="neutral"
              key={option.id}
              onClick={() => state.onClick(option)}
            >
              {option.v}
            </Button>
          ))}
          <Divider sx={{ my: 1 }} />
          <Row>
            <Input
              variant="outlined"
              placeholder="Новое значение"
              value={state.newValue}
              onChange={e => state.setNewValue(e.target.value)}
            />
            <PlusIcon onClick={() => state.add()} variant="solid" />
          </Row>
        </Stack>
      </>
    </ModalDialog>
  </Modal>
))

const state = new State()
export const dictManager = state
