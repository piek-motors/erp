import {
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
import { DeleteIcon, Loading, P, PlusIcon, Row } from '@/lib/index'
import { LoadingController } from '@/lib/store/loading_controller'
import { notifier } from '@/lib/store/notifier.store'
import type { DictEntry } from '@/server/lib/create_dict_router'
import { HoverReveal } from './hidden_button'
import { Search } from './inputs'

export interface Dict<V extends DictEntry> {
  ls(): Promise<V[]>
  rm(id: number): Promise<void>
  add(v: V['v']): Promise<V>
  onClick(V: DictEntry): void
}

class State {
  constructor() {
    makeAutoObservable(this)
  }
  readonly loader = new LoadingController()

  search: string = ''
  setSearch(s: string) {
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

  dict: Dict<DictEntry> | null = null
  setDict(d: Dict<DictEntry> | null) {
    this.dict = d
  }

  newValue: string = ''
  setNewValue(s: string) {
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
    this.search = ''
    this.setModalOpen(false)
    this.setDict(null)
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

    this.setNewValue('')
    this.setSearch('')
  }

  async onClick(v: DictEntry) {
    if (!this.dict) throw Error('dict is undefined')
    this.dict?.onClick(v)
    this.close()
  }
}

export const DictManagerModal = observer(() => (
  <Modal open={state.modalOpen} onClose={() => state.setModalOpen(false)}>
    <ModalDialog layout="fullscreen">
      <Container maxWidth="xs" sx={{ overflow: 'auto' }}>
        <ModalClose variant="solid" color="neutral" />
        {state.loader.loading && <Loading />}
        <P level="h4">Справочник</P>
        <Search
          autoFocus
          value={state.search}
          onChange={e => state.setSearch(e.target.value)}
        />
        <Stack py={1}>
          {state.filtredOptions.map(option => (
            <HoverReveal
              flexWrap={'nowrap'}
              direction={'row'}
              hiddenComp={
                <DeleteIcon
                  onClick={() => {
                    if (window.confirm(`Удалить значение ${option.v}`)) {
                      state.rm(option.id)
                    }
                  }}
                />
              }
            >
              <P
                sx={{
                  textAlign: 'left',
                  width: '100%',
                  fontWeight: 'normal',
                  justifyContent: 'start',
                  cursor: 'pointer',
                }}
                variant="plain"
                color="neutral"
                key={option.id}
                onClick={() => state.onClick(option)}
              >
                {option.v}
              </P>
            </HoverReveal>
          ))}
          <Row py={1}>
            <Input
              size="sm"
              variant="outlined"
              placeholder="Новое значение"
              value={state.newValue}
              onChange={e => state.setNewValue(e.target.value)}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  state.add()
                }
              }}
              sx={{ flexGrow: 2 }}
            />
            <PlusIcon onClick={() => state.add()} size="sm" />
          </Row>
        </Stack>
      </Container>
    </ModalDialog>
  </Modal>
))

const state = new State()
export const dictManager = state
